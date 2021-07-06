import { Message, MessageEmbed } from "discord.js";
import { Colors, randInt } from "../helpers/util";

export async function cute(message: Message) {
  if (randInt(0, 5) === 0) {
    await message.channel.send(new MessageEmbed({
      color: Colors.theme
    }).setImage("https://i.pinimg.com/originals/2f/3c/e6/2f3ce6e7cd1e5170fa9f8317325f351d.jpg"))
  } else {
    await message.channel.send(`${message.author.username}님이 더 귀여워요!`)
  }
}