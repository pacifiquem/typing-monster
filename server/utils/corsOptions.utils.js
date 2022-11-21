const dotenv = require('dotenv').config();

module.exports.corsOptions = {
    origin: (process.env.NODE_ENV === "PRODUCTION") ? process.env.PROD_URL : process.env.DEV_URL,
}