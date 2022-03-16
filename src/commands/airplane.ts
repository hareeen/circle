import { Message, MessageEmbed } from "discord.js";
import { Colors, randInt } from "../helpers/util";

export async function cute(message: Message, params: string[]) {
  if (randInt(0, 10) === 0) {
    await message.channel.send(`비행기모드가 모에요오?? 막 비행기로 바뀌어서 날아가나???`)
  } else {
    await message.channel.send(new MessageEmbed({
      color: Colors.theme
    }).setImage("https://media.istockphoto.com/vectors/airplane-icon-vector-flat-icon-aircraft-symbol-isolated-on-white-vector-id1225137077?k=20&m=1225137077&s=170667a&w=0&h=oAI7ZPWn0MQq7SuNwpM_4KfnUlEMGW0Lu-0Zkoha5jk="))
  }
}