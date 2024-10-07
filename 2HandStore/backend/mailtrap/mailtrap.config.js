import { MailtrapClient } from "mailtrap"
import dotenv from "dotenv"

dotenv.config()


export const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "haivu04112003@gmail.com",
  }
];