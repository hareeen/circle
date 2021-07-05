import { Message } from "discord.js";
import { getUser } from "../helpers/user";

export async function checkauthentication(message: Message) {
  const user = await getUser(message.author.id)

  if (user === undefined) {
    await message.channel.send(
      `아직 인증이 되지 않았어요.`
    )
  } else {
    await message.channel.send(
      `**${user!.name}**(${user!.email})로 빙의하고 있어요!`
    )
  }
}