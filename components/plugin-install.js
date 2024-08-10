import axios from 'axios'
import fs from 'fs'
import path from 'path'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Please provide a plugin URL`
  const gistId = text.match(/(?:\/|gist\.github\.com\/)([a-fA-F0-9]+)/)
  if (!gistId) throw `Invalid plugin URL`
  const gistName = gistId[1]
  const gistURL = `https://api.github.com/gists/${gistName}`
  try {
    const response = await axios.get(gistURL)
    const gistData = response.data
    if (!gistData || !gistData.files) {
      throw `No valid files found in the Gist`
    }
    for (const file of Object.values(gistData.files)) {
      const pluginName = file.filename
      const pluginPath = path.join('plugins', `${pluginName}`)
      await fs.promises.writeFile(pluginPath, file.content)
      m.reply(`successfully installed the plugin to Oreo-Bot`)
    }
  } catch (error) {
    throw `Error fetching or saving the plugin: ${error.message}`
  }
}

handler.help = ['install'].map(v => v + ' <Gist URL>')
handler.tags = ['plugin']
handler.command = /^install$/i

handler.owner = true

export default handler
