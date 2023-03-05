const axios = require("axios");
const dotenv = require("dotenv");

const url = dotenv.config().parsed.ekiUrl;
const tgtText = dotenv.config().parsed.targetText;

const getDepatureTime = async function(){
    const body = await axios(url);
    const rowData = body.data;
    const devidedData = rowData.split('\n');

    for(let i = 0; i < devidedData.length; i++){
        if(devidedData[i].includes(tgtText)){
            const timeText = devidedData[i + 3];
            let startTime = "";
            let endTime = "";
            for(let j = 0; j < 5; j++){
                startTime += timeText[j];
                endTime += timeText[33 + j];
            }
            console.log(startTime);
            console.log(endTime);
        }
    }
}

getDepatureTime();