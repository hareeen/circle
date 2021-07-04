import { Message, MessageEmbed } from "discord.js";
import { Colors } from "../helpers/util";

export async function showhelp(message: Message) {
  await message.channel.send(new MessageEmbed({
    title: "도움말",
    color: Colors.theme,
    description: "\`<>\`는 생략되어도 되는 인자에요."
  }).addField(
    "라미야 도움말",
    "이 도움말을 보여 드려요.\n사용법: \`라미야 도움말\`"
  ).addField(
    "라미야 인증",
    "학교 구글 계정을 통해 인증을 진행해요.\n사용법: \`라미야 인증\`"
  ).addField(
    "라미야 누구야",
    "현재 인증 정보를 표시해요.\n사용법: \`라미야 누구야\`"
  ).addField(
    "라미야 현황",
    "현재 전체 이석 신청 현황을 보여 드려요.\n사용법: \`라미야 현황\`"
  ).addField(
    "라미야 보기",
    "현재 특정 학생의 이석 신청 현황을 보여 드려요.\n사용법: \`라미야 보기 <학번|이름>\`"
  ).addField(
    "라미야 실별",
    "현재 특정 장소의 이석 신청 현황을 보여 드려요.\n사용법: \`라미야 실별 [장소] ['1'|'2'|'1교시'|'2교시']\`"
  ).addField(
    "라미야 신청",
    "이석 신청을 대신 해 드려요.\n지원되는 장소: 융공강, (1,2,3)공강, 수강6, 수강7, 기숙사\n사용법: \`라미야 신청 <학번|이름> [장소|'취소'] ['1'|'2'|'3'|'1교시'|'2교시'|'전부'|'모두']\`"
  ))
}