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

const sendMail = async (receiver, html) => {
    let mailConfirmation;
    let mailOptions = {
        from: '"Natascha Puper " <yinyogamedical.server@gmail.com>',
        to: receiver,
        subject: "Het Eigen Wijze Lichaam",
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw Error({ message: "Mail kon niet worden verzonden", error: error.message });
        } else {
            mailConfirmation = info;
        }
    });

    return mailConfirmation;
}

module.exports.sessionSignOutMail = async (user, session) => {
    let html = `
        <h1>Hallo ${user.fullName}</h1>
        <p>U heeft uitgeschreven voor de les: ${session.title}</p>
        <p>Met vriendelijke groet, </p>
        <p>Het Eigen Wijze Lichaam</p>
    `;
    try {
        if (sendMail(receiver, html)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

module.exports.signUpMail = async (user) => {
    let receiver = user.email;
    let html = `
        <h1>Welkom ${user.fullName}</h1>
        <p>U heeft zich aangemeld voor het platform van Het Eigen Wijze Lichaam</p>
        <p>Met vriendelijke groet, </p>
        <p>Het Eigen Wijze Lichaam</p>
    `;
    try {
        if (sendMail(receiver, html)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}