import { MessageEmbed } from 'discord.js'

export const Colors = {
  'theme': 0x8aeec9,
  'success': 0x8aed8a,
  'failure': 0xed8a8a
}

export const ErrorMessage = (message?: string): MessageEmbed => {
  return new MessageEmbed({
    title: "오류",
    color: Colors.failure,
    description: message
  })
}

export const randInt = (from: number, to: number): number => {
  return Math.floor(Math.random() * (to - from) + from)
}