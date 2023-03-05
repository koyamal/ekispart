const axios = require("axios");
const dotenv = require("dotenv");

const url = dotenv.config().parsed.ekiUrl;

console.log(url);

const getDepatureTime = async function(){
    const body = await axios(url);
    const rowData = body.data
    console.log(rowData);
    console.log(typeof rowData);
}

getDepatureTime();