import { MessageEmbed } from 'discord.js'

export const Colors = {
  'theme': 0xffa200,
  'success': 0x00ff00,
  'failure': 0xff0000
}

export const ErrorMessage = (message?: string): MessageEmbed => {
  return new MessageEmbed({
    title: "오류",
    color: Colors.failure,
    description: message
  })
}

