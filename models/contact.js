const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  
  message: {
    type: String,
    default: true, // or use `required: true` if it's mandatory
  },
});

// Create the model
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
