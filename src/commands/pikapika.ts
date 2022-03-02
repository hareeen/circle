import { Message } from "discord.js";
import { sheets_v4 } from "googleapis";
import { User } from "../helpers/user";
import { apply } from "./apply";

const targets = ["3114", "3206", "3417", "3607", "3805"]
const place = "융과실"

export async function pikapika(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  targets.forEach(async target => {
    await apply(message, sheets, ["", target, place], user)
  })
  }