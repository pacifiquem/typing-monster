const mongoose = require("mongoose");
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config = ({path : './config.env'});
const url = process.env.DB_URL;

const dbconnection = async() =>{
    try {
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            UseUnifiedTopology: true
         });
        if(conn) {
         console.log(`database connected successfully`.magenta.bgBlack);
        }
    } catch (error) {
        console.log(error);
    }
};


module.exports = dbconnection