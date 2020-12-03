import App from "./app/app"
import * as dotenv from 'dotenv';

dotenv.config();
const app = new App()
app.run()
