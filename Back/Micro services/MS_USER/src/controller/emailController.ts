import * as nodemailer from 'nodemailer';
import { load } from 'ts-dotenv'
import {Request, Response} from 'express';

const env = load({
    MAILING_HOST:String,
    MAILING_USER:String,
    MAILING_PW:String,
    MAILING_PORT:Number
})

export const sendEmail = async (req: Request, template:any, title:string): Promise<boolean> => {
    const { email } = req.body;
  
    const transporter = nodemailer.createTransport({
      host: env.MAILING_HOST,
      port: env.MAILING_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: env.MAILING_USER,
        pass: env.MAILING_PW,
      },
    });
  
    try {
      const info = await transporter.sendMail({
        from: '"MaelCe.fr"<noreply@maelce.fr>',
        to: email,
        subject: title,
        html: template,
        headers: { 'x-myheader': 'MaelCe.fr' },
      });
      console.log("Message sent: %s", info.response);
      return true
    } catch (error) {
      console.error("Error sending email:", error);
      return false
    }
};

