const fetch = require("node-fetch") 
const path = require('path');
const SHA256 = require('./sha256');
const fs = require('fs');

async function gameAPi(data){
    // console.log(data)
    function readPem (filename) {
        return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename)).toString('ascii');
      }

const privateKey = readPem('private.pem');
// return privateKey
let body = {
    "operatorId": "sheldon",
    "userId":"6438f461d2eb67c8f67fe08d",
    "providerName": data.provider_name,
    "platformId":"DESKTOP",
    "currency":"INR",
    "username":"user4",
    "lobby":false,
    "clientIp":"46.101.225.192",
    "gameId":`${data.game_id}`,
    "balance":5000
   }
//    console.log(body)
//    return body
// // console.log(privateKey)
let DATA 
const textToSign = JSON.stringify(body)
// // console.log(privateKey, textToSign)
const hashedOutput = SHA256(privateKey, textToSign);

var fullUrl = 'https://dev-api.dreamdelhi.com/api/operator/login';
    await fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Signature': hashedOutput ,
            'accept': 'application/json'
            },
        body:JSON.stringify(body)

    })
    .then(res => res.json())
    .then(result => {
      DATA = result
    })
    // console.log(DATA)
    return DATA
}

module.exports = gameAPi