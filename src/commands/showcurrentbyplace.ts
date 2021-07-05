import { Message, MessageEmbed } from "discord.js";
import { sheets_v4 } from "googleapis";
import { getConfig } from "../helpers/config";
import { parseMode, parsePlaceToShow } from "../helpers/spreadsheetutil";
import { User } from "../helpers/user";
import { Colors, ErrorMessage } from "../helpers/util";

export async function showcurrentbyplace(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  const config = await getConfig()

  try {
    if (params.length < 3) throw Error

    const mode = parseMode(params[2])!
    if (mode === "3") throw Error

    const { name, ranges } = parsePlaceToShow(params[1], (mode as "1" | "2"))!

    const valueRanges = (await sheets.spreadsheets.values.batchGet({
      spreadsheetId: config.google.spreadsheetId,
      ranges: ranges
    })).data.valueRanges!

    let students: string[] = []
    for (const valueRange of valueRanges) {
      const rows = valueRange.values || ['', '']
      rows.forEach(row => {
        if (row[0] !== undefined && row[0] !== '') {
          students.push(`${row[0]} ${row[1]}`)
        }
      })
    }

    const description = students.join("\n").trim()
    await message.channel.send(new MessageEmbed({
      title: `${name} ${mode}교시 현황`,
      color: Colors.theme,
      description: description || "아무도 없어요!"
    }))
  } catch (e) {
    await message.channel.send(
      ErrorMessage()
    )
  }

}