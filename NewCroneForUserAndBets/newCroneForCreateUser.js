const crone = require('node-cron');
const betModel = require('../model/betmodel');
const accModel =  require("../model/accountStatementByUserModel");
const userModel =  require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");


exports.create1000User = () => {
    crone.schedule('*/5 * * * *', async() => {
            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
            function generateString(length) {
                let result = "";
                const charactersLength = characters.length;
                for ( let i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
        
                return result;
            }
            // console.log();
        
            // console.log('working')
            let array = [ '6492fd6cd09db28e00761691', '651128f2807eb50d0b84955a' ]
            array.push("65112c6806674741fbdd1172")
            // console.log(array)
            for(let i = 0; i < 1000; i++){
                let x = generateString(7)
                // console.log(x)
                let data = {
                    userName : x,
                    name : x,
                    password : "123456789",
                    passwordConfirm : "123456789",
                    role : "648193c3cb86f71eede0b1fd",
                    whiteLabel : "betbhaiTest",
                    role_type : 5,
                    roleName : "user",
                    parent_id : "648193f1cb86f71eede0b201",
                    parent_user_type_id : 1,
                    parentUsers : array
                }
                
                await User.create(data)
            }
    })
}