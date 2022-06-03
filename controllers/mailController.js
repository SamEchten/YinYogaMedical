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
    <html>
    <head>  
    <style>
        table{
            background-color: #d5ca9b;
        }
        h1{
            color: #FFFFFF!important;
            font-size: 32px;
            text-align: center;
        }
        .content{
            background-color: #FFFFFF;
            padding-left: 2vw;
            padding-right: 2vw;
        }
        .topBottom{
            width: 100%;
            padding-left: 2vw;
            padding-right: 2vw;
            margin: auto;
        }
        .topBottom p{
            color:#FFFFFF!important;
            text-align: left;
        }
    </style>
    </head>
    <body>
    <table>
        <tbody>
            <tr>
                <th class="topBottom">
                    <h1>Natascha Puper
                        <br> Welkom bij het eigen wijze lichaam
                    </h1>
                </th>
            </tr>
            <tr>
                <td class="content">
                    <p>Hallo Natascha, Zoals ook in de app gestuurd is, is dit de opzet van de mail die klanten krijgen bij het registreren op de website. De klanten krijgen een mail bij het registreren op de website, het kopen van een product, bij het in- en uitschrijven van een les en als u/de admin een les annuleerd waarvoor de klant ingeschreven staat.</p>
                    <p>Vind u de opzet van de mail zoals het nu is goed of heeft u een ander idee voor deze mails?</p>
                    <p> Zou u voor de volgende situaties een opzet maken van de inhoud voor een mailtje bij de desbetreffende situaties. De situaties zijn:</p>
                    <ul>
                        <li>Registreren op het platform</li>
                        <li>Kopen van een product</li>
                        <li>Inschrijven voor een les</li>
                        <li>Uitschrijven voor een les</li>
                        <li>Anuleringsmail van een les als je bent ingeschreven in die les</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td class="topBottom">
                    <p>Met vriendelijke
                        groet,<br> Het eigenwijze lichaam <br> Natascha Puper <br> E-mail: info@nataschapuper.nl <br> Tel: 06-42461736
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
    </body>
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