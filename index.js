const axios = require("axios");
const dotenv = require("dotenv");

const minuteLater = 5;

const createDateSet = function(minuteLater){
    const nowDate = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const dateSetNow = {}

    dateSetNow.year = nowDate.getFullYear().toString();
    (nowDate.getMonth() + 1).toString().length === 2?
        dateSetNow.month = (nowDate.getMonth() + 1).toString(): 
        dateSetNow.month = '0' + (nowDate.getMonth() + 1);
    nowDate.getDate().toString().length === 2 ?
        dateSetNow.day = nowDate.getDate().toString(): 
        dateSetNow.day = '0' + nowDate.getDate();
    nowDate.getHours().toString().length === 2 ? 
        dateSetNow.hour = nowDate.getHours().toString(): 
        dateSetNow.hour = '0' + nowDate.getHours();
    nowDate.getMinutes().toString().length === 2 ? 
        dateSetNow.minute = nowDate.getMinutes().toString(): 
        dateSetNow.minute = '0' + nowDate.getMinutes();
    
    const dateSetLater = {};
    nowDate.setMinutes(nowDate.getMinutes() + minuteLater);

    dateSetLater.year = nowDate.getFullYear().toString();
    (nowDate.getMonth() + 1).toString().length === 2?
        dateSetLater.month = (nowDate.getMonth() + 1).toString(): 
        dateSetLater.month = '0' + (nowDate.getMonth() + 1);
    nowDate.getDate().toString().length === 2 ?
        dateSetLater.day = nowDate.getDate().toString(): 
        dateSetLater.day = '0' + nowDate.getDate();
    nowDate.getHours().toString().length === 2 ? 
        dateSetLater.hour = nowDate.getHours().toString(): 
        dateSetLater.hour = '0' + nowDate.getHours();
    nowDate.getMinutes().toString().length === 2 ? 
        dateSetLater.minute = nowDate.getMinutes().toString(): 
        dateSetLater.minute = '0' + nowDate.getMinutes();

    console.log(dateSetNow, dateSetLater);
    return {dateSetNow, dateSetLater};
}

const getStartEndTime = function(timeText){
    let startTime = "";
    let endTime = "";

    for(let i = 0; i < 5; i++){
        startTime += timeText[i];
        endTime += timeText[33 + i];
    }
    return {startTime, endTime};
}

const getDepatureTime = async function(dateSet){

    const urlCommonPart = dotenv.config().parsed.ekiUrl;
    const urlTimePart = `&yyyymm=${dateSet.year}${dateSet.month}&day=${dateSet.day}&hour=${dateSet.hour}&minute10=${dateSet.minute[0]}&minute1=${dateSet.minute[1]}`;
    const url = urlCommonPart + urlTimePart;
    
    const tgtText = dotenv.config().parsed.targetText;

    const response = await axios(url);
    let depatureTimes = [];

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

    if(!depatureTimes.length){
        throw new Error('No Data');
    }

    return depatureTimes;
}

const calDiffNowAndDpt = function(dptime, nowtime){
    // console.log(dptime, nowtime);
    const dpHour = dptime.startTime[0] + dptime.startTime[1];
    const dpMinute = dptime.startTime[3] + dptime.startTime[4];
    let diffTime;
    if(dpHour === nowtime.hour){
        diffTime = dpMinute - nowtime.minute;
    }else if(dpHour - nowtime.hour >= 1){
        diffTime = 60 * (dpHour - nowtime.hour) + (dpMinute - nowtime.minute);
    }else{
        diffTime = 'エラー';
    }

    return diffTime;
}

const init = async function(minLate = 0){
    const dateSet = createDateSet(minLate);
    let speakOutput;
    try{
        const dpt = await getDepatureTime(dateSet.dateSetLater);
        // const dpt = [
        //     { startTime: '20:43', endTime: '20:55' }
        //   ]
        console.log('dpt: ', dpt);
        
        dpt[1]? 
            speakOutput = `次のバスは${calDiffNowAndDpt(dpt[0], dateSet.dateSetNow)}分後の${dpt[0].startTime}で、その次は${calDiffNowAndDpt(dpt[1], dateSet.dateSetNow)}分後の${dpt[1].startTime}です。`:
            speakOutput = `次のバスは${calDiffNowAndDpt(dpt[0], dateSet.dateSetNow)}分後の${dpt[0].startTime}です。`;

    }catch(e){
        speakOutput = e.message;
    }
    console.log(speakOutput);
}

init(130);