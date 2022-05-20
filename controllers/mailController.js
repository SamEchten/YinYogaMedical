const mailer = require("nodemailer");
const config = require("../config").config;

let transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.email.user,
        pass: config.email.password,
    }
});

const sendMail = async (receiver, subject, html) => {
    let mailConfirmation;
    let mailOptions = {
        from: '"Natascha Puper " <yinyogamedical.server@gmail.com>',
        to: receiver,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw Error({ message: "Mail kon niet worden verzonden", error: error.message });
        } else {
            mailConfirmation = true;
        }
    });
}

module.exports.sessionSignOutMail = async (receiver, session) => {
    let subject = "Uitschrijven les";
    let html = "<h1>U heeft uitgeschreven voor de les: " + session.title + "</h1>";
    try {
        if (sendMail(receiver, subject, html)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}