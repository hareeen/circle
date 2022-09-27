import { Message, MessageEmbed } from 'discord.js'
import { google } from 'googleapis'
import { getConfig } from '../helpers/config'
import { parseStudentByCode } from '../helpers/spreadsheetutil'
import { updateUser } from '../helpers/user'
import { Colors, ErrorMessage } from '../helpers/util'

export async function authenticate(message: Message, params: string[]) {
  const config = await getConfig()

  const {client_secret, client_id, redirect_uris} = config.google.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  )

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.google.scopes
  })

  const dmChannel = await message.author.createDM()

  await dmChannel.send(new MessageEmbed({
    title: '인증',
    color: Colors.theme,
    description: `링크를 방문해서 인증을 완료하고, 코드를 DM에 적어주세요.\n${authUrl}`
  }))

  await message.channel.send(new MessageEmbed({
    color: Colors.theme,
    description: "인증 안내가 DM으로 전송되었습니다."
  }))

  try {
    const reply = (await dmChannel.awaitMessages(
      () => true,
      {
        max: 1,
        time: 300000,
        errors: ['time']
      }
    )).first()

    try {
      const token = (await oAuth2Client.getToken(reply!.content.trim())).tokens
      oAuth2Client.setCredentials(token)

      const loggedin = (await google.people(
        { version: 'v1', auth: oAuth2Client }
      ).people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
      })).data

      const name = loggedin.names![0].displayName!
      const email = loggedin.emailAddresses![0].value!

      if(!email.endsWith('sshs.hs.kr')) {
        await dmChannel.send(
          ErrorMessage("서울과학고등학교 계정으로만 인증을 진행할 수 있습니다.")
        )

        return
      }

      await dmChannel.send(new MessageEmbed({
        color: Colors.theme,
        description: `학번을 여기에 적어주세요.`
      }))

      try {
        const codereply = (await dmChannel.awaitMessages(
          (msg: Message) => parseStudentByCode(msg.content) !== undefined,
          {
            max: 1,
            time: 60000,
            errors: ['time']
          }
        )).first()
        
        await updateUser({
          id: dmChannel.recipient.id,
          code: codereply!.content,
          name: name,
          email: email,
          installed: token
        })

        await dmChannel.send(new MessageEmbed({
          title: "인증 성공",
          color: Colors.success,
          description: "인증 성공. 인증 정보가 저장되었습니다."
        }).addField(
          "학번", codereply!.content
        ).addField(
          "이름", name
        ).addField(
          "계정", email
        ))
      } catch (e) {
        await dmChannel.send(
          ErrorMessage('응답 시간을 초과하였습니다.')
        )
      }
    } catch (e) {
      await dmChannel.send(
        ErrorMessage(`인증에 실패하였습니다. (${(e as Error).name})`)
      )
    }
  } catch (e) {
    await dmChannel.send(
      ErrorMessage("응답 시간을 초과하였습니다.")
    )
  }
}