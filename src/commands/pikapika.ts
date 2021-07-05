import { Message } from "discord.js";
import { sheets_v4 } from "googleapis";
import { User } from "../helpers/user";
import { apply } from "./apply";

export async function pikapika(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
  await apply(message, sheets, ["", "2209", "2공강"], user)
  await apply(message, sheets, ["", "2416", "2공강"], user)
  await apply(message, sheets, ["", "2608", "2공강"], user)
  await apply(message, sheets, ["", "2617", "2공강"], user)
}