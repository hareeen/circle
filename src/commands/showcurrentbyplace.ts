import { Message, MessageEmbed } from "discord.js";
import { sheets_v4 } from "googleapis";
import { getConfig } from "../helpers/config";
import { parsePlaceToShow } from "../helpers/spreadsheetutil";
import { User } from "../helpers/user";
import { Colors, ErrorMessage } from "../helpers/util";

export async function showcurrentbyplace(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  const config = await getConfig()

  try {
    if (params.length < 2) throw Error

    const { name, ranges } = parsePlaceToShow(params[1])!

    const embed = new MessageEmbed({
      title: `${name} 현황`,
      color: Colors.theme
    })

    if(ranges["1"] !== undefined) {
      const valueRanges = (await sheets.spreadsheets.values.batchGet({
        spreadsheetId: config.google.spreadsheetId,
        ranges: ranges["1"]
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

      const description = students.join("\n").trim() || "아무도 없어요!"
    
      embed.addField(
        `1교시 (${students.length}명)`,
        description,
        true
      )
    }
    
    if(ranges["2"] !== undefined) {
      const valueRanges = (await sheets.spreadsheets.values.batchGet({
        spreadsheetId: config.google.spreadsheetId,
        ranges: ranges["2"]
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

      const description = students.join("\n").trim() || "아무도 없어요!"
    
      embed.addField(
        `2교시 (${students.length}명)`,
        description,
        true
      )
    }

    await message.channel.send(
      embed
    )
  } catch (e) {
    await message.channel.send(
      ErrorMessage((e as Error).name)
    )
  }

}