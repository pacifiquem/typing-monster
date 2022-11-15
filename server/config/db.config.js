const mongoose = require("mongoose");
const dotenv = require('dotenv');
const colors = require('colors');
dotenv.config();

const url =  process.env.onlineUrl || process.env.offlineUrl;

const dbconnection = async() =>{
    try {
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            UseUnifiedTopology: true
         });
        if(conn) {
         console.log(`database connected on ${url} successfully`.magenta.bgBlack);
        }
    } catch (error) {
        console.log(`there was error : ${error}`);
        process.exit(1);
    }
};


module.exports = dbconnection