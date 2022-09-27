import { Message, MessageEmbed } from "discord.js";
import { sheets_v4 } from "googleapis";
import { getConfig } from "../helpers/config";
import { parseStudent } from "../helpers/spreadsheetutil";
import { User } from "../helpers/user";
import { Colors, ErrorMessage } from "../helpers/util";

export async function leave(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  const config = await getConfig()

  try {
    let rown: number, mode: "1" | "2";

    if (params.length == 1) {
      rown = parseStudent(user.code)!
      mode = "1"
    } else if (params.length == 2) {
      if (parseStudent(params[1]) === undefined) {
        rown = parseStudent(user.code)!
        mode = params[1] !== "취소" ? "1" : "2" 
      } else {
        rown = parseStudent(params[1])!
        mode = "1"
      }
    } else {
      rown = parseStudent(params[1])!
      mode = params[1] !== "취소" ? "1" : "2"
    }

    let valueRanges: sheets_v4.Schema$ValueRange[] = [];
    valueRanges.push({
      range: `학생 신청!O${rown}`,
      majorDimension: "ROWS",
      values: [
        [mode === "1" ? "퇴사" : ""]
      ]
    })

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: config.google.spreadsheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: valueRanges
      }
    })

    await message.channel.send(new MessageEmbed({
      color: Colors.success,
      description: "퇴사 신청에 성공하였습니다."
    }))
  } catch (e) {
    await message.channel.send(
      ErrorMessage((e as Error).name)
    )
  }
}