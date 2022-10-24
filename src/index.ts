import { Client, Message, MessageEmbed } from 'discord.js'
import { google, sheets_v4 } from 'googleapis'
import { airplane } from './commands/airplane'
import { apply } from './commands/apply'
import { authenticate } from './commands/authenticate'
import { checkauthentication } from './commands/checkauthentication'
import { cute } from './commands/cute'
import { double } from './commands/double'
import { leave } from './commands/leave'
import { pikapika } from './commands/pikapika'
import { roll } from './commands/roll'
import { showcurrentbyplace } from './commands/showcurrentbyplace'
import { showcurrentbystudent } from './commands/showcurrentbystudent'
import { showhelp } from './commands/showhelp'
import { showstatus } from './commands/showstatus'
import { triple } from './commands/triple'
import { getConfig } from './helpers/config'
import { getUser, User } from './helpers/user'
import { Colors } from './helpers/util'

const PREFIX = '라미야 '
const client = new Client()

client.on('ready', () => {
  console.log('ready')
})

const commands1 = {
  "인증": authenticate,
  "누구야": checkauthentication,
  "도움말": showhelp,
  "귀여워": cute,
  "굴려": roll,
  "비행기모드": airplane
}
type command1FunctionType = (message: Message, params: string[]) => Promise<void>

const commands2 = {
  "현황": showstatus,
  "보기": showcurrentbystudent,
  "더블보기": double,
  "트리플보기": triple,
  "실별": showcurrentbyplace,
  "신청": apply,
  "퇴사": leave,
  "피카피카": pikapika
}
type command2FunctionType = (message: Message, sheets: sheets_v4.Sheets, params: string[], user: User) => Promise<void>;

client.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (message.content.startsWith(PREFIX)) {
    const params = message.content.slice(PREFIX.length).trim().split(" ")

    if (!Object.keys(commands1).includes(params[0]) && !Object.keys(commands2).includes(params[0])) return

    for (const [key, value] of Object.entries(commands1)) {
      if (key === params[0]) {
        await (value as command1FunctionType)(message, params);
      }
    }

    if (!Object.keys(commands2).includes(params[0])) return

    const user = (await getUser(message.author.id))?.toObject() as User
    if (user === undefined) {
      await message.channel.send(new MessageEmbed({
        color: Colors.theme,
        description: "인증이 필요한 기능입니다."
      }))
    }

    const config = await getConfig()
    const { client_secret, client_id, redirect_uris } = config.google.installed
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]
    )
    oAuth2Client.setCredentials(user.installed)

    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client })

    for (const [key, value] of Object.entries(commands2)) {
      if (key === params[0]) {
        await (value as command2FunctionType)(message, sheets, params, user);
      }
    }
  }
});

(async () => {
  const config = await getConfig()

  client.login(config.discord.token)
})()