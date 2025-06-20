import nodemailer from 'nodemailer';
import asyncHandler from './asynchandler.js';
import ApiErrors from './ApiErrors.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../Public/temp/.env') });

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);  
  console.log(" Email sent:", info.messageId);
};

export default sendEmail;
