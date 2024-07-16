import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })


import express from 'express'
import initApp from './src/index.router.js'

const app = express()
const port = process.env.PORT || 6000


initApp(app ,express)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))