const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "nicedashboard.info",
    port: 465, // SSL Port
    secure: true,
    auth: {
      user: "empyrean@nicedashboard.info",
      pass: "54J@Yf&nN",
    },
  });


// async..await is not allowed in global scope, must use a wrapper
exports.sendMail = async (
  mailAddress,
  mailerName,
  mailerMessage
) => {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${mailerName}" <${mailAddress}>`, // sender address
      to: "md@nusaiba.com.bd", // list of receivers
      subject: "Contact Information", // Subject line
      text: mailerMessage, // plain text body
      // html: "<b>{mailerMessage}</b>",
    });

    console.log("Message sent: %s", info);

    return info;
  } catch (error) {
    return error;
  }

  //
};