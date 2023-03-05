const axios = require("axios");
const dotenv = require("dotenv");

const url = dotenv.config().parsed.ekiUrl;
const tgtText = dotenv.config().parsed.targetText;

const getStartEndTime = function(timeText){
    let startTime = "";
    let endTime = "";

    for(let i = 0; i < 5; i++){
        startTime += timeText[i];
        endTime += timeText[33 + i];
    }
    return {startTime, endTime};
}

const getDepatureTime = async function(){
    const body = await axios(
        url
        ).then(
            function(response){
                const rowData = response.data;
                const devidedData = rowData.split('\n');

                for(let i = 0; i < devidedData.length; i++){
                    if(devidedData[i].includes(tgtText)){
                        const timeText = devidedData[i + 3];
                        const seTime = getStartEndTime(timeText);
                        console.log(seTime.startTime);
                        console.log(seTime.endTime);
                    }
                }
            });
}

getDepatureTime();