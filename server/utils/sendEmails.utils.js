const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config = ({path: '../config/config.env'});

email = this.email;

const sendEmail = async(options) => {

    const transporter = nodemailer.createTransport({

      host: process.env.Mailhost,
      port: process.env.Mailport,
        auth: {
          user: process.env.Mailuser,
          pass: process.env.Mailpass
      }
    });
    var mailOptions = {
      from: 'smartfy < '+process.env.myEmail,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error.message);
      } else {
        console.log('Email sent: ' + info.response);
      }
   });
}

module.exports = sendEmail