const crone = require('node-cron');
const betModel = require('../model/betmodel');
const accModel =  require("../model/accountStatementByUserModel");
const userModel =  require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const User = require('../model/userModel');


module.exports = () => {
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
            let array = [ '6492fd6cd09db28e00761691', '65410e67bba0d7d26d377df1' ]
            array.push("65410f41bba0d7d26d379deb")
            // console.log(array)
            for(let i = 0; i < 1000; i++){
                let x = generateString(7)
                // console.log(x)
                let data = {
                    name : x,
                    userName : x,
                    role : "6492fe4fd09db28e00761694",
                    whiteLabel : "jayesh",
                    email: 'cronetestingUser@gmail.com',
                    contact: '987654321',
                    password : "123456789",
                    passwordConfirm : "123456789",
                    exposureLimit:10000,
                    role_type : 5,
                    roleName : "user",
                    parent_id : "65410f41bba0d7d26d379deb",
                    parentUsers : array
                }
                
                let parentUser = await User.findById("65410f41bba0d7d26d379deb")
                if(parentUser.availableBalance != 0){
                    
                    let newUser = await User.create(data)
                    newUser.balance = parseFloat(10000);
                    newUser.availableBalance = parseFloat(10000);
                    newUser.creditReference = parseFloat(10000);
                    parentUser.availableBalance = parseFloat(parentUser.availableBalance - 10000);
                    parentUser.downlineBalance = parseFloat(parentUser.downlineBalance) + parseFloat(10000);
                    const updatedChild = await User.findByIdAndUpdate(newUser.id, newUser,{
                        new:true
                    });
    
                    const updatedparent =  await User.findByIdAndUpdate(parentUser.id, parentUser);
                    if(!updatedChild || !updatedparent){
                        console.log("NOtworking")
                        break;
                    }
                    try{
    
                    
                    let childAccStatement = {}
                    let ParentAccStatement = {}
                    let date = Date.now()
                    childAccStatement.child_id = newUser.id;
                    childAccStatement.user_id = newUser.id;
                    childAccStatement.parent_id = parentUser.id;
                    childAccStatement.description = 'Chips credited to ' + newUser.name + '(' + newUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
                    childAccStatement.creditDebitamount = parseFloat(10000);
                    childAccStatement.balance = newUser.availableBalance;
                    childAccStatement.date = date
                    childAccStatement.userName = newUser.userName
                    childAccStatement.role_type = newUser.role_type
                    // childAccStatement.Remark = req.body.remark
                    const accStatementChild = await accModel.create(childAccStatement)
                    if(!accStatementChild){
                        // return next(new AppError("Ops, Something went wrong While Fund Debit Please try again later", 500))
                        console.log('Not Working')
                        break;
                    }
    
                    ParentAccStatement.child_id = newUser.id;
                    ParentAccStatement.user_id = parentUser.id;
                    ParentAccStatement.parent_id = parentUser.id;
                    ParentAccStatement.description = 'Chips credited to ' + newUser.name + '(' + newUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
                    ParentAccStatement.creditDebitamount = -parseFloat(10000);
                    ParentAccStatement.balance = parentUser.availableBalance;
                    ParentAccStatement.date = date
                    ParentAccStatement.userName = parentUser.userName;
                    ParentAccStatement.role_type = parentUser.role_type
                    // ParentAccStatement.Remark = req.body.remark
                    const accStatementparent = await accModel.create(ParentAccStatement)
                    if(!accStatementparent){
                        console.log('Not Working')
                        break;
                    }
    
                    console.log(newUser, "+==> NewUser" , i)
                }catch(err){
                    console.log(err,  "=======> err")
                    break
                }
                }
            }
    })
}