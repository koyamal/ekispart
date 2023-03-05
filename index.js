const axios = require("axios");
const dotenv = require("dotenv");

const url = dotenv.config().parsed.ekiUrl;

console.log(url);

const getDepatureTime = async function(){
    const body = await axios(url);
    console.log(body.data);
}

getDepatureTime();