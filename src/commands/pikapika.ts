import { Message } from "discord.js";
import { sheets_v4 } from "googleapis";
import { parseStudent } from "../helpers/spreadsheetutil";
import { User } from "../helpers/user";
import { apply } from "./apply";

const targets = ["3114", "3206", "3417", "3607", "3805"]
const place = "3학년공강실"

export async function pikapika(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  targets.forEach(async target => {
    const trown = parseStudent(target)
    if (trown !== undefined && params.map(parseStudent).includes(trown)) return
    await apply(message, sheets, ["", target, place], user)
  })
}
