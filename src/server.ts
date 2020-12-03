import App from "./app/app"
import * as dotenv from 'dotenv';

dotenv.config();
const { JSend } = require('jsend-express')
const jSend = new JSend({ name: 'appName', version: 'X.X.X', release: 'XX' })
const app = new App()
app.server.use(jSend.middleware.bind(jSend))
app.run()
