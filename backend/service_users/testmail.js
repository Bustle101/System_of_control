import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const main = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"System Control" <${process.env.SMTP_USER}>`,
      to: "test2001@gmail.com", 
      subject: "Тестовое письмо — Система Контроля",
      text: "кусь за ухо",
    });

    console.log("Письмо отправлено:", info.messageId);
  } catch (err) {
    console.error("Ошибка при отправке:", err);
  }
};

main();
