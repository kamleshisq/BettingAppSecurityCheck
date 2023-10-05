const userModel = require('../model/userModel');
const betmodel = require('../model/betmodel');
const accountStatementByUserModel = require("../model/accountStatementByUserModel");
const betLimitModel = require('../model/betLimitModel');
const cricketAndOtherSport = require('../utils/getSportAndCricketList');
const commissionRepportModel = require("../model/commissionReport");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const betLimitMatchWisemodel = require('../model/betLimitMatchWise');
const newCommissionModel =  require('../model/commissioNNModel');
const Decimal = require('decimal.js');

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = "";
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(parseFloat(Math.random() * charactersLength));
        }

        return result;
    }

async function placeBet(data){
    console.log(data, "data1")
    let check = await userModel.findById(data.LOGINDATA.LOGINUSER._id)
    if(check.availableBalance < data.data.stake){
        return "You do not have sufficient balance for bet"
    }else if(check.exposureLimit === check.exposure){
        return "Please try again later, Your exposure Limit is full"
    }
    let uniqueToken = generateString(5)
    const sportData = await cricketAndOtherSport()
    let gameList
    let bettype

//FOR SPORT TYPE
    if(data.data.spoetId == 4){
        gameList = sportData[0].gameList[0].eventList
        bettype = 'Cricket'
    }else if(data.data.spoetId == 1){
        let footballdata = sportData[1].gameList.find(item => item.sport_name === "Football")
        gameList = footballdata.eventList
        bettype = "Football"
    }else if (data.data.spoetId == 2){
        let tennisData = sportData[1].gameList.find(item => item.sport_name === "Tennis")
        gameList = tennisData.eventList
        bettype = "Tennis"
    }


//FOR FIND THE MATCH
    let liveBetGame = gameList.find(item => item.eventData.eventId == data.data.eventId);

//FOR MARKET DETAILS
    let marketDetails
    let marketList = liveBetGame.marketList
    for (let key in marketList) {
        //FOR FENCT DATA(IF THAT MARKET IS FANCY)
        if (data.data.secId === "odd_Even_Yes" || data.data.secId === "odd_Even_No"){
            const oddEvenData = marketList.odd_even;
            marketDetails = oddEvenData.find(item => item.marketId === data.data.market)
            if(!marketDetails){
                let oddEvenData = marketList.session
                marketDetails = oddEvenData.find(item => item.marketId === data.data.market)
            }
            break;
        //FOR BOOK MAKER AND MATCHODDS DATA (IF MARKET IS MATCH ODDS OR BOOKMAKER)
        }else if(marketList.hasOwnProperty(key)) {
            const marketData = marketList[key];
            if(marketData != null){

                //FOR BOOKMAKER MARKET
                if(Array.isArray(marketData)){
                    let book = marketData.find(item => item.marketId == data.data.market)
                    if(book){
                        marketDetails = book
                        break;
                    }
                }else{
                    //FOR MATCH OODS MARKET
                    if (marketData.marketId === data.data.market) {
                        marketDetails =  marketData;
                        break;
                      }
                }
            }
      }}
let betPlaceData = {}


//FOR BET LIMIT
    let betLimit = await betLimitModel.findOne({type:liveBetGame.eventData.name})
        if(!betLimit){
            betLimit = await betLimitModel.findOne({type:liveBetGame.eventData.league})
            if(!betLimit){
                betLimit = await betLimitModel.findOne({type:sportName})
                if(!betLimit){
                    betLimit = await betLimitModel.findOne({type:'Sport'})
                    if(!betLimit){
                        betLimit = await betLimitModel.findOne({type:'Home'})
                    }
                }
            }
        }

        let minMatchOdds = betLimit.min_stake
        let maxMatchOdds = betLimit.max_stake
        let minBookMaker = betLimit.min_stake
        let maxBookMaker = betLimit.max_stake
        let minFancy = betLimit.min_stake
        let maxFancy = betLimit.max_stake

//FOR PERTICULAR MARKETS
    let thatMarketLimit = await betLimitModel.findOne({type:data.data.market})
    if(thatMarketLimit){
        if(thatMarketLimit.min_stake > parseFloat(data.data.stake) ){
            return `Stake out of range`
        }else if(thatMarketLimit.max_stake < parseFloat(data.data.stake)){
            return `Stake out of range`
        }
    }

//FOR SPORT NAME 
    let sportName = ''
    if(data.data.spoetId == 1){
        filtertinMatch = {
            type : {
                $in :['Home', "Football", 'Football/matchOdds', liveBetGame.eventData.league, liveBetGame.eventData.name]
            }
        }

        sportName = 'Football'
    }else if (data.data.spoetId == 2){
        filtertinMatch = {
            type : {
                $in :['Home', "Tennis", 'Tennis/matchOdds', liveBetGame.eventData.league, liveBetGame.eventData.name]
            }
        }
        sportName = 'Tennis'
    }else if(data.data.spoetId == 4){
        filtertinMatch = {
            type : {
                $in :['Home', "Cricket", 'Cricket/matchOdds', "Cricket/bookMaker", 'Cricket/fency', liveBetGame.eventData.league, liveBetGame.eventData.name]
            }
        }
        sportName = 'Cricket'
    }


// FOR STAKE RANGE
    if(marketDetails.title.toLowerCase().startsWith('match')){

        let MATCHODDDATA = await betLimitModel.findOne({type:`${sportName}/matchOdds`})
        if(MATCHODDDATA){
            minMatchOdds = MATCHODDDATA.min_stake
            maxMatchOdds = MATCHODDDATA.max_stake
        }
        if(minMatchOdds > parseFloat(data.data.stake) ){
            return `Stake out of range`
        }else if(maxMatchOdds < parseFloat(data.data.stake)){
            return `Stake out of range`
        }
    }else if(marketDetails.title.toLowerCase().startsWith('book') || marketDetails.title.toLowerCase().startsWith('toss')){
        let BOOKMAKER = await betLimitModel.findOne({type:`${sportName}/bookMaker`})
        if(BOOKMAKER){
            minBookMaker = BOOKMAKER.min_stake
            maxBookMaker = BOOKMAKER.max_stake
        }
        if(minBookMaker > parseFloat(data.data.stake) ){
            return `Stake out of range`
        }else if(maxBookMaker < parseFloat(data.data.stake)){
            return `Stake out of range`
        }
    }else {
        let FENCY = await betLimitModel.findOne({type:`${sportName}/fency`})
        if(FENCY){
            minFancy = FENCY.min_stake
            maxFancy = FENCY.max_stake
        }
        if(minFancy > parseFloat(data.data.stake) ){
            return `Stake out of range`
        }else if(maxFancy < parseFloat(data.data.stake)){
            return `Stake out of range`
        }
    }


// FOR ODDS LIMIT
    if(data.data.bettype2 === 'BACK'){
        let OddChake = (data.data.oldOdds * 1) + (betLimit.max_odd * 1) 
        if(OddChake <= data.data.odds || data.data.odds < data.data.oldOdds){
            return 'Odds out of range back'
        }
    }else{
        let OddChake = (data.data.oldOdds * 1) - (betLimit.max_odd * 1)  
        if(OddChake >= data.data.odds || data.data.odds > data.data.oldOdds ){
            return 'Odds out of range'
        }
    }



// FOR LAY BACK DIFF

    let creditDebitamount
    if(data.data.bettype2 === "BACK"){
        if(marketDetails.title.toLowerCase().startsWith('match')){
            creditDebitamount = (parseFloat(data.data.stake)).toFixed(2)
        }else if (marketDetails.title.toLowerCase().startsWith('book') || marketDetails.title.toLowerCase().startsWith('toss')){
            creditDebitamount = (parseFloat(data.data.stake)).toFixed(2)
        }
    }else{
        if(marketDetails.title.toLowerCase().startsWith('match')){
            creditDebitamount = (parseFloat(data.data.stake * data.data.odds) - parseFloat(data.data.stake)).toFixed(2)
        }else{
            creditDebitamount = (parseFloat(data.data.stake * data.data.odds)/100).toFixed(2)
        }
    }


console.log(creditDebitamount, "creditDebitamountcreditDebitamount")
//FOR BET PLACE DATA 

//     if(!marketDetails.runners){
//         betPlaceData = {
//             userId : data.LOGINDATA.LOGINUSER._id,
//             userName : data.LOGINDATA.LOGINUSER.userName,
//             transactionId : `${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`,
//             date : Date.now(),
//             oddValue : parseFloat(data.data.odds),
//             Stake : parseFloat(data.data.stake),
//             status : "OPEN",
//             returns : -creditDebitamount,
//             role_type : data.LOGINDATA.LOGINUSER.role_type,
//             match : data.data.title,
//             betType : bettype,
//             event : liveBetGame.eventData.league,
//             gameId : liveBetGame.eventData.sportId,
//             eventId: liveBetGame.eventData.eventId,
//             eventDate : new Date(liveBetGame.eventData.time * 1000),
//             marketName : marketDetails.title,
//             selectionName : marketDetails.title,
//             marketId : data.data.market,
//             secId : data.data.secId,
//             bettype2: data.data.bettype2,
//             ip:data.LOGINDATA.IP
//         }
//     }else{
//         let runnersData = JSON.parse(marketDetails.runners)
//         let betOn = runnersData.find(item => item.secId == data.data.secId)
//         if(!betOn){
//             betOn = runnersData.find(item => item.secId == data.data.secId.slice(0,-1))
//         }
//             betPlaceData = {
//                 userId : data.LOGINDATA.LOGINUSER._id,
//                 userName : data.LOGINDATA.LOGINUSER.userName,
//                 transactionId : `${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`,
//                 date : Date.now(),
//                 oddValue : parseFloat(data.data.odds),
//                 Stake : parseFloat(data.data.stake),
//                 status : "OPEN",
//                 returns : -creditDebitamount,
//                 role_type : data.LOGINDATA.LOGINUSER.role_type,
//                 match : data.data.title,
//                 betType : bettype,
//                 event : liveBetGame.eventData.league,
//                 gameId : liveBetGame.eventData.sportId,
//                 eventId: liveBetGame.eventData.eventId,
//                 eventDate : new Date(liveBetGame.eventData.time * 1000),
//                 marketName : marketDetails.title,
//                 selectionName : betOn.runner,
//                 marketId : data.data.market,
//                 secId : data.data.secId,
//                 bettype2: data.data.bettype2,
//                 ip:data.LOGINDATA.IP

//             }
//     }
//     let description = `Bet for ${data.data.title}/stake = ${data.data.stake}`
    
// // FOR ACC STATEMENTS DATA 
//     let Acc = {
//         "user_id":data.LOGINDATA.LOGINUSER._id,
//         "description": description,
//         "creditDebitamount" : -creditDebitamount,
//         "balance" : check.availableBalance - creditDebitamount,
//         "date" : Date.now(),
//         "userName" : data.LOGINDATA.LOGINUSER.userName,
//         "role_type" : data.LOGINDATA.LOGINUSER.role_type,
//         "Remark":"-",
//         "stake": parseFloat(data.data.stake),
//         "transactionId":`${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`
//     }
//     await betmodel.create(betPlaceData)
//     await accountStatementByUserModel.create(Acc)



// // FOR USER CHANGES 
//     let user = await userModel.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id, {$inc:{availableBalance: - creditDebitamount, myPL: - creditDebitamount, Bets : 1, exposure: creditDebitamount, uplinePL:creditDebitamount, pointsWL:-creditDebitamount}})
//     if(!user){
//         return "There is no user with that id"
//     }
    
                    



// // FOR USER PARENTS CHANGES
//     let amount = creditDebitamount;
//     try{
//         for(let i = user.parentUsers.length - 1; i >= 1; i--){
//             let parentUser1 = await userModel.findById(user.parentUsers[i])
//             let parentUser2 = await userModel.findById(user.parentUsers[i-1])
//             let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
//             let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
//             parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
//             parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
//             await userModel.findByIdAndUpdate(user.parentUsers[i], {
//                 $inc: {
//                     downlineBalance: -creditDebitamount,
//                     myPL: parentUser1Amount,
//                     uplinePL: parentUser2Amount,
//                     lifetimePL: parentUser1Amount,
//                     pointsWL: -creditDebitamount
//                 }
//             });
        
//             if (i === 1) {
//                 await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
//                     $inc: {
//                         downlineBalance: -creditDebitamount,
//                         myPL: parentUser2Amount,
//                         lifetimePL: parentUser2Amount,
//                         pointsWL: -creditDebitamount
//                     }
//                 });
//             }
//             amount = parentUser2Amount
//         }
//     }catch(err){
//         console.log(err)
//         return err
//     }



// // FOR COMMISSION REGARDIN THAT BET 
//     // console.log(user)
//     let commissionMarket = await commissionMarketModel.find()
//     if(commissionMarket.some(item => item.marketId == data.data.market)){
//         let commission = await commissionModel.find({userId:user.id})
//         // console.log(commission, 456)
//         let commissionPer = 0
//         if ((marketDetails.title.toLowerCase().startsWith('book')|| marketDetails.title.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY" && commission[0].Bookmaker.status){
//           commissionPer = commission[0].Bookmaker.percentage
//         }else if (commission[0].fency.type == "ENTRY" && !(marketDetails.title.toLowerCase().startsWith('book')|| marketDetails.title.toLowerCase().startsWith('toss') || marketDetails.title.toLowerCase().startsWith('match')) && commission[0].fency.status){
//           commissionPer = commission[0].fency.percentage
//         }
//         let commissionCoin = ((commissionPer * data.data.stake)/100).toFixed(4)
//         if(commissionPer > 0){
//             let commissiondata = {
//                 userName : user.userName,
//                 userId : user.id,
//                 eventId : liveBetGame.eventData.eventId,
//                 sportId : liveBetGame.eventData.sportId,
//                 ComId : liveBetGame.eventData.compId,
//                 marketId : marketDetails.marketId,
//                 eventDate : new Date(liveBetGame.eventData.time * 1000),
//                 eventName : liveBetGame.eventData.name,
//                 commission : commissionCoin,
//                 upline : 100,
//                 commissionType: 'Entry Wise Commission',
//                 commissionPercentage:commissionPer
//             }
//             let commissionData = await newCommissionModel.create(commissiondata)
//         }
    
//         try{
//             for(let i = user.parentUsers.length - 1; i >= 1; i--){
//                 let childUser = await userModel.findById(user.parentUsers[i])
//                 let parentUser = await userModel.findById(user.parentUsers[i - 1])
//                 let commissionChild = await commissionModel.find({userId:childUser.id})
//                 let commissionPer = 0
//                 if ((marketDetails.title.toLowerCase().startsWith('book')|| marketDetails.title.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY" && commissionChild[0].Bookmaker.status){
//                   commissionPer = commissionChild[0].Bookmaker.percentage
//                 }else if (commissionChild[0].fency.type == "ENTRY" && !(marketDetails.title.toLowerCase().startsWith('book')|| marketDetails.title.toLowerCase().startsWith('toss') || marketDetails.title.toLowerCase().startsWith('match')) && commissionChild[0].fency.status){
//                   commissionPer = commissionChild[0].fency.percentage

//                 }
//                 let commissionCoin = ((commissionPer * data.data.stake)/100).toFixed(4)
//                 if(commissionPer > 0){
//                     let commissiondata = {
//                         userName : childUser.userName,
//                         userId : childUser.id,
//                         eventId : liveBetGame.eventData.eventId,
//                         sportId : liveBetGame.eventData.sportId,
//                         ComId : liveBetGame.eventData.compId,
//                         marketId : marketDetails.marketId,
//                         eventDate : new Date(liveBetGame.eventData.time * 1000),
//                         eventName : liveBetGame.eventData.name,
//                         commission : commissionCoin,
//                         upline : 100,
//                         commissionType: 'Entry Wise Commission',
//                         commissionPercentage:commissionPer
//                     }
//                     let commissionData = await newCommissionModel.create(commissiondata)
//                 }
//             }
//         }catch(err){
//             console.log(err)
//         }
//     }
    return "Bet placed successfully"
}

module.exports = placeBet