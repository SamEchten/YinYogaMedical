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
            console.log(error);
            throw Error({ message: "Mail kon niet worden verzonden", error: error.message });
        } else {
            mailConfirmation = info;
        }
    });

    return mailConfirmation;
}

module.exports.sessionSignOutMail = async (user, session) => {
    const date = new Data(session.date);
    let html = `
    <h1>Hallo ${user.fullName}</h1>
    <p U heeft u uitgeschreven voor de les ${session.title} op ${date.getDate()} " " ${date.getMonth()} om ${date.getTime()}
    </p>
    <p>Heb je nog vragen? Neem gerust contact op</p>
    <p>Met vriendelijke groet,</p>
    <p>Natascha Puper</p>
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
    <p>U heeft u in geschreven op het platform <a href='https://het-eigen-wijze-lichaam.nl'>Het eigen wijze Lichaam</a>. Op het platform kunt u het les rooster vinden, 
    u inschrijven voor lessen en video's en podcasts bekijken en beluisteren.
    </p>
    <p>Heb je nog vragen? Neem gerust contact op</p>
    <p>Met vriendelijke groet,</p>
    <p>Natascha Puper</p>
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

module.exports.productConfirmationMail = async (user, product) => {
    let receiver = user.email;
    let html = `
    <h1>Hallo ${user.fullName}</h1>
    <p>U heeft zojuist het product ${product.productName} gekocht op <a href='https://het-eigen-wijze-lichaam.nl'>Het eigen wijze lichaam</a>
    </p>
    <p>Heb je nog vragen? Neem gerust contact op</p>
    <p>Met vriendelijke groet,</p>
    <p>Natascha Puper</p>
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

module.exports.sessionCanceledMail = async (user, session) => {
    let receiver = user.email;
    let html = `
    <h1>Hallo ${user.fullName}</h1>
    <p>U heeft u aangemeld voor de les ${session.title}, deze gaat helaas niet door. De uren die van uw account zijn afgegaan zullen terug worden gezet.
    </p>
    <p>Heb je nog vragen? Neem gerust contact op</p>
    <p>Met vriendelijke groet,</p>
    <p>Natascha Puper</p>
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