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
        if (error)
        {
            throw Error({ message: "Mail kon niet worden verzonden", error: error.message });
        } else
        {
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
    try
    {
        if (sendMail(receiver, html))
        {
            return true;
        } else
        {
            return false;
        }
    } catch (err)
    {
        return false;
    }
}

module.exports.signUpMail = async (user) => {
    let receiver = user.email;
    let html = `
                        <div class="row pt-3">
                            <div class="col-md-8">
                                <p>Welkom bij het eigenwijze lichaam.</p>
                                <p>Op het platform kan je stippenkaarten afsluiten waarmee je je in kan schrijven op
                                    lessen. Deze strippenkaarten kan je niet alleen voor jezelf kopen maar ook cadeau
                                    doen aan andere mensen. Het platform geeft je ook de mogelijkheid om meerdere
                                    personen mee te nemen naar een les.</p>
                                <p>Op het platform kan je niet allen inschrijven voor lessen maar kan je ook filmpjes
                                    bekijken of luisteren naar podcasts.</p>
                                <p>Met vriendelijke groet,</p>
                                <p>Natascha Puper</p>
                                <a href="https://twitter.com/nataschapuper"><i class="bi bi-twitter"></i></a>
                                <a href="https://www.facebook.com/natascha.puper"><i class="bi bi-facebook"></i></a>
                                <a href="https://www.linkedin.com/in/nataschapuper-yinyogamedical/"><i
                                        class="bi bi-linkedin"></i></a>
                            </div>
                            <div class="col md-4">
                                <img class="imgMail" src="static/Eigen-wijze-lichaam-logo.png">
                            </div>
                        </div>
    `;
    try
    {
        if (sendMail(receiver, html))
        {
            return true;
        } else
        {
            return false;
        }
    } catch (err)
    {
        return false;
    }
}