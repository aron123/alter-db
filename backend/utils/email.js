const nodemailer = require('nodemailer');
const connection = require('../config').email;

async function sendActivationEmail(nick, email, activationCode) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(connection);
        transporter.sendMail({
            from: 'AlterDB <noreply@arondev.hu>',
            to: email,
            subject: 'Email aktiválás (AlterDB)',
            text: `Kedves ${nick}!\n` +
            '\n' +
            'Regisztrációd aktiválásához nyisd meg böngésződben az alábbi linket:\n' +
            `https://alter.arondev.hu/activate?key=${activationCode}\n` +
            '\n' +
            'Az AlterDB csapata\n'
        }, (err, info) => {
            if (err) {
                return reject(err);
            }

            resolve(info);
        })
    });
}

module.exports = {
    sendActivationEmail
}
