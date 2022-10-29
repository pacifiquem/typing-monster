const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();


app.listen(2000, () => {
    console.log(`server is in ${process.env.NODE_ENV} at ${process.env.PORT}`);
});