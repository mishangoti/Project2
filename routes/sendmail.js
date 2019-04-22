const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();
require('dotenv').config();

/* GET users listing. */
router.get('/', (req, res, next) => {
    console.log('mail is sending');
    // check if user is login or note using session 
    // const account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    

    // setup email data with unicode symbols
    const mailOptions = {
        from: '<mishan2512@gmail.com>', // sender address
        to: "mishan2512@gmail.com, mishangoti555@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

});

module.exports = router;
