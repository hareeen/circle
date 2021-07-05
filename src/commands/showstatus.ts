import { Message, MessageEmbed } from "discord.js";
import { sheets_v4 } from "googleapis";
import { getConfig } from "../helpers/config";
import { statusData } from "../helpers/spreadsheetutil";
import { User } from "../helpers/user";
import { Colors, ErrorMessage } from "../helpers/util";

export async function showstatus(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  const config = await getConfig()

  try {
    const [rows1, rows2] = (await sheets.spreadsheets.values.batchGet({
      spreadsheetId: config.google.spreadsheetId,
      ranges: (statusData.ranges as string[])
    })).data.valueRanges!

    const embed1 = new MessageEmbed().setTitle("1교시 이석신청 현황").setColor(Colors.theme)
    rows1.values!.forEach(row => {
      if (row[0] !== undefined && row[0] !== '') {
        embed1.addField(row[0], `${row[2]} / ${row[1]}`)
      }
    })
    const embed2 = new MessageEmbed().setTitle("2교시 이석신청 현황").setColor(Colors.theme)
    rows2.values!.forEach(row => {
      if (row[0] !== undefined && row[0] !== '') {
        embed2.addField(row[0], `${row[2]} / ${row[1]}`)
      }
    })

    await message.channel.send(embed1)
    await message.channel.send(embed2)
  } catch (e) {
    await message.channel.send(
      ErrorMessage()
    )
  }

}