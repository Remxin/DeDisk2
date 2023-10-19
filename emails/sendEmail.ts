import nodemailer from "nodemailer"
import { render } from "@react-email/render"


export async function sendEmail(template: JSX.Element, email: string, title: string) {

    const templateHTML = render(template)
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "ct8.pl",
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_SENDER, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });



    await transporter.sendMail({
        from: `"DeDisk 🧹" ${process.env.EMAIL_SENDER}`, // sender address
        to: email, // list of receivers
        subject: title, // Subject line
        html: templateHTML, // html body
    });



}