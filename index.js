require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');
let requestCounter = '-1';


const server = http.createServer((req, res) => {
    requestCounter = (+requestCounter + 1).toString();
    startShowDate(res, requestCounter);
});


startShowDate = (res, requestCounter) => {
    let interval = process.env.INTERVAL,
        stopTime = process.env.STOPTIME,
        counter = 0;

    let intervalId = setInterval(() => {
        counter += +interval;

        let dateToShow = dateFormat(new Date(), 'dd-mm-yyyy | HH:MM:ss');
        logDate(dateToShow, requestCounter, getLogColor(requestCounter));

        if (counter >= stopTime) {
            clearInterval(intervalId);
            sendResponse(res, dateToShow);
        }
    }, interval);
};

sendResponse = (res, date) => {
    fs.readFile(path.normalize('./responsePage.html'), 'utf8', (error, responsePage) => {
        if (error) {
            console.log('Error reading responsePage.html file');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);

            let separatedDate = date.split(' | ');
            let parsedDate = separatedDate[0];
            let parsedTime = separatedDate[1];

            let findDate = '{{date}}';
            let findTime = '{{time}}';



            responsePage = responsePage.replace(findDate, parsedDate);
            responsePage = responsePage.replace(findTime, parsedTime);
            res.end(responsePage);
        }
    });
};


getLogColor = (requestCounter) => {
    let numForColor = requestCounter.length > 1 ? requestCounter[requestCounter.length-1] : requestCounter;
    return `\x1b[3${numForColor}m%s\x1b[0m`;
};


logDate = (date, requestCounter, logColor) => {
    let logStr = `\nДата для запроса №${+requestCounter+1}:\n${date}`;
    console.log(logColor, logStr);
};


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});