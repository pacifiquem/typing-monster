// packages
const express = require('express');
const dotenv = require('dotenv').config({path: './config/config.env'});
const colors = require('colors');
const express_mongo_sanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// routes handlers
const user = require('./router/user.router');
const shoes = require('./router/shoes.router');

//config
const dbconnection = require('./config/db.config');

//middlewares
const errorHandler = require('./middleware/errorHandler.middleware');
const {protect} = require('./middleware/auth.middleware');



let port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express_mongo_sanitize());
app.use(helmet());
app.use(cookieParser())
dbconnection()

app.use('/v1/users', user);
app.use('/v1/shoes', shoes);
app.use(errorHandler);

app.listen(port,()=> {
    console.log(`server is running in ${process.env.NODE_ENV} at port ${port}`.bold.bgBlack.cyan)
})