import fs from 'fs'
import path from 'path'

const status = process.env.STATUS
if (!status) throw new Error('missing environment variable: STATUS')

fs.mkdirSync('dist', { recursive: true })
fs.writeFileSync(path.join('dist', 'index.json'), JSON.stringify({ status }))
