const nodemailer = require('nodemailer');

const SendEmailUtility= async (EmailTo, EmailText, EmailSubject) => {

    let transporter = nodemailer.createTransport({
        host: 'mail.noormultipleshop.com',
        port: 25,
        secure: false,
        auth: {
            user: "info@noormultipleshop.com",
            pass: 'fb+gU)M20tx^'
        },tls: {
            rejectUnauthorized: false
        },
    }); 


    let mailOptions = {
        from: 'ToDo List Application <info@noormultipleshop.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return  await transporter.sendMail(mailOptions)

}
module.exports=SendEmailUtility