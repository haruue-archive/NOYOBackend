import {createTransport, SendMailOptions, SentMessageInfo} from "nodemailer";
import {mailAccount} from "../config";

const transporter = createTransport(mailAccount);

export async function sendMail(mail: SendMailOptions): Promise<SentMessageInfo> {
  return await transporter.sendMail(mail);
}