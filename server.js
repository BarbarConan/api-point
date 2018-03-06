console.log('Server has been started');

import 'babel-polyfill';

import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';

import color from 'colors';

import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;

const reqURL = process.env.OLROUTE;
const cacheUrl = process.env.CACHEDNS;
const logOutputs = () => {
  console.log('Your settings: >>'.yellow);
  console.log(
    'appName: '.padEnd(5).magenta,
    process.env.APP_NAME.white.bgBlack
  );
  console.log(
    'appToken: '.padEnd(5).magenta,
    process.env.APP_TOKEN.white.bgBlack
  );
  console.log(
    'allowed origin: '.padEnd(5).magenta,
    process.env.ALLOW_ORIGIN.yellow.underline.bgBlack
  );
  console.log(' ');
};

logOutputs();

const getDataFromServer = async (url, params) => {
  let response = await fetch(reqURL, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      appName: process.env.APP_NAME,
      appToken: process.env.APP_TOKEN,
    },
  });
  let data = await response.json();
  return data;
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use(bodyParser.json());

app.post('/endpoint', (request, response) => {
  logOutputs();

  const { body } = request;
  console.log(body);

  console.log(
    'OLROUTE'.underline.blue.bgWhite,
    color.grey.bgBlack('incoming request')
  );

  getDataFromServer(reqURL, body)
    .then(data => {
      response.send(data);
      console.log(color.green.bgBlack('Data has been sent'));
    })
    .catch(reason => {
      console.log(reason.message);
    });
});

app.post('/cache', (request, response) => {
  console.clear();
  logOutputs();

  const { body } = request;

  console.log(
    'CACHEDNS'.underline.blue.bgWhite,
    color.grey.bgBlack('incoming request')
  );

  getDataFromServer(cacheUrl, body)
    .then(data => {
      response.send(data);
      console.log(data);

      console.log(color.green.bgBlack('cache data has been sent'));
    })
    .catch(reason => {
      console.log(reason.message);
    });
});

app.listen(PORT, () => {
  console.log(
    `Server runing on >> ${`http://localhost:${PORT}`.blue.bgBlack.underline}`
  );
});
