const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const gameModel = require('../model/gameModel');
const fs = require('fs')
const path = require('path')
const SHA256 = require('../utils/sha256')
const fetch = require("node-fetch") 
const XLSX = require('xlsx');
const workbook = XLSX.readFile("/var/www/LiveBettingApp/bettingApp/xlsfiles/GameList.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// console.log(data[2])

exports.addXlsFIle = catchAsync(async(req, res, next) => {
    for(let i = 3; i < data.length; i++){
        // console.log(data[i])
        let data1 = {};
        data1.provider_name = data[i][3];
        data1.sub_provider_name = data[i][4];
        data1.category = data[i][2];
        data1.game_code = data[i][7];
        data1.game_id = (data[i][0] * 1)
        data1.game_name = data[i][1]
        data1.url_thumb = data[i][6]
        data1.whiteLabelName = 'dev.ollscores.com'
        await gameModel.create(data1)
        // console.log(data1)


        // data1.provider_name = data[i][0];
        // data1.sub_provider_name = data[i][1];
        // data1.category = data[i][2];
        // data1.game_code = data[i][3];
        // data1.game_id = data[i][4]
        // data1.game_name = data[i][6]
        // data1.url_thumb = data[i][7]
        // data1.whiteLabelName = 'dev.ollscores.com'
        // await gameModel.create(data1)
    }
    res.status(200).json({
        status:"success"
    })
})

exports.addGame = catchAsync(async(req, res, next) => {
    const newGame = await gameModel.create(req.body);
    if(!newGame){
        return next(new AppError("pls try again later", 404))
    }
    res.status(200).json({
        status:"success",
        newGame
    })
});

exports.getAllGame = catchAsync(async(req, res, next) => {
    const AllGame = await gameModel.find();
    res.status(200).json({
        status:"success",
        results:AllGame.length,
        data:AllGame
    })
});

exports.getGameByCategory = catchAsync(async(req, res, next) => {
    // console.log(req.body);
})


exports.sport = catchAsync(async(req, res, next) => {
    // console.log(req.currentUser, 123)
    let body = {
        clientIp: "121.122.32.1",
        currency: "INR",
        operatorId: "sheldon",
        partnerId: "SHPID01",
        platformId: "DESKTOP",
        userId: req.currentUser._id,
        username: req.currentUser.userName
    }
    function readPem (filename) {
        return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename)).toString('ascii');
      }

    const privateKey = readPem('private.pem');
    const textToSign = JSON.stringify(body);
    const hashedOutput = SHA256(privateKey, textToSign);
    // console.log(hashedOutput)
    var fullUrl = 'https://stage-api.mysportsfeed.io/api/v1/feed/user-login';
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
    // return DATA
    req.body.url = DATA.url
    next()
})