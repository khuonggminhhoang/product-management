const express = require("express");
const http = require('http');
const { Server } = require('socket.io'); 

const bodyParser = require("body-parser");                      // thư viện hỗ trợ parse data của form gửi lên từ fe
const methodOverride = require('method-override');              // thư viện hỗ trợ ghi đè các method fe khi gửi tới server
const flash = require('express-flash');                         // thư viện hỗ trợ in thông báo
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');                                   // path để ghép chuỗi đường dẫn
require('dotenv').config();                                     // config file .env


const {connectDB} = require('./config/connectDB');
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// SOCKET IO
global._io = io;                     // dùng biến global để truy cập được từ tất cả các file js trong app
// END

global.objectId = {};               // lưu key là userId, value là socketId khi connect tới socket 

const port = process.env.PORT;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

connectDB();                   // connect to MongoDB 

const systemConfig = require('./config/system');

// App local variable: dùng được mọi nơi ở trong file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

// tinyMce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// setup pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//setup flash
app.use(cookieParser(process.env.SECRET_KEY));  // cái này chỉ là một chuỗi random 
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// Routes admin
routeAdmin(app);

// Routes client
routeClient(app);


app.get('*', (req, res) => {
    res.render('./client/pages/error/404.pug');
});

server.listen(port,() => {
    console.log('server listening on port 3000');
}); 
