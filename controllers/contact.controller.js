const Contact = require("../models/contact");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// module.exports.createContact = async (req, res) => {
//   try {

//     const { fullName, email, message } = req.body;



//     const data = { fullName, email, message  }; 
//     const contact = new Contact(data);
//     await contact.save();

//     console.log('contact', contact);
//     res.status(200).send({
//       status: 'Success',
//       message: 'Successfully inserted contact data',
//       data: contact
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: "failed",
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };


// module.exports.createContact = async (req, res) => {
  
//   try {
//     const { fullName, email, message } = req.body;

//       const contact = new Contact(req.body);
//       await contact.save();

//     // Set the PDF file path
//     const pdfPath = path.join(__dirname, "contact.pdf");
//     const doc = new PDFDocument();
//     const writeStream = fs.createWriteStream(pdfPath);

//     doc.pipe(writeStream);

//     // PDF Header
//     doc.fontSize(18).text("Contact Information", { align: "center" }).moveDown(2);

//     // PDF Content (Table-like format)
//     doc.fontSize(12);
//     doc.text(`Full Name: ${fullName}`);
//     doc.text(`Email: ${email}`);
//     doc.text(`Message: ${message}`);
//     doc.end();

//     // Once the PDF is created, send an email
//     writeStream.on("finish", async () => {
//         // Nodemailer setup
//        const transporter = nodemailer.createTransport({
//            host: "nicedashboard.info",
//            port: 465, // SSL Port
//            secure: true,
//            auth: {
//              user: "empyrean@nicedashboard.info",
//              pass: "54J@Yf&nN",
//            },
//          });

//         const mailOptions = {
//             from: "empyrean@nicedashboard.info",
//             // to: "md@nusaiba.com.bd", // Receiver's email
//             to: "mohsinkabirseo@gmail.com", // Receiver's email
//             subject: "New Contact Form Submission",
//             text: `A new contact form submission:\n\nFull Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`,
//             attachments: [
//                 {
//                     filename: "contact.pdf",
//                     path: pdfPath,
//                 },
//             ],
//         };

//         // Send email
//         await transporter.sendMail(mailOptions);

//         // Delete the PDF file after sending
//         fs.unlinkSync(pdfPath);

//       res.status(200).send({
//       status: 'Success',
//       message: 'Successfully inserted contact data',
//       data: contact
//     });
//     });

// } catch (error) {
//   res.status(500).send({
//           status: "failed",
//           message: "Something went wrong",
//           error: error.message,
//         });
// }

// };


module.exports.createContact = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    const contact = new Contact(req.body);
    await contact.save();

    const pdfPath = path.join(__dirname, "contact.pdf");
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Header
    doc
      .fontSize(20)
      .text("Contact Information", { align: "center" })
      .moveDown(2);

    // Table Positioning
    const startX = 50;
    const startY = 150;
    const colWidth = 250;
    const rowHeight = 50; // Increased row height for better spacing

    // Column Headers
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Label", startX, startY + 10, { width: colWidth, align: "center" }) // Adjusted position
      .text("Value", startX + colWidth, startY + 10, { width: colWidth, align: "center" });

    // Draw Table Borders
    doc
      .moveTo(startX, startY)
      .lineTo(startX + colWidth * 2, startY)
      .lineTo(startX + colWidth * 2, startY + rowHeight * 4)
      .lineTo(startX, startY + rowHeight * 4)
      .lineTo(startX, startY)
      .stroke();

    // Row Separators
    for (let i = 0; i <= 4; i++) {
      doc
        .moveTo(startX, startY + rowHeight * i)
        .lineTo(startX + colWidth * 2, startY + rowHeight * i)
        .stroke();
    }

    // Column Separator
    doc
      .moveTo(startX + colWidth, startY)
      .lineTo(startX + colWidth, startY + rowHeight * 4)
      .stroke();

    // Table Data (Adjusted Y positions for better spacing)
    doc
      .font("Helvetica")
      .fontSize(12)
      .text("Full Name", startX, startY + rowHeight + 10, { width: colWidth, align: "center" })
      .text(fullName, startX + colWidth, startY + rowHeight + 10, { width: colWidth, align: "center" });

    doc
      .text("Email", startX, startY + rowHeight * 2 + 10, { width: colWidth, align: "center" })
      .text(email, startX + colWidth, startY + rowHeight * 2 + 10, { width: colWidth, align: "center" });

    // Multi-line support for Message (Adjusted Y position)
    doc
      .text("Message", startX, startY + rowHeight * 3 + 10, { width: colWidth, align: "center" })
      .text(message, startX + colWidth, startY + rowHeight * 3 + 10, {
        width: colWidth - 10,
        align: "center",
        lineGap: 5, // Adds spacing between lines
      });

    doc.end();

    writeStream.on("finish", async () => {
      const transporter = nodemailer.createTransport({
        host: "nicedashboard.info",
        port: 465,
        secure: true,
        auth: {
          user: "empyrean@nicedashboard.info",
          pass: "54J@Yf&nN",
        },
      });

      const mailOptions = {
        from: "empyrean@nicedashboard.info",
        to: "mohsinkabirseo@gmail.com",
        subject: "New Contact Form Submission",
        text: `A new contact form submission:\n\nFull Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`,
        attachments: [
          {
            filename: "contact.pdf",
            path: pdfPath,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      fs.unlinkSync(pdfPath);

      res.status(200).send({
        status: "Success",
        message: "Successfully inserted contact data and sent email",
        data: contact,
      });
    });

  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
};
module.exports.getAllContact = async(req, res) => {
  try {
    const contact = await Contact.find();
    console.log(contact);
    res.status(200).send({
      status: "Success",
      message: "You got all contact",
      data: contact,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
};
