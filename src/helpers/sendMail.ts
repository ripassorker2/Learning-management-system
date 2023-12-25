import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import config from '../config';

type EmailOptions = {
   email: string;
   subject: string;
   template: string;
   data: { [key: string]: string };
};

export const sendMail = async (options: EmailOptions): Promise<void> => {
   const transporter: Transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: parseInt(config.smtp.port || '587'),
      service: config.smtp.service,
      auth: {
         user: config.smtp.mail,
         pass: config.smtp.pass,
      },
   });
   const { email, subject, template, data } = options;
   // get path to  mail tamplate file
   const templatePath = path.join(__dirname, '../app/mail', template);

   const html: string = await ejs.renderFile(templatePath, data);

   const mailOptions = {
      from: config.smtp.mail,
      to: email,
      subject,
      html,
   };
   await transporter.sendMail(mailOptions);
};
