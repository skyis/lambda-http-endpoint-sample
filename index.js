console.log('Loading function');

const config  = require('config');
const axios = require('axios');
const querystring = require('querystring');

exports.handler = (event, context, callback) => {
    // console.log('Received event:', JSON.stringify(event, null, 2));
    const axiosConfig = {
      method: 'post',
      baseURL: 'https://hoge.piyo/',
      url: '/rpc',
      data: null,
    };

    if (event.httpMethod !== 'POST') callback(null, {statusCode: 405});

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.path) {
      case '/oauth2/token':
        const requestParams = querystring.parse(event.body);
        const method = 'issueToken';
        const params = {
          null,
        };

        axiosConfig.data = {method, params};
        axios(axiosConfig)
        .then(function (response) {
          console.log(response.data);
          console.log(response.headers);
          if (response.data.error) done(new Error(`{"error":"${errorMessage}"}`));
          done(null, response.data);
        })
        .catch(function (error) {
          console.log(error);
          callback(null, {statusCode: 500});
        });

        break;

      default:
        done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
