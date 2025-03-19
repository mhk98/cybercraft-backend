const Contact = require("../models/contact");


module.exports.createContact = async (req, res) => {
  try {

    const { fullName, email, message } = req.body;



    const data = { fullName, email, message  }; 
    const contact = new Contact(data);
    await contact.save();

    console.log('contact', contact);
    res.status(200).send({
      status: 'Success',
      message: 'Successfully inserted contact data',
      data: room
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
