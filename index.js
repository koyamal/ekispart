const axios = require("axios");
const dotenv = require("dotenv");

const nowDate = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
const dateSet = {}

dateSet.year = nowDate.getFullYear().toString();
(nowDate.getMonth() + 1).toString().length === 2?
    dateSet.month = (nowDate.getMonth() + 1).toString(): 
    dateSet.month = '0' + (nowDate.getMonth() + 1);
nowDate.getDate().toString().length === 2 ?
    dateSet.day = nowDate.getDate().toString(): 
    dateSet.day = '0' + nowDate.getDate();
nowDate.getHours().toString().length === 2 ? 
    dateSet.hour = nowDate.getHours().toString(): 
    dateSet.hour = '0' + nowDate.getHours();
nowDate.getMinutes().toString().length === 2 ? 
    dateSet.minute = nowDate.getMinutes().toString(): 
    dateSet.minute = '0' + nowDate.getMinutes();

console.log(dateSet);
console.log(nowDate);

const urlCommonPart = dotenv.config().parsed.ekiUrl;
const urlTimePart = `&yyyymm=${dateSet.year}${dateSet.month}&day=${dateSet.day}&hour=${dateSet.hour}&minute10=${dateSet.minute[0]}&minute1=${dateSet.minute[1]}`;
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
    let depatureTimes = [];
    const body = await axios(
        url
        ).then(
            function(response){
                const rowData = response.data;
                const devidedData = rowData.split('\n');

                for(let i = 0; i < devidedData.length; i++){
                    if(devidedData[i].includes(tgtText)){
                        const timeText = devidedData[i + 3];
                        const startEndTime = getStartEndTime(timeText);
                        depatureTimes.push(startEndTime);
                    }
                }
                console.log(depatureTimes);
            });
    return 'This is async function';
}

getDepatureTime().then(result=> {
    console.log(result);
});