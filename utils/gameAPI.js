const fetch = require("node-fetch") 
const path = require('path');
const SHA256 = require('./sha256');
const fs = require('fs');
const loginLogs = require('../model/loginLogs');


async function gameAPi(data,user){
    // console.log(user, data,123)
    function readPem (filename) {
        return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename)).toString('ascii');
      }

const privateKey = readPem('private.pem');
// return privateKey
let body = {
    "operatorId": "sheldon",
    "userId":user._id,
    "providerName": data.provider_name,
    "platformId":"DESKTOP",
    "currency":"INR",
    "username":user.userName,
    "lobby":false,
    "clientIp":"46.101.225.192",
    "gameId":`${data.game_id}`
   }
//    console.log(body)
//    return body
// // console.log(privateKey)
let DATA 
const textToSign = JSON.stringify(body)
// // console.log(privateKey, textToSign)
const hashedOutput = SHA256(privateKey, textToSign);

var fullUrl = 'https://dev-api.dreamdelhi.com/api/operator/login';
// var fullUrl = 'https://api.dreamdelhi.com/api/operator/login';
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

    // forloginLogs Update 
    let loginData = await loginLogs.find({userName: user.userName, isOnline: true})
    // console.log(loginData, "loginDataloginDataloginData")
    if(loginData[0].gameToken){
        await loginLogs.findByIdAndUpdate(loginData[0]._id, {gameToken:DATA.token})
    }else{
        await loginLogs.findByIdAndUpdate(loginData[0]._id, {gameToken:DATA.token})
    }
    // console.log(DATA, "GAMEAPI DATA")
    return DATA
}

module.exports = gameAPi