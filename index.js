const express = require("express");
const bodyParser = require("body-parser");                      // thư viện hỗ trợ parse data của form gửi lên từ fe
const methodOverride = require('method-override');              // thư viện hỗ trợ ghi đè các method fe khi gửi tới server
const flash = require('express-flash');                         // thư viện hỗ trợ in thông báo
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();                                     // config file .env


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


app.use(express.static(`${__dirname}/public`));

// setup pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//setup flash
app.use(cookieParser('Hoangminhkhuongrandom'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// Routes client
routeClient(app);

// Routes admin
routeAdmin(app);

app.listen(port,() => {
    console.log('server listening on port 3000');
}); 


