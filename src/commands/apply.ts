import { Message, MessageEmbed } from "discord.js";
import { sheets_v4 } from "googleapis";
import { getConfig } from "../helpers/config";
import { parseMode, parsePlaceToApply, parseStudent } from "../helpers/spreadsheetutil";
import { User } from "../helpers/user";
import { Colors, ErrorMessage } from "../helpers/util";

export async function apply(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  const config = await getConfig()

  try {
    if (params.length < 2) throw Error;

    let rown: number, place: string, mode: "1" | "2" | "3";

    if (params.length == 2) {
      rown = parseStudent(user.code)!
      place = parsePlaceToApply(params[1])!
      mode = "3"
    } else if (params.length == 3) {
      if (parseStudent(params[1]) === undefined) {
        rown = parseStudent(user.code)!
        place = parsePlaceToApply(params[1])!
        mode = parseMode(params[2])!
      } else {
        rown = parseStudent(params[1])!
        place = parsePlaceToApply(params[2])!
        mode = "3"
      }
    } else {
      rown = parseStudent(params[1])!
      place = parsePlaceToApply(params[2])!
      mode = parseMode(params[3])!
    }

    let valueRanges: sheets_v4.Schema$ValueRange[] = [];
    if (mode === "1" || mode === "3") {
      valueRanges.push({
        range: `학생 신청!C${rown}`,
        majorDimension: "ROWS",
        values: [
          [place]
        ]
      })
    }
    if (mode === "2" || mode === "3") {
      valueRanges.push({
        range: `학생 신청!F${rown}`,
        majorDimension: "ROWS",
        values: [
          [place]
        ]
      })
    }

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: config.google.spreadsheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: valueRanges
      }
    })

    await message.channel.send(new MessageEmbed({
      color: Colors.success,
      description: "이석 신청에 성공하였습니다."
    }))
  } catch (e) {
    await message.channel.send(
      ErrorMessage()
    )
  }
}