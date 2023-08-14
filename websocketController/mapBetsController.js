const userModel = require("../model/userModel");
const accModel = require("../model/accountStatementByUserModel");
const betModel = require("../model/betmodel");


exports.mapbet = async(data) => {
    console.log(data)
    // let bets = await betModel.find({marketId:`${data.id}`})
    let bets = await betModel.aggregate([
        {
            $match:{
                marketId:`${data.id}`
            }
        },
        {
            $lookup: {
              from: "users",
              localField: "userName",
              foreignField: "userName",
              as: "user"
            }
          },
          {
            $unwind: "$user"
          },
          {
            $match: {
              "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER>_id] }
            }
          },
    ])
    console.log(bets)
    bets.forEach(async(bet) => {
        if(data.result === "yes" || data.result === "no"){
            // console.log(bet)
            if(bet.secId === "odd_Even_Yes" && data.result === "yes" || bet.secId === "odd_Even_No" && data.result === "no" ){
                let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:(bet.Stake * bet.oddValue)})
                        let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{balance: parseFloat(bet.Stake * bet.oddValue), availableBalance: parseFloat(bet.Stake * bet.oddValue), myPL: parseFloat(bet.Stake * bet.oddValue), Won:1, exposure:-parseFloat(bet.Stake)}})
                        console.log(user)
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                        let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                        let parentUser

                        if(user.parentUsers.length < 2){
                            // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (bet.Stake * bet.oddValue), downlineBalance: (bet.Stake * bet.oddValue)}})
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                        }else{
                            await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue)}})
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance: -parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                        }
                        
                        await accModel.create({
                          "user_id":user._id,
                          "description": description,
                          "creditDebitamount" : (bet.Stake * bet.oddValue),
                          "balance" : user.availableBalance + (bet.Stake * bet.oddValue),
                          "date" : Date.now(),
                          "userName" : user.userName,
                          "role_type" : user.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}`
                        })

                        await accModel.create({
                          "user_id":parentUser._id,
                          "description": description2,
                          "creditDebitamount" : -(bet.Stake * bet.oddValue),
                          "balance" : parentUser.availableBalance - (bet.Stake * bet.oddValue),
                          "date" : Date.now(),
                          "userName" : parentUser.userName,
                          "role_type" : parentUser.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}Parent`
                        })
            }else{
                await betModel.findByIdAndUpdate(bet._id,{status:"LOSS"})
                await userModel.findByIdAndUpdate(bet.userId,{$inc:{Loss:1, exposure:-parseFloat(bet.Stake)}})
            }
        }else{
            if(bet.selectionName.toLowerCase() === data.result.toLowerCase()){
                let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:(bet.Stake * bet.oddValue)})
                let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{balance: parseFloat(bet.Stake * bet.oddValue), availableBalance: parseFloat(bet.Stake * bet.oddValue), myPL: parseFloat(bet.Stake * bet.oddValue), Won:1, exposure:-parseFloat(bet.Stake)}})
                let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                let parentUser

                if(user.parentUsers.length < 2){
                    // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (bet.Stake * bet.oddValue), downlineBalance: (bet.Stake * bet.oddValue)}})
                    parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                }else{
                    await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue)}})
                    parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                }
                
                await accModel.create({
                  "user_id":user._id,
                  "description": description,
                  "creditDebitamount" : (bet.Stake * bet.oddValue),
                  "balance" : user.availableBalance + (bet.Stake * bet.oddValue),
                  "date" : Date.now(),
                  "userName" : user.userName,
                  "role_type" : user.role_type,
                  "Remark":"-",
                  "stake": bet.Stake,
                  "transactionId":`${bet.transactionId}`
                })

                await accModel.create({
                  "user_id":parentUser._id,
                  "description": description2,
                  "creditDebitamount" : -(bet.Stake * bet.oddValue),
                  "balance" : parentUser.availableBalance - (bet.Stake * bet.oddValue),
                  "date" : Date.now(),
                  "userName" : parentUser.userName,
                  "role_type" : parentUser.role_type,
                  "Remark":"-",
                  "stake": bet.Stake,
                  "transactionId":`${bet.transactionId}Parent`
                })
            }else{
                await betModel.findByIdAndUpdate(bet._id,{status:"LOSS"})
                await userModel.findByIdAndUpdate(bet.userId,{$inc:{Loss:1, exposure:-parseFloat(bet.Stake)}})
            }
        }
    });
}