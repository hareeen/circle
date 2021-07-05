import { promises } from 'fs'
import path from 'path'

const STUDENT_PATH = '../data/student.json'
const STATUS_PATH = '../data/status.json'
const APPLY_PATH = '../data/apply.json'
const SHOW_PATH = '../data/show.json'
const MODE_PATH = '../data/mode.json';

export let studentData: any, statusData: any, applyData: any, showData: any, modeData: any;

(async () => {
  studentData = JSON.parse(
    (await promises.readFile(path.resolve(__dirname, STUDENT_PATH))).toString()
  )
  statusData = JSON.parse(
    (await promises.readFile(path.resolve(__dirname, STATUS_PATH))).toString()
  )
  applyData = JSON.parse(
    (await promises.readFile(path.resolve(__dirname, APPLY_PATH))).toString()
  )
  showData = JSON.parse(
    (await promises.readFile(path.resolve(__dirname, SHOW_PATH))).toString()
  )
  modeData = JSON.parse(
    (await promises.readFile(path.resolve(__dirname, MODE_PATH))).toString()
  )
})();

interface ShowDataValue {
  aliases: string[],
  ranges: {
    "1"?: string[],
    "2"?: string[]
  }
}

export function validateCode(code: string): boolean {
  const code_p = /[1-3][1-8][0-1]\d/
  return code_p.test(code)
}

export function parseStudentByCode(code: string): number | undefined {
  if (!validateCode(code)) return undefined;

  const index = (studentData.students as string[][]).findIndex((el) => el[0] === code)
  if (index === -1)
    return undefined
  else
    return (studentData.offset as number) + index + 1
}

export function parseStudentByName(name: string): number | undefined {
  const index = (studentData.students as string[][]).findIndex((el) => el[1] === name)
  if (index === -1) return undefined

  return (studentData.offset as number) + index + 1
}

export function parseStudent(query: string): number | undefined {
  return parseStudentByCode(query) || parseStudentByName(query)
}

export function parsePlaceToApply(place: string): string | undefined {
  for (const [key, value] of Object.entries(applyData)) {
    if ((value as string[]).includes(place)) return key
  }

  return undefined
}

export function parsePlaceToShow(place: string, period: "1" | "2"): {
  name: string,
  ranges: string[]
} | undefined {
  for (const [key, value] of Object.entries(showData)) {
    if ((value as ShowDataValue).aliases.includes(place)) {
      const ranges = (value as ShowDataValue).ranges[period]
      if (ranges === undefined) return undefined

      return {
        name: key,
        ranges: ranges
      }
    }
  }

  return undefined
}

export function parseMode(query: string): "1" | "2" | "3" | undefined {
  return modeData[query]
}