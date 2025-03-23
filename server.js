const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./config/database.config');
const UserRoute = require('./routes/user')
const ContactRoute = require('./routes/contact')
const app = express();
const cors = require("cors");
require('dotenv').config();
const path = require('path');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


dbConnect()
app.use('/api/v1/user',UserRoute)
app.use('/api/v1/contact',ContactRoute)

app.get('/', (req, res) => {
    res.json({"message": "Hello server is running"});
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});




