// packages
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const express_mongo_sanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

// routes handlers
const user = require('./router/user.router');

//config
const dbconnection = require('./config/db.config');

//middlewares
const errorHandler = require('./middleware/errorHandler.middleware');
const {protect} = require('./middleware/auth.middleware');

// utils
const corsOptions = require('./utils/corsOptions.utils');

let port = process.env.PORT || 1000;

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(express_mongo_sanitize());
app.use(helmet());
app.use(cookieParser())
dbconnection()

app.use('/v1/users', user);
app.use(errorHandler);

app.listen(port,()=> {
    console.log(`server is running in ${process.env.NODE_ENV} at port ${port}`.bold.bgBlack.cyan)
})