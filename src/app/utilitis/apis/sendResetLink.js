"use server";

import nodemailer from 'nodemailer';
import { findIdwEmailQuery } from './queries';
import {client} from "../../../sanity/client"

const mailLink = async (verifyObject) => {

    const email = verifyObject.email;
    const userId = await client.fetch(findIdwEmailQuery, { email });
  
    if (!userId) {
        return {error: true, message: "Your email is incorrect or is not registered"};
    }
    
    else {
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
            subject: 'Reset Password - Ben Dover',
            text: `This is your link to reset your password: http://localhost:3000/reset-password/${userId}`,
        };
        return {error: false, message: "Email sent"};
    }
  
};

export default mailLink;
