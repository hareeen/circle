import { Message, MessageEmbed } from "discord.js";
import { validateCode } from "../helpers/spreadsheetutil";
import { Colors, ErrorMessage, randInt } from "../helpers/util";

const QUANTITY_LIMIT = 300
const MAX_LIMIT = 1000000

type SingleTypeDice = {
  quantity: number,
  max: number
}

function evaluateDice(dice: SingleTypeDice[]): number[] {
  const totalquantity = dice.reduce((acc, val) => acc + val.quantity, 0)
  if (totalquantity > QUANTITY_LIMIT || totalquantity <= 0) throw new Error()

  return dice.map(({ quantity, max }) => Array.from({ length: quantity }, (v, i) => randInt(0, max) + 1)).reduce((acc, val) => acc.concat(val), []);
}

function parseSingleTypeDice(str: string): SingleTypeDice {
  const intregex = /^[0-9]+$/

  const splitted = str.split("d")
  if (splitted.length !== 2) throw new Error()
  if (!intregex.test(splitted[0]) || !intregex.test(splitted[1])) throw new Error()

  const quantity = parseInt(splitted[0], 10), max = parseInt(splitted[1], 10)
  
  if(quantity <= 0 || quantity > QUANTITY_LIMIT || max <= 0 || max > MAX_LIMIT) throw new Error()

  return {
    quantity,
    max
  }
}

export async function roll(message: Message, params: string[]) {
  try {
    const diceStrings = params.slice(1)
    const dice: SingleTypeDice[] = diceStrings === [] ? [{quantity: 1, max: 100}] : diceStrings.map(parseSingleTypeDice)
    const evaluated = evaluateDice(dice)
    const total = evaluated.reduce((acc, val) => acc + val, 0)
    const average = total / evaluated.length

    await message.channel.send(new MessageEmbed({
      title: "주사위 결과",
      color: Colors.theme,
      description: evaluated.join(' ')
    }).addField(
      "총 개수",
      `${evaluated.length}`,
      true
    ).addField(
      "총합",
      `${total}`,
      true
    ).addField(
      "평균",
      `${Math.round(average * 100) / 100}`,
      true
    ))
  } catch (e) {
    await message.channel.send(ErrorMessage())
  }
}