const express = require("express");
const {connectDB} = require('./config/connectDB');
const routes = require('./routes/client/index.route');
require('dotenv').config();     // config file .env


const app = express();
const port = process.env.PORT;
connectDB();                   // connect to MongoDB 

app.use(express.static('public'));
// set pug
app.set("views", "./views");
app.set("view engine", "pug");

// Routes
routes(app);

app.listen(port,() => {
    console.log('server listening on port 3000');
}); 