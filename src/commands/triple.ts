import { Message } from "discord.js";
import { sheets_v4 } from "googleapis";
import { User } from "../helpers/user";
import { showcurrentbystudent } from "./showcurrentbystudent";

export async function triple(message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) {
    await showcurrentbystudent(message, sheets, params, user);
    await showcurrentbystudent(message, sheets, params, user);
    await showcurrentbystudent(message, sheets, params, user);
}