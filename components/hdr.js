import FormData from 'form-data'
import Jimp from 'jimp'

let handler = async (m, { oreo, usedPrefix, command }) => {
  switch (command) {
    case 'dehaze':
      {
        oreo.enhancer = oreo.enhancer ? oreo.enhancer : {}
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!mime) throw `photo?`
        if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
        else oreo.enhancer[m.sender] = true
        m.reply(wait)
        let img = await q.download?.()
        let error
        try {
          const This = await processing(img, 'dehaze')
          oreo.sendFile(m.chat, This, '', 'Nih...', m)
        } catch (er) {
          error = true
        } finally {
          if (error) {
            m.reply('Proses Gagal :(')
          }
          delete oreo.enhancer[m.sender]
        }
      }
      break
    case 'recolor':
      {
        oreo.recolor = oreo.recolor ? oreo.recolor : {}
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!mime) throw `photo?`
        if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
        else oreo.recolor[m.sender] = true
        m.reply(wait)
        let img = await q.download?.()
        let error
        try {
          const This = await processing(img, 'recolor')
          oreo.sendFile(m.chat, This, '', 'Nih...', m)
        } catch (er) {
          error = true
        } finally {
          if (error) {
            m.reply('Proses Gagal :(')
          }
          delete oreo.recolor[m.chat]
        }
      }
      break
    case 'hdr':
      {
        oreo.hdr = oreo.hdr ? oreo.hdr : {}
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!mime) throw `photo?`
        if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
        else oreo.hdr[m.sender] = true
        m.reply(wait)
        let img = await q.download?.()
        let error
        try {
          const This = await processing(img, 'enhance')
          oreo.sendFile(m.chat, This, '', 'Nih...', m)
        } catch (er) {
          error = true
        } finally {
          if (error) {
            m.reply('Proses Gagal :(')
          }
          delete oreo.hdr[m.sender]
        }
      }
      break
  }
}
handler.help = ['dehaze', 'recolor', 'hdr']
handler.tags = ['tools']
handler.command = ['dehaze', 'recolor', 'hdr']
export default handler

async function processing(urlPath, method) {
  return new Promise(async (resolve, reject) => {
    let Methods = ['enhance', 'recolor', 'dehaze']
    Methods.includes(method) ? (method = method) : (method = Methods[0])
    let buffer,
      Form = new FormData(),
      scheme = 'https' + '://' + 'inferenceengine' + '.vyro' + '.ai/' + method
    Form.append('model_version', 1, {
      'Content-Transfer-Encoding': 'binary',
      contentType: 'multipart/form-data; charset=uttf-8',
    })
    Form.append('image', Buffer.from(urlPath), {
      filename: 'enhance_image_body.jpg',
      contentType: 'image/jpeg',
    })
    Form.submit(
      {
        url: scheme,
        host: 'inferenceengine' + '.vyro' + '.ai',
        path: '/' + method,
        protocol: 'https:',
        headers: {
          'User-Agent': 'okhttp/4.9.3',
          Connection: 'Keep-Alive',
          'Accept-Encoding': 'gzip',
        },
      },
      function (err, res) {
        if (err) reject()
        let data = []
        res
          .on('data', function (chunk, resp) {
            data.push(chunk)
          })
          .on('end', () => {
            resolve(Buffer.concat(data))
          })
        res.on('error', e => {
          reject()
        })
      }
    )
  })
}
