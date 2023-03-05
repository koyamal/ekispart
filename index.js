const axios = require("axios");
const dotenv = require("dotenv");

const urlCommonPart = dotenv.config().parsed.ekiUrl;
const urlTimePart = '&yyyymm=202303&day=5&hour=21&minute10=4&minute1=9'
const url = urlCommonPart + urlTimePart;

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
                let depatureTimes = [];

                for(let i = 0; i < devidedData.length; i++){
                    if(devidedData[i].includes(tgtText)){
                        const timeText = devidedData[i + 3];
                        const startEndTime = getStartEndTime(timeText);
                        depatureTimes.push(startEndTime);
                    }
                }
                console.log(depatureTimes);
            });
}

getDepatureTime();