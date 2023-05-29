const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const gameModel = require('../model/gameModel');
// const XLSX = require('xlsx');
// const workbook = XLSX.readFile("C:\\jayesh\\New_folder1\\Lordex-New\\backend\\xlsfiles\\DC.xlsx");
// const sheetName = workbook.SheetNames[0];
// const worksheet = workbook.Sheets[sheetName];
// const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// console.log(data[2])

exports.addXlsFIle = catchAsync(async(req, res, next) => {
    for(let i = 1; i < data.length; i++){
        let data1 = {};
        data1.provider_name = data[i][0];
        data1.sub_provider_name = data[i][1];
        data1.category = data[i][2];
        data1.game_code = data[i][3];
        data1.game_id = data[i][4]
        data1.game_name = data[i][6]
        data1.url_thumb = data[i][7]
        await gameModel.create(data1)
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
    console.log(req.body);
})