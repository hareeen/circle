import { Message, MessageEmbed } from "discord.js";
import { sheets_v4 } from "googleapis";
import { getConfig } from "../helpers/config";
import { parseStudent } from "../helpers/spreadsheetutil";
import { User } from "../helpers/user";
import { Colors, ErrorMessage } from "../helpers/util";

export async function showcurrentbystudent(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  const config = await getConfig()

  try {
    const rown = params.length === 1 ? parseStudent(user.code)! : parseStudent(params[1])!;

    const row = (await sheets.spreadsheets.values.get({
      spreadsheetId: config.google.spreadsheetId,
      range: `학생 신청!A${rown}:H${rown}`
    })).data.values![0]

    const embed = new MessageEmbed().setTitle(`${row[0]} ${row[1]}의 현재 신청`).setColor(Colors.theme)
    embed.addField("1교시", row[4])
    embed.addField("2교시", row[7])

    await message.channel.send(
      embed
    )
  } catch (e) {
    await message.channel.send(
      ErrorMessage()
    )
  }
}