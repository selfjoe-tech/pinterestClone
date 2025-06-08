"use server";

import nodemailer from 'nodemailer';

const mailCode = async (verifyObject) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bendoverpty@gmail.com',
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Ben Dover <bendoverpty@gmail.com>',
    to: verifyObject.email,
    subject: 'Verification Code - Ben Dover',
    text: `Your verification code: ${verifyObject.generatedCode}. Don't share this with anyone.`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);    
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default mailCode;