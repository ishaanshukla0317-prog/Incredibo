require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Incredibo <onboarding@resend.dev>',
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        if (error) {
            console.error("Resend API Error: ", error);
            return null;
        }

        console.log("Email sent: ", data.id); 
        return data;
    } catch (error) {
        console.error("Error sending email: ", error); 
    }
}

module.exports = { sendEmail };