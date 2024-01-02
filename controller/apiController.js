const AppError = require('../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const fetch = require("node-fetch")

exports.getLiveMatchDetails= async(req, res, next) => {
    // const id = req.query.id
    fetch(`http://46.101.225.192/balance`, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer uchr7s3qwg2dxito`, // notice the Bearer before your token
        }
    })
   .then(resp => resp.json())
   .then(json => {
        req.body.liveMatch = json
        next()
    })
};