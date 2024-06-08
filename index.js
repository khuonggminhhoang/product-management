const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
require('dotenv').config();     // config file .env

const {connectDB} = require('./config/connectDB');
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

connectDB();                   // connect to MongoDB 

const systemConfig = require('./config/system');

// App local variable: dùng được mọi nơi ở trong file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));

// set pug
app.set("views", "./views");
app.set("view engine", "pug");

// Routes client
routeClient(app);

// Routes admin
routeAdmin(app);

app.listen(port,() => {
    console.log('server listening on port 3000');
}); 