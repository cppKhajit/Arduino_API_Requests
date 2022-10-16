var IotApi = require('@arduino/arduino-iot-client');
var rp = require('request-promise');
var XMLHttpRequest = require('xhr2'); // required to make Http Requests through Node

var payloadThing = JSON.stringify(require('./updateThingPayload.json')); // include dashboard upadate in a JSON file

// function for main access token 
async function getToken() {
    var options = {
        method: 'POST',
        url: 'https://api2.arduino.cc/iot/v1/clients/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        json: true,
        form: {
            grant_type: 'client_credentials',
            client_id: 'rx0ph5orF5cdSfxKuAofB6fJtQAG1j9x',
            client_secret: 'it8b8tyEVU3ANB3xq4nFrO2Py6uQSDSVJfRgR5Sj3LDRxZrf0Mwbu6xM3cy4pa46',
            audience: 'https://api2.arduino.cc/iot'
        }
    };

    try {
        const response = await rp(options);
        return response['access_token'];
    }
    catch (error) {
        console.error("Failed getting an access token: " + error)
    }
}

// make POST request to update thing
async function myHttpRequest(myUrl, myMethod, myToken) {
    var xhr = new XMLHttpRequest();
    xhr.open(myMethod, myUrl); // method to be used in the URL

    xhr.setRequestHeader("Accept", "application/json"); // accept data in JSON 
    xhr.setRequestHeader("Authorization", "Bearer " + myToken); // add Bearer access token from getToken()
    xhr.setRequestHeader("Content-Type", "application/json"); // set payload content type as JSON 

    // function to display stage change of XMLHttpRequest client
    xhr.onreadystatechange = function () {
        // check if the state an XMLHttpRequest client is in the DONE(==4) stage
        if (xhr.readyState === 4) {
            console.log(xhr.status); // display status
            console.log(xhr.responseText); // display response text
        }
    };
    xhr.send(payloadThing); // send Http Request
}

async function run() {
    var client = IotApi.ApiClient.instance;
    // Configure OAuth2 access token for authorization: oauth2
    var oauth2 = client.authentications['oauth2'];
    oauth2.accessToken = await getToken();

    var url = 'https://api2.arduino.cc/iot/v2/things/7ea1ea47-9ca5-4805-94eb-8185d489ac1a?force=true'; // URL of target thing update
    var targetMethod = 'POST'; // method to be used in the URL

    myHttpRequest(url, targetMethod, oauth2.accessToken);
}

run();