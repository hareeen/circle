import { promises } from 'fs'
import path from 'path'

const CONFIG_PATH = '../.config.json'

export async function getConfig(): Promise<any> {
  return JSON.parse(
    (await promises.readFile(path.resolve(__dirname, CONFIG_PATH))).toString()
  )
}