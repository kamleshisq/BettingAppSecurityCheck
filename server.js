const app = require('./app');
const mongoose = require('mongoose')
const util = require('util');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fetch = require('node-fetch');
const gameAPI = require('./utils/gameAPI');
const Role = require('./model/roleModel');
const User = require("./model/userModel");
const Bet = require("./model/betmodel");
const verticalMenuModel = require("./model/verticalMenuModel");
const horizontalMenuModel = require("./model/horizontalMenuModel");
const AccModel  = require("./model/accountStatementByUserModel");
const pagesModel = require("./model/pageModel");
const Promotion = require("./model/promotion")
const Stream = require('./model/streammanagement')
const userController = require("./websocketController/userController");
const accountControl = require("./controller/accountController");
const getmarketDetails = require("./utils/getmarketsbymarketId");
const marketDetailsBymarketID = require("./utils/getmarketsbymarketId");
const scores = require("./utils/Scores")
const placeBet = require('./utils/betPlace');
const loginlogs = require('./model/loginLogs');
const gameModel = require('./model/gameModel');
const getCrkAndAllData = require("./utils/getSportAndCricketList");
const bannerModel = require('./model/bannerModel');
const sliderModel = require('./model/sliderModel');
const betLimit = require("./model/betLimitModel");
const notificationModel = require("./model/notificationModel");
const stakeLabelModel = require("./model/stakeLabelModel");
const multimarketModel = require("./model/maltimarket");
const gameRuleModel = require("./model/gamesRulesModel");
const CasinoFevoriteModel = require("./model/CasinoFevorite");
const fs = require('fs');
const path = require('path');
const houseFundModel = require('./model/houseFundmodel');
const loginLogs =  require("./model/loginLogs");
const settlement = require("./model/sattlementModel");
const settlementHistory = require('./model/settelementHistory')
const mapBet = require("./utils/mapBetController");
const commissionModel = require("./model/CommissionModel");
const catalogController = require("./model/catalogControllModel");
const commissionMarketModel = require("./model/CommissionMarketsModel");
const netCommissionModel = require('./model/netCommissionModel');
const commissionRepportModel = require('./model/commissionReport');
const featureEventModel = require('./model/featureEventModel')
const InPlayEvent = require('./model/inPlayModel')
const PaymentMethodModel = require('./model/paymentmethodmodel')
const paymentReportModel = require('./model/paymentreport')

const { error } = require('console');
const checkPass = require("./websocketController/checkPassUser");
const { type } = require('os');
const checkPassAsync = util.promisify(checkPass.checkPass);
const betLimitMatchWisemodel = require('./model/betLimitMatchWise');
const voidbetAfterPlace = require('./utils/voideBetAfterPlace');
const voidBetBeforePlace = require('./utils/voidBetForOpen');
const rollBackBet = require('./utils/RollBackAfterPlace');
const InprogreshModel = require('./model/InprogressModel');
const eventNotification = require('./model/eventNotification');
const newCommissionModel = require('./model/commissioNNModel'); 
const timelyNotificationModel = require('./model/timelyVoideNotification');
const resumeSuspendModel = require('./model/resumeSuspendMarket');
const Decimal = require('decimal.js');
const runnerDataModel = require('./model/runnersData');
const streamModel = require('./model/streammanagement');
const liveStreameData = require('./utils/getLiveStream');
const manageAccountsUser = require('./model/paymentMethodUserSide');
const withdowReqModel = require('./model/withdrowReqModel');
const runnerData = require('./model/runnersData');
// const { date } = require('joi');
// const { Linter } = require('eslint');
io.on('connection', (socket) => {
    console.log('connected to client')
   
    // console.log(loginData.Token)
    // console.log(global._token)
    socket.emit("loginUser", {
        loginData:global.loginData,
        socket:socket.request.connection.remoteAddress
    })
    const urlRequestAdd = async(url,method, Token, user) => {
        const login = await loginlogs.findOne({session_id:Token, isOnline:true})
        
        var fullUrl = global._protocol + '://' + global._host + url
        if(login){
            // console.log(fullUrl)
            login.logs.push(method + " - " + fullUrl)
            login.save()
        }else{
            let data = {}
            data.user_id = user._id,
            data.userName = user.userName
            data.logs = [fullUrl]
            await loginlogs.create(data)
        }
    }


//.........................for update role................//


    socket.on('dataId', async(id)=>{
        var fullUrl = global._protocol + '://' + global._host + '/api/v1/role/getRoleById?id=' + id
        var fullUrl1 = global._protocol + '://' + global._host + "/api/v1/role/getAuthROle"

        let urls = [
            {
                url:fullUrl,
                name:'data'
            },
            {
                url:fullUrl1,
                name:'role'
            }
        ]
        // console.log(urls)
        let requests = urls.map(item => fetch(item.url, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ` + global._token, 
            }
        }).then(data => data.json()));
        const resultData = {data:[], role:[]};
        const data = await Promise.all(requests)
        // console.log(data)
        // const data1 = data[0].data;
        // const role = data[1].roles;
        // console.log(data)
        socket.emit("sendData", data)
        
        // console.log(data)
    })






//......................FOR user profile page .......................//

    socket.on('editMyProfile',async(data)=>{
        try{
            await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id,data.data)
            socket.emit('editMyProfile',{status:'success',msg:'profile edited successfully'})
        }catch(err){
            console.log(err)
            socket.emit('editMyProfile',{status:'success',msg:'something went wrong'})
        }
    })

    socket.on('editMyPassword',async(data)=>{
        try{
            let user = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
            if(user){
                const passcheck = await user.correctPassword(data.data.oldpassword, user.password)
                if(passcheck){
                    if(await user.correctPassword(data.data.password, user.password)){
                        socket.emit('editMyPassword',{status:'fail',msg:'Please enter other password'})
                    
                    }else if(data.data.password == data.data.passwordConfirm){
                        user.password = data.data.password
                        user.passwordConfirm = data.data.passwordConfirm
                        user.save()
                        socket.emit('editMyPassword',{status:'success',msg:'Password Updated Successfully'})
                    }else{
                        socket.emit('editMyPassword',{status:'fail',msg:'Your new password and confirm new password are not match'})
                    }
                        
                }else{
                    socket.emit('editMyPassword',{status:'fail',msg:'Your old password is wrong'})
                }
            }else{
                socket.emit('editMyPassword',{status:'fail',msg:'user not found'})
            }
        }catch(err){
            console.log(err)
            socket.emit('editMyPassword',{status:'fail',msg:'something went wrong'})
        }
    })
//......................FOR user management page .......................//


    socket.on("Parent", async(id) => {
       let child = await User.find({parent_id: id})
       socket.emit("child", child);
    })

    socket.on("search", async(data) => {
        // console.log(data.LOGINDATA.LOGINTOKEN);
        // console.log(data);
        let page = data.page; 
        let limit;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = limit * page
        }
        let user
        const me = await User.findById(data.id)
        // console.log(data.LOGINDATA)
        let roles ;
        let operationId;
        let operationUser;
        if(me.roleName == 'Operator'){
            operationUser = await User.findById(me.parent_id)
            operationId = operationUser._id
            roles = await Role.find({role_level: {$gt:operationUser.role.role_level}});
        }else{
            operationUser = me
            operationId = operationUser._id
            roles = await Role.find({role_level: {$gt:operationUser.role.role_level}});
        }
        
        if(Object.keys(data.filterData).length !== 0){
            data.filterData.roleName = {$ne:'Operator'}

            data.filterData.parentUsers = operationId
            let role_type =[]
            for(let i = 0; i < roles.length; i++){
                role_type.push(roles[i].role_type)
            }
            
            
            if(data.filterData.userName){
                var regexp = new RegExp(data.filterData.userName);
                data.filterData.userName = regexp
            }
            if(data.filterData.status){
                if(data.filterData.status == 'true'){
                    data.filterData.isActive = true
                }else if(data.filterData.status == 'false'){
                    data.filterData.isActive = false
                }else{
                    data.filterData.betLock = true
                }
                delete data.filterData['status']
            }
            if(operationUser.role.role_level == 1){
                // console.log(data.filterData)
                // console.log(data.filterData)
                // user = await User.find({userName:new RegExp(data.filterData.userName,"i"), data.filterData})
                if(data.filterData.role_type){
                // console.log(parseInt(data.filterData.role_type))
                if(role_type.includes(parseInt(data.filterData.role_type))){
                    user = await User.find(data.filterData).skip(skip).limit(limit)
                }else{
                    socket.emit('searchErr',{
                        message:'you not have permition'
                    })
                }
                }else{
                    data.filterData.role_type = {
                        $ne : 1
                    }
                    user = await User.find(data.filterData).skip(skip).limit(limit)
                }            
            }else{
                if(data.filterData.role_type){
                    if(role_type.includes((data.filterData.role_type) * 1)){
                        // console.log('here')
                        user = await User.find(data.filterData).skip(skip).limit(limit)
                    }else{
                        socket.emit('searchErr',{
                            message:'you not have permition'
                        })
                    }
                }else{

                    let role_Type = {
                        $in:role_type
                    }
                    data.filterData.role_type = role_Type
                    // console.log(data.filterData)
                    user = await User.find(data.filterData).skip(skip).limit(limit)
                }
            }
        }else{
            let parent = await User.findById(data.id)
            if(parent.roleName == 'Operator'){
                user = await User.find({parent_id:parent.parent_id,roleName:{$ne:'Operator'}}).skip(skip).limit(limit)
            }else{
                user = await User.find({parent_id:parent._id,roleName:{$ne:'Operator'}}).skip(skip).limit(limit)
            }
           }
        let currentUser = data.LOGINDATA.LOGINUSER

        // console.log(user)
        // console.log(page)
        let response = user;
        //urlRequestAdd(`/api/v1/users/searchUser?username = ${data.filterData.userName}& role=${data.filterData.role}& whiteLable = ${data.filterData.whiteLabel}`,'GET', data.LOGINDATA.LOGINTOKEN)
        socket.emit("getOwnChild", {status : 'success',response, currentUser,page,roles,refreshStatus:data.refreshStatus,me})
    })

    socket.on('getOperatorPermission',async(id)=>{
        let user = await User.findById(id)
        let permissions = user.OperatorAuthorization
        socket.emit('getOperatorPermission',{status:'success',permissions})
    })

    socket.on('editOperatorPermission',async(data)=>{
        try{
            let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password');
            if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
                socket.emit("editOperatorPermission",{status:'fail',msg:"please provide a valid password"})
            }else{
                await User.findByIdAndUpdate(data.data.id,{OperatorAuthorization:data.data.OperatorAuthorization})
                socket.emit('editOperatorPermission',{status:'success',msg:'permission updated successfully'})
            }
           
        }catch(err){
            socket.emit('editOperatorPermission',{status:'fail',msg:'somethig went wrong'})

        }
    })

    socket.on('loginuserbalance',async(data)=>{
        let id = data.LOGINUSER._id
        if(data.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINUSER.parent_id)
            data.LOGINUSER = parentUser
            id = parentUser._id.toString()
        }
        const user = await User.findById(id)
        // console.log(user, "CONSOLEUSER")
        socket.emit('loginuserbalance',user)
    })

    socket.on('userHistory',async(data)=>{
        // console.log(data.filterData)
        let page = data.page;
        let limit = 10;
        let filter = {}
       
        if(data.filterData.fromDate && data.filterData.toDate){
            filter.login_time = {$gte:new Date(data.filterData.fromDate),$lte:new Date(data.filterData.toDate)}
        }else if(data.filterData.fromDate && !data.filterData.toDate){
            filter.login_time = {$gte:new Date(data.filterData.fromDate)}
        }else if(data.filterData.toDate && !data.filterData.fromDate){
            filter.login_time = {$lte:new Date(data.filterData.toDate)}
        }
        // console.log(filter)
        let childrenUsername = []
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }else{
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }

        if(data.filterData.userName){
            filter.userName = data.filterData.userName
        }else{
            filter.userName = {$in:childrenUsername}
        }
        let users = await loginlogs.aggregate([
            {
                $match:filter
            },
            {
                $sort:{
                    login_time:-1
                }
            },
            {
                $skip:(page * 10)
            },
            {
                $limit:10
            }
        ])
        // console.log(users)
        socket.emit('userHistory',{users,page})
    })
    
    // status:'success',
    // response:response.child,
    // // Rows:response.Rows,
    // result:response.result,
    // me:response.me,
    // currentUser:response.currentUser,
    // page:data.page,
    // roles:response.roles

    // socket.on('searchUser1', async(data) => {
    //     // console.log(data)
    //     let user = await User.findById(data)
    //     let currentUser = global._User
    //     socket.emit("searchUser2", {user, currentUser})
    // })
    
    //...........for pagination......./
    
    socket.on('getOwnChild',async(data) => {
        // console.log(data)
        let response = await userController.getOwnChild(data.id,data.page)
        if(response.status === 'success'){

            socket.emit('getOwnChild',{
                status:'success',
                response:response.child,
                // Rows:response.Rows,
                // result:response.result,
                // me:response.me,
                currentUser:response.currentUser,
                page:data.page,
                roles:response.roles
            })
        }else{
            socket.emit('error',{
                status:'error'
            })
        }
    })

    socket.on("SelectLogoutUserId",async(id)=>{
        // console.log(id,'back end id')
        // let data = {userId:`${id}`}
        try{
            let fullUrl =  `http://127.0.0.1/api/v1/auth/logOutSelectedUser?userId=`+id
            fetch(fullUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ` + loginData.Token }
            }).then(res => res.json())
            .then(json =>{
                // console.log(json.status)
                if(json.status == "success"){
                    socket.emit("SelectLogoutUserId", "success")
                }
            })
        }catch(err){
            console.log(err)
        }
        
    })

    //....For inactive user page....//
    
    socket.on("UserActiveStatus", async(id) => {
        // console.log(id)
        await User.findByIdAndUpdate(id.id, {isActive: true})
        let Users
        const roles = await Role.find({role_level: {$gt:global._User.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        if(global._User.role_type == 1){
            Users = await User.find({isActive:false})
        }else{
            Users = await User.find({role_type:{$in:role_type},isActive:false , whiteLabel:global._User.whiteLabel})
        }
        //urlRequestAdd(`/api/v1/users/updateUserStatusActive`,'POST', id.LOGINDATA.LOGINTOKEN)
        socket.emit("inActiveUserDATA", Users)

    });


    socket.on("deleteUser", async(id) => {
        // console.log(id)
        await User.findByIdAndDelete(id.id)
        let Users
        const roles = await Role.find({role_level: {$gt:global._User.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        if(global._User.role_type == 1){
            Users = await User.find({isActive:false})
        }else{
            Users = await User.find({role_type:{$in:role_type},isActive:false , whiteLabel:global._User.whiteLabel})
        }
        socket.emit("inActiveUserDATA1", Users)
        //urlRequestAdd(`/api/v1/users/deleteUser`,'POST', id.LOGINDATA.LOGINTOKEN)
    });



    // socket.on("datefilter", async(data) => {
    //     console.log(data)

    // })

    socket.on("AccountScroll", async(data)=>{
        // console.log(data)
        let fullUrl
        let operatorId;
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            operatorId = data.LOGINDATA.LOGINUSER.parent_id
        }else{
            operatorId = data.LOGINDATA.LOGINUSER._id
        }
        if(data.id){
            // console.log()
            fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement?id=' + data.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate  + "&refreshStatus=" + data.refreshStatus 
        }else{
            fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement?id=' + operatorId + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate + "&refreshStatus=" + data.refreshStatus 

        }

        //urlRequestAdd(`/api/v1/Account/getUserAccStatement?id = ${data.id}&page=${data.page}&from = ${data.from}&from = ${data.from}&to = ${data.to}&search = ${data.search}`,'GET', data.LOGINDATA.LOGINTOKEN)


        // console.log(fullUrl)
        fetch(fullUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ` + loginData.Token },
        }).then(res => res.json())
        .then(json =>{ 
            // console.log(json)
            socket.emit('Acc', {json,page:data.page})
            // const data = json.userAcc
            // res.status(200).render('./userAccountStatement/useracount',{
            // title:"UserAccountStatement",
            // me:currentUser,
            // data})
        });
    })

    socket.on("AccountScroll1", async(data)=>{
        // console.log(data)
        let fullUrl
        let operatorId;
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            operatorId = data.LOGINDATA.LOGINUSER.parent_id
        }else{
            operatorId = data.LOGINDATA.LOGINUSER._id
        }
        if(data.id){
            // console.log()
            fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement1?id=' + data.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate  
        }else{
            fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement1?id=' + operatorId + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate 

        }

        //urlRequestAdd(`/api/v1/Account/getUserAccStatement?id = ${data.id}&page=${data.page}&from = ${data.from}&from = ${data.from}&to = ${data.to}&search = ${data.search}`,'GET', data.LOGINDATA.LOGINTOKEN)


        // console.log(fullUrl)
        fetch(fullUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ` + loginData.Token },
        }).then(res => res.json())
        .then(json =>{ 
            // console.log(json)
            socket.emit('Acc1', {json,page:data.page})
            // const data = json.userAcc
            // res.status(200).render('./userAccountStatement/useracount',{
            // title:"UserAccountStatement",
            // me:currentUser,
            // data})
        });
    })

    socket.on("AccountScroll2", async(data)=>{
        // console.log(data)
        const user = await User.findById(data.id)
        let fullUrl
        let account;
        let json  = {}
        let filter = {};
        let limit = 10
        if(data.Fdate != '' && data.Tdate != ''){
            filter.date = {$gte:new Date(data.Fdate),$lte:new Date(data.Tdate)}
        }else if(data.Fdate != '' && data.Tdate == ''){
            filter.date = {$gte:new Date(data.Fdate)}

        }else if(data.Fdata == '' && data.Tdate != ''){
            filter.date = {$lte:new Date(data.Tdate)}
        }
        filter.user_id = new mongoose.Types.ObjectId(data.id)

        if(data.id){
            // console.log()
            let Logs = await AccModel.aggregate([
                {
                    $match:filter
                },
                {
                    $lookup:{
                        from:'betmodels',
                        localField:'transactionId',
                        foreignField:'transactionId',
                        as:'betDetails'
                    }
                },
                // {
                //     $unwind:"$betDetails"
                // },
                {
                    $sort:{"date":-1}
                },
                {
                    $skip:limit * data.page
                },
                {
                    $limit:limit
                }
            ])
            json.userAcc = Logs

            // account  = await AccModel.find({user_id:data.id})
            
            // fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement1?id=' + data.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate  
        }else{
            json.userAcc = [] 
            
        }
        json.status = 'success'
        socket.emit('Acc2', {json,page:data.page,user})

    })

    // socket.on("SearchACC", async(data) => {
    //     // console.log(data)
    //     const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
    //     let role_type =[]
    //     for(let i = 0; i < roles.length; i++){
    //         role_type.push(roles[i].role_type)
    //     }
    //     // console.log(role_type, 123)
        
    //     var regexp = new RegExp(data.x);
    //     let user
    //     if(data.LOGINDATA.LOGINUSER.role.role_level == 1){
    //             user = await User.find({userName:regexp})
    //     }else{
    //             // let role_Type = {
    //             //     $in:role_type
    //             // }
    //             // let xfiletr  = {}
    //             // xfiletr.role_Type = role_Type
    //             // xfiletr.userName = regexp
    //             // console.log(data.filterData)
    //             // console.log(xfiletr)
    //             user = await User.find({ role_type:{$in: role_type}, userName: regexp })
    //     }
    //     // console.log(user)
    //     socket.emit("ACCSEARCHRES", user)
    // })

    socket.on("UserSearchId", async(data) => {
        // console.log(data, 123545)
        let user = await User.findOne({userName:data.userName})
        let fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement?id=' + user.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate
        // console.log(fullUrl)
        //urlRequestAdd(`/api/v1/Account/getUserAccStatement?id = ${data.id}&page=${data.page}&from = ${data.from}&from = ${data.from}&to = ${data.to}`,'GET', data.LOGINDATA.LOGINTOKEN)


        // console.log(fullUrl)
        fetch(fullUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ` + data.LOGINDATA.LOGINTOKEN },
        }).then(res => res.json())
        .then(json =>{ 
            // console.log(json)
            socket.emit('Acc', {json,page:data.page})
            // const data = json.userAcc
            // res.status(200).render('./userAccountStatement/useracount',{
            // title:"UserAccountStatement",
            // me:currentUser,
            // data})
        });
        
    })


    socket.on("bettingList", async(data) => {
        let user = await User.findOne({userName:data.val})
        // console.log(user)
        let fullUrl = "http://127.0.0.1/api/v1/bets/betListByUserId?id=" + user._id;
        // console.log(fullUrl)
        fetch(fullUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ` + data.LOGINDATA.LOGINTOKEN },
        }).then(res => res.json())
        .then(Data =>{
            socket.emit("resBetListData", Data.betList)
        })  

    })

    socket.on('UpdateBYID', async(data) => {
        // console.log(data)
        let position = await Promotion.findById(data)
        await Promotion.findByIdAndUpdate(data, {click:position.click+1})
    })
    socket.on('IMGID', async(data) => {
        // console.log(data)
        let gameData = await gameModel.findById(data.id)
        let urldata = await gameAPI(gameData, data.LOGINDATA.LOGINUSER)
        socket.emit('URLlINK', urldata.url)
    })

    socket.on('BACCARAT', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("BACCARAT","i")},{category:new RegExp("BACCARAT","i")},{game_code:new RegExp("BACCARAT","i")}]})
        socket.emit('baccarat1', {data,id:"BACCARAT"})
    })
    socket.on('CASUALGAMES', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("CASUAL","i")},{category:new RegExp("CASUAL","i")},{game_code:new RegExp("CASUAL","i")}]})
        socket.emit('baccarat1', {data,id:"CASUALGAMES"})
    })
    socket.on('FISHSHOOTING', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("FISH","i")},{category:new RegExp("FISH","i")},{game_code:new RegExp("FISH","i")}]})
        socket.emit('baccarat1', {data,id:"FISHSHOOTING"})
    })
    socket.on('INSTANTWINGAMES', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("INSTANT","i")},{category:new RegExp("INSTANT","i")},{game_code:new RegExp("INSTANT","i")}]})
        socket.emit('baccarat1', {data,id:"INSTANTWINGAMES"})
    })
    socket.on('LIVE', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("LIVE","i")},{category:new RegExp("LIVE","i")},{game_code:new RegExp("LIVE","i")}]})
        socket.emit('baccarat1', {data,id:"LIVE"})
    })
    socket.on('BLACKJACK', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("BLACK","i")},{category:new RegExp("BLACK","i")},{game_code:new RegExp("BLACK","i")}]})
        socket.emit('baccarat1', {data,id:"BLACKJACK"})
    })
    socket.on('FH', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("FH","i")},{category:new RegExp("FH","i")},{game_code:new RegExp("FH","i")}]})
        socket.emit('baccarat1', {data,id:"FH"})
    })
    socket.on('GAME', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("GAME","i")},{category:new RegExp("GAME","i")},{game_code:new RegExp("GAME","i")}]})
        socket.emit('baccarat1', {data,id:"GAME"})
    })
    socket.on('KENO', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("KENO","i")},{category:new RegExp("KENO","i")},{game_code:new RegExp("KENO","i")}]})
        socket.emit('baccarat1', {data,id:"KENO"})
    })
    socket.on('LIVEBACCARAT', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("BACCARAT","i")},{category:new RegExp("BACCARAT","i")},{game_code:new RegExp("BACCARAT","i")}]})
        socket.emit('baccarat1', {data,id:"LIVEBACCARAT"})
    })
    socket.on('ANDARBAHAR', async(A) => {
        let data
        data = await gameModel.find({$or:[{game_name:new RegExp("ANDAR","i")},{category:new RegExp("ANDAR","i")},{game_code:new RegExp("ANDAR","i")}]})
        socket.emit('baccarat1', {data,id:"ANDARBAHAR"})
    })



    socket.on("RGV", async(A)=>{
        let data;
        data = await gameModel.find({sub_provider_name:"Royal Gaming Virtual"})
       
        socket.emit("RGV1", {data, provider:"RGV"})
    })

    socket.on('casionoStatusChange',async(data)=>{
        try{
            if(data.status){
                await gameModel.updateOne({game_id:data.id},{status:true})
            }else{
                await gameModel.updateOne({game_id:data.id},{status:false})
            }
            socket.emit('casionoStatusChange',{status:'success'})
        }catch(error){
            socket.emit('casionoStatusChange',{status:'fail'})

        }
    })

    socket.on('ElementID',async(data)=>{
        // console.log(data)
        const acc = await AccModel.findById(data)
        // console.log(acc, 132)
        let bet = {}
        if(acc.transactionId){
            bet = await Bet.findOne({transactionId:acc.transactionId})
            if(!bet){
                const result = acc.transactionId.replace(/Parent$/, '');
                bet = await Bet.findOne({transactionId:result})
            }
        }else{
            bet = acc
        }

        // let transactionId = data;
        // console.log(bet)
        socket.emit('getMyBetDetails',bet)
    })

    socket.on("EZ", async(A)=>{
        let data;
        data = await gameModel.find({sub_provider_name:"Ezugi"})
        socket.emit("RGV1", {data, provider:"EZ"})
    })

    socket.on("EG", async(A)=>{
        let data;
        data = await gameModel.find({sub_provider_name:"Evolution Gaming"})
        socket.emit("RGV1", {data, provider:"EG"})
    })

    socket.on('gameReport',async(data)=>{
        let page = data.page
        let limit;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = page * limit
        }
        let childrenUsername = []
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id }); 
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }else{
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }
        if(data.filterData.userName != data.LOGINDATA.LOGINUSER.userName){
            childrenUsername = [data.filterData.userName]
        }
        if(data.filterData.fromDate && data.filterData.toDate){
            data.filterData.date = {$gte:new Date(data.filterData.fromDate),$lte:new Date(data.filterData.toDate)}
        }else if(data.filterData.fromDate && !data.filterData.toDate){
            data.filterData.date = {$gte:new Date(data.filterData.fromDate)}
        }else if(data.filterData.toDate && !data.filterData.fromDate){
            data.filterData.date = {$lte:new Date(data.filterData.toDate)}
        }else if(!data.filterData.toDate && !data.filterData.fromDate){
            data.filterData.date = {$exists:true}
        }
        let games = await Bet.aggregate([
            {
                $match: {
                userName: { $in: childrenUsername },
                status: {$in:["WON",'LOSS','CANCEL']},
                date:data.filterData.date
                }
            },
            {
                $group:{
                    _id:{
                        userName:'$userName',
                        gameId: '$event'
                    },
                    gameCount:{$sum:1},
                    loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                    won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                    void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                    returns:{$sum:'$returns'}
                    
                }
            },
            {
                $group:{
                    _id:'$_id.userName',
                    gameCount:{$sum:1},
                    betCount:{$sum:'$gameCount'},
                    loss:{$sum:'$loss'},
                    won:{$sum:'$won'},
                    void:{$sum:'$void'},
                    returns:{$sum:'$returns'}
    
                }
            },
            {
                $sort: {
                  _id: 1,
                  returns: 1
                }
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
          ])

        socket.emit('gameReport',{games,page,refreshStatus:data.refreshStatus})
    })
    socket.on('gameReportByMatch',async(data)=>{
        let page = data.page
        let limit;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = page * limit
        }
    
        let games = await Bet.aggregate([
            {
                $match: {
                userName: { $in: [data.filterData.userName] },
                status: {$in:["WON",'LOSS','CANCEL']},
                date:{$gte:new Date(data.filterData.fromDate),$lte:new Date(new Date(data.filterData.toDate).getTime() + ((24 * 60*60*1000)-1))}          
                    
                }
            },
            {
                $group:{
                    _id:{
                        match:'$match',
                        marketName: '$marketName'
                    },
                    eventDate:{$first:'$eventDate'},
                    gameCount:{$sum:1},
                    loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                    won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                    void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                    returns:{$sum:'$returns'}
                    
                }
            },
            {
                $group:{
                    _id:'$_id.match',
                    eventDate:{$first:'$eventDate'},
                    gameCount:{$sum:1},
                    betCount:{$sum:'$gameCount'},
                    loss:{$sum:'$loss'},
                    won:{$sum:'$won'},
                    void:{$sum:'$void'},
                    returns:{$sum:'$returns'}
        
        
                }
            },
            {
                $sort: {
                    _id: 1,
                    returns: 1
                }
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
            ])
            let url = `/admin/gamereport/match/market?userName=${data.filterData.userName}&fromDate=${data.filterData.fromDate}&toDate=${data.filterData.toDate}`

        socket.emit('gameReportByMatch',{games,url,page,refreshStatus:data.refreshStatus})
    })
    socket.on('gameReportByMarket',async(data)=>{
        let page = data.page
        let limit;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = page * limit
        }
    
        let games = await Bet.aggregate([
            {
                $match: {
                    userName: { $in: [data.filterData.userName] },
                    status: {$in:["WON",'LOSS','CANCEL']},
                    date:{$gte:new Date(data.filterData.fromDate),$lte:new Date(new Date(data.filterData.toDate).getTime() + ((24 * 60*60*1000)-1))},
                    match:data.filterData.match
                }
            },
            {
                $group:{
                    _id:'$marketName',
                    date:{$first:'$date'},
                    gameCount:{$sum:1},
                    loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                    won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                    void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                    returns:{$sum:'$returns'}
                    
                }
            },
            {
                $sort: {
                    _id: 1,
                    returns: 1
                }
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
            ])
            let url = `/admin/gamereport/match/market?userName=${data.filterData.userName}&fromDate=${data.filterData.fromDate}&toDate=${data.filterData.toDate}&match=${data.filterData.match}`

        socket.emit('gameReportByMarket',{games,url,page,refreshStatus:data.refreshStatus})
    })
    socket.on('gameReportFinal',async(data)=>{
        let page = data.page
        let limit;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = page * limit
        }
        let market;
        if(data.filterData.market.toLowerCase().startsWith('book')){
            market =  {
                $regex: /^book/i
              }
        }else{
            market = data.filterData.market
        }
        let games = await Bet.aggregate([
            {
                $match: {
                    userName: { $in: [data.filterData.userName] },
                    status: {$in:["WON",'LOSS','CANCEL']},
                    date:{$gte:new Date(data.filterData.fromDate),$lte:new Date(new Date(data.filterData.toDate).getTime() + ((24 * 60*60*1000)-1))},
                    match:data.filterData.match,
                    marketName:market
                }
            },
            {
                $project:{
                    date:1,
                    selectionName:1,
                    oddValue:1,
                    ip:1,
                    Stake:1,
                    returns:'$returns'
                }
            },
            {
                $sort: {
                    date: -1,
                }
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
            ])


        socket.emit('gameReportFinal',{games,page,refreshStatus:data.refreshStatus})
    })



    socket.on("searchEvents", async(data) => {
        let cricketList;
        let footballList;
        let tennisList;
        // console.log(data);
        const sportData = await getCrkAndAllData()
        // console.log(sportData)
        cricketList = sportData[0].gameList[0].eventList
        footballList = sportData[1].gameList.find(item => item.sportId == parseInt('1'))
        footballList = footballList.eventList
        tennisList = sportData[1].gameList.find(item => item.sportId == parseInt('2'))
        tennisList = tennisList.eventList
        let sportList = cricketList.concat(footballList,tennisList)
        sportList = sportList.filter(item => item.eventData.name.toLowerCase().includes(data.x.toLowerCase()))
        // console.log(sportList)
        socket.emit("searchEvents", {sportList,type:data.type})
    })
    socket.on("SearchACC", async(data) => {
        let page = data.page
        if(!page){
            page = 0
        }
        limit = 10
        // console.log(data)
        let roles;
        let operatorId;
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
            roles = await Role.find({role_level: {$gt:parentUser.role.role_level}});
            operatorId = parentUser._id
        }else{
            roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
            operatorId = data.LOGINDATA.LOGINUSER._id
        }
        // console.log(roles)
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        // console.log(role_type, 123)
        
        var regexp = new RegExp(data.x);

        let user = await User.aggregate([
            {
                $match:{
                    userName:regexp,
                    parentUsers:{$elemMatch:{$eq:operatorId}}
                }
            },
            {
                $sort:{
                    userName:-1,
                    _id:-1
                }
            },
            {
                $skip:(page*limit)
            },{
                $limit:limit
            }
        ])

        // if(data.LOGINDATA.LOGINUSER.role.role_level == 1){
        //         user = await User.find({userName:regexp}).skip(page * limit).limit(limit)
        // }else{
        //         // let role_Type = {
        //         //     $in:role_type
        //         // }
        //         // let xfiletr  = {}
        //         // xfiletr.role_Type = role_Type
        //         // xfiletr.userName = regexp
        //         // console.log(data.filterData)
        //         // console.log(xfiletr)
        //         user = await User.find({ role_type:{$in: role_type}, userName: regexp, parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}} }).skip(page * limit).limit(limit)
        // }
        page++
        if(user.length === 0 ){
            page = null
        }
        socket.emit("ACCSEARCHRES", {user, page})
    })
    socket.on("SearchACC1", async(data) => {
        let page = data.page
        if(!page){
            page = 0
        }
        limit = 10
        // console.log(data)
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        // console.log(roles)
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        // console.log(role_type, 123)
        
        var regexp = new RegExp(data.x);

        let user = await User.aggregate([
            {
                $match:{
                    userName:regexp,
                    parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}},
                    roleName:{$ne:'user'}
                }
            },
            {
                $sort:{
                    userName:-1,
                    _id:-1
                }
            },
            {
                $skip:(page*limit)
            },{
                $limit:limit
            }
        ])

        // if(data.LOGINDATA.LOGINUSER.role.role_level == 1){
        //         user = await User.find({userName:regexp}).skip(page * limit).limit(limit)
        // }else{
        //         // let role_Type = {
        //         //     $in:role_type
        //         // }
        //         // let xfiletr  = {}
        //         // xfiletr.role_Type = role_Type
        //         // xfiletr.userName = regexp
        //         // console.log(data.filterData)
        //         // console.log(xfiletr)
        //         user = await User.find({ role_type:{$in: role_type}, userName: regexp, parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}} }).skip(page * limit).limit(limit)
        // }
        page++
        if(user.length === 0 ){
            page = null
        }
        socket.emit("ACCSEARCHRES1", {user, page})
    })

    socket.on('userBetDetail',async(data)=>{
        let page = data.page
        let limit;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = page * limit
        }


        if(data.filterData.fromDate && data.filterData.toDate){
            data.filterData.date = {$gte:new Date(data.filterData.fromDate),$lte:new Date(data.filterData.toDate)}
            delete data.filterData.fromDate;
            delete data.filterData.toDate;
        }else if(data.filterData.fromDate && !data.filterData.toDate){
            data.filterData.date = {$gte:new Date(data.filterData.fromDate)}
            delete data.filterData.fromDate
        }else if(data.filterData.toDate && !data.filterData.fromDate){
            data.filterData.date = {$lte:new Date(data.filterData.toDate)}
            delete data.filterData.toDate
        }

        if(data.filterData.betType === 'All'){
            delete data.filterData['betType']
        }

        if(data.filterData.status == 'All'){
            data.filterData.status = {$ne: "OPEN"}
        }
        // console.log(data.filterData)

        let childrenUsername = []
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }else{
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }

        if(data.filterData.userName == data.LOGINDATA.LOGINUSER.userName){
            data.filterData.userName = {$in:childrenUsername}
        }
        let ubDetails = await Bet.find(data.filterData).sort({'date':-1}).skip(skip).limit(limit)


        socket.emit('userBetDetail',{ubDetails,page,refreshStatus:data.refreshStatus})

    })


    socket.on('betMoniter',async(data)=>{
        // console.log(data.filterData)
        if(data.filterData.marketName == "All"){
            delete data.filterData.marketName
        }

        if(data.filterData.marketName == "Fancy"){
            data.filterData.marketName = {$nin:["Match Odds", "Bookmaker 0%Comm"]}
        }

        if(data.filterData.betType == "All"){
            delete data.filterData.betType; 
        }else if(data.filterData.betType == "4"){
            data.filterData.betType = 'Cricket'
        }else if(data.filterData.betType == "1"){
            data.filterData.betType = "Football"
        }else if(data.filterData.betType == "2"){
            data.filterData.betType = "Tennis"
        }

        if(data.filterData.status == "All"){
            delete data.filterData.status
        }

        if(data.filterData.eventId == "All"){
            delete data.filterData.eventId
        }

        if(data.filterData.Stake){
            data.filterData.Stake = {$gte:data.filterData.Stake}
        }

        if(data.filterData.fromDate && data.filterData.toDate){
            data.filterData.date = {$gte : new Date(data.filterData.fromDate),$lte : new Date(new Date(data.filterData.toDate))}
            delete data.filterData.fromDate;
            delete data.filterData.toDate;
        }else{
            if(data.filterData.fromDate){
                data.filterData.date = {$gte : data.filterData.fromDate}
                delete data.filterData.fromDate;

            }
            if(data.filterData.toDate){
                data.filterData.date = {$lte : new Date(new Date(data.filterData.toDate))}
                delete data.filterData.toDate;

            }
        }
        if(data.filterData.whiteLabel == 'All'){
            delete data.filterData.whiteLabel
        }

        

        let limit;
        let page = data.page;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = limit * page
        }
        let childrenUsername = []
        let userFilter = {};
        let operatorId;
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            operatorId = data.LOGINDATA.LOGINUSER.parent_id
        }else{
            operatorId = data.LOGINDATA.LOGINUSER._id
        }
        userFilter.parentUsers = operatorId
        if(data.filterData.whiteLabel){
            userFilter.whiteLabel = data.filterData.whiteLabel
        }
        if(data.filterData.userName != data.LOGINDATA.LOGINUSER.userName){
            userFilter.userName = data.filterData.userName
        }
        childrenUsername = await User.distinct('userName', userFilter);
        // let children = await User.find(userFilter)
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })

        if(data.filterData.userName == data.LOGINDATA.LOGINUSER.userName){
            data.filterData.userName = {$in:childrenUsername}
        }else{
            if(data.filterData.whiteLabel){
                data.filterData.userName = {$in:childrenUsername}
                
            }
        }
        delete data.filterData.whiteLabel
        let events;
        if(data.type){

        }else{
            events = await Bet.aggregate([
                {
                    $match: data.filterData
                },
                {
                    $group:{
                        _id:'$match',
                        eventId:{$first:'$eventId'}
                    }
                }
            ])
        }
        let ubDetails = await Bet.find(data.filterData).sort({'date':-1}).skip(skip).limit(limit)
        socket.emit('betMoniter',{ubDetails,page,events,refreshStatus:data.refreshStatus})

    })

    socket.on('matchBets',async(data)=>{
        // console.log(data.filterData)
        let ubDetails;
        let limit = 10;
        let page = data.page;
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        data.filterData.role_type = {
            $in:role_type
        }
        data.filterData.status = 'OPEN'
        if(data.filterData.userName == data.LOGINDATA.LOGINUSER.userName){
            let childrenUsername = []
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
            data.filterData.userName = {$in:childrenUsername}
            ubDetails = await Bet.find(data.filterData).sort({'date':-1}).skip(page * limit).limit(limit)
        }else{
            ubDetails = await Bet.find(data.filterData).sort({'date':-1}).skip(page * limit).limit(limit)
        }
        socket.emit('matchBets',{ubDetails,page})
    })




    socket.on('voidBET', async(data)=>{
        data.filterData.status = 'OPEN'
        if(data.filterData.marketName == "All"){
            delete data.filterData.marketName
        }

        if(data.filterData.marketName == "Fancy"){
            data.filterData.marketName = {$nin:["Match Odds", "Bookmaker 0%Comm"]}
        }

        if(data.filterData.betType == "All"){
            delete data.filterData.betType; 
        }else if(data.filterData.betType == "4"){
            data.filterData.betType = 'Cricket'
        }else if(data.filterData.betType == "1"){
            data.filterData.betType = "Football"
        }else if(data.filterData.betType == "2"){
            data.filterData.betType = "Tennis"
        }


        if(data.filterData.eventId == "All"){
            delete data.filterData.eventId
        }


        if(data.filterData.from_date && data.filterData.to_date){
            data.filterData.date = {$gte : new Date(data.filterData.from_date),$lte : new Date(new Date(data.filterData.to_date))}
            delete data.filterData.from_date;
            delete data.filterData.to_date;
        }else{
            if(data.filterData.from_date){
                data.filterData.date = {$gte : data.filterData.from_date}
                delete data.filterData.from_date;

            }
            if(data.filterData.to_date){
                data.filterData.date = {$lte : new Date(new Date(data.filterData.to_date))}
                delete data.filterData.to_date;

            }
        }
        let limit;
        let page = data.page;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = limit * page
        }
        let childrenUsername = []
        let userFilter = {};
        let operatorId;
        let operatoruserName;
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            operatorId = data.LOGINDATA.LOGINUSER.parent_id
            let parentUser = await User.findById(operatorId)
            operatoruserName = parentUser.userName
        }else{
            operatorId = data.LOGINDATA.LOGINUSER._id
            operatoruserName = data.LOGINDATA.LOGINUSER.userName
        }
        userFilter.parentUsers = operatorId
        if(data.filterData.userName != data.LOGINDATA.LOGINUSER.userName){
            userFilter.userName = data.filterData.userName
        }
        childrenUsername = await User.distinct('userName', userFilter);
        // let children = await User.find(userFilter)
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })

        if(data.filterData.userName == data.LOGINDATA.LOGINUSER.userName){
            data.filterData.userName = {$in:childrenUsername}
        }
        let events;
        if(data.type){

        }else{
            events = await Bet.aggregate([
                {
                    $match: data.filterData
                },
                {
                    $group:{
                        _id:'$match',
                        eventId:{$first:'$eventId'}
                    }
                }
            ])
        }
        let betResult = await Bet.find(data.filterData).sort({'date':-1}).skip(skip).limit(limit)

        socket.emit("voidBET", {betResult,events,page,refreshStatus:data.refreshStatus})

    })

    socket.on('userPLDetail',async(data)=>{
        let page = data.page
        let limit;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = page * limit
        }
        let childrenUsername = []
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }else{
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }
        if(data.filterData.userName != data.LOGINDATA.LOGINUSER.userName){
            childrenUsername = [data.filterData.userName]
        }
        if(data.filterData.fromDate && data.filterData.toDate){
            data.filterData.date = {$gte:new Date(data.filterData.fromDate),$lte:new Date(data.filterData.toDate)}
        }else if(data.filterData.fromDate && !data.filterData.toDate){
            data.filterData.date = {$gte:new Date(data.filterData.fromDate)}
        }else if(data.filterData.toDate && !data.filterData.fromDate){
            data.filterData.date = {$lte:new Date(data.filterData.toDate)}
        }else if(!data.filterData.toDate && !data.filterData.fromDate){
            data.filterData.date = {$exists:true}
        }
        let games = await Bet.aggregate([
            {
                $match: {
                userName: { $in: childrenUsername },
                status: {$in:["LOSS","WON"]},
                date:data.filterData.date
                }
            },
            {
                $group:{
                    _id:'$userName',
                    gameCount:{$sum:1},
                    loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                    won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                    returns:{$sum:{$cond:[{$in:['$status',['LOSS','WON']]},'$returns',0]}}
                    
                }
            },
            {
                $sort: {
                  returns: -1
                }
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
          ])

        socket.emit('userPLDetail',{games,page,refreshStatus:data.refreshStatus})
    })

    socket.on("SearchOnlineUser", async(data) => {
        // console.log(data)
        let page
        page = data.page
        if(!page){
            page = 0
        }
        limit = 10
        // const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        // let role_type =[]
        // for(let i = 0; i < roles.length; i++){
        //     role_type.push(roles[i].role_type)
        // }
        let onlineUsers
        if(data.LOGINDATA.LOGINUSER.role_type === 1){
            onlineUsers = await User.find({is_Online:true, userName:new RegExp(data.x)}).skip(page * limit).limit(limit)
        }else{
            onlineUsers = await User.find({is_Online:true, userName:new RegExp(data.x), parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}}}).skip(page * limit).limit(limit)
        }
        page++
        socket.emit("SearchOnlineUser",{onlineUsers, page})
    })

    socket.on('OnlineUser', async(data) => {
        // console.log(data.filterData, 12121)
        // console.log(data)
        let page
        let limit = 10
        page = data.page
        
        // const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        // let role_type =[]
        // for(let i = 0; i < roles.length; i++){
        //     role_type.push(roles[i].role_type)
        // }
        data.filterData.is_Online = true
        data.filterData.parentUsers = data.LOGINDATA.LOGINUSER._id
        let onlineUsers
        if(data.filterData.userName == data.LOGINDATA.LOGINUSER.userName){
            delete data.filterData['userName']
            onlineUsers = await User.find(data.filterData).skip(page * limit).limit(limit)
        }else{
            onlineUsers = await User.find(data.filterData).skip(page * limit).limit(limit)
        }
        // if(data.LOGINDATA.LOGINUSER.role_type === 1){
        // }else{
        // }
        // console.log(onlineUsers)
        socket.emit("OnlineUser",{onlineUsers, page})
    })

    socket.on("marketId", async(data) => {
        const result = await marketDetailsBymarketID(data.ids)
        let finalResult = result.data
        // console.log(finalResult, "finalResultfinalResultfinalResult")
        const betLimits = await betLimit.find({type:"Sport"})
        let resumeSuspendMarkets = await resumeSuspendModel.aggregate([
            {
                $match:{
                    marketId : {
                        $in:data.ids
                    },
                    status:false
                }
            }
        ])
        let forFancy 
        // console.log(finalResult, "finalResult[1].event_idfinalResult[1].event_id")
        if(finalResult.items.length > 0 ){
            if(finalResult.items[1]){
                forFancy = await resumeSuspendModel.find({marketId:`${finalResult.items[1].event_id}/FANCY`, status:false})
            }
        }
        // console.log(forFancy)
        let allData =  await getCrkAndAllData()
        const cricket = allData[0].gameList[0].eventList
        let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
        footBall = footBall.eventList
        Tennis = Tennis.eventList
        const resultSearch = cricket.concat(footBall, Tennis);
        let status;
        // console.log(data,"==>marketId eventId error")
        if(data.eventId){
            let event = resultSearch.find(item => item.eventData.eventId == data.eventId)
            // console.log(event,data.eventId,"==>Event")
            if(await InPlayEvent.findOne({Id:event.eventData.eventId})){
                status = true
            }else{
                if(event.eventData.type == "IN_PLAY"){
                    status = true
                }else{
                    status = false
                }
            }

        }else{
            // console.log(finalResult)
            for(let i = 0; i < finalResult.items.length; i++){
                // console.log(finalResult.items[i])
            }
        }

        // console.log(resumeSuspendMarkets)
        socket.emit("marketId", {finalResult,betLimits, status,resumeSuspendMarkets, forFancy})
    })

    socket.on("SPORTDATA", async(data) => {
        if(data === "cricket"){
            const sportListData = await getCrkAndAllData()
            const cricket1 = sportListData[0].gameList[0].eventList
            // console.log(LiveCricket1[0].marketList.match_odd)
            const {cricket, marketArray} = cricket1.reduce(
                (acc, item) => {
                        acc.cricket.push(item);
                        // console.log(item.marketList.match_odd)
                        if(item.marketList.match_odd != null){
                            acc.marketArray.push(item.marketList.match_odd.marketId);
                        }
                    return acc;
                },
                { cricket: [], marketArray: [] }
                );
                //   console.log(LiveCricket)
                socket.emit("SPORTDATA", cricket)
            const marketdetails1 = await getmarketDetails(marketArray)




        }
    });

    socket.on("eventId", async(data) => {
        let matchScore = await scores(data)
        // console.log(matchScore, 123)
        socket.emit("eventId", matchScore)
    })

    // socket.on('logOutUser',async(id) => {
    //     // console.log(id)
    //     // const user = await User.findOne({_id:id,is_Online:true});
    //     // if(!user){
    //     //     return next(new AppError('User not find with this id',404))
    //     // }
    //     // if(user.role.role_level < req.currentUser.role.role_level){
    //     //     return next(new AppError('You do not have permission to perform this action',404))
    //     // }
    //     // console.log(user._id)
    //     const logs = await loginlogs.findOneAndUpdate({user_id:id.id,isOnline:true},{isOnline:false})
    //     global._loggedInToken.splice(logs.session_id, 1);
    //     await User.findByIdAndUpdate({_id:id.id},{is_Online:false})
    //     // const roles = await Role.find({role_level: {$gt:global._User.role.role_level}});
    //     // let role_type =[]
    //     // for(let i = 0; i < roles.length; i++){
    //     //     role_type.push(roles[i].role_type)
    //     // }
    //     // const currentUser = global._User
    //     // let users
    //     // if(currentUser.role_type == 1){
    //     //     users = await User.find({is_Online:true})
    //     // }else{
    //     //     users = await User.find({role_type:{$in:role_type},is_Online:true , whiteLabel:currentUser.whiteLabel})
    //     // }
    //     //urlRequestAdd(`/api/v1/users/logOutSelectedUser`,'POST')
    //     socket.emit('logOutUser',{status:'success'})
    // })

    // //For load page//
    // socket.on('load',async(data) =>{
    //     // console.log(global._User)
    //     data.currentUser = global._User
    //     let response = await userController.getownChild(data)
    //     // console.log(response)
    //     socket.emit('load1', response)

    // })    











    //BETTING DETAILS SOCKETS//


    socket.on('betDetails', async(data) => {
        // console.log(data, "DATA")
        let marketDetails = await marketDetailsBymarketID([`${data.data.market}`])
        // console.log(marketDetails.data.items)
        // data.data.oldData = data.data.odds
        data.LOGINDATA.IP = data.LOGINDATA.IP.replace('::ffff:','')
        let thatMarket = marketDetails.data.items[0]
        if(data.data.secId.startsWith('odd_Even_')){
            if(data.data.secId == "odd_Even_Yes"){
                let odds
                if(thatMarket.odd){
                    odds = (parseFloat(thatMarket.odd * 100) - 100).toFixed(2)
                    data.data.selectionName = thatMarket.title + "@" + odds
                }else{
                    odds = thatMarket.yes_rate
                    data.data.selectionName = thatMarket.title + "@" + thatMarket.yes
                }
                data.data.odds = odds
                data.data.bettype2 = 'BACK'
                
            }else{
                let odds
                if(thatMarket.even){
                    odds = (parseFloat(thatMarket.even * 100) - 100).toFixed(2)
                    data.data.selectionName = thatMarket.title + "@" + odds

                }else{
                    odds = thatMarket.no_rate
                    data.data.selectionName = thatMarket.title + "@" + thatMarket.no

                }
                data.data.odds = odds
                data.data.bettype2 = 'LAY'
            }
        }else if(thatMarket.title != "Bookmaker 0%Comm" && thatMarket.title != "TOSS" && thatMarket.title != 'BOOKMAKER 0% COMM'){
            // console.log(thatMarket, 45454545454)
            let realodd = thatMarket.odds.find(item => item.selectionId == data.data.secId.slice(0,-1))
            let name
            // let bettype2
            if(data.data.secId.slice(-1) > 3){
                name = `layPrice${data.data.secId.slice(-1) - 3}`
                data.data.bettype2 = 'LAY'
            }else{
                name = `backPrice${data.data.secId.slice(-1)}`
                data.data.bettype2 = 'BACK'
            }
            // let odds = realodd[name];
            // data.data.odds = odds
            data.data.secId = data.data.secId.slice(0,-1)
        }else if(thatMarket.title == "Bookmaker 0%Comm" || thatMarket.title == "TOSS" || thatMarket.title != 'BOOKMAKER 0% COMM'){
            // console.log(thatMarket, 4545454)
            let realodd = thatMarket.runners.find(item => item.secId == data.data.secId.slice(0,-1))
            let name
            // console.log(data)
            if(data.data.secId.slice(-1) == 2){
                name = `layPrice${data.data.secId.slice(-1) - 3}`
                name =  name.slice(0, -2)

                data.data.bettype2 = 'LAY'
            }else{
                name = `backPrice${data.data.secId.slice(-1)}`
                name = name.slice(0, -1)
                data.data.bettype2 = 'BACK'
            }
            // console.log(name)
            // console.log(name)
            // console.log(realodd[name], realodd, "realodds")
            // let odds = realodd[name];
            // data.data.odds = odds
            data.data.secId = data.data.secId.slice(0,-1)
        }
        // console.log(data ,'++++++==>DATA')
        let result = await placeBet(data)
        let openBet = []
        if(data.pathname === "/exchange/multimarkets"){
            openBet = await Bet.find({userId:data.LOGINDATA.LOGINUSER._id, status:"OPEN"})
        }else{
            openBet = await Bet.find({userId:data.LOGINDATA.LOGINUSER._id, status:"OPEN", match:data.data.title})
        }
        // console.log(openBet, "openBet")
        let user = await User.findById(data.LOGINDATA.LOGINUSER._id)
        socket.emit("betDetails", {result, openBet, user})
    })

    socket.on('voidBet', async(data) => {
        try{
            let user = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
            const passcheck = await user.correctPassword(data.data.password, user.password)
            if(passcheck){
                let bet = await Bet.findByIdAndUpdate(data.id, {status:"CANCEL",alertStatus:"CANCEL",remark:data.data.Remark,returns:0});
                let DebitCreditAmount 
                if(bet.bettype2 === "Back"){
                    if(bet.marketName.toLowerCase().startsWith('match')){
                        DebitCreditAmount = bet.Stake
                    }else if(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')){
                        DebitCreditAmount = bet.Stake
                    }else{
                        DebitCreditAmount = bet.Stake
                    }
                }else{
                    if(bet.marketName.toLowerCase().startsWith('match')){
                        DebitCreditAmount = ((bet.Stake * bet.oddValue) - bet.Stake).toFixed(2)
                    }else if(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')){
                        DebitCreditAmount = ((bet.Stake * bet.oddValue)/100).toFixed(2)
                    }else{
                        DebitCreditAmount = ((bet.Stake * bet.oddValue)/100).toFixed(2)
                    }
                }
                // console.log(bet);
                let user = await User.findByIdAndUpdate(bet.userId, {$inc:{availableBalance: DebitCreditAmount, myPL: DebitCreditAmount, exposure:-DebitCreditAmount}})
                let timelyVoideCheck = await timelyNotificationModel.findOne({marketId : bet.marketId})
                let notification
                if(timelyVoideCheck){
                    notification = await timelyNotificationModel.findOneAndUpdate({marketId : bet.marketId}, {message:data.data.Remark})
                }else{
                    let timelyNotification = {
                        message : data.data.Remark,
                        userName : user.userName,
                        marketId : bet.marketId
                    }
                    notification = await timelyNotificationModel.create(timelyNotification)
                }
                let description = `Bet for ${bet.match}/stake = ${bet.Stake}/CANCEL`
                // console.log(user.availableBalance, DebitCreditAmount, user.availableBalance + DebitCreditAmount)
                let userAcc = {
                    "user_id":user._id,
                    "description": description,
                    "creditDebitamount" : DebitCreditAmount,
                    "balance" : user.availableBalance + parseFloat(DebitCreditAmount),
                    "date" : Date.now(),
                    "userName" : user.userName,
                    "role_type" : user.role_type,
                    "Remark":"-",
                    "stake": DebitCreditAmount,
                    "transactionId":`${bet.transactionId}`
                }
                
                let debitAmountForP = DebitCreditAmount
                  for(let i = user.parentUsers.length - 1; i >= 1; i--){
                      let parentUser1 = await User.findById(user.parentUsers[i])
                      let parentUser2 = await User.findById(user.parentUsers[i - 1])
                      let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                      let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                      parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                      parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                      await User.findByIdAndUpdate(user.parentUsers[i], {
                        $inc: {
                            downlineBalance: DebitCreditAmount,
                            myPL: -parentUser1Amount,
                            uplinePL: -parentUser2Amount,
                            lifetimePL: -parentUser1Amount,
                            pointsWL: DebitCreditAmount
                        }
                    });
                
                    if (i === 1) {
                        await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                            $inc: {
                                downlineBalance: DebitCreditAmount,
                                myPL: -parentUser2Amount,
                                lifetimePL: -parentUser2Amount,
                                pointsWL: DebitCreditAmount
                            }
                        });
                    }
                      debitAmountForP = parentUser2Amount
                  }
                
                await AccModel.create(userAcc);
                socket.emit('voidBet', {bet, status:"success"})
            }else{
                socket.emit('voidBet', {status:"fail",msg:'Please provide valide password'})
            }
        }catch(err){
            console.log(err)
            socket.emit("voidBet",{msg:"Please try again leter", status:"fail"})
        }
        })


    socket.on('createNotification', async(data) => {
        data.data.userId = data.LOGINDATA.LOGINUSER._id
        let bodyData = JSON.stringify(data.data)
        const fullUrl = 'http://127.0.0.1/api/v1/notification/createNotification'
        fetch(fullUrl, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ` + data.LOGINDATA.LOGINTOKEN,
                'Content-Type': 'application/json',
                'accept': 'application/json' },
            body:bodyData
        }).then(res => res.json())
        .then(Data =>{
            socket.emit("createNotification", Data)
        })  
    })

    socket.on('updateStatus', async(data) => {
        try{
            let updatedNotification = await notificationModel.findOne({ _id: data.id });
            updatedNotification.status = !updatedNotification.status;
            await updatedNotification.save();
            socket.emit("updateStatus", {id:updatedNotification.id, message:"updated",status:updatedNotification.status})
        }catch(err){
            socket.emit("updateStatus", "Please try again later")
        }

    });

    socket.on("deleteNotification", async(data) => {
        let id = data.id.slice(0, -1);
        const fullUrl = 'http://127.0.0.1/api/v1/notification/deleteNotification?id=' + `${id}`
        fetch(fullUrl, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ` + data.LOGINDATA.LOGINTOKEN,
                'Content-Type': 'application/json',
                'accept': 'application/json' },
        }).then(res => res.json())
        .then(Data =>{
            socket.emit('deleteNotification', Data)
        })
    })


    //For Promotion//

    socket.on("PromotionId", async(data) => {
        let ads = await Promotion.findByIdAndUpdate(data, {$inc:{click:1}})
        socket.emit("PromotionId", ads)
    })
    socket.on("PromotionIdByData", async(data) => {
        let ads = await Promotion.findById(data)
        socket.emit("PromotionIdByData", ads)
    })


    socket.on("aggreat", async(data) => {
        let id = ``
        if(data.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINUSER.parent_id)
            data.LOGINUSER = parentUser
        }
        // console.log(data.LOGINUSER._id.toString(), "data.LOGINUSERdata.LOGINUSERdata.LOGINUSER")
        let userIds = await User.distinct('userName', {parentUsers: { $elemMatch: { $eq: data.LOGINUSER._id.toString() } }}).lean();
        let bets = await Bet.aggregate([
            {
                $match: {
                    userName: { $in: userIds },
                    status: 'OPEN'
                }
              },
              {
                  $group:{
                      _id: '$secId',
                      totalStake: { $sum: '$Stake' },
                      count: { $sum: 1 }
                  }
              }
        ])
        // console.log(userIds, "userIdsuserIdsuserIds")
        socket.emit("aggreat", bets)
        // User.aggregate([
        //     {
        //       $match: {
        //         parentUsers: { $elemMatch: { $eq: data.LOGINUSER._id.toString() } }
        //       }
        //     },
        //     {
        //       $group: {
        //         _id: null,
        //         userIds: { $push: '$_id' } 
        //       }
        //     }
        //   ])
        //     .then((userResult) => {
        //         // console.log(userResult, "userResultuserResultuserResultuserResult")
        //       const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
        //     //   console.log(userIds, "aggreataggreataggreataggreataggreataggreat")
        //       Bet.aggregate([
        //         {
        //           $match: {
        //             userId: { $in: userIds },
        //             status: 'OPEN'
        //           }
        //         },
        //         {
        //             $group:{
        //                 _id: '$secId',
        //                 totalStake: { $sum: '$Stake' },
        //                 count: { $sum: 1 }
        //             }
        //         }
        //       ])
        //         .then((betResult) => {
        //           socket.emit("aggreat", betResult)
        //         })
        //         .catch((error) => {
        //           console.error(error);
        //         });
        //     })
        //     .catch((error) => {
        //       console.error(error);
        //     });

    })


    module.exports = function alert(data){
        // console.log(data)
        socket.emit("alertMessage", data)
    }


    socket.on("createVerticalMenu", async(data) => {
        let fullUrl = "http://127.0.0.1/api/v1/verticalMenu/createVerticalMenu"
        fetch(fullUrl, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ` + data.LOGINDATA.LOGINTOKEN,
                'Content-Type': 'application/json',
                'accept': 'application/json' },
            body:JSON.stringify(data.data)
        }).then(res => res.json())
        .then(Data =>{
            socket.emit("createVerticalMenu", Data)
        })
    })

    socket.on("VerticalMenuIdByData", async(date) => {
        let verticalMenu = await verticalMenuModel.findById(date)
        let page = await pagesModel.find()
        socket.emit("VerticalMenuIdByData", {verticalMenu, page})
    })

    socket.on('updateVerticalMenu', async(data) => {
        let data1
        let check = await verticalMenuModel.findById(data.id);
        let allMenu =  await verticalMenuModel.find()
        try{
            if(data.check){
                data.status = true
            }else{
                data.status = false
            }
            if(!(check.num == data.num)){
                if(data.num > allMenu.length){
                    data.num = allMenu.length
                    await verticalMenuModel.findOneAndUpdate({num:data.num},{num:check.num})
                }else if(data.num < 1){
                    socket.emit("updateVerticalMenu", "Please provide positive number")
                }else{
                    await verticalMenuModel.findOneAndUpdate({num:data.num},{num:check.num})
                }
            }
            data1 = await verticalMenuModel.findByIdAndUpdate(data.id, data)
            socket.emit("updateVerticalMenu", "Updated Successfully")
        }catch(err){
            console.log(err)
        }
    })

    socket.on("deleteVerticalMenu", async(data) => {
        try{
            let deletedMenu = await verticalMenuModel.findByIdAndDelete(data)
            await verticalMenuModel.updateMany({num:{$gt:deletedMenu.num}},{$inc:{num:-1}})
            socket.emit("deleteVerticalMenu", "done")
        }catch(err){
            console.log(err)
        }
    })

    socket.on("HorizontalMenuIdByData", async(data) => {
        let horizontalMenu = await horizontalMenuModel.findById(data);
        socket.emit('HorizontalMenuIdByData', horizontalMenu)
    })

    socket.on('deleteHorizontalMenu', async(data) => {
        try{
            let deleteMenu = await horizontalMenuModel.findByIdAndDelete(data)
            await horizontalMenuModel.updateMany({Number:{$gt:deleteMenu.Number}},{$inc:{Number:-1}})
            socket.emit("deleteHorizontalMenu", "success")

        }catch(err){
            console.log(err)
        }
    })

    socket.on("getBannerDetails", async(data) => {
        let details = await bannerModel.findById(data)
        socket.emit("getBannerDetails", details)
    })

    socket.on("deleteBanner", async(data) => {
        try{
            await bannerModel.findByIdAndDelete(data)
            socket.emit("deleteBanner", "Deleted Successfully")
        }catch(err){
            console.log(err)
        }
    })

    socket.on('updatePromotion', async(data) => {
        await Promotion.findByIdAndUpdate(data,{$inc:{click:1}})
    })

    socket.on("CmsPage", async(data) => {
        let sliders = await sliderModel.find();
        socket.emit('CmsPage', sliders)
    })

    socket.on("dleteImageSport", async(data) => {
        let name = data.split("//")[1]
        let slider = await sliderModel.findOne({name:name})
        let imageName = data.split("//")[0]
        let index = slider.images.findIndex(item => item.name == imageName)
        if(index !== -1) {
            slider.images.splice(index, 1);
            await sliderModel.findByIdAndUpdate(slider._id, slider)
            socket.emit('dleteImageSport', "image deleted")
        }else{
            socket.emit('dleteImageSport', "Please try again later")
        }
    })


    socket.on('editImageSport', async(data) => {
        let name = data.split("//")[1]
        let slider = await sliderModel.findOne({name:name})
        let imageName = data.split("//")[0]
        let index = slider.images.findIndex(item => item.name == imageName)
        if(index !== -1) {
            let details = slider.images[index]
            socket.emit('editImageSport', details)
        }else{
            socket.emit('editImageSport', "Please try again later")
        }
    })

    socket.on("dleteImageRoyal", async(data) => {
        let slider = await sliderModel.findOne({name:"Royal_Gaming"})
        let index = slider.images.findIndex(item => item.name == data)
        if(index !== -1) {
            slider.images.splice(index, 1);
            await sliderModel.findByIdAndUpdate(slider._id, slider)
            socket.emit('dleteImageRoyal', "image deleted")
        }else{
            socket.emit('dleteImageRoyal', "Please try again later")
        }
    })

    socket.on("dleteImageCasino", async(data) => {
        let slider = await sliderModel.findOne({name:"Casino"})
        let index = slider.images.findIndex(item => item.name == data)
        if(index !== -1) {
            slider.images.splice(index, 1);
            await sliderModel.findByIdAndUpdate(slider._id, slider)
            socket.emit('dleteImageCasino', "image deleted")
        }else{
            socket.emit('dleteImageCasino', "Please try again later")
        }
    })

    socket.on('deleteSlider', async(data) => {
        try{
            let deleted = await sliderModel.findByIdAndDelete(data)
            await sliderModel.updateMany({Number:{$gt:deleted.Number}},{$inc:{Number:-1}})
                socket.emit("deleteSlider", "Deleted successfully")
            }catch(err){
            if(err){
                console.log(err)
                socket.emit("deleteSlider", "Please try again leter")
            }
        }
    })


    socket.on('liveData', async(data) => {
        let sportListData = await getCrkAndAllData()
        const cricket = sportListData[0].gameList[0].eventList
        let featureEventId = []
        let featureStatusArr = await featureEventModel.find();
        featureStatusArr.map(ele => {
            featureEventId.push(parseInt(ele.Id))
        })

    
        let LiveCricket = cricket.filter(item => featureEventId.includes(item.eventData.eventId))
        let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
        let liveFootBall = footBall.eventList.filter(item => featureEventId.includes(item.eventData.eventId));
        let liveTennis = Tennis.eventList.filter(item => featureEventId.includes(item.eventData.eventId))
        socket.emit("liveData", {liveFootBall, liveTennis, LiveCricket})
    })

    socket.on("UserUpdatePass", async(data) => {
        // console.log(data.LOGINDATA.LOGINTOKEN)
        let fullUrl = "http://127.0.0.1/api/v1/users/updateCurrentUserPass"
        fetch(fullUrl, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ` + data.LOGINDATA.LOGINTOKEN,
                'Content-Type': 'application/json',
                'accept': 'application/json' },
            body:JSON.stringify(data.data)
        }).then(res => res.json())
        .then(Data =>{
            socket.emit('UserUpdatePass', Data)
            urlRequestAdd(`/api/v1/users/updateCurrentUserPass`,'POST', data.LOGINDATA.LOGINTOKEN, data.LOGINDATA.LOGINUSER)
            // console.log(Data)
        })
    })

    socket.on("checkPage", async(data) => {
        let page = await pagesModel.findById(data)
        socket.emit("checkPage", page)
    })

    socket.on("updatePage", async(data) => {
        // console.log(data)
        let page = await pagesModel.findByIdAndUpdate(data.id,data)
        if(page){
            socket.emit("updatePage", "success")
        }else{
            socket.emit("updatePage", "error")
        }
    })

    socket.on('liveCasinoPage', async(data) => {
        let games
        if(data.selectedValue === "All"){
             games = await gameModel.find()
        }else{
            games = await gameModel.find({provider_name:data.selectedValue})
        }
        let fevGames = []
        if(data.LOGINDATA.LOGINUSER != "" && data.LOGINDATA.LOGINUSER != undefined){
            // console.log(data.LOGINDATA.LOGINUSER._id)
           let fevGames1 = await CasinoFevoriteModel.findOne({userId:data.LOGINDATA.LOGINUSER._id})
           if(fevGames1){
               fevGames = fevGames1.gameId
           }else{
            fevGames = []
           }
        }
        socket.emit("liveCasinoPage", {games, fevGames})
    })

    socket.on("ACCSTATEMENTUSERSIDE", async(data) => {
    let limit = 20;
    let page = data.page;
    // console.log(data.filterData)
    // console.log(data.LOGINDATA.LOGINUSER)
    let filter = {}
    filter.user_id = data.LOGINDATA.LOGINUSER._id
    if(data.filterData.fromDate != "" && data.filterData.toDate == ""){
        filter.date = {
            $gt : new Date(data.filterData.fromDate)
        }
    }else if(data.filterData.fromDate == "" && data.filterData.toDate != ""){
        filter.date = {
            $lt : new Date(data.filterData.toDate)
        }
    }else if (data.filterData.fromDate != "" && data.filterData.toDate != ""){
        filter.date = {
            $gte : new Date(data.filterData.fromDate),
            $lt : new Date(data.filterData.toDate)
        }
    }
    if(data.filterData.type === "2"){
        filter.stake = {
            $ne:undefined
        }
    }else if (data.filterData.type === "1"){
        filter.stake = undefined
    }
    // console.log(filter)
    let userAcc = await AccModel.find(filter).sort({date: -1}).skip(page * limit).limit(limit)
    socket.emit("ACCSTATEMENTUSERSIDE", {userAcc, page})
    })

    socket.on("BETSFORUSER", async(data) => {
    let limit = 20;
    let page = data.page;
    let filter = {}
    // console.log(data)
    filter.userId = data.LOGINDATA.LOGINUSER._id
    // console.log(filter)
    if(data.filterData.fromDate != "" && data.filterData.toDate == ""){
        filter.date = {
            $gt : new Date(data.filterData.fromDate)
        }
    }else if(data.filterData.fromDate == "" && data.filterData.toDate != ""){
        filter.date = {
            $lt : new Date(data.filterData.toDate)
        }
    }else if (data.filterData.fromDate != "" && data.filterData.toDate != ""){
        filter.date = {
            $gte : new Date(data.filterData.fromDate),
            $lt : new Date(data.filterData.toDate)
        }
    }
    if(data.filterData.type != "All Bets"){
        filter.status = data.filterData.type
    }
    // console.log(filter)
    let MyBets = await Bet.find(filter).sort({date: -1}).skip(page * limit).limit(limit)
    // console.log(MyBets)
    socket.emit("BETSFORUSER", {MyBets, page})
    })




    socket.on("GAMEREPORTUSER", async(data) => {
        let page = data.page
        let limit = 20
        let matchStage = {};
        // matchStage.userId = data.LOGINDATA.LOGINUSER._id
        if(data.filterData.fromDate != ""){
            let fromDate = new Date(data.filterData.fromDate)
            matchStage.$gte = fromDate
        }

        if(data.filterData.toDate != ""){
            let toDate = new Date(data.filterData.toDate)
            matchStage.$lte = toDate;
        }
        let bets = await Bet.aggregate([
            {
              $match: {
                userId:data.LOGINDATA.LOGINUSER._id,
                date:matchStage
              }
            },
            {
              $group: {
                _id: '$event',
                totalData: { $sum: 1 },
                won: { $sum: { $cond: [{ $eq: ['$status', 'WON'] }, 1, 0] } },
                loss: { $sum: { $cond: [{ $eq: ['$status', 'LOSS'] }, 1, 0] } },
                Open: { $sum: { $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0] } },
                Cancel: { $sum: { $cond: [{ $eq: ['$status', 'CANCEL'] }, 1, 0] } },
                sumOfReturns: { $sum: '$returns' },
                uniqueMarketCount: { $addToSet: '$marketName' } 
              }
            },
            {
              $project: {
                _id: 1,
                totalData: 1,
                won: 1,
                loss: 1,
                Open: 1,
                Cancel: 1,
                sumOfReturns: 1,
                uniqueMarketCount: { $size: '$uniqueMarketCount' } 
              }
            },
            {
                $sort: { totalData: -1 , _id: 1}
            },
            {
                $skip:(page * limit)
            },
            {
                $limit:limit
            }
          ]);

          socket.emit("GAMEREPORTUSER", {bets, page})
    })
    
    socket.on("GAMEREPORTMATCHPAGEUSER", async(data) => {
        let page = data.page
        limit = 20
        let result =  await Bet.find({event:data.jsonData.eventName, match:data.jsonData.matchName, userId:data.LOGINDATA.LOGINUSER._id}).skip(page * limit).limit(limit)
        socket.emit("GAMEREPORTMATCHPAGEUSER", {result, page})
    })

    socket.on("STAKELABEL", async(data) => {
        // console.log(data)
        let stakeArray = data.input1Values.map((key, index) => ({
            key: parseInt(key.replace(/,/g, ''), 10),
            value: parseInt(data.input2Values[index].replace(/,/g, ''), 10)
          }));
        //   console.log(stakeArray)
        let userId = data.LOGINDATA.LOGINUSER._id
        let check = await stakeLabelModel.find({userId})
        // console.log(check.length)
        // console.log(stakeArray, userId)
        if(check.length === 0){
            // console.log("WORKING")
            try{
                let data = await stakeLabelModel.create({stakeArray:stakeArray, userId:userId})
                // console.log(data)
                socket.emit("STAKELABEL", "Updated")
            }catch(err){
                socket.emit("STAKELABEL", "Please try again later")
            }
        }else{
            try{
                const data = await stakeLabelModel.findOneAndUpdate({userId:userId}, {stakeArray:stakeArray})
                // console.log(data)
                socket.emit("STAKELABEL", "Updated")
            }catch(err){
                socket.emit("STAKELABEL", "Please try again later")
            }
        }
    })


    socket.on('socketStakeLABLEDATA', async(data) => {
        // console.log(data)
        let check = []
        if(data.LOGINUSER){
            check = await stakeLabelModel.find({userId:data.LOGINUSER._id})
        }
        // console.log(check)
        if(check.length === 0){
            socket.emit('socketStakeLABLEDATA', {status:"notFound"})
        }else{
            socket.emit('socketStakeLABLEDATA', check[0])
        }
    })


    socket.on("MULTIPLEMARKET", async(data) => {
        try{
            let userMultimarket = await multimarketModel.findOne({userId:data.LOGINDATA.LOGINUSER._id})
            if(userMultimarket){
                const index = userMultimarket.marketIds.indexOf(data.id);
                    if (index !== -1) {
                        // If data.id is found in the array, remove it using splice
                        userMultimarket.marketIds.splice(index, 1);
                        await userMultimarket.save()
                        socket.emit("MULTIPLEMARKET", {id:data.id,remove:true})
                    } else {
                        // If data.id is not found in the array, add it
                        userMultimarket.marketIds.push(data.id);
                        await userMultimarket.save()
                        socket.emit("MULTIPLEMARKET", {id:data.id,remove:false})
                    }
                
            }else{
                await multimarketModel.create({userId:data.LOGINDATA.LOGINUSER._id, marketIds:[`${data.id}`]})
                socket.emit("MULTIPLEMARKET", {id:data.id,})
            }
        }catch(err){
            socket.emit("MULTIPLEMARKET", "err")
        }
    });

    socket.on("MultiMarketPage", async(data) => {
            let multimarket = await multimarketModel.findOne({userId:data.LOGINUSER._id})
            let sportListData = await getCrkAndAllData()
            const SportLimits = await betLimit.find({type :"Sport"})
            socket.emit("MultiMarketPage", {multimarket, sportListData, SportLimits})
    })

    socket.on("createNewRule", async(data) =>{
        // console.log(data.data)
        try{
            let data1 = await gameRuleModel.create(data.data)
            socket.emit("createNewRule", {message:"updated", data1})
        }catch(err){
            console.log(err)
            socket.emit("createNewRule", {message:"err"})
        }
    })

    socket.on("getDetailsOfRUles", async(data) => {
        let data1 =  await gameRuleModel.findById(data)
        socket.emit("getDetailsOfRUles", data1)
    })

    socket.on("updateRules", async(data) => {
        // console.log(data)
        try{
            await gameRuleModel.findByIdAndUpdate(data.id, {name:data.name, description:data.description})
            let updated = await gameRuleModel.findById(data.id)
            socket.emit("updateRules", updated)
        }catch(err){
            console.log(err)
            socket.emit("updateRules", "err")
        }
    })

    socket.on("KYC", async(data) => {
        function saveBufferToFile(bufferData, filePath) {
            const uint8ArrayData = new Uint8Array(bufferData);
            fs.writeFile(filePath, uint8ArrayData, (err) => {
              if (err) {
                console.error('Error saving the file:', err);
              } else {
                console.log('File saved successfully.');
              }
            });
          }
          const bufferData = Buffer.from(` files: ${data.data.files}`, 'hex');
          const filePath = path.join( __dirname, 'documents'); 
        // //   console.log(`${data.LOGINDATA.LOGINUSER.userName}`)
        //   console.log()
          saveBufferToFile(bufferData, `${filePath}/${data.LOGINDATA.LOGINUSER.userName}`);
    })

    socket.on('getPdf', async(data) => {
        // console.log(data)
        const fileName = `${data.LOGINDATA.LOGINUSER.userName}`; 
        const filePath = `/var/www/bettingApp/documents/${fileName}.pdf`;
        fs.readFile(filePath, (err, data1) => {
            if (err) {
              console.error('Error reading the PDF file:', err);
              return;
            }
            socket.emit('getPdf', { fileName, data1 });
        })
    })

    socket.on("CasinoFevorite", async(data) => {
        try{
            let games = await CasinoFevoriteModel.findOne({userId:data.LOGINDATA.LOGINUSER._id})
            if(games){
                const index = games.gameId.indexOf(data.id);
                    if (index !== -1) {
                        // If data.id is found in the array, remove it using splice
                        games.gameId.splice(index, 1);
                        await games.save()
                        socket.emit("CasinoFevorite", {id:data.id,remove:true})
                    } else {
                        // If data.id is not found in the array, add it
                        games.gameId.push(data.id);
                        await games.save()
                        let gameDetails = await gameModel.findById(data.id)
                        socket.emit("CasinoFevorite", {id:data.id,remove:false, gameDetails})
                    }
                
            }else{
                await CasinoFevoriteModel.create({userId:data.LOGINDATA.LOGINUSER._id, gameId:[`${data.id}`]})
                socket.emit("CasinoFevorite", {id:data.id,})
            }
        }catch(err){
            console.log(err)
            socket.emit("CasinoFevorite", "err")
        }
        // console.log(data)
    })

    socket.on("UserSideSEarchLive", async(data) => {
        if(data != "LessTheN3"){
            let allData =  await getCrkAndAllData()
            const cricket = allData[0].gameList[0].eventList
            let LiveCricket = cricket.filter(item =>  item.eventData.name.toLowerCase().includes(data.toLowerCase()))
            let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
            let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
            footBall = footBall.eventList
            Tennis = Tennis.eventList
            let liveFootBall = footBall.filter(item =>  item.eventData.name.toLowerCase().includes(data.toLowerCase()));
            let liveTennis = Tennis.filter(item =>  item.eventData.name.toLowerCase().includes(data.toLowerCase()))
            const resultSearch = LiveCricket.concat(liveFootBall, liveTennis);
            // console.log(resultSearch)
            // console.log(data)
            socket.emit("UserSideSEarchLive", resultSearch)
        }else{
            let resultSearch = []
            socket.emit("UserSideSEarchLive", resultSearch)
        }
    })

    socket.on("chartMain", async (data) => {
        // console.log(data);
        if(data.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINUSER.parent_id)
            data.LOGINUSER = parentUser
        }
    
        const currentDate = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(currentDate.getDate() - 10);
    
        const dateSequence = [];
        for (let i = 0; i < 10; i++) {
            const currentDate = new Date(tenDaysAgo);
            currentDate.setDate(tenDaysAgo.getDate() + i);
            dateSequence.push(currentDate.toDateString());
        }
    
        let accountForGraph = await AccModel.aggregate([
            {
                $match: {
                    userName: data.LOGINUSER.userName,
                    date: {
                        $gte: tenDaysAgo,
                        $lte: currentDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        day: { $dayOfMonth: '$date' },
                    },
                    totalIncome: {
                        $sum: '$creditDebitamount',
                    },
                    totalIncome2: {
                        $sum: { $abs: '$creditDebitamount' },
                    },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
            },
        ]);
    
        const newDataArray = [];
        const currentDate1 = new Date(tenDaysAgo);
        for (let i = 0; i < 10; i++) {
            const matchingData = accountForGraph.find(item =>
                item._id.year === currentDate1.getFullYear() &&
                item._id.month === currentDate1.getMonth() + 1 &&
                item._id.day === currentDate1.getDate()
            );
    
            if (matchingData) {
                newDataArray.push(matchingData);
            } else {
                newDataArray.push({
                    _id: {
                        year: currentDate1.getFullYear(),
                        month: currentDate1.getMonth() + 1,
                        day: currentDate1.getDate(),
                    },
                    totalIncome: 0,
                    totalIncome2: 0,
                });
            }
    
            currentDate1.setDate(currentDate1.getDate() + 1);
        }
    
        // Format data to two decimal places
        const formattedDataArray = newDataArray.map(item => ({
            _id: item._id,
            totalIncome: item.totalIncome.toFixed(2),
            totalIncome2: item.totalIncome2.toFixed(2),
        }));
    
        const Income = formattedDataArray.map(item => parseFloat(item.totalIncome));
        const Revanue = formattedDataArray.map(item => parseFloat(item.totalIncome2));
        socket.emit("chartMain", { Income, Revanue });
    });
    

    socket.on("FIlterDashBoard", async(data) => {
        let filter;
        let filter2;
        let result = {}
        if(data.LOGINDATA.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
            data.LOGINDATA.LOGINUSER = parentUser
        }
        let childrenUsername = []
        childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
        // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
        
        var today = new Date();
        var todayFormatted = formatDate(today);
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() - 1);
        var tomorrowFormatted = formatDate(tomorrow);
        var thirdDay = new Date();
        thirdDay.setDate(today.getDate() - 2);
        var thirdDayFormatted = formatDate(thirdDay);
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return year + "-" + month + "-" + day;
        }
        if (data.value === "today") {
            filter = {
                $or:[{login_time: {$gte:new Date(todayFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}},{logOut_time: {$exists:false}}],
                userName:{$in:childrenUsername}
                
            };
            filter2 = {$gte:new Date(todayFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}
        } else if (data.value === "yesterday") {
            filter = {
                $or:[{login_time: {$lte:new Date(new Date(tomorrowFormatted).getTime() + ((24 * 60*60*1000)-1))}},{logOut_time:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(tomorrowFormatted).getTime() + ((24 * 60*60*1000)-1))}}],
                userName:{$in:childrenUsername}
                
            };
            filter2 = {$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(tomorrowFormatted).getTime() + ((24 * 60*60*1000)-1))}

        } else if (data.value === "all") {
            filter = {
                userName:{$in:childrenUsername}
            };
            filter2 = {$exists:true}

        } else {
            filter = {
                $or:[{login_time: {$lte:new Date(new Date(thirdDayFormatted).getTime() + ((24 * 60*60*1000)-1))}},{logOut_time:{$gte:new Date(thirdDayFormatted),$lte:new Date(new Date(thirdDayFormatted).getTime() + ((24 * 60*60*1000)-1))}}],
                userName:{$in:childrenUsername}
            };
            filter2 = {$gte:new Date(thirdDayFormatted),$lte:new Date(new Date(thirdDayFormatted).getTime() + ((24 * 60*60*1000)-1))}

        }
        filter.role_Type = 5
        const userCount = await loginLogs.aggregate([
            {
                $match:filter
            },
            {
                $group: {
                    _id: '$userName'
                }
            }
        ])

       
        result.userCount = userCount.length > 0?userCount.length : 0;

        filter.role_Type = {$ne:5}
        const adminCount = await loginLogs.aggregate([
            {
                $match:filter
            },
            {
                $group: {
                    _id: '$userName'
                }
            }
        ])

      
        result.adminCount = adminCount.length > 0?adminCount.length : 0;

        let turnOver = await AccModel.aggregate([
            {
                $match:{
                    userName:data.LOGINDATA.LOGINUSER.userName,
                    date:filter2
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: { $abs: "$creditDebitamount" } },
                    Income : {$sum: '$creditDebitamount'},
                }
            }
        ])

        // console.log(turnOver,'turnOver')
        if(turnOver.length > 0){
            result.turnOver = turnOver[0].totalAmount
            result.Income = turnOver[0].Income
        }else{
            result.turnOver = 0
            result.Income = 0
        }

        if(data.value === "all"){
            betCount = await Bet.aggregate([
                {
                    $match:{
                        date:filter2,
                        userName : {$in:childrenUsername}
                    }
                }
               
              ])
        }else{
            betCount = await Bet.aggregate([
                {
                    $match:{
                        date:filter2,
                        userName : {$in:childrenUsername}
                    }
                }
            
              ])
        }

        // console.log(betCount,'betCount')

        result.betCount = betCount.length
        // console.log(turnOver)
        // console.log(turnOver.length)

        socket.emit("FIlterDashBoard", {result})

    })

    socket.on('dashboardrefresh',async(data)=>{
        // console.log("WORKING")
        let roles
        let users
        let topGames
        let Categories
        let userCount = 0
        let adminCount = 0
        let betCount = 0
        let alertBet
        let betsEventWise
        let turnOver
        if(data.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINUSER.parent_id)
            data.LOGINUSER = parentUser
        }
        let childrenUsername = []
        // let children = await User.find({parentUsers:data.LOGINUSER._id})
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
        childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINUSER._id });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
        topGames = await Bet.aggregate([
            {
                $match: {
                    status: { $ne: "OPEN" },
                    date: { $gte: sevenDaysAgo },
                    userName:{$in:childrenUsername}
                }
            },
    
            {
                $group: {
                    _id: "$event",
                    totalCount: { $sum: 1 },
                    uniqueUsers: { $addToSet: "$userId" },
                    totalReturns: { $sum: "$Stake" }
                }
            },
            {
                $project: {
                    _id: 0,
                    event: "$_id",
                    totalCount: 1,
                    noOfUniqueUsers: { $size: "$uniqueUsers" },
                    totalReturns: 1
                }
            },
            {
                $sort: {
                    totalCount: -1
                }
            },
            {
                $limit: 5
            }
        ]);
    
        Categories = await Bet.aggregate([
            {
                $match: {
                    status: { $ne: "OPEN" },
                    date: { $gte: sevenDaysAgo },
                    userName:{$in:childrenUsername}
                }
            },
            {
                $group: {
                    _id: "$betType",
                    totalBets: { $sum: 1 },
                    totalReturns: { $sum: "$Stake" },
                    uniqueEvent: { $addToSet: "$event" }
                }
            },
            {
                $sort: {
                    totalBets: -1
                }
            }
        ])
    
        var today = new Date();
        var todayFormatted = formatDate(today);
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return year + "-" + month + "-" + day;
        }

    
        alertBet = await Bet.aggregate([
            {
                $match: {
                    "status": "Alert",
                    userName:{$in:childrenUsername}
    
                }
            },
            {
                $sort: {
                    Stake: -1
                }
            },
            {
                $limit: 5
            }
        ]);
        
        betsEventWise = await Bet.aggregate([
            {
                $match: {
                    status: "OPEN",
                    userName: {$in:childrenUsername}
                }
            },
            {
                $group: {
                    _id: "$match",
                    count: { $sum: 1 },
                    eventdate: { $first: "$eventDate" },
                    eventid: { $first: "$eventId" },
                    series: { $first: "$event" },
                    sport: { $first: "$betType" }
                }
            },
            {
                $project: {
                    _id: 0,
                    matchName: "$_id",
                    eventdate: 1,
                    eventid: 1,
                    series: 1,
                    count: 1,
                    sport: 1
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);
        
    
    
    
        let topBets = await Bet.aggregate([
            {
                $match: {
                    status:"OPEN",
                    userName: {$in:childrenUsername}
                }
            },
            {
                $sort:{
                    Stake: -1
                }
            },
            {
                $limit:5
            }
        ])
            
            
    
            // console.log(topBets, "topBets 741258963")
        const topPlayers = await User.find({Bets:{ $nin : [0, null, undefined] }, parentUsers : { $in: [data.LOGINUSER._id] }}).limit(5).sort({Bets:-1})
        const dashboard = {};
        dashboard.topPlayers = topPlayers
        dashboard.topGames = topGames
        dashboard.Categories = Categories
        dashboard.alertBet = alertBet
        dashboard.settlement = betsEventWise
        dashboard.topBets = topBets
        // console.log("WORKINGDONE")
        socket.emit('dashboardrefresh',dashboard)
    })

    socket.on("getUserDetaisl", async(data) => {
        try{
            let user = await User.findById(data.dataId)
            let parent = await User.findById(user.parent_id)
            socket.emit("getUserDetaisl", {user, status:"success", parent})
        }catch(err){
            console.log(err)
            socket.emit("getUserDetaisl", {message:"err", status:"error"})
        }
    })
    socket.on("DepositW", async(data) => {
        try{
            let user = await User.findById(data.dataId)
            let parent = await User.findById(user.parent_id)
            socket.emit("DepositW", {user, status:"success", type:data.type, parent})
        }catch(err){
            console.log(err)
            socket.emit("DepositW", {message:"err", status:"error"})
        }
    })

    socket.on("getUserDetaislForPassChange", async(data) => {
        try{
            let user = await User.findById(data.dataId)
            let parent = await User.findById(user.parent_id)
            socket.emit("getUserDetaislForPassChange", {user, status:"success", parent})
        }catch(err){
            console.log(err)
            socket.emit("getUserDetaislForPassChange", {message:"err", status:"error"})
        }
    })

    socket.on("BetLockUnlock", async(data) => {
        try{
            let user =  await User.findById(data.dataId)
            let status = !user.betLock
            user.betLock = status
            await User.findByIdAndUpdate(data.dataId, {betLock:status})
            socket.emit("BetLockUnlock", {user, status,rowid:data.id})

        }catch(err){
            console.log(err)
            socket.emit("BetLockUnlock", {message:"err", status:"error"})
        }
    })

    socket.on("userStatus", async(data) => {
        try{
            let user = await User.findById(data.dataId)
            let parent = await User.findById(user.parent_id)
            socket.emit("userStatus", {user, status:"success", parent})
        }catch(err){
            console.log(err)
            socket.emit("userStatus", {message:"err", status:"error"})
        }
    })

    socket.on("FUndData", async(data) => {
        try{
            if(data.LOGINDATA.LOGINUSER.roleName === "Admin"){
                let user = await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id, {$inc:{balance:parseFloat(data.data.amount), availableBalance:parseFloat(data.data.amount)}})
                // console.log(user,122122)
                let date = Date.now()
                let data1 = {
                    userId:data.LOGINDATA.LOGINUSER._id,
                    amount:parseFloat(data.data.amount),
                    Remark:data.data.Remark,
                    date,
                    type:"Deposit",
                    closingBalance: parseFloat(user.availableBalance + parseFloat(data.data.amount))
                }
                let houseFund =  await houseFundModel.create(data1)
                socket.emit("FUndData", houseFund)
            }else{
                let parentUse = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
                if(parentUse.roleName === "Admin"){ 
                    let user = await User.findByIdAndUpdate(parentUse._id.toString(), {$inc:{balance:parseFloat(data.data.amount), availableBalance:parseFloat(data.data.amount)}})
                // console.log(user,122122)
                let date = Date.now()
                let data1 = {
                    userId:parentUse._id.toString(),
                    amount:parseFloat(data.data.amount),
                    Remark:data.data.Remark,
                    date,
                    type:"Deposit",
                    closingBalance: parseFloat(user.availableBalance + parseFloat(data.data.amount))
                }
                let houseFund =  await houseFundModel.create(data1)
                socket.emit("FUndData", houseFund)
                }
            }
        }catch(err){
            console.log(err)
            socket.emit("FUndData",{message:"err", status:"error"})
        }
    })

    socket.on("alertBet", async(data) => {
        try{
            let user = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
            const passcheck = await user.correctPassword(data.data.password, user.password)
            if(passcheck){
                let bet = await Bet.findOne({_id:data.id});
                if(bet.alertStatus == 'CANCEL'){
                    socket.emit('alertBet', {bet, status:"fail",msg:'Cannot alert this bet'})
                }else if(bet.alertStatus == 'ACCEPT'){
                    socket.emit('alertBet', {bet, status:"fail",msg:'Bet alredy accepted'})
                }else if(bet.status == 'Alert'){
                    await Bet.findOneAndUpdate({_id:data.id}, {status:"OPEN",$unset:{'alertStatus':1},remark:data.data.Remark});
                    socket.emit('alertBet', {bet, status:"fail",msg:'Removed alert successfully'})
                }else if(bet.status == 'OPEN'){
                    await Bet.findOneAndUpdate({_id:data.id}, {status:"Alert",alertStatus:"ALERT",remark:data.data.Remark});
                    socket.emit('alertBet', {status:"success", bet})
                }else if(['LOSS','WON'].includes(bet.status)){
                    socket.emit('alertBet', {bet, status:"fail",msg:'Cannot alert this bet'})

                }
                // let bet = await Bet.findOneAndUpdate({_id:data.id,status:'OPEN'}, {status:"Alert",alertStatus:"ALERT",remark:data.data.Remark});
            }else{
                socket.emit("alertBet",{msg:"Please Provide valide password", status:"fail"})

            }

        }catch(err){
            console.log(err)
            socket.emit("alertBet",{msg:"Please try again leter", status:"fail"})
        }
    })

    socket.on("acceptBet", async(data) => {
        try{
            let remark = `accept by ${data.LOGINDATA.LOGINUSER.userName}`
            let bet = await Bet.findByIdAndUpdate(data.id, {status:"OPEN",alertStatus:"ACCEPT",remark});
            socket.emit('acceptBet', {bet, status:"success"})

        }catch(err){
            console.log(err)
            socket.emit("acceptBet",{msg:"Please try again leter", status:"fail"})
        }
    })

    socket.on('AlertBet',async(data)=>{
        // console.log(data.filterData)
        if(data.filterData.marketName == "All"){
            delete data.filterData.marketName
        }
        if(data.filterData.marketName == "Fancy"){
            data.filterData.marketName = {$nin:["Match Odds", "Bookmaker 0%Comm"]}
        }
        if(data.filterData.alertStatus == 'All' || !data.filterData.alertStatus){
            data.filterData.alertStatus = {$in:['ALERT','ACCEPT','CANCEL']}
        }
        if(data.filterData.betType == "All"){
            delete data.filterData.betType; 
        }
        if(data.filterData.fromDate && data.filterData.toDate){
            data.filterData.date = {$gte : new Date(data.filterData.fromDate),$lte : new Date(new Date(data.filterData.toDate))}
            delete data.filterData.fromDate;
            delete data.filterData.toDate;
        }else{
            if(data.filterData.fromDate){
                data.filterData.date = {$gte : data.filterData.fromDate}
                delete data.filterData.fromDate;

            }
            if(data.filterData.toDate){
                data.filterData.date = {$lte : new Date(new Date(data.filterData.toDate))}
                delete data.filterData.toDate;

            }
        }
        let limit;
        let page = data.page;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = limit * page
        }
        let childrenUsername = []
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }else{
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }     
        if(data.LOGINDATA.LOGINUSER.userName != data.filterData.userName){
        }
        else{
            data.filterData.userName = {$in:childrenUsername}

        }
        let ubDetails = await Bet.find(data.filterData).sort({date:-1}).skip(skip).limit(limit)
        socket.emit('AlertBet',{ubDetails,page,refreshStatus:data.refreshStatus})
    })

    socket.on("myShare", async(data) => {
        try{
            if(data.share < 0 || data.myShare < 0){
            socket.emit("myShare",{message:"value Must be positive", status:"error"})
            }else{
                await User.findByIdAndUpdate(data.id, {Share:data.share, myShare:data.myShare})
                socket.emit("myShare", {share:data.share, myShare:data.myShare, status:"success"})
            }
        }catch(err){
            console.log(err)
            socket.emit("myShare",{message:"Please try again later", status:"error"})
        }
    })

    socket.on("Wallet", async(data) => {
        try{
            await User.findByIdAndUpdate(data.id, {maxCreditReference:data.maxCreditReference, transferLock:data.transferLock})
            socket.emit("myShare", {maxCreditReference:data.maxCreditReference, transferLock:data.transferLock, status:"success"})
        }catch(err){
            console.log(err)
            socket.emit("Wallet",{message:"Please try again later", status:"error"})
        }
    })

    socket.on("BETSFORUSERAdminSide", async(data) => {
        // console.log(data)
        try{
            let limit = 20
            let page = 0
            if(data.page){
                page = data.page
            }
            let user = await User.findById(data.id)
            let bets 
            let filter = {}
            
            if(data.filterData.fromDate != "" && data.filterData.toDate == ""){
                filter.date = {
                    $gt : new Date(data.filterData.fromDate)
                }
            }else if(data.filterData.fromDate == "" && data.filterData.toDate != ""){
                filter.date = {
                    $lt : new Date(data.filterData.toDate)
                }
            }else if (data.filterData.fromDate != "" && data.filterData.toDate != ""){
                filter.date = {
                    $gte : new Date(data.filterData.fromDate),
                    $lt : new Date(data.filterData.toDate)
                }
            }
            if(data.filterData.type != "All Bets"){
                filter.status = data.filterData.type
            }
            // console.log(filter)
            if(user.roleName != "user"){
                bets = await Bet.aggregate([
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
                          "user.parentUsers": { $in: [data.id] }
                        }
                      },
                      {
                        $match:filter
                      },
                      {
                    $sort: {
                        date: -1
                    }
                },
                {
                    $skip:(page * limit)
                },
                {
                    $limit:limit
                }
                    ])
            }else{
                filter.userId = data.id
                bets = await Bet.find(filter).sort({date:-1}).skip(limit*page).limit(limit)

            }
            socket.emit("BETSFORUSERAdminSide",{bets, page,status:"success"})

        }catch(err){
            console.log(err)
            socket.emit("BETSFORUSERAdminSide",{message:"Please try again later", status:"error"})
        }
    })

    socket.on("ACCSTATEMENTADMINSIDE", async(data) => {
        try{

            let limit = 10;
            let page = data.page;
            // console.log(page)
            // console.log(data.LOGINDATA.LOGINUSER)
            let filter = {}
            filter.user_id = data.id
            if(data.filterData.fromDate != "" && data.filterData.toDate == ""){
            filter.date = {
                $gt : new Date(data.filterData.fromDate)
            }
        }else if(data.filterData.fromDate == "" && data.filterData.toDate != ""){
            filter.date = {
                $lt : new Date(data.filterData.toDate)
            }
        }else if (data.filterData.fromDate != "" && data.filterData.toDate != ""){
            filter.date = {
                $gte : new Date(data.filterData.fromDate),
                $lt : new Date(data.filterData.toDate)
            }
        }
        if(data.filterData.type === "2"){
            filter.stake = {
                $ne:undefined
            }
        }else if (data.filterData.type === "1"){
            filter.stake = undefined
        }
        // console.log(filter)
        let userAcc = await AccModel.find(filter).sort({date: -1}).skip(page * limit).limit(limit)
        // console.log(userAcc)
        socket.emit("ACCSTATEMENTADMINSIDE", {userAcc, page})
    }catch(err){
        console.log(err)
    }
    })


    socket.on("loadMorediveHistory", async(data) => {
        let page = data.page
        let userDetails = await User.findById(data.id)
        let historty = await loginLogs.find({userName:userDetails.userName}).sort({login_time:-1}).skip(page*20).limit(20)
        socket.emit("loadMorediveHistory", historty)
    })

    socket.on("Autosettle", async(data) => {
        // console.log(data)
        await settlement.findOneAndUpdate({userId:data.LOGINDATA.LOGINUSER._id},{status:data.status})
    })

    socket.on('settlement',async(data)=>{
        // console.log(data)
        const me = data.LOGINUSER
        let dataobj;

        if(data.fromdate && data.todate){
            let fromDate = new Date(data.fromdate)
            let toDate = new Date(data.todate)
            toDate.setDate(toDate.getDate() + 1);
            // fromDate = Math.floor(fromDate.getTime()/1000)
            // toDate = Math.floor(toDate.getTime()/1000)
            dataobj = {$gte:new Date(fromDate) ,$lte:new Date(toDate)}
        }else if(data.fromdate && !data.todate){
            let fromDate = new Date(data.fromdate)
            // fromDate = Math.floor(fromDate.getTime()/1000)
            dataobj = {$gte:new Date(fromDate)}
        }else if(!data.fromdate && data.todate){
            let toDate = new Date(data.todate)
            // toDate = Math.floor(toDate.getTime()/1000)
            toDate.setDate(toDate.getDate() + 1);
            dataobj = {$lte:new Date(toDate)}
        }
        // console.log(dataobj, "dateObj")
        let childrenUsername = []
        if(me.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', {parentUsers:{ $in: [me.parent_id] }});
            
            // let children = await User.find({parentUsers:{ $in: [me.parent_id] }})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }else{
            childrenUsername = await User.distinct('userName', {parentUsers:{ $in: [me._id] }});
            // let children = await User.find({parentUsers:{ $in: [me._id] }})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })

        }
    
    
        let betsEventWise = await Bet.aggregate([
            {
                $match: {
                    // status:"OPEN" ,
                    eventDate: dataobj,
                    userName:{$in:childrenUsername}
                }
            },
              {
                $group: {
                  _id: {
                    betType: "$betType",
                    matchName: "$match"
                  },
                  count: { $sum: 1 },
                  eventdate: { $first: "$eventDate" }, 
                  eventid: { $first: "$eventId" },
                  series: {$first: "$event"},
                  betType : {$first: '$betType'},
                  count2: { 
                      $sum: {
                        $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
                      },
                  },
                }
              },
              {
                $group: {
                  _id: "$_id.betType",
                  data: {
                    $push: {
                      matchName: "$_id.matchName",
                      count: "$count",
                      eventdate : '$eventdate',
                      eventid : "$eventid",
                      series : '$series',
                      count2: "$count2",
                      betType : '$betType'
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  id: "$_id", 
                  data: 1
                }
              },
              {
                $sort: {
                    "data.eventdate": -1 
                }
            }
        
        ])
        socket.emit('settlement',{betsEventWise,dataobj,data})

    })

    socket.on('settlementHistory',async(data)=>{
        let me = data.USER
        let page = data.page;
        let limit = 10
        let operationId;
        let operationroleName;
        if(me.roleName == 'Operator'){
            operationId = me.parent_id
            let parentUser = await User.findById(operationId)
            operationroleName = parentUser.roleName
        }else{
            operationId = me._id
            operationroleName = me.roleName
    
        }
        // console.log(me)
        let filter = {}
        if(data.from_date && data.to_date){
            filter.date = {$gte:new Date(data.from_date),$lte:new Date(data.to_date)}
        }else if(data.from_date && !data.to_date){
            filter.date = {$gte:new Date(data.from_date)}
        }else if(data.to_date && !data.from_date){
            filter.date = {$lte:new Date(data.to_date)}
        }
        // console.log(filter)
     
        if(operationroleName === "Admin"){
        }else{
            filter.userId = operationId
        }
        let History2 = await settlementHistory.aggregate([
            {
                $match:filter
            },
            {
                $addFields: {
                  userIdObjectId: { $toObjectId: '$userId' } 
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userIdObjectId",
                    foreignField: '_id',
                    as: "user"
                  }
            },
            {
                $sort:{
                    date:-1
                }
            },
            {
                $skip:(page * limit)
            },
            {
                $limit:limit
            }
        ])
        socket.emit('settlementHistory',{History:History2,page})
    })

    socket.on("VoidBetIn", async(data) => {
        try{
            let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password');
            if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
                socket.emit("VoidBetIn",{message:"please provide a valid password", status:"error"})
            }else{
                socket.emit('VoidBetIn', {message: 'Void Bet Process Start', id:data.id})
                let result = await voidBetBeforePlace(data)
            }
        }catch(err){
            console.log(err)
            socket.emit("VoidBetIn",{status:"error"})
        }     
    })


    socket.on('VoidBetIn2', async(data) => {
        try{
            let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password'); 
            if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
                socket.emit('VoidBetIn2', 'please provide a valid password') 
            }else{
                socket.emit('VoidBetIn2', 'Void Bet Process Start')
                let reultData = await voidbetAfterPlace(data)
            }
        }catch(err){
            console.log(err)
            socket.emit("VoidBetIn2",{message:"err", status:"error"})
        }
    })


    socket.on('unmapBet', async(data) => {
        try{
            await Bet.updateMany({ marketId: data.id, status: 'MAP' }, { $unset: { result: 1 }, $set: { status: 'OPEN' } });
            let betdata = await Bet.findOne({marketId:data.id})
            socket.emit('unmapBet', {status:"success", betdata, result:data.result})
        }catch(err){
            console.log(err)
            socket.emit('unmapBet', {message:'err', status:'error'})
        }
    })

    socket.on('Settle', async(data) => {
        try{
            // console.log(data)
            socket.emit("Settle", {message:"Settleed Process start", status:'success', id:data.id})
            let data1 = mapBet(data)
            // socket.emit('Settle', {marketId:data.id, status:"success"})
        }catch(err){
            console.log(err)
            socket.emit("Settle",{message:"err", status:"error"})
        }
    })

    socket.on("VoidBetIn22", async(data) => {
        try{
             if(data.result != ""){
                await Bet.updateMany({marketId:data.id, status:'OPEN'}, {$set:{result:data.result, status:'MAP'}})
                let betdata = await Bet.findOne({marketId:data.id})
                socket.emit('VoidBetIn22', {status:"success", betdata, result:data.result})
             }else{
                socket.emit('VoidBetIn22', {message:"Please select a result", status:"error"})
             }
        }catch(err){
            console.log(err)
            socket.emit("VoidBetIn22",{message:"err", status:"error"})
        }
    })

    socket.on("commissionData", async(data) => {
        try{
            let commissionData = await commissionModel.find({userId:data.dataId})
            socket.emit("commissionData", {stats:"success", commissionData, id:data.dataId})
        }catch(err){
            socket.emit("commissionData",{message:"err", status:"error"})
        }

    })

    socket.on("updateCommission", async(data) => {
        // console.log(data)
        try{
            let newValues = {
                matchOdd: { percentage: data.data.matchOdds, type: `${data.data.matchOddsType}` , status: data.data.matchOddsStatus},
                Bookmaker: { percentage: data.data.Bookmaker, type:  `${data.data.BookmakerType}`, status: data.data.BookmakerStatus},
                fency: { percentage: data.data.fency, type: `${data.data.fencyType}`, status: data.data.fencyStatus}
            }
            let newdata
            if(!await commissionModel.findOne({userId:data.data.id})){
                newValues.userId = data.data.id
                newdata = await commissionModel.create(newValues)
            }else{

                newdata = await commissionModel.findOneAndUpdate({userId:data.data.id}, newValues)
            }

        socket.emit("updateCommission",{newdata, status:"success"})
        }catch(err){
            socket.emit("updateCommission",{message:"err", status:"error"})
        }
    })

    socket.on("CommissionRReport", async(data) => {
        let limit = 10;
        let page = data.page;
        // console.log(page)
        // console.log(data.LOGINDATA.LOGINUSER)
        let filter = {}
        filter.user_id = data.LOGINDATA.LOGINUSER._id
        filter.description = { $regex: /^commission for/ }
        if(data.filterData.fromDate != "" && data.filterData.toDate == ""){
            filter.date = {
                $gte : new Date(data.filterData.fromDate)
            }
        }else if(data.filterData.fromDate == "" && data.filterData.toDate != ""){
            filter.date = {
                $lte : new Date(new Date(data.filterData.toDate).getTime() + ((24 * 60 *60 *1000) - 1))
            }
        }else if (data.filterData.fromDate != "" && data.filterData.toDate != ""){
            filter.date = {
                $gte : new Date(data.filterData.fromDate),
                $lte : new Date(new Date(data.filterData.toDate).getTime() + ((24 * 60 *60 *1000) - 1))
            }
        }

        let CommissionData = await AccModel.find(filter).sort({date:-1}).skip(page * limit).limit(limit)
        // console.log(CommissionData)
        socket.emit("CommissionRReport", {CommissionData, page})
    })

    socket.on('sportStatusChange',async(data) => {
        // console.log(data)
        let allData =  await getCrkAndAllData()
        const cricket = allData[0].gameList[0].eventList
        let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
        footBall = footBall.eventList
        Tennis = Tennis.eventList
        const resultSearch = cricket.concat(footBall, Tennis);
        let result = resultSearch.find(item => item.eventData.compId == data.id)
        if(data.status){
            let cataLog =  await catalogController.findOneAndDelete({Id:data.id},{status:true})
            if(cataLog){
                msg = 'series activated'
                socket.emit('sportStatusChange',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange',{status:'success',msg})
            }
        }else{
            let createData = {
                Id : data.id,
                name : result.eventData.league,
                type : "league",
                status : false      
            }
            let cataLog = await catalogController.create(createData)
            if(cataLog){
                msg = 'series deactivated'
                socket.emit('sportStatusChange',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange',{status:'success',msg})
            }
        }
        // console.log(data)
         // try{
        //     let msg;
        //     let sport;
        //     if(data.status){
        //         sport = await catalogController.updateOne({Id:data.id},{status:true})
        //         if(sport.type == 'event'){
        //             msg = 'event activated'
        //         }else{
        //             msg = 'series activated'
        //         }
        //     }else{
        //         sport = await catalogController.updateOne({Id:data.id},{status:false})
        //         if(sport.type == 'event'){
        //             msg = 'event deactivated'
        //         }else{
        //             msg = 'series deactivated'
        //         }
        //     }
        //     socket.emit('sportStatusChange',{status:'success',msg})
        // }catch(error){
        //     socket.emit('sportStatusChange',{status:'fail'})
        // }
    })

    socket.on('sportStatusChange2',async(data) => {
        // console.log(data)
        let allData =  await getCrkAndAllData()
        const cricket = allData[0].gameList[0].eventList
        let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
        footBall = footBall.eventList
        Tennis = Tennis.eventList
        const resultSearch = cricket.concat(footBall, Tennis);
        let result = resultSearch.find(item => item.eventData.eventId == data.id)
        if(data.status){
            let cataLog =  await catalogController.findOneAndDelete({Id:data.id},{status:true})
            if(cataLog){
                msg = 'series activated'
                socket.emit('sportStatusChange2',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange2',{status:'success',msg})
            }
        }else{
            let createData = {
                Id : data.id,
                name : result.eventData.name,
                type : "event",
                status : false      
            }
            let cataLog
            if(!await catalogController.findOne({Id:data.id})){
                cataLog = await catalogController.create(createData)
            }
            if(cataLog){
                msg = 'series deactivated'
                socket.emit('sportStatusChange2',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange2',{status:'success',msg})
            }
        }
        // console.log(data)
         // try{
        //     let msg;
        //     let sport;
        //     if(data.status){
        //         sport = await catalogController.updateOne({Id:data.id},{status:true})
        //         if(sport.type == 'event'){
        //             msg = 'event activated'
        //         }else{
        //             msg = 'series activated'
        //         }
        //     }else{
        //         sport = await catalogController.updateOne({Id:data.id},{status:false})
        //         if(sport.type == 'event'){
        //             msg = 'event deactivated'
        //         }else{
        //             msg = 'series deactivated'
        //         }
        //     }
        //     socket.emit('sportStatusChange',{status:'success',msg})
        // }catch(error){
        //     socket.emit('sportStatusChange',{status:'fail'})
        // }
    })
    socket.on('sportStatusChange3',async(data) => {
        // console.log(data)
        let allData =  await getCrkAndAllData()
        const cricket = allData[0].gameList[0].eventList
        let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
        footBall = footBall.eventList
        Tennis = Tennis.eventList
        const resultSearch = cricket.concat(footBall, Tennis);
        let result = resultSearch.find(item => item.eventData.eventId == data.id)
        if(data.status){
            let createData = {
                Id : data.id,
                name : result.eventData.name
            }
            let cataLog
            if(!await featureEventModel.findOne({Id:data.id})){
                cataLog = await featureEventModel.create(createData)
            }
            if(cataLog){
                msg = 'event activated'
                socket.emit('sportStatusChange3',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange3',{status:'success',msg})
            }
           
        }else{
            let cataLog =  await featureEventModel.findOneAndDelete({Id:data.id})
            if(cataLog){
                msg = 'event deactivated'
                socket.emit('sportStatusChange3',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange3',{status:'success',msg})
            }
          
        }
    })
    socket.on('sportStatusChange4',async(data) => {
        // console.log(data)
        let allData =  await getCrkAndAllData()
        const cricket = allData[0].gameList[0].eventList
        let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
        footBall = footBall.eventList
        Tennis = Tennis.eventList
        const resultSearch = cricket.concat(footBall, Tennis);
        let result = resultSearch.find(item => item.eventData.eventId == data.id)
        if(data.status){
            let createData = {
                Id : data.id,
                name : result.eventData.name
            }
            let cataLog
            if(!await InPlayEvent.findOne({Id:data.id})){
                cataLog = await InPlayEvent.create(createData)
            }
            if(cataLog){
                msg = 'event activated'
                socket.emit('sportStatusChange4',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange4',{status:'success',msg})
            }
           
        }else{
            let cataLog =  await InPlayEvent.findOneAndDelete({Id:data.id})
            if(cataLog){
                msg = 'event deactivated'
                socket.emit('sportStatusChange4',{status:'success',msg})
            }else{
                msg = "Something went wrong please try again later!"
                socket.emit('sportStatusChange4',{status:'success',msg})
            }
          
        }
    })

    socket.on("MarketMatch", async(data) => {
        if(data != "LessTheN3"){
            let allData =  await getCrkAndAllData()
            const cricket = allData[0].gameList[0].eventList
            let LiveCricket = cricket.filter(item =>  item.eventData.name.toLowerCase().includes(data.inputValue.toLowerCase()))
            let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
            let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
            footBall = footBall.eventList
            Tennis = Tennis.eventList
            let liveFootBall = footBall.filter(item =>  item.eventData.name.toLowerCase().includes(data.inputValue.toLowerCase()));
            let liveTennis = Tennis.filter(item =>  item.eventData.name.toLowerCase().includes(data.inputValue.toLowerCase()))
            const resultSearch = LiveCricket.concat(liveFootBall, liveTennis);
            // console.log(resultSearch)
            // console.log(data)
            socket.emit("MarketMatch", resultSearch)
        }else{
            let resultSearch = []
            socket.emit("MarketMatch", resultSearch)
        }
    })

    socket.on("eventIdForMarketList", async(data) => {
        // console.log(data.id)
        let allData =  await getCrkAndAllData()
        const cricket = allData[0].gameList[0].eventList
        let footBall = allData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = allData[1].gameList.find(item => item.sport_name === "Tennis")
        footBall = footBall.eventList
        Tennis = Tennis.eventList
        const resultSearch = cricket.concat(footBall, Tennis);
        // console.log(resultSearch)
        let result = resultSearch.find(item => item.eventData.eventId == data.id)
        let data1 = await commissionMarketModel.find()
        // console.log(result, 123)
        socket.emit("eventIdForMarketList", {result, data1})
    })

    socket.on("commissionMarketbyId", async(data) => {
        // console.log(data)
        try{
            if(data.isChecked){
                let data1 = await commissionMarketModel.create({marketId:data.marketId})
            }else{
                let data1 = await commissionMarketModel.findOneAndDelete({marketId:data.marketId})
            }
            socket.emit("commissionMarketbyId", {status:'success',msg:'market status changed successfully'})
        }catch(err){
            console.log(err)
            socket.emit("commissionMarketbyId", {status:'fail',msg:'somothing went wrong'})
        }
    })

    socket.on("claimCommission", async(data) => {
        // console.log(data)
        let user = await User.findById(data.LOGINDATA.LOGINUSER._id) 
        let commissionAmount = await newCommissionModel.aggregate([
            {
                $match:{
                    userId: data.LOGINDATA.LOGINUSER._id,
                    commissionStatus: 'Unclaimed'
                }
            },
            {
                $group: {
                  _id: null, 
                  totalCommission: { $sum: "$commission" } 
                }
              }
        ])
        if(user){
            if(commissionAmount.length != 0 && commissionAmount[0].totalCommission > 0){
                try{
                    // console.log(commissionAmount[0].totalCommission, "COMMISSIONDATA")
                    let commission = commissionAmount[0].totalCommission
                    user = await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id,{$inc:{availableBalance:commission}})
                    let parenet = await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER.parent_id, {$inc:{availableBalance: -commission}})
                    // console.log(user)
                    let desc1 = `Claim Commisiion, ${user.userName}/${parenet.userName}`
                    let desc2 = `Claim Commisiion of chiled user ${user.userName}, ${user.userName}/${parenet.userName}`
                    let childdata = {
                        user_id:data.LOGINDATA.LOGINUSER._id,
                        description : desc1,
                        creditDebitamount : commission,
                        balance : user.availableBalance + commission,
                        date : Date.now(),
                        userName : user.userName,
                        role_type:user.role_type,
                    }
                    let perentData = {
                        user_id:data.LOGINDATA.LOGINUSER.parent_id,
                        description : desc2,
                        creditDebitamount : -commission,
                        balance : parenet.availableBalance - commission,
                        date : Date.now(),
                        userName : parenet.userName,
                        role_type:parenet.role_type
                    }
                    await AccModel.create(childdata)
                    await AccModel.create(perentData)
                    await newCommissionModel.updateMany({userId:data.LOGINDATA.LOGINUSER._id}, {commissionStatus:'Claimed', claimeDate: Date.now()})
                    socket.emit("claimCommission", "Success")
                }catch(err){
                    console.log(err)
                    socket.emit("claimCommission", "error")
                }
            }

           
        }else{
            socket.emit("claimCommission", "error")
        }
    })


    socket.on('getUserDetaisl111', async(data) => {
        try{
            let user = await User.findById(data.dataId)
            let parent = await User.findById(user.parent_id)
            socket.emit("getUserDetaisl111", {user, status:"success", parent})
        }catch(err){
            console.log(err)
            socket.emit("getUserDetaisl111", {message:"err", status:"error"})
        }
    })

    socket.on('BETONEVENT', async(data) => {
        try{
            if(data.LOGINDATA.LOGINUSER.role.roleName == 'Operator'){
                let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
                data.LOGINDATA.LOGINUSER = parentUser
            }
            let page = data.page;
            let skip;
            let limit = 10;
            if(data.type == 'loop'){
                limit *= page
                skip = 0
            }else{
                skip = limit * page
            }
            let Bets = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN" ,
                        eventId: data.id
                    }
                },
                {
                    $sort:{"date":-1}
                },
                {
                    $skip:skip
                },
                {
                    $limit:limit
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
                      "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id.toString()] }
                    }
                  }
                  
            ])
            socket.emit('BETONEVENT', {data:Bets,page,type:data.type, status:'success'})
        }catch(err){
            socket.emit('BETONEVENT', {message:"err", status:"error"})
        }
    })


    socket.on('UerBook', async(data) => {
        console.log('START')
        // let users = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id,role_type:2})
        let users = []
        let falg = false
        let Id 
        if(data.LOGINDATA.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
            data.LOGINDATA.LOGINUSER = parentUser
        }


        if(data.userName){
            let thatUSer = await User.findOne({userName:data.userName})
            if(thatUSer){
                Id = thatUSer.userName
                falg = true
                users = await User.find({parent_id:thatUSer._id, isActive:true , roleName:{$ne:'Operator'}})

                // parentIdOfClickedUser = thatUSer._id
            }
            // users = await User.find({parent_id:data.LOGINDATA.LOGINUSER._id, isActive:true , roleName:{$ne:'Operator'}})
        }else{
            users = await User.find({parent_id:data.LOGINDATA.LOGINUSER._id.toString(), isActive:true , roleName:{$ne:'Operator'}})
            // users = await User.find({userName:'testing_sdm-10000'})
            // users = await User.aggregate([
            //     {
            //         $match: {
            //             parent_id: data.LOGINDATA.LOGINUSER._id.toString(),
            //             isActive: true,
            //             roleName: { $ne: 'Operator' }
            //         }
            //     },
            //     {
            //         $addFields: {
            //             userIdString: { $toString: "$_id" }
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: "betmodels", 
            //             let: { userId: "$userIdString", userName: "$userName" },
            //             pipeline: [
            //                 {
            //                     $match: {
            //                         marketId : data.marketId,
            //                         $expr: {
            //                             $or: [
            //                                 { $in: ["$$userId", "$parentArray.parentUSerId"] },
            //                                 { $eq: ["$$userName", "$userName"] }
            //                             ]
            //                         },
            //                         status: 'OPEN',
            //                     }
            //                 },
            //                 { $limit: 1 }
            //             ],
            //             as: "openBets"
            //         }
            //     },
            //     {
            //         $match: {
            //             openBets: { $not: { $size: 0 } }
            //         }
            //     }
            // ]);
            // parentIdOfClickedUser = data.LOGINDATA.LOGINUSER._id
            Id = data.LOGINDATA.LOGINUSER.userName   

        }
        console.log('MIDDLE')
        console.log(users, "usersusersusers")
        try{
            let newUser = users.map(async(ele)=>{
                let childrenUsername1 = []
                let children
                let parentIdOfClickedUser
                if(falg){
                    childrenUsername1 = await User.distinct("userName", {parentUsers:ele.id})
                    parentIdOfClickedUser = ele.id
                }else{
                    childrenUsername1 = await User.distinct("userName", {parentUsers:ele._id})
                    parentIdOfClickedUser = ele._id
                }
                // children.map(ele1 => {
                //     childrenUsername1.push(ele1.userName) 
                // })
                if(childrenUsername1.length > 0){
                    let Bets = await Bet.aggregate([
                        {
                            $match: {
                                status: "OPEN",
                                marketId: data.marketId,
                                userName:{$in:childrenUsername1}
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    userName: "$userName",
                                    selectionName: "$selectionName",
                                    matchName: "$match",
                                },
                                totalAmount: {
                                    $sum: {
                                        $cond: { 
                                            if : {$eq: ['$bettype2', "BACK"]},
                                            then:{
                                                $cond:{
                                                    if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                    then:{
                                                        $sum: {
                                                            $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
                                                        }
                                                    },
                                                    else:{
                                                        $sum: {
                                                            $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                                        }
                                                    }
                                                }
                                            },
                                            else:{
                                                $cond:{
                                                    if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                    then:{
                                                        $sum: {
                                                           $multiply : [ {$subtract: [ { $multiply: ["$oddValue", "$Stake"] }, "$Stake" ]}, -1]
                                                        }
                                                    },
                                                    else:{
                                                        $sum: { 
                                                            $multiply : [ {$divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]}, -1]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                Stake: {
                                    $sum: { 
                                        $cond: { 
                                            if : {$eq: ['$bettype2', "BACK"]},
                                            then : {
                                                $sum: '$Stake' 
                                            },
                                            else : {
                                                $multiply: ['$Stake', -1]
                                            }
                                        }
                                    }
                                },
                                parentArray: { $first: "$parentArray" },
                                role_type: { $first: "$role_type" },
                                parentId: { $first: "$parentId" },
                            },
                        },
                        {
                            $group: {
                                _id: "$_id.userName",
                                parentArray: { $first: "$parentArray" },
                                role_type: { $first: "$role_type" },
                                parentId: { $first: "$parentId" },
                                selections: {
                                    $push: {
                                        selectionName: "$_id.selectionName",
                                        totalAmount: '$totalAmount',
                                        matchName: "$_id.matchName",
                                        Stake: { $multiply: ["$Stake", -1] },
                                    },
                                },
                            },
                        },
                        {
                            $project: { 
                                _id:0,
                                userName: "$_id",
                                parentArray:"$parentArray",
                                parentId: "$parentId",
                                selections: { 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalAmount",
                                            matchName: "$$selection.matchName",
                                            Stake: "$$selection.Stake",
                                            winAmount: "$$selection.totalAmount",
                                            lossAmount:"$$selection.Stake"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                "userName": 1, 
                            }
                        },
                        {
                            $project: { 
                                _id:0,
                                userName: "$userName",
                                elementUser : ele.userName,
                                parentArray:"$parentArray",
                                parentId: "$parentId",
                                selections2:{ 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalAmount",
                                            matchName: "$$selection.matchName",
                                            Stake: "$$selection.Stake",
                                            winAmount :"$$selection.winAmount",
                                            lossAmount : "$$selection.lossAmount",
                                            winAmount2: {
                                                $reduce:{
                                                    input:'$parentArray',
                                                    initialValue: { value: 0, flag: true },
                                                    in : {
                                                        $cond:{
                                                            if : {
                                                                $and: [
                                                                  { $ne: ['$$this.parentUSerId', ele.id] }, 
                                                                  { $eq: ['$$value.flag', true] } 
                                                                ]
                                                              },
                                                            then : {
                                                                value: { 
                                                                    $cond:{
                                                                        if:{ $eq: ["$$value.value", 0] },
                                                                        then:{
                                                                            $multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                        },
                                                                        else:{
                                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                        }
                                                                    }
                                                                },
                                                                flag: true,
                                                                
                                                            },
                                                            else : {
                                                                value: {
                                                                    $cond : {
                                                                        if : { $eq : ["$$value.value" , 0]},
                                                                        then : {
                                                                            $cond:{
                                                                                if : {$eq : ["$parentId", ele.id]},
                                                                                then:"$$selection.winAmount",
                                                                                else:{$subtract : ["$$selection.winAmount",{$multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]}]}
                                                                            }
                                                                        },
                                                                        else : "$$value.value"
                                                                    }
                                                                },
                                                                flag:false
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            lossAmount2:{
                                                $reduce:{
                                                    input:'$parentArray',
                                                    initialValue: { value: 0, flag: true },
                                                    in : {
                                                        $cond:{
                                                            if : {
                                                                $and: [
                                                                  { $ne: ['$$this.parentUSerId', ele.id] }, 
                                                                  { $eq: ['$$value.flag', true] } 
                                                                ]
                                                              },
                                                            then : {
                                                                value: { 
                                                                    $cond:{
                                                                        if:{ $eq: ["$$value.value", 0] },
                                                                        then:{
                                                                            $multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                        },
                                                                        else:{
                                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                        }
                                                                    }
                                                                },
                                                                flag: true,
                                                                
                                                            },
                                                            else : {
                                                                value: {
                                                                    $cond : {
                                                                        if : { $eq : ["$$value.value" , 0]},
                                                                        then : {
                                                                            $cond:{
                                                                                if : {$eq : ["$parentId", ele.id]},
                                                                                then:"$$selection.lossAmount",
                                                                                else:{$subtract:["$$selection.lossAmount", {$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]}
                                                                            }
                                                                        },
                                                                        else : "$$value.value"
                                                                    }
                                                                },
                                                                flag:false
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$selections2"
                        },
                        {
                            $group: {
                              _id: {
                                elementUser: "$elementUser",
                                selectionName: "$selections2.selectionName"
                              },
                              totalWinAmount: { $sum: "$selections2.winAmount2.value" },
                              totalLossAmount: { $sum: "$selections2.lossAmount2.value" }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              elementUser: "$_id.elementUser",
                              selection: {
                                selectionName: "$_id.selectionName",
                                totalWinAmount: {
                                    $multiply:["$totalWinAmount", -1]
                                },
                                totalLossAmount:{
                                    $multiply:["$totalLossAmount", -1]
                                }
                              }
                            }
                        },
                        {
                            $group: {
                              _id: "$elementUser",
                              selections: { $push: "$selection" }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              elementUser: "$_id",
                              selections: 1
                            }
                        },
                        {
                            $project: { 
                                _id:0,
                                elementUser:"$elementUser",
                                selections: { 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalWinAmount",
                                            winAmount: { 
                                                $add : [
                                                    "$$selection.totalWinAmount", 
                                                    {
                                                        $reduce: {
                                                            input: "$selections",
                                                            initialValue: 0,
                                                            in: {
                                                                $cond: {
                                                                    if: {
                                                                      $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                    },
                                                                    then: { $add: ["$$value", "$$this.totalLossAmount"] },
                                                                    else: {
                                                                        $add: ["$$value", 0] 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                            lossAmount:{ 
                                                $add : [
                                                    "$$selection.totalLossAmount", 
                                                    {
                                                        $reduce: {
                                                            input: "$selections",
                                                            initialValue: 0,
                                                            in: {
                                                                $cond: {
                                                                    if: {
                                                                      $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                    },
                                                                    then: { $add: ["$$value", "$$this.totalWinAmount"] },
                                                                    else: {
                                                                        $add: ["$$value", 0] 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                        }
                                    }
                                }
                            }
                        },
                        
                        
                    ])

                    if(falg){
                        return({User:ele, Bets:Bets, userName:data.userName})
                    }else{
                        return({User:ele, Bets:Bets})
                    }
                }else{
                    if(ele.roleName === "user"){
                        let Bets = await Bet.aggregate([
                            {
                                $match: {
                                    status: "OPEN",
                                    marketId: data.marketId,
                                    userName:ele.userName
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        userName: "$userName",
                                        selectionName: "$selectionName",
                                        matchName: "$match",
                                    },
                                    totalAmount: {
                                        $sum: {
                                            $cond: { 
                                                if : {$eq: ['$bettype2', "BACK"]},
                                                then:{
                                                    $cond:{
                                                        if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                        then:{
                                                            $sum: {
                                                                $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
                                                            }
                                                        },
                                                        else:{
                                                            $sum: {
                                                                $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                                            }
                                                        }
                                                    }
                                                },
                                                else:{
                                                    $cond:{
                                                        if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                        then:{
                                                            $sum: {
                                                               $multiply : [ {$subtract: [ { $multiply: ["$oddValue", "$Stake"] }, "$Stake" ]}, -1]
                                                            }
                                                        },
                                                        else:{
                                                            $sum: { 
                                                                $multiply : [ {$divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]}, -1]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    Stake: {
                                        $sum: { 
                                            $cond: { 
                                                if : {$eq: ['$bettype2', "BACK"]},
                                                then : {
                                                    $sum: '$Stake' 
                                                },
                                                else : {
                                                    $multiply: ['$Stake', -1]
                                                }
                                            }
                                        }
                                    },
                                    parentArray: { $first: "$parentArray" }
                                },
                            },
                            {
                                $group: {
                                    _id: "$_id.userName",
                                    parentArray: { $first: "$parentArray" },
                                    selections: {
                                        $push: {
                                            selectionName: "$_id.selectionName",
                                            totalAmount: "$totalAmount",
                                            matchName: "$_id.matchName",
                                            Stake: { $multiply: ["$Stake", -1] },
                                        },
                                    },
                                },
                            },
                            {
                                $project: { 
                                    _id:0,
                                    userName: "$_id",
                                    parentArray:"$parentArray",
                                    selections: { 
                                        $map: { 
                                            input: "$selections",
                                            as: "selection",
                                            in: { 
                                                selectionName: "$$selection.selectionName",
                                                totalAmount: "$$selection.totalAmount",
                                                matchName: "$$selection.matchName",
                                                Stake: "$$selection.Stake",
                                                winAmount: "$$selection.totalAmount",
                                                lossAmount:"$$selection.Stake"
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $sort: {
                                    "userName": 1, 
                                }
                            },
                            {
                                $unwind: "$selections"
                            },
                            {
                                $group: {
                                  _id: {
                                    elementUser: "$userName",
                                    selectionName: "$selections.selectionName"
                                  },
                                  totalWinAmount: { $sum: "$selections.winAmount" },
                                  totalLossAmount: { $sum: "$selections.lossAmount" }
                                }
                            },
                            {
                                $project: {
                                  _id: 0,
                                  elementUser: "$_id.elementUser",
                                  selection: {
                                    selectionName: "$_id.selectionName",
                                    totalWinAmount: "$totalWinAmount",
                                    totalLossAmount: "$totalLossAmount"
                                  }
                                }
                            },
                            {
                                $group: {
                                  _id: "$elementUser",
                                  selections: { $push: "$selection" }
                                }
                            },
                            {
                                $project: {
                                  _id: 0,
                                  elementUser: "$_id",
                                  selections: 1
                                }
                            },
                            {
                                $project: { 
                                    _id:0,
                                    elementUser:"$elementUser",
                                    selections: { 
                                        $map: { 
                                            input: "$selections",
                                            as: "selection",
                                            in: { 
                                                selectionName: "$$selection.selectionName",
                                                totalAmount: "$$selection.totalWinAmount",
                                                winAmount: { 
                                                    $add : [
                                                        "$$selection.totalWinAmount", 
                                                        {
                                                            $reduce: {
                                                                input: "$selections",
                                                                initialValue: 0,
                                                                in: {
                                                                    $cond: {
                                                                        if: {
                                                                          $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                        },
                                                                        then: { $add: ["$$value", "$$this.totalLossAmount"] },
                                                                        else: {
                                                                            $add: ["$$value", 0] 
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                lossAmount:{ 
                                                    $add : [
                                                        "$$selection.totalLossAmount", 
                                                        {
                                                            $reduce: {
                                                                input: "$selections",
                                                                initialValue: 0,
                                                                in: {
                                                                    $cond: {
                                                                        if: {
                                                                          $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                        },
                                                                        then: { $add: ["$$value", "$$this.totalWinAmount"] },
                                                                        else: {
                                                                            $add: ["$$value", 0] 
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                            }
                                        }
                                    }
                                }
                            },

                        ])

                        return({User:ele, Bets:Bets, status:'User', userName:data.userName})

                    }
                }
            })
            let resultPromise = await Promise.all(newUser)
            console.log(resultPromise, "resultPromiseresultPromise")
            const result = resultPromise.filter(item => item && item.Bets && item.Bets.length > 0);
            console.log(result, "resultresultresultresult")
            
            let matchName2 = await Bet.findOne({marketId: data.marketId})
            let matchName
            let sport
            if(matchName2){
                matchName = matchName2.match
                sport = matchName2.betType
            }

           socket.emit('UerBook', {Bets:result,type:data.type,newData:data.newData, matchName, Id,sport});
        }catch(err){
            console.log(err)
            socket.emit('UerBook', {message:"err", status:"error"})
        }
    })
    
    socket.on('Book', async(data) => {
        // console.log(data, "datadatadatadata")
        let users = []
        let falg = false
        let Id 
        if(data.LOGINDATA.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
            data.LOGINDATA.LOGINUSER = parentUser
        }
        let loginId = data.LOGINDATA.LOGINUSER._id.toString()
        if(data.userName){
            let thatUSer = await User.findOne({userName:data.userName})
            if(thatUSer){
                Id = thatUSer.userName
                falg = true
                users = await User.find({parent_id:thatUSer._id, isActive:true , roleName:{$ne:'Operator'}})
            }
            // users = await User.find({parent_id:data.LOGINDATA.LOGINUSER._id, isActive:true , roleName:{$ne:'Operator'}})
        }else{
            users = await User.find({parent_id:data.LOGINDATA.LOGINUSER._id.toString(), isActive:true , roleName:{$ne:'Operator'}})
            Id = data.LOGINDATA.LOGINUSER.userName

        }

        try{
            let newUser = users.map(async(ele)=>{ 
                let childrenUsername1 = []
                let children
                if(falg){
                    children = await User.find({parentUsers:ele.id})
                }else{
                    children = await User.find({parentUsers:ele._id})
                }
                children.map(ele1 => {
                    childrenUsername1.push(ele1.userName) 
                })
                if(childrenUsername1.length > 0){
                    let Bets = await Bet.aggregate([
                        {
                            $match: {
                                status: "OPEN",
                                marketId: data.marketId,
                                userName:{$in:childrenUsername1}
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    userName: "$userName",
                                    selectionName: "$selectionName",
                                    matchName: "$match",
                                },
                                totalAmount: {
                                    $sum: {
                                        $cond: { 
                                            if : {$eq: ['$bettype2', "BACK"]},
                                            then:{
                                                $cond:{
                                                    if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                    then:{
                                                        $sum: {
                                                            $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
                                                        }
                                                    },
                                                    else:{
                                                        $sum: {
                                                            $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                                        }
                                                    }
                                                }
                                            },
                                            else:{
                                                $cond:{
                                                    if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                    then:{
                                                        $sum: {
                                                           $multiply : [ {$subtract: [ { $multiply: ["$oddValue", "$Stake"] }, "$Stake" ]}, -1]
                                                        }
                                                    },
                                                    else:{
                                                        $sum: { 
                                                            $multiply : [ {$divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]}, -1]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                Stake: {
                                    $sum: { 
                                        $cond: { 
                                            if : {$eq: ['$bettype2', "BACK"]},
                                            then : {
                                                $sum: '$Stake' 
                                            },
                                            else : {
                                                $multiply: ['$Stake', -1]
                                            }
                                        }
                                    }
                                },
                                parentArray: { $first: "$parentArray" },
                                role_type : { $first: "$role_type" }
                            }
                        },
                        {
                            $group: {
                                _id: "$_id.userName",
                                parentArray: { $first: "$parentArray" },
                                role_type : { $first: "$role_type" },
                                selections: {
                                    $push: {
                                        selectionName: "$_id.selectionName",
                                        totalAmount: "$totalAmount",
                                        matchName: "$_id.matchName",
                                        Stake: { $multiply: ["$Stake", -1] },
                                    }
                                }
                            }
                        },
                        {
                            $project: { 
                                _id:0,
                                userName: "$_id",
                                parentArray:"$parentArray",
                                role_type : "$role_type",
                                selections: { 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalAmount",
                                            matchName: "$$selection.matchName",
                                            Stake: "$$selection.Stake",
                                            winAmount: "$$selection.totalAmount",
                                            lossAmount:"$$selection.Stake"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                "userName": 1, 
                            }
                        },
                        {
                            $project: { 
                                _id:0,
                                userName: "$userName",
                                elementUser : ele.userName,
                                parentArray:"$parentArray",
                                selections2:{ 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalAmount",
                                            matchName: "$$selection.matchName",
                                            Stake: "$$selection.Stake",
                                            winAmount :"$$selection.winAmount",
                                            lossAmount : "$$selection.lossAmount",
                                            winAmount2: {
                                                $reduce:{
                                                    input:'$parentArray',
                                                    initialValue: { value: 0, flag: true },
                                                    in : {
                                                        $cond:{
                                                            if : {
                                                                $and: [
                                                                  { $ne: ['$$this.parentUSerId', loginId] }, 
                                                                  { $eq: ['$$value.flag', true] } 
                                                                ]
                                                              },
                                                            then : {
                                                                value: { 
                                                                    $cond:{
                                                                        if:{ $eq: ["$$value.value", 0] },
                                                                        then:{
                                                                            $multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                        },
                                                                        else:{
                                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                        }
                                                                    }
                                                                },
                                                                flag: true,
                                                                
                                                            },
                                                            else : {
                                                                value: {
                                                                    $cond : {
                                                                        if : { $eq : ["$$value.value" , 0]},
                                                                        then : {
                                                                            $subtract : ["$$selection.winAmount",{$multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                                        },
                                                                        else : "$$value.value"
                                                                    }
                                                                },
                                                                flag:false
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            lossAmount2:{
                                                $reduce:{
                                                    input:'$parentArray',
                                                    initialValue: { value: 0, flag: true },
                                                    in : {
                                                        $cond:{
                                                            if : {
                                                                $and: [
                                                                  { $ne: ['$$this.parentUSerId', loginId] }, 
                                                                  { $eq: ['$$value.flag', true] } 
                                                                ]
                                                              },
                                                            then : {
                                                                value: { 
                                                                    $cond:{
                                                                        if:{ $eq: ["$$value.value", 0] },
                                                                        then:{
                                                                            $multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                        },
                                                                        else:{
                                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                        }
                                                                    }
                                                                },
                                                                flag: true,
                                                                
                                                            },
                                                            else : {
                                                                value: {
                                                                    $cond : {
                                                                        if : { $eq : ["$$value.value" , 0]},
                                                                        then : {
                                                                            $subtract:["$$selection.lossAmount", {$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                                        },
                                                                        else : "$$value.value"
                                                                    }
                                                                },
                                                                flag:false
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$selections2"
                        },
                        {
                            $group: {
                              _id: {
                                elementUser: "$elementUser",
                                selectionName: "$selections2.selectionName"
                              },
                              totalWinAmount: { $sum: "$selections2.winAmount2.value" },
                              totalLossAmount: { $sum: "$selections2.lossAmount2.value" }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              elementUser: "$_id.elementUser",
                              selection: {
                                selectionName: "$_id.selectionName",
                                totalWinAmount: {
                                    $multiply:["$totalWinAmount", -1]
                                },
                                totalLossAmount:{
                                    $multiply:["$totalLossAmount", -1]
                                }
                              }
                            }
                        },
                        {
                            $group: {
                              _id: "$elementUser",
                              selections: { $push: "$selection" }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              elementUser: "$_id",
                              selections: 1
                            }
                        },
                        {
                            $project: { 
                                _id:0,
                                elementUser:"$elementUser",
                                selections: { 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalWinAmount",
                                            winAmount: { 
                                                $add : [
                                                    "$$selection.totalWinAmount", 
                                                    {
                                                        $reduce: {
                                                            input: "$selections",
                                                            initialValue: 0,
                                                            in: {
                                                                $cond: {
                                                                    if: {
                                                                      $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                    },
                                                                    then: { $add: ["$$value", "$$this.totalLossAmount"] },
                                                                    else: {
                                                                        $add: ["$$value", 0] 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                            lossAmount:{ 
                                                $add : [
                                                    "$$selection.totalLossAmount", 
                                                    {
                                                        $reduce: {
                                                            input: "$selections",
                                                            initialValue: 0,
                                                            in: {
                                                                $cond: {
                                                                    if: {
                                                                      $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                    },
                                                                    then: { $add: ["$$value", "$$this.totalWinAmount"] },
                                                                    else: {
                                                                        $add: ["$$value", 0] 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                        }
                                    }
                                }
                            }
                        },
                    ])


                    if(falg){
                        return({User:ele, Bets:Bets, userName:data.userName})
                    }else{
                        return({User:ele, Bets:Bets})
                    }

                }else{
                    if(ele.roleName === "user"){ 
                        let Bets = await Bet.aggregate([
                            {
                                $match: {
                                    status: "OPEN",
                                    marketId: data.marketId,
                                    userName:ele.userName
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        userName: "$userName",
                                        selectionName: "$selectionName",
                                        matchName: "$match",
                                    },
                                    totalAmount: {
                                        $sum: {
                                            $cond: { 
                                                if : {$eq: ['$bettype2', "BACK"]},
                                                then:{
                                                    $cond:{
                                                        if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                        then:{
                                                            $sum: {
                                                                $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
                                                            }
                                                        },
                                                        else:{
                                                            $sum: {
                                                                $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                                            }
                                                        }
                                                    }
                                                },
                                                else:{
                                                    $cond:{
                                                        if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                        then:{
                                                            $sum: {
                                                               $multiply : [ {$subtract: [ { $multiply: ["$oddValue", "$Stake"] }, "$Stake" ]}, -1]
                                                            }
                                                        },
                                                        else:{
                                                            $sum: { 
                                                                $multiply : [ {$divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]}, -1]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    Stake: {
                                        $sum: { 
                                            $cond: { 
                                                if : {$eq: ['$bettype2', "BACK"]},
                                                then : {
                                                    $sum: '$Stake' 
                                                },
                                                else : {
                                                    $multiply: ['$Stake', -1]
                                                }
                                            }
                                        }
                                    },
                                    parentArray: { $first: "$parentArray" }
                                },
                            },
                            {
                                $group: {
                                    _id: "$_id.userName",
                                    parentArray: { $first: "$parentArray" },
                                    selections: {
                                        $push: {
                                            selectionName: "$_id.selectionName",
                                            totalAmount: "$totalAmount",
                                            matchName: "$_id.matchName",
                                            Stake: { $multiply: ["$Stake", -1] },
                                        },
                                    },
                                },
                            },
                            {
                                $project: { 
                                    _id:0,
                                    userName: "$_id",
                                    parentArray:"$parentArray",
                                    selections: { 
                                        $map: { 
                                            input: "$selections",
                                            as: "selection",
                                            in: { 
                                                selectionName: "$$selection.selectionName",
                                                totalAmount: "$$selection.totalAmount",
                                                matchName: "$$selection.matchName",
                                                Stake: "$$selection.Stake",
                                                winAmount: "$$selection.totalAmount",
                                                lossAmount:"$$selection.Stake"
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $sort: {
                                    "userName": 1, 
                                }
                            },
                            {
                                $project: { 
                                    _id:0,
                                    userName: "$userName",
                                    elementUser : ele.userName,
                                    parentArray:"$parentArray",
                                    selections2:{ 
                                        $map: { 
                                            input: "$selections",
                                            as: "selection",
                                            in: { 
                                                selectionName: "$$selection.selectionName",
                                                totalAmount: "$$selection.totalAmount",
                                                matchName: "$$selection.matchName",
                                                Stake: "$$selection.Stake",
                                                winAmount :"$$selection.winAmount",
                                                lossAmount : "$$selection.lossAmount",
                                                winAmount2: {
                                                    $reduce:{
                                                        input:'$parentArray',
                                                        initialValue: { value: 0, flag: true },
                                                        in : {
                                                            $cond:{
                                                                if : {
                                                                    $and: [
                                                                      { $ne: ['$$this.parentUSerId', loginId] }, 
                                                                      { $eq: ['$$value.flag', true] } 
                                                                    ]
                                                                  },
                                                                then : {
                                                                    value: { 
                                                                        $cond:{
                                                                            if:{ $eq: ["$$value.value", 0] },
                                                                            then:{
                                                                                $multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                            },
                                                                            else:{
                                                                                $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                            }
                                                                        }
                                                                    },
                                                                    flag: true,
                                                                    
                                                                },
                                                                else : {
                                                                    value: {
                                                                        $cond : {
                                                                            if : { $eq : ["$$value.value" , 0]},
                                                                            then : {
                                                                                $subtract : ["$$selection.winAmount",{$multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                                            },
                                                                            else : "$$value.value"
                                                                        }
                                                                    },
                                                                    flag:false
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                lossAmount2:{
                                                    $reduce:{
                                                        input:'$parentArray',
                                                        initialValue: { value: 0, flag: true },
                                                        in : {
                                                            $cond:{
                                                                if : {
                                                                    $and: [
                                                                      { $ne: ['$$this.parentUSerId', loginId] }, 
                                                                      { $eq: ['$$value.flag', true] } 
                                                                    ]
                                                                  },
                                                                then : {
                                                                    value: { 
                                                                        $cond:{
                                                                            if:{ $eq: ["$$value.value", 0] },
                                                                            then:{
                                                                                $multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                            },
                                                                            else:{
                                                                                $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                            }
                                                                        }
                                                                    },
                                                                    flag: true,
                                                                    
                                                                },
                                                                else : {
                                                                    value: {
                                                                        $cond : {
                                                                            if : { $eq : ["$$value.value" , 0]},
                                                                            then : {
                                                                                $subtract:["$$selection.lossAmount", {$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                                            },
                                                                            else : "$$value.value"
                                                                        }
                                                                    },
                                                                    flag:false
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $unwind: "$selections2"
                            },
                            {
                                $group: {
                                  _id: {
                                    elementUser: "$elementUser",
                                    selectionName: "$selections2.selectionName"
                                  },
                                  totalWinAmount: { $sum: "$selections2.winAmount2.value" },
                                  totalLossAmount: { $sum: "$selections2.lossAmount2.value" }
                                }
                            },
                            {
                                $project: {
                                  _id: 0,
                                  elementUser: "$_id.elementUser",
                                  selection: {
                                    selectionName: "$_id.selectionName",
                                    totalWinAmount: {
                                        $multiply:["$totalWinAmount", -1]
                                    },
                                    totalLossAmount:{
                                        $multiply:["$totalLossAmount", -1]
                                    }
                                  }
                                }
                            },
                            {
                                $group: {
                                  _id: "$elementUser",
                                  selections: { $push: "$selection" }
                                }
                            },
                            {
                                $project: {
                                  _id: 0,
                                  elementUser: "$_id",
                                  selections: 1
                                }
                            },
                            {
                                $project: { 
                                    _id:0,
                                    elementUser:"$elementUser",
                                    selections: { 
                                        $map: { 
                                            input: "$selections",
                                            as: "selection",
                                            in: { 
                                                selectionName: "$$selection.selectionName",
                                                totalAmount: "$$selection.totalWinAmount",
                                                winAmount: { 
                                                    $add : [
                                                        "$$selection.totalWinAmount", 
                                                        {
                                                            $reduce: {
                                                                input: "$selections",
                                                                initialValue: 0,
                                                                in: {
                                                                    $cond: {
                                                                        if: {
                                                                          $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                        },
                                                                        then: { $add: ["$$value", "$$this.totalLossAmount"] },
                                                                        else: {
                                                                            $add: ["$$value", 0] 
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                lossAmount:{ 
                                                    $add : [
                                                        "$$selection.totalLossAmount", 
                                                        {
                                                            $reduce: {
                                                                input: "$selections",
                                                                initialValue: 0,
                                                                in: {
                                                                    $cond: {
                                                                        if: {
                                                                          $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                        },
                                                                        then: { $add: ["$$value", "$$this.totalWinAmount"] },
                                                                        else: {
                                                                            $add: ["$$value", 0] 
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                            }
                                        }
                                    }
                                }
                            }

                        ])
                        // console.log(Bets, "BETSBETS")
                        // console.log(Bets[0].selections, "selectionsselections")
                        if(Bets.length > 0){

                            return({User:ele, Bets:Bets, status:'User', userName:data.userName})
                        }
                    }
                }
            })


            let resultPromise = await Promise.all(newUser)
            let result = []
            for(let i = 0;i<resultPromise.length;i++){
                if(resultPromise[i] && resultPromise[i].Bets.length > 0){
                    result.push(resultPromise[i])
                }
            }
            let matchName2 = await Bet.findOne({marketId: data.marketId})
            let matchName
            let sport
            if(matchName2){
                matchName = matchName2.match
                sport = matchName2.betType
            }

           socket.emit('Book', {Bets:result,type:data.type,newData:data.newData, matchName, Id,sport});
        }catch(err){
            console.log(err)
            socket.emit('Book', {message:"err", status:"error"})
        }
    })

    socket.on('FANCYBOOK', async(data) => {
        // console.log(data, "FANCYDATA")
        let childrenUsername1 = []
        // let loginUser = await User.findById()
        if(data.LOGINDATA.LOGINUSER.role.roleName == 'Operator'){
            let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
            data.LOGINDATA.LOGINUSER = parentUser
            data.id = parentUser._id.toString()
        }
        let forcheck = await Bet.find({marketId: data.marketId}) 
        let children = await User.find({parentUsers:data.id, role_type: 5})
        children.map(ele1 => {
            childrenUsername1.push(ele1.userName) 
        })
        // let checkBET = await Bet.findOne({marketId:data.marketId})
        if(forcheck.length > 0){
            if(data.marketId.slice(-2).startsWith('OE')){
                let betData = await Bet.aggregate([
                    {
                        $match: {
                            status: "OPEN",
                            marketId: data.marketId,
                            userName:{$in:childrenUsername1}
                        }
                    },
                    {
                        $group: { 
                            _id: {
                                "secId":"$secId",
                                "userName":"$userName"
                            },
                            parentArray: { $first: "$parentArray" },
                            totalAmount: { 
                                $sum: '$returns'
                            },
                            totalWinAmount:{
                                $sum: { 
                                    $cond : {
                                        if : {$eq: ["$secId", "odd_Even_Yes"]},
                                    then:{
                                        $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                    },
                                    else:"$Stake"
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            userName: "$_id.userName",
                            secId: "$_id.secId",
                            parentArray: "$parentArray",
                            totalAmount1: "$totalAmount",
                            totalWinAmount1: "$totalWinAmount",
                            totalAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', data.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalAmount",{$multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            },
                            totalWinAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', data.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalWinAmount",{$multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:"$secId",
                            totalAmount:{
                                $sum: '$totalAmount.value'
                            },
                            totalWinAmount:{
                                $sum: '$totalWinAmount.value'
                            },
    
                        }
                    },
                    {
                        $group: {
                          _id: null,
                          data: {
                            $push: {
                              _id: "$_id",
                              totalAmount: {
                                $multiply:["$totalAmount", -1]
                              },
                              totalWinAmount: {
                                $multiply:["$totalWinAmount", -1]
                              }
                            }
                          }
                        }
                      },
                      {
                        $project: {
                          _id: 0,
                          data: {
                            $map: {
                              input: "$data",
                              as: "item",
                              in: {
                                _id: "$$item._id",
                                totalAmount: "$$item.totalAmount",
                                totalWinAmount: "$$item.totalWinAmount",
                                totalWinAmount2: {
                                  $add: ["$$item.totalWinAmount", {
                                    $reduce: { 
                                        input: "$data",
                                        initialValue: 0,
                                        in: {
                                            $cond: {
                                                if: {
                                                    $ne: ["$$this._id", "$$item._id"] 
                                                },
                                                then: { $add: ["$$value", "$$this.totalAmount"] },
                                                else: {
                                                    $add: ["$$value", 0] 
                                                }
                                            }
                                        }
                                    }
                                  }]
                                }
                              }
                            }
                          }
                        }
                      }
                ])
    
                // console.log(betData, "betData")
                // console.log(betData[0].data, "betData[0].databetData[0].databetData[0].data")
                socket.emit('FANCYBOOK', {betData:betData[0].data, type:'ODD'})
            }else{
                // console.log('WORKING123', data)
                let betData = await Bet.aggregate([
                    {
                        $match: {
                            status: "OPEN",
                            marketId: data.marketId,
                            userName:{$in:childrenUsername1}
                        }
                    },
                    {
                        $addFields: {
                          runs: {
                            $toInt: {
                              $arrayElemAt: [
                                { $split: ["$selectionName", "@"] },
                                1 
                              ]
                            }
                          }
                        }
                    },
                    {
                        $group: { 
                            _id: {
                                "secId":"$secId",
                                "userName":"$userName",
                                "runs":"$runs"
                            },
                            // uniqueRuns: { $addToSet: "$runs" },
                            parentArray: { $first: "$parentArray" },
                            totalAmount: { 
                                $sum: '$returns'
                            },
                            totalWinAmount:{
                                $sum: { 
                                    $cond : {
                                        if : {$eq: ["$secId", "odd_Even_Yes"]},
                                    then:{
                                        $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                    },
                                    else:"$Stake"
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            userName: "$_id.userName",
                            secId: "$_id.secId",
                            runs: "$_id.runs",
                            parentArray: "$parentArray",
                            totalAmount1: "$totalAmount",
                            totalWinAmount1: "$totalWinAmount",
                            uniqueRuns:"$uniqueRuns",
                            totalAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', data.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalAmount",{$multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            },
                            totalWinAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', data.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalWinAmount",{$multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            secId: "$secId",
                            runs: "$runs",
                            totalAmount:"$totalAmount.value",
                            totalWinAmount:"$totalWinAmount.value",
                            uniqueRuns:"$uniqueRuns",
                        }
                    },
                    {
                        $group: {
                          _id: null,
                          uniqueRuns: { $addToSet: "$runs" },
                          data: { $push: "$$ROOT" } 
                        }
                      },
                      {
                        $project: {
                          _id: 0, 
                          uniqueRuns: 1,
                          data: 1 
                        }
                      },
                      {
                        $unwind: "$uniqueRuns" 
                      },
                      {
                        $sort: {
                          "uniqueRuns": 1 
                        }
                      },
                      {
                        $group: {
                          _id: null,
                          uniqueRuns: { $push: "$uniqueRuns" },
                          data: { $push: "$data" }
                        }
                      },
                    
                    
                    
                  ])

                  betData =  betData[0]
                let dataToshow = []
                for(let i = 0; i < betData.uniqueRuns.length; i++){ 
                    if(betData.uniqueRuns.length === 1){
                        let data1 = {}
                        data1.message = `${betData.uniqueRuns[i] - 1} or less`
                        let sum = 0
                        for(let j = 0; j < betData.data[0].length; j++){
                            if(betData.data[0][j].secId === "odd_Even_No"){
                                sum += betData.data[0][j].totalWinAmount
                            }else{
                                sum += betData.data[0][j].totalAmount
                            }
                        }
                        data1.sum = sum
                        dataToshow.push(data1)
                        let data2 = {}
                        let sum2 = 0
                        data2.message = `${betData.uniqueRuns[i]} or more`
                        for(let j = 0; j < betData.data[0].length; j++){
                            if(betData.data[0][j].secId === "odd_Even_Yes"){
                                sum2 += betData.data[0][j].totalWinAmount
                            }else{
                                sum2 += betData.data[0][j].totalAmount
                            }
                        }
                        data2.sum = sum2
                        dataToshow.push(data2)
                    }else{
                        if(i === 0){
                            let data = {}
                            data.message = `${betData.uniqueRuns[i] - 1} or less`
                            let sum = 0
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_No" && betData.data[0][j].runs >= (betData.uniqueRuns[i])){
                                    sum += betData.data[0][j].totalWinAmount
                                }else{
                                    sum += betData.data[0][j].totalAmount
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                        }else if (i === (betData.uniqueRuns.length - 1)){
                            let data = {}
                            let data1 = {}
                            if(betData.uniqueRuns[i - 1] == (betData.uniqueRuns[i] - 1)){
                                data.message = `${betData.uniqueRuns[i - 1]}`
                            }else{
                                data.message = `between ${betData.uniqueRuns[i - 1]} and ${betData.uniqueRuns[i] - 1}`
                            }
                            let sum = 0
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_No" && betData.data[0][j].runs == betData.uniqueRuns[i]){
                                    sum += betData.data[0][j].totalWinAmount
                                }else if (betData.data[0][j].secId === "odd_Even_Yes" && betData.data[0][j].runs == betData.uniqueRuns[i - 1]){
                                    sum += betData.data[0][j].totalWinAmount
                                }
                                else{
                                    sum += betData.data[0][j].totalAmount
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                            let sum2 = 0
                            data1.message = `${betData.uniqueRuns[i]} or more`
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_Yes" && betData.data[0][j].runs <= betData.uniqueRuns[i]){
                                    sum2 += betData.data[0][j].totalWinAmount
                                }
                                else{
                                    sum2 += betData.data[0][j].totalAmount
                                }
                            }
                            data1.sum = sum2
                            dataToshow.push(data1)
                        }else{
                            let data = {}
                            if(betData.uniqueRuns[i - 1] == (betData.uniqueRuns[i] - 1)){
                                data.message = `${betData.uniqueRuns[i] - 1}`
                            }else{
                                data.message = `between ${betData.uniqueRuns[i - 1]} and ${betData.uniqueRuns[i] - 1}`
                            }
                            let sum = 0
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_No" && betData.data[0][j].runs == betData.uniqueRuns[i]){
                                    sum += betData.data[0][j].totalWinAmount
                                }else if (betData.data[0][j].secId === "odd_Even_Yes" && betData.data[0][j].runs == betData.uniqueRuns[i - 1]){
                                    sum += betData.data[0][j].totalWinAmount
                                }
                                else{
                                    sum += betData.data[0][j].totalAmount
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                        }
                    }
                }
                // console.log(dataToshow, "betData")
                socket.emit('FANCYBOOK', {betData : dataToshow, type:'Fancy'})
            }

        }else{
            socket.emit('FANCYBOOK', {type:'notFound'})
        }


    })

    socket.on("updateUserDetailssss", async(data) => {
        try{
            let user = await User.findByIdAndUpdate(data.id, {contact:data.contact, email:data.email})
            socket.emit('updateUserDetailssss', user)
        }catch(err){
            console.log(err)
            socket.emit('updateUserDetailssss', {message:"err", status:"error"})
        }
    })


    socket.on('gameAnalysis', async(data) => {
        // console.log(data.Sport)

        let me = data.USER

        let page = data.page;
        let limit = 10
        let childrenUsername = []
        let children
        if(data.USER.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', {parentUsers:me.parent_id});
            // children = await User.find({parentUsers:me.parent_id})
        }else{
            childrenUsername = await User.distinct('userName', {parentUsers:me._id});
            
            // children = await User.find({parentUsers:me._id})

        }
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
        let role_type = []
        let roles
        if(data.USER.roleName == 'Operator'){
            let parentUser = await User.findById(data.USER.parent_id)
            roles = await Role.find({role_level: {$gt:parentUser.role.role_level}});
        }else{
            roles = await Role.find({role_level: {$gt:me.role.role_level}});
        }
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }

        let filter = {}
        if(data.from_date && data.to_date){
            filter.date = {$gte:new Date(data.from_date),$lte:new Date(data.to_date)}
        }else if(data.from_date && !data.to_date){
            filter.date = {$gte:new Date(data.from_date)}
        }else if(data.to_date && !data.from_date){
            filter.date = {$lte:new Date(data.to_date)}
        }
        if(data.Sport != "All"){
            filter.eventId = data.Sport
        }
        if(data.market != "All"){
            if(data.market === "Match Odds"){
                filter.marketName = { '$regex': '^Match', '$options': 'i' }
            }else if (data.market === "Bookmaker 0%Comm"){
                filter.marketName = { '$regex': '^Bookma', '$options': 'i' }
            }else if (data.market === "Fancy"){
                filter.marketName = { '$not': { '$regex': '^(match|bookma)', '$options': 'i' } }
            }
        }

        // console.log(filter)
        const gameAnalist = await Bet.aggregate([
            {
                $match:filter
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userName',
                    foreignField:'userName',
                    as:'userDetails'
                }
            },
            {
                $unwind:'$userDetails'
            },
            {
                $match:{
                    'userDetails.isActive':true,
                    'userDetails.roleName':{$ne:'Admin'},
                    'userDetails.role_type':{$in:role_type},
                    'userDetails.parentUsers':{$elemMatch:{$eq:me._id}}
                }
            },
            {
                $group:{
                    _id:{
                        userName:'$userName',
                        whiteLabel:'$userDetails.whiteLabel'
                    },
                    betCount:{$sum:1},
                    loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                    won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                    open:{$sum:{$cond:[{$in:['$status',['MAP','OPEN']]},1,0]}},
                    void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                    returns:{$sum:{$cond:[{$in:['$status',['LOSS','WON']]},'$returns',0]}}
                    
                }
            },
            {
                $group:{
                    _id:'$_id.whiteLabel',
                    Total_User:{$sum:1},
                    betcount:{$sum:'$betCount'},
                    loss:{$sum:'$loss'},
                    won:{$sum:'$won'},
                    open:{$sum:'$open'},
                    void:{$sum:'$void'},
                    returns:{$sum:'$returns'}
                }
            },
            {
                $sort: {
                    betcount: -1 ,
                    open : -1,
                    won : -1,
                    loss : -1,
                    Total_User:-1
                }
            },
            {
                $skip: page * limit
            },
            {
                $limit: limit 
            }
        ])

        filter.userName = {$in:childrenUsername}

        const marketAnalist =  await Bet.aggregate([
            {
                $match:filter
            },
            {
                $group:{
                    _id:'$marketName',
                    betcount:{$sum:1},
                    loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                    won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                    open:{$sum:{$cond:[{$in:['$status',['MAP','OPEN']]},1,0]}},
                    void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                    returns:{$sum:{$cond:[{$in:['$status',['LOSS','WON']]},'$returns',0]}}
                    
                }
            },
            {
                $sort: {
                    betcount: -1 ,
                    open : -1,
                    won : -1,
                    loss : -1,
                    Total_User:-1
                }
            },
            {
                $skip: page * limit
            },
            {
                $limit: limit 
            }
        ])
        // console.log(gameAnalist)
        socket.emit('gameAnalysis', {gameAnalist,marketAnalist, page,filter})
    })

    socket.on('matchOdds',async(data)=>{
        let page = data.page;
        let limit = 10
        // console.log(me)

        let filter = {}
        if(data.from_date && data.to_date){
            filter.date = {$gte:new Date(data.from_date),$lte:new Date(data.to_date)}
        }else if(data.from_date && !data.to_date){
            filter.date = {$gte:new Date(data.from_date)}
        }else if(data.to_date && !data.from_date){
            filter.date = {$lte:new Date(data.to_date)}
        }
        if(data.Sport != "All"){
            filter.eventId = data.Sport
        }
        if(data.market != "All"){
            if(data.market === "Match Odds"){
                filter.marketName = { '$regex': '^Match', '$options': 'i' }
            }else if (data.market === "Bookmaker 0%Comm"){
                filter.marketName = { '$regex': '^Bookma', '$options': 'i' }
            }else if (data.market === "Fancy"){
                filter.marketName = { '$not': { '$regex': '^(match|bookma)', '$options': 'i' } }
            }
        }

        const matchOdds =  await Bet.aggregate([
            {
                $match:filter
            },
            {
                $sort: {
                    date: -1 
                }
            },
            {
                $skip: page * limit
            },
            {
                $limit: limit 
            }
        ])

        socket.emit('matchOdds',{matchOdds,page})
    })
    socket.on('matchOddsOwn',async(data)=>{
        let own = data.own
        let page = data.page;
        let limit = 10
        let filter = {}
        filter.userName = own
        if(data.from_date && data.to_date){
            filter.date = {$gte:new Date(data.from_date),$lte:new Date(data.to_date)}
        }else if(data.from_date && !data.to_date){
            filter.date = {$gte:new Date(data.from_date)}
        }else if(data.to_date && !data.from_date){
            filter.date = {$lte:new Date(data.to_date)}
        }
        if(data.Sport != "All"){
            filter.eventId = data.Sport
        }

        if(data.market != "All"){
            if(data.market === "Match Odds"){
                filter.marketName = { '$regex': '^Match', '$options': 'i' }
            }else if (data.market === "Bookmaker 0%Comm"){
                filter.marketName = { '$regex': '^Bookma', '$options': 'i' }
            }else if (data.market === "Fancy"){
                filter.marketName = { '$not': { '$regex': '^(match|bookma)', '$options': 'i' } }
            }
        }

        const matchOdds =  await Bet.aggregate([
            {
                $match:filter
            },
            {
                $sort: {
                    date: -1 
                }
            },
            {
                $skip: page * limit
            },
            {
                $limit: limit 
            }
        ])

        socket.emit('matchOddsOwn',{matchOdds,page})
    })

    socket.on('childGameAnalist',async(data)=>{
        // console.log(data)
        let roleType = data.roleType;
        let parent = data.parent
        let users;
        let breadcum;
        let type;
        let page = data.page;
        let limit = 10
        let roles;
        let role_type =[]
        let filter = {}
        if(data.from_date && data.to_date){
            filter.date = {$gte:new Date(data.from_date),$lte:new Date(data.to_date)}
        }else if(data.from_date && !data.to_date){
            filter.date = {$gte:new Date(data.from_date)}
        }else if(data.to_date && !data.from_date){
            filter.date = {$lte:new Date(data.to_date)}
        }
        if(data.Sport != "All"){
            filter.eventId = data.Sport
        }
        if(data.market != "All"){
            if(data.market === "Match Odds"){
                filter.marketName = { '$regex': '^Match', '$options': 'i' }
            }else if (data.market === "Bookmaker 0%Comm"){
                filter.marketName = { '$regex': '^Bookma', '$options': 'i' }
            }else if (data.market === "Fancy"){
                filter.marketName = { '$not': { '$regex': '^(match|bookma)', '$options': 'i' } }
            }
        }
        if(roleType == '1'){
            type = 'user'
            let admin = await User.findOne({role_type:1})
            users = await User.find({parent_id:admin._id,whiteLabel:parent,role_type:2})
            breadcum = [parent]
        }else if(roleType == '2'){
            type = 'user'
            let parentName = await User.findOne({userName:parent})
            users = await User.find({parentUsers:parentName._id,role_type:5})
            breadcum = [parentName.whiteLabel,parentName.userName]
        }else if(roleType == '5'){
            type = 'matchOdd'
            users = await User.find({userName:parent})
            let parentName = await User.findOne({_id:users[0].parent_id})
            breadcum = [parentName.whiteLabel,parentName.userName,users[0].userName]
        }

        let newUsers = users.map(async(ele) => {
            let userfilter;
            role_type = []
            roles = await Role.find({role_level: {$gt:ele.role.role_level}});
            for(let i = 0; i < roles.length; i++){
                role_type.push(roles[i].role_type)
            }
            let childrenUsername = []
           
            if(ele.role_type == 2){
                childrenUsername = await User.distinct('userName', {parentUsers:ele._id,isActive:true,role_type:{$in:role_type}});
                
                // let children = await User.find({parentUsers:ele._id,isActive:true,role_type:{$in:role_type}})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }
            else if(ele.role_type == 5){
                childrenUsername = await User.distinct('userName', {userName:ele.userName,isActive:true});
                // let children = await User.find({userName:ele.userName,isActive:true})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }

            
            filter.userName = {$in:childrenUsername}
            let betDetails = await Bet.aggregate([
                {
                    $match:filter
                },
                {
                    $group:{
                        _id:'$userName',
                        betcount:{$sum:1},
                        loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                        won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                        open:{$sum:{$cond:[{$in:['$status',['MAP','OPEN']]},1,0]}},
                        void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                        returns:{$sum:{$cond:[{$in:['$status',['LOSS','WON']]},'$returns',0]}},
                        marketName:{ $first: '$marketName' }
                        
                    }
                },
                {
                    $sort: {
                        betcount: -1 ,
                        open : -1,
                        won : -1,
                        loss : -1
                    }
                },
                {
                    $skip: page * limit
                },
                {
                    $limit: limit 
                }
            ]) 
            if(betDetails.length !== 0){
                return ({ele,betDetails:betDetails[0]})
            }
            
        })

        let resultPromise = await Promise.all(newUsers)
        let result = []
        for(let i = 0;i<resultPromise.length;i++){
            if(resultPromise[i]){
                result.push(resultPromise[i])
            }
        }

        // console.log(result)

        socket.emit('childGameAnalist',{result,page,type,breadcum})



    })

    socket.on('getEvetnsOfSport',async(data)=>{
        // console.log(data);
        const sportData = await getCrkAndAllData()
        // console.log(sportData)
        let sportList;
        if(data.sport == '4'){
            sportList = sportData[0].gameList[0]
        }else{
            sportList = sportData[1].gameList.find(item => item.sportId == parseInt(data.sport))
        }

        socket.emit('getEvetnsOfSport',sportList)

    })

    socket.on('claimCommissionAdmin', async(data) => {
        // console.log(data)
        let operationId;
        let operationUser;
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            operationId = data.LOGINDATA.LOGINUSER.parent_id
            operationUser = await User.findById(operationId)
        }else{
            operationId = data.LOGINDATA.LOGINUSER._id
            operationUser = data.LOGINDATA.LOGINUSER
        }
        let user = await User.findById(operationId)
        let commissionAmount = await newCommissionModel.aggregate([
            {
                $match:{
                    userId: operationId,
                    commissionStatus: 'Unclaimed'
                }
            },
            {
                $group: {
                  _id: null, 
                  totalCommission: { $sum: "$commission" } 
                }
              }
        ])
        // console.log(commissionAmount, "commissionAmountcommissionAmountcommissionAmountcommissionAmount")
        if(user){
            if(commissionAmount.length != 0 && commissionAmount[0].totalCommission > 0){
                try{
                    let commission = commissionAmount[0].totalCommission
                    await User.findByIdAndUpdate(operationUser._id,{$inc:{availableBalance:commission}})
                    let parenet = await User.findByIdAndUpdate(operationUser.parent_id, {$inc:{availableBalance: -commission}})
                    let desc1 = `Claim Commisiion, ${user.userName}/${parenet.userName}`
                    let desc2 = `Claim Commisiion of chiled user ${user.userName}, ${user.userName}/${parenet.userName}`
                    let childdata = {
                        user_id:operationUser._id,
                        description : desc1,
                        creditDebitamount : commission,
                        balance : user.availableBalance + commission,
                        date : Date.now(),
                        userName : user.userName,
                        role_type:user.role_type,
                    }
                    let perentData = {
                        user_id:operationUser.parent_id,
                        description : desc2,
                        creditDebitamount : -commission,
                        balance : parenet.availableBalance - commission,
                        date : Date.now(),
                        userName : parenet.userName,
                        role_type:parenet.role_type
                    }
                    await AccModel.create(childdata)
                    await AccModel.create(perentData)
                    await newCommissionModel.updateMany({userId:operationUser._id}, {commissionStatus:'Claimed', claimeDate: Date.now()})
                    socket.emit("claimCommissionAdmin", "Success")
                }catch(err){
                    console.log(err)
                    socket.emit("claimCommissionAdmin", "error")
                }
            }
            // else{
            //     socket.emit("claimCommissionAdmin", "Success")
            // }

           
        }else{
            socket.emit("claimCommissionAdmin", "error")
        }
    })


    socket.on('BetLimitDetails', async(data) => {
        try{
            let details = await betLimit.findOne({type:data})
            if(details){
                socket.emit('BetLimitDetails', {details, type:data})
            }else{
                socket.emit("BetLimitDetails", {message:'', status:'notFound', type:data})
            }

        }catch(err){
            socket.emit('BetLimitDetails', {message:"try again leter", status:"err"})
        }
    })


    socket.on('UpdateBetLimit', async(data) => {
        // console.log(data, "LimitData")
        try{
            let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password');
            // console.log(loginUser, "loginUser")
            if(loginUser && (await loginUser.correctPassword(data.data.password, loginUser.password))){
                let check = await betLimit.findOne({type:data.data.type})
                // console.log(check)
                if(check){
                    // console.log('WORKING')
                    await betLimit.findOneAndUpdate({type:data.data.type}, data.data)
                    socket.emit('UpdateBetLimit', {status:'success'})
                }else{
                    await betLimit.create(data.data)
                    socket.emit('UpdateBetLimit', {status:'success'})
                }
            }else{
                socket.emit('UpdateBetLimit', {message:"Please provide a valid password", status:"err"})
            }   



        }catch(err){
            console.log(err)
            socket.emit('UpdateBetLimit', {message:"Please try again leter", status:"err"})
        }
    })

    socket.on('updateBetLimitMATCH', async(data) => {

        // console.log(data)
        let data1 = await betLimit.findOne({type:data.id})
        if(data1 != null){
            socket.emit('updateBetLimitMATCH', {marketData:data1, data:data.innerText, id:data.id})
        }else{
            socket.emit('updateBetLimitMATCH', {status:'notFound', message:'notFOund', data:data.innerText, id:data.id})
        }
        // let matchName = data.split('/')[0]
        // let Marketname = data.split('/')[1]
        // let dataDb = await betLimitMatchWisemodel.findOne({matchTitle:matchName})
        // if(dataDb != null){
        //     console.log(dataDb)
        //     console.log(matchName, Marketname)
        //     let marketData = dataDb.marketDetails.find(item => item.title == Marketname)
        //     if(marketData){
        //         socket.emit('updateBetLimitMATCH', {marketData, data:data})
        //     }else{
        //         socket.emit('updateBetLimitMATCH', {status:'notFound', message:'notFOund', data:data})
        //     }
        // }else{
        //     socket.emit('updateBetLimitMATCH', {status:'notFound', message:'notFOund', data:data})
        // }
    })


    socket.on('updateBetLimitMarket', async(data) => {
        // console.log('WORKING')
       let dbData = await betLimit.findOne({type:data.id})
       if(dbData){
        // console.log(dbData)
        let marketDetails = await betLimit.findOneAndUpdate({type:data.id}, {min_stake:data.min_stake, max_stake:data.max_stake, max_profit:data.max_profit, max_odd:data.max_odd, delay:data.delay})
        socket.emit('updateBetLimitMarket', marketDetails)
       }else{
        // console.log(data)
        let marketDetails = await betLimit.create({type:data.id, min_stake:data.min_stake, max_stake:data.max_stake, max_profit:data.max_profit, max_odd:data.max_odd, delay:data.delay})
        socket.emit('updateBetLimitMarket', marketDetails)
       }
       
    })


    socket.on('ROLLBACKDETAILS', async(data) => {
        try{
            
            let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password');
            if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
                socket.emit('ROLLBACKDETAILS', 'please provide a valid password') 
            }else{ 
                socket.emit('ROLLBACKDETAILS', {message:'RollBack Process Start', id:data.id})
                let resultDate = rollBackBet(data)
            }
        }catch(err){
            console.log(err)
            socket.emit("ROLLBACKDETAILS",{message:"err", status:"error"})
        }
    })


    socket.on('marketLimitId', async(data) => {
        try{
            let LimitData = await betLimit.find({type:{$in:data}})
            socket.emit('marketLimitId', LimitData)

        }catch(err){
            console.log(err)
        }
    })

    socket.on('HouseFundData', async(data) => {
        try{
            let page = data.page
            let limit = 10
            let id = data.LOGINDATA.LOGINUSER._id

            if(data.LOGINDATA.LOGINUSER.role.roleName == 'Operator'){
                let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
                data.LOGINDATA.LOGINUSER = parentUser
                id = parentUser._id.toString()
            }

            let houseData = await houseFundModel.find({userId:id}).sort({date:-1}).skip(page * limit).limit(limit)
            socket.emit('HouseFundData', houseData)
        }catch(err){
            console.log(err)
        }
    })

    socket.on('addnewStream',async(data)=>{
        try{
            if(!await Stream.findOne({eventId:data.eventId})){

                await Stream.create(data)
                socket.emit('addnewStream',{status:'success',msg:'stream created successfully'})
            }else{
                socket.emit('addnewStream',{status:'success',msg:'stream already addedd'})

            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on('delteStreame',async(id) =>{
        try{
            await Stream.findByIdAndDelete(id)
            socket.emit('delteStreame',{status:'success'})
        }catch(err){
            console.log(err)
        }
    })
    socket.on('editStream',async(data) =>{
        try{
            let stream = await Stream.findOne({eventId:data.eventId})
            if(stream){
                await Stream.findOneAndUpdate({eventId:data.eventId},{url:data.url,status:data.status})
            }else{
                await Stream.create(data)
            }
            socket.emit('editStream',{status:'success'})
        }catch(err){
            console.log(err)
            socket.emit('editStream',{status:'fail',err})
        }
    })


    socket.on('getinProgressData', async(data) => {
        try{
            let inprogressData = await InprogreshModel.find({eventId:data})
            // console.log(inprogressData, "inprogressDatainprogressDatainprogressDatainprogressDatainprogressData")
            socket.emit('getinProgressData', inprogressData)
        }catch(err){
            console.log(err)
        }
    })

    socket.on('eventNotification', async(data) => {
        try{
            let eventNotificationSetting = await eventNotification.findOne({id:data.id})
            if(eventNotificationSetting){
                socket.emit('eventNotification', {eventNotificationSetting, id:data.id})
            }else{
                socket.emit('eventNotification', {status:'noFound', id:data.id})
            }

        }catch(err){
            console.log(err)
        }
    })


    socket.on('eventNotification2', async(data) => {
        try{
            let notificationData = await eventNotification.findOne({id:data.id})
            if(notificationData){
                notificationData = await eventNotification.findOneAndUpdate({id:data.id}, data)
            }else{
                notificationData = await eventNotification.create({id:data.id, message:data.message})
            }
            socket.emit('eventNotification2', notificationData)
        }catch(err){
            // console.log(err)
            socket.emit('eventNotification2', {status:'err'})
        }
    })


    socket.on('commissionReportFilter', async(data) => {
        try{
            // `{ fromTime: '2023-10-12', toTime: '' }`
            // console.log(data.data, "DATE")
            let dateFilter
            if(data.data.fromTime == ''){
                dateFilter = {$lte: new Date(data.data.toTime)}
            }else if(data.data.toTime == ''){
                dateFilter = {$gte: new Date(data.data.fromTime)}
            }else{
                dateFilter = {
                    $gte: new Date(data.data.fromTime),
                    $lte: new Date(data.data.toTime)
                }
            }
            let childrenUsername = []
            if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
                // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }else{
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
                // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }
            let eventData = await newCommissionModel.aggregate([
                {
                    $match: {
                      eventDate: dateFilter,
                      userName:{$in:childrenUsername}
                    }
                  },
                  {
                      $group: {
                          _id: "$eventName",
                      totalCommission: { $sum: "$commission" },
                      eventDate: { $first: "$eventDate" }
                    }
                },
                {
                  $sort:{
                      eventDate : -1,
                      totalCommission : 1,
                      _id : 1
                  }
                },
                {
                    $skip:(data.page * 10)
                },
                  {
                    $limit:10
                  }
            ])

            socket.emit('commissionReportFilter', {eventData, page:data.page})
        }catch(err){
            console.log(err)
        }
    })



    socket.on('commissionAccFilter', async(data) => {
        // console.log(data.data, data.id)
        try{
            let dateFilter
            if(data.data.fromTime == '' && data.data.toTime != ''){
                dateFilter = {$lte: new Date(data.data.toTime)}
            }else if(data.data.toTime == '' && data.data.fromTime != ''){
                dateFilter = {$gte: new Date(data.data.fromTime)}
            }else if (data.data.toTime != '' && data.data.fromTime != ''){
                dateFilter = {
                    $gte: new Date(data.data.fromTime),
                    $lte: new Date(data.data.toTime)
                }
            }else{
                // console.log(new Date(), 7 * 24 * 60 * 60 * 1000)
                dateFilter = {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                  }
            }
            // console.log(dateFilter)
            let childrenUsername = []
            if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
                // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }else{
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
                // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }
            let accStatements
            if(data.id){
                // console.log(data.id ,"data.id")
                // let user = await User.findById(data.id)
                // console.log(user, "WORKING")
                accStatements = await AccModel.aggregate([
                    {
                        $match:{
                            date: dateFilter,
                            // userName:req.currentUser.userName,
                            description:{
                                $regex: /^Claim Commisiion/i
                            },
                            userName:data.id
                        }
                    },
                    {
                        $sort:{
                            date : -1,
                            userName : 1
                        }
                    },
                    {
                        $skip:(data.page * 10)
                    },
                    {
                      $limit:10
                    }
                ])
            }else{

            accStatements = await AccModel.aggregate([
                {
                    $match:{
                        date: dateFilter,
                        // userName:req.currentUser.userName,
                        description:{
                            $regex: /^Claim Commisiion/i
                        },
                        userName:{$in:childrenUsername}
                    }
                },
                {
                    $sort:{
                        date : -1,
                        userName : 1
                    }
                },
                {
                    $skip:(data.page * 10)
                },
                {
                  $limit:10
                }
            ])
        }


            // console.log(accStatements,"accStatements")
            socket.emit("commissionAccFilter", {accStatements, page:data.page})
        }catch(err){
            console.log(err)
        }

    })


    socket.on('commissionUserLevel', async(data) => {
        // console.log(data.data)
        try{
            let dateFilter = {}
            // let dateFilter
            if(data.data.fromTime == '' && data.data.toTime != ''){
                dateFilter = {$lte: new Date(data.data.toTime)}
            }else if(data.data.toTime == '' && data.data.fromTime != ''){
                dateFilter = {$gte: new Date(data.data.fromTime)}
            }else if (data.data.toTime != '' && data.data.fromTime != ''){
                dateFilter = {
                    $gte: new Date(data.data.fromTime),
                    $lte: new Date(data.data.toTime)
                }
            }else{
                // console.log(new Date(), 7 * 24 * 60 * 60 * 1000)
                dateFilter = {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                  }
            }
            let childrenUsername = []
            if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
                // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }else{
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
                // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
                // children.map(ele => {
                //     childrenUsername.push(ele.userName) 
                // })
            }
            let userWiseData = await newCommissionModel.aggregate([
                {
                    $match: {
                      eventDate: dateFilter,
                      userName:{$in:childrenUsername},
                      loginUserId:{$exists:true},
                        parentIdArray:{$exists:true}
                    }
                  },
                  {
                    $lookup: {
                        from: "commissionnewmodels",
                        let: {ud:{$cond:{if:{$ifNull: ["$uniqueId", false]},then:{ $toObjectId: "$uniqueId" },else:'$_id'}},loginId:'$loginUserId',parentArr:'$parentIdArray'},
                        pipeline: [
                            {
                              $match: {
                                $expr: { $and: [{ $eq: ["$loginUserId", "$$loginId"] },{ $eq: [{ $toObjectId: "$uniqueId" }, "$$ud"] }, { $in: ["$userId", "$$parentArr"] }] },
                                loginUserId:{$exists:true},
                                parentIdArray:{$exists:true}
                              }
                            }
                          ],
                        as: "parentdata"
                    }
                },
                {
                    $group: {
                        _id: "$userName",
                        totalCommission: { $sum: "$commission" },
                        totalUPline: { $sum:{
                            $reduce:{
                                input:'$parentdata',
                                initialValue:0,
                                in: { $add: ["$$value", "$$this.commission"] }
                            }
                        }},
                    }
                },
                    {
                      $sort:{
                        _id : 1,
                        totalCommission : 1,
                        totalUPline : 1
                      }
                    },
                    {
                        $skip:(data.page * 10)
                    },
                  {
                    $limit:10
                  }
            ])
            // console.log(userWiseData, "userWiseData")
            socket.emit('commissionUserLevel', {userWiseData, page:data.page})
        }catch(err){
            console.log(err)
        }
    })


    socket.on('timelyVoideBEt', async(data) => {
        // console.log(data)
        try{
            let user = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
            const passcheck = await user.correctPassword(data.data.password, user.password)
            // console.log(passcheck, "PASSWORD CHECK")
            if(passcheck){
            let bet = await Bet.findByIdAndUpdate(data.id, {status:"CANCEL",remark:data.Remark,alertStatus:'CANCEL',returns:0});
          
            // console.log(bet, "BETS")
            let DebitCreditAmount 
            if(bet.bettype2 === "Back"){
                if(bet.marketName.toLowerCase().startsWith('match')){
                    DebitCreditAmount = bet.Stake
                }else if(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')){
                    DebitCreditAmount = bet.Stake
                }else{
                    DebitCreditAmount = bet.Stake
                }
            }else{
                if(bet.marketName.toLowerCase().startsWith('match')){
                    DebitCreditAmount = ((bet.Stake * bet.oddValue) - bet.Stake).toFixed(2)
                }else if(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')){
                    DebitCreditAmount = ((bet.Stake * bet.oddValue)/100).toFixed(2)
                }else{
                    DebitCreditAmount = ((bet.Stake * bet.oddValue)/100).toFixed(2)
                }
            }
            let user = await User.findByIdAndUpdate(bet.userId, {$inc:{availableBalance: DebitCreditAmount, myPL: DebitCreditAmount, exposure:-DebitCreditAmount}})
            let timelyVoideCheck = await timelyNotificationModel.findOne({marketId : bet.marketId})
            let notification
            if(timelyVoideCheck){
                notification = await timelyNotificationModel.findOneAndUpdate({marketId : bet.marketId}, {message:data.data.Remark})
            }else{
                let timelyNotification = {
                    message : data.data.Remark,
                    userName : user.userName,
                    marketId : bet.marketId
                }
                notification = await timelyNotificationModel.create(timelyNotification)
            }
            let description = `Bet for ${bet.match}/stake = ${bet.Stake}/CANCEL`
            // console.log(user.availableBalance, DebitCreditAmount, user.availableBalance + DebitCreditAmount)
            let userAcc = {
                "user_id":user._id,
                "description": description,
                "creditDebitamount" : DebitCreditAmount,
                "balance" : user.availableBalance + parseFloat(DebitCreditAmount),
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": DebitCreditAmount,
                "transactionId":`${bet.transactionId}`
            }
            
            let debitAmountForP = DebitCreditAmount
              for(let i = user.parentUsers.length - 1; i >= 1; i--){
                  let parentUser1 = await User.findById(user.parentUsers[i])
                  let parentUser2 = await User.findById(user.parentUsers[i - 1])
                  let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                  let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                  parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                  parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                  await User.findByIdAndUpdate(user.parentUsers[i], {
                    $inc: {
                        downlineBalance: DebitCreditAmount,
                        myPL: -parentUser1Amount,
                        uplinePL: -parentUser2Amount,
                        lifetimePL: -parentUser1Amount,
                        pointsWL: DebitCreditAmount
                    }
                });
            
                if (i === 1) {
                    await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: DebitCreditAmount,
                            myPL: -parentUser2Amount,
                            lifetimePL: -parentUser2Amount,
                            pointsWL: DebitCreditAmount
                        }
                    });
                }
                  debitAmountForP = parentUser2Amount
              }
            
            await AccModel.create(userAcc);
            socket.emit('timelyVoideBEt', {bet, status:"success"})
            }else{
                socket.emit('timelyVoideBEt', {status:'err', message:'Please Provide valide password'})
            }
        }catch(err){
            console.log(err)
            socket.emit('timelyVoideBEt', {status:'err', message:'Please try again leter'})
        }
    })


    socket.on('marketnotificationId', async(data) => {
        // console.log(data, "dataId")
        try{
            let notifications = await timelyNotificationModel.find({marketId:{$in:data}})
            socket.emit('marketnotificationId', notifications)
        }catch(err){
            console.log(err)
        }
    })

    socket.on('userLoginBalance', async(data) => {
        // console.log(data, "LOGINDATA")
        if(data.LOGINUSER){
            let userData = await User.findById(data.LOGINUSER._id)
            const exposure1 = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN",
                        userName:userData.userName,
                        // marketName : {
                        //     $not: {
                        //         $regex: /^(?!^(match|win|book)).*/
                        //     }
                        // },
                        marketId:{$regex: /OE$/}
                        
                    }
                },
                {
                    $group: {
                        _id: "$marketId",
                        totalAmountB: {
                            $sum: {
                                $cond: {
                                    if : {$eq: ['$bettype2', "BACK"]},
                                    then:{$multiply:["$exposure",-1]},
                                    else:'$WinAmount'
                                }
                            }
                        },
                        totalAmountL: {
                            $sum: {
                                $cond: {
                                    if : {$eq: ['$bettype2', "LAY"]},
                                    then:{$multiply:["$exposure",-1]},
                                    else:'$WinAmount'
                                }
                            }
                        }
                   
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: {$sum:{$cond:{
                            if:{
                                $eq:[{$cmp:['$totalAmountB','$totalAmountL']},0]
                            },
                            then:"$totalAmountL",
                            else:{
                                $cond:{
                                    if:{
                                        $eq:[{$cmp:['$totalAmountB','$totalAmountL']},1]
                                    },
                                    then:"$totalAmountL",
                                    else:"$totalAmountB"
                                }
                               
                            }
                        },
                    }},
                }
            }
            ])

        
            const exposure2 = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN",
                        userName:userData.userName,
                        marketId:{$regex: /F2$/}
                        
                    }
                },
                {
                    $addFields: {
                      runs: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$selectionName", "@"] },
                            1 
                          ]
                        }
                      }
                    }
                },
                {
                    $group: {
                        _id:{
                            marketId:"$marketId",
                            runs:'$runs',
                            bettype2:'$bettype2'
                        },
                        exposure:{$sum: '$exposure'},
                        WinAmount:{$sum:'$WinAmount'},
                    },
                },
                {
                    $group:{
                        _id:"$_id.marketId",
        
                        runs:{
                            $push:'$_id.runs'
                        },
                        data:{
                            $push:{
                                run:'$_id.runs',
                                exposure:'$exposure',
                                winAmount:'$WinAmount',
                                type:'$_id.bettype2'
                            }
                        },
                    }
                        
                    
                },
            ])


            let exposure3 = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN",
                        userName:userData.userName,
                        marketName: {
                            $regex: /^(match|book)/i
                        }
                        
                    }
                },
                {
                    $group:{
                        _id: {
                            selectionName: "$selectionName",
                            marketId : "$marketId"
                        },
                        totalWinAmount:{
                            $sum: { 
                                $cond: { 
                                    if : {$eq: ['$bettype2', "BACK"]},
                                    then : {
                                        $sum: "$WinAmount"
                                    },
                                    else:{ 
                                        $sum: "$exposure"
                                    }
                                }
                            }
                        },
                        totalLossAmount:{
                            $sum: { 
                                $cond: { 
                                    if : {$eq: ['$bettype2', "BACK"]},
                                    then : {
                                        $sum: "$exposure"
                                    },
                                    else:{ 
                                        $sum: "$WinAmount"
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $group:{
                        _id:"$_id.marketId",
                        data:{ 
                            $push:{ 
                                selectionName : "$_id.selectionName",
                                totalWinAmount : "$totalWinAmount",
                                totalLossAmount : {
                                    $multiply:["$totalLossAmount", -1]
                                }
                            }
                        }

                    }
                },
                {
                    $project: {
                      _id: "$_id",
                      data: {
                        $map: {
                          input: "$data",
                          as: "item",
                          in: {
                            selectionName: "$$item.selectionName",
                            totalWinAmount: "$$item.totalWinAmount",
                            totalLossAmount: {
                              $add: [
                                "$$item.totalLossAmount",
                                {
                                    $sum:{
                                        $reduce: { 
                                            input: "$data",
                                            initialValue: 0,
                                            in: { 
                                                $cond: { 
                                                    if: {
                                                        $ne: ["$$this.selectionName", "$$item.selectionName"] 
                                                      },
                                                      then: { $add: ["$$value", "$$this.totalWinAmount"] },
                                                      else: {
                                                          $add: ["$$value", 0] 
                                                      }
                                                }
                                            }
                                        }
                                    }
                                }
                              ]
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      data: 1
                    }
                  },
                  {
                    $unwind: "$data"
                  },
                  {
                    $sort: {
                      "data.totalLossAmount": 1
                    }
                  },
                  {
                    $group: {
                      _id: "$_id",
                      selectionName: { $first: "$data.selectionName" },
                      amount: { $first: "$data.totalLossAmount" }
                    }
                  },
                  {
                        $project: {
                        _id: 1,
                        marketId: "$_id",
                        amount: 1
                        }
                    },
                    // {
                    //     $project:{
                    //         _id:0,
                    //         amount:{
                    //             $sum:'$amount'
                    //         }
                    //     }
                    // }
                    {
                        $group:{
                            _id:null,
                            amount:{ $sum:'$amount'}
                        }
                    }
            ])

            let exposer3Amount = 0
            if(exposure3.length > 0){
                exposer3Amount = exposure3[0].amount
            }
        
            // console.log(exposure3, exposure2, exposure1)

            function getExposure(runs,obj){
                runs.sort((a, b) => a - b)
                obj.sort((a, b) => a.run - b.run)
                let runLength = runs.length;
                let dataToshow = [];
                let min = 0
                for(let i = 0;i<runLength;i++){
                    if(runLength == 1){
                        let data1 = {}
                        data1.message = `${runs[0] - 1} or less`
                        let sum = 0
                        for(let j = 0; j < obj.length; j++){
                            if(obj[j].type === "LAY"){
                                sum += obj[j].winAmount
                            }else{
                                sum -= obj[j].exposure
                            }
                        }
                        data1.sum = sum
                        dataToshow.push(data1)
                        let data2 = {}
                        let sum2 = 0
                        data2.message = `${runs[i]} or more`
                        for(let j = 0; j < obj.length; j++){
                            if(obj[j].type === "BACK"){
                                sum2 += obj[j].winAmount
                            }else{
                                sum2 -= obj[j].exposure
                            }
                        }
                        data2.sum = sum2
                        dataToshow.push(data2)
                    }else{
                        if(i === 0){
                            let data = {}
                            data.message = `${runs[i] - 1} or less`
                            let sum = 0
                            for(let j = 0; j < obj.length; j++){
                                if(obj[j].type === "LAY" && obj[j].run >= runs[i]){
                                    sum += obj[j].winAmount
                                }else{
                                    sum -= obj[j].exposure
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                        }else if (i === (runs.length - 1)){
                            let data = {}
                            let data1 = {}
                            
                            if(runs[i - 1] == (runs[i] - 1)){
                                data.message = `${runs[i - 1]}`
                            }else{
                                data.message = `between ${runs[i - 1]} and ${runs[i] - 1}`
                            }
                            let sum = 0
                            for(let j = 0; j < obj.length; j++){
                                if(obj[j].type === "LAY" && obj[j].run == runs[i]){
                                    sum += obj[j].winAmount
                                }else if(obj[j].type === "BACK" && obj[j].run == runs[i-1]){
                                    sum += obj[j].winAmount
                                }else{
                                    sum -= obj[j].exposure
        
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                            let sum2 = 0
                            data1.message = `${runs[i]} or more`
                            for(let j = 0; j < obj.length; j++){
                                if(obj[j].type === "BACK" && obj[j].run <= runs[i]){
                                    sum2 += obj[j].winAmount
                                }else{
                                    sum2 -= obj[j].exposure
                                }
                            }
                            data1.sum = sum2
                            dataToshow.push(data1)
                        }else{
                            let data = {}
                            if(runs[i - 1] == (runs[i] - 1)){
                                data.message = `${runs[i] - 1}`
                            }else{
                                data.message = `between ${runs[i - 1]} and ${runs[i] - 1}`
                            }
                            let sum = 0
                            for(let j = 0; j < obj.length; j++){
                                if(obj[j].type === "LAY" && obj[j].run == runs[i]){
                                    sum += obj[j].winAmount
                                }else if (obj[j].type === "BACK" && obj[j].run == runs[i - 1]){
                                    sum += obj[j].winAmount
                                }
                                else{
                                    sum -= obj[j].exposure
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                        }
                    }
        
                }
        
                for(let i = 0;i<Object.keys(dataToshow).length;i++){
                    if(dataToshow[i].sum < min){
                        min = dataToshow[i].sum
                    }
                }
                return min;
            }
        
            let exposureFancy = 0;
            for(let i = 0;i<exposure2.length;i++){
                exposureFancy += getExposure(exposure2[i].runs,exposure2[i].data)
            }
            let totalExposure;
            let exposureOther;
            if(exposure1.length == 0 ){
                exposureOther = 0
            }else{
                exposureOther = exposure1[0].totalAmount
            }
            // console.log(exposureOther, exposureFancy, exposer3Amount)
            totalExposure = (exposureOther + exposureFancy + exposer3Amount) * -1
            // totalExposure = totalExposure + exposer3Amount
            // console.log(totalExposure, "totalExposuretotalExposuretotalExposure")
            socket.emit('userLoginBalance', {userData,totalExposure})
        }
    })

    socket.on('suspendResume', async(data) => {
        try{
            let check = await resumeSuspendModel.findOne({marketId:data.id})
            let status 
            if(check){
                await resumeSuspendModel.findOneAndUpdate({marketId:data.id}, {userName:data.LOGINDATA.LOGINUSER.userName, status:!check.status})
                status = !check.status
            }else{
                await resumeSuspendModel.create({marketId:data.id, userName:data.LOGINDATA.LOGINUSER.userName, status:false})
                status = false
            }
            socket.emit('suspendResume', {status, marketId:data.id, status2:'success'})
        }catch(err){
            console.log(err)
        }
    })


    socket.on('WINNERMARKET', async(data) => {
        try{
            if(data){
                let runners = await runnerDataModel.findOne({marketId:data})
                socket.emit('WINNERMARKET', runners)
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on('addpaymentMethod',async(data)=>{
        try{
            let filterdata = {}
            let filterarr = []
            if(data.accountnumber){
                filterarr.push({accountnumber:data.accountnumber})
            }
            if(data.upiid){
                filterarr.push({upiid:data.upiid})
            }
            if(data.phonenumber){
                filterarr.push({phonenumber:data.phonenumber})
            }
            filterdata.$or = filterarr
            if(!await PaymentMethodModel.findOne(filterdata)){
                await PaymentMethodModel.create(data)
                socket.emit('addpaymentMethod',{status:'success',msg:'payment method added successfully'})
            }else{
                socket.emit('addpaymentMethod',{status:'success',msg:'this account number is alredy exist'})
            }
        }catch(err){
            console.log(err)
            socket.emit('addpaymentMethod',{status:'fail',msg:'something went wrong'})
        }
    })

    socket.on('editpaymentMethod',async(data)=>{
        try{
            let id = data.id
            delete data['id']
            // console.log(data)
            await PaymentMethodModel.findByIdAndUpdate(id,data)
            socket.emit('editpaymentMethod',{status:'success',msg:'data updated successfully'})
        }catch(err){
            socket.emit('editpaymentMethod',{status:'fail',msg:'something went wrong'})
        }
    })

    socket.on('deletePaymentMethod',async(data)=>{
        try{
            await PaymentMethodModel.findByIdAndDelete(data.id)
            socket.emit('deletePaymentMethod',{status:'success',msg:'payment method deleted successfully'})
        }catch(err){
            socket.emit('deletePaymentMethod',{status:'fail',msg:'something went wrong'})
        }
    })

    socket.on('paymentmethodStatusChange',async(data)=>{
        try{
            await PaymentMethodModel.findByIdAndUpdate(data.id,{status:data.status})
            socket.emit('paymentmethodStatusChange',{status:'success',msg:'status changed successfully'})
        }catch(err){
            socket.emit('paymentmethodStatusChange',{status:'fail',msg:'something went wrong'})
        }
    })

    socket.on('filterpaymentmethod',async(data)=>{
        try{
            let result
            let filter = {}
            if(data.data != 'All'){
                filter.pmethod = data.data
            }
            filter.userName = data.LOGINDATA.LOGINUSER.userName
            result = await PaymentMethodModel.find(filter)
            socket.emit('filterpaymentmethod',{status:'success',data:result})
        }catch(err){
            socket.emit('filterpaymentmethod',{status:'fail',msg:'something went wrong'})
            console.log(err)
        }
    })

    socket.on('getpaymentdetailbyholdername',async(data)=>{
        try{
            let user = await User.findById(data.LOGINDATA.LOGINUSER._id)
            let sdmId = user.parentUsers[1]
            let sdmUser = await User.findById(sdmId)
            data.data.userName = sdmUser.userName
            data.data.status = true
            let paymentmethod = await PaymentMethodModel.findOne(data.data)
            socket.emit('getpaymentdetailbyholdername',{status:'success',data:paymentmethod})
        }catch(err){
            socket.emit('getpaymentdetailbyholdername',{status:'fail',msg:'something went wrong'})
        }
    })

    socket.on('getPaymentmethodData',async(data)=>{
        try{
            let user = await User.findById(data.data.LOGINUSER._id)
            let sdmId = user.parentUsers[1]
            let sdmUser = await User.findById(sdmId)
            // console.log('sdmId',sdmId,'sdmUser',sdmUser)
            let paymentMethodDetail = await PaymentMethodModel.findOne({userName:sdmUser.userName,pmethod:'banktransfer',status:true})
            let accountholderarr = await PaymentMethodModel.find({userName:sdmUser.userName,pmethod:'banktransfer',status:true})
            socket.emit('getPaymentmethodData',{status:'success',data:paymentMethodDetail,accountholderarr})
        }catch(err){
            socket.emit('getPaymentmethodData',{status:'fail',msg:'something went wrong'})
            console.log(err)
        }
       

    })

    socket.on('getBankData', async(data) => {
        try{
            let user = await User.findById(data.LOGINDATA.LOGINUSER._id)
            let sdmId = user.parentUsers[1]
            let sdmUser = await User.findById(sdmId)
            let paymentMethodDetail = await PaymentMethodModel.findOne({userName:sdmUser.userName,pmethod:data.type,status:true})
            let accountholderarr = await PaymentMethodModel.find({userName:sdmUser.userName,pmethod:data.type,status:true})
            socket.emit('getBankData', {paymentMethodDetail, type:data.type,accountholderarr})
        }catch(err){
            socket.emit('getPaymentmethodData',{status:'fail',msg:'something went wrong'})
            console.log(err)
        }
    })

    socket.on('getpaymentmethoddetailsbyid',async(data)=>{
        try{
            let paymentdata = await PaymentMethodModel.findOne({_id:data.id})
            socket.emit('getpaymentmethoddetailsbyid', {status:'success',data:paymentdata})
        }catch(err){
            socket.emit('getpaymentmethoddetailsbyid', {status:'fail',msg:'something went wrong'})
        }
    })

    socket.on('getpaymentapprovalreqdata',async(data)=>{
        try{
            let result = await paymentReportModel.findById(data)
            socket.emit('getpaymentapprovalreqdata',{status:'success',result})
        }catch(err){
            socket.emit('getpaymentapprovalreqdata',{status:'fail',msg:'something went wrong'})

        }
    })

    socket.on('getpaymentdenyreqdata',async(data)=>{
        try{
            let result = await paymentReportModel.findById(data)
            socket.emit('getpaymentdenyreqdata',{status:'success',result})
        }catch(err){
            socket.emit('getpaymentdenyreqdata',{status:'fail',msg:'something went wrong'})

        }
    })

    socket.on('acceptpaymetnreq',async(data)=>{
        try{
            const report = await paymentReportModel.findByIdAndUpdate(data.id,{approvedamount:data.approvedamount,status:'approved'})
            let userData = {}
            let parentData = {}
            const childUser = await User.findOne({userName:report.username});
            const parentUser = await User.findById(childUser.parent_id);
            userData.balance = parseFloat(childUser.balance + (data.approvedamount * 1));
            userData.availableBalance = parseFloat(childUser.availableBalance + (data.approvedamount * 1));
            // // userData.creditReference = {}
            // // userData.lifeTimeCredit = (childUser.lifeTimeCredit + req.body.amount);
            parentData.availableBalance = parseFloat(parentUser.availableBalance - (data.approvedamount * 1));
            // // parentData.lifeTimeDeposit = (parentUser.lifeTimeDeposit + (data.approvedamount * 1));
            parentData.downlineBalance = parseFloat(parentUser.downlineBalance + (data.approvedamount * 1));
            
            // // console.log(userData)
            const updatedChild = await User.findByIdAndUpdate(childUser.id, userData,{
                new:true
            });
            await User.findByIdAndUpdate(childUser.id, {$inc:{creditReference:(data.approvedamount * 1)}})
            const updatedparent =  await User.findByIdAndUpdate(parentUser.id, parentData);
            let childAccStatement = {}
            let ParentAccStatement = {}
            let date = Date.now()

            // //for child User//
            childAccStatement.child_id = childUser.id;
            childAccStatement.user_id = childUser.id;
            childAccStatement.parent_id = parentUser.id;
            childAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
            childAccStatement.creditDebitamount = data.approvedamount;
            childAccStatement.balance = userData.availableBalance;
            childAccStatement.date = date
            childAccStatement.userName = childUser.userName
            childAccStatement.role_type = childUser.role_type
            childAccStatement.Remark = 'Deposit'

            const accStatementChild = await AccModel.create(childAccStatement)
            if(!accStatementChild){
                return next(new AppError("Ops, Something went wrong Please try again later", 500))
            }
            // // console.log(childAccStatement)
            // // for parent user // 
            ParentAccStatement.child_id = childUser.id;
            ParentAccStatement.user_id = parentUser.id;
            ParentAccStatement.parent_id = parentUser.id;
            ParentAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
            ParentAccStatement.creditDebitamount = -(data.approvedamount);
            ParentAccStatement.balance = parentData.availableBalance;
            ParentAccStatement.date = date
            ParentAccStatement.userName = parentUser.userName;
            ParentAccStatement.role_type = parentUser.role_type
            ParentAccStatement.Remark = 'Deposit'

            // // console.log(ParentAccStatement)
            const accStatementparent = await AccModel.create(ParentAccStatement)
            socket.emit('acceptpaymetnreq',{status:'success',msg:'request approved'})
        }catch(err){
            socket.emit('acceptpaymetnreq',{status:'fail',msg:'something went wrong'})

        }
    })

    socket.on('deniePaymentReq',async(data)=>{
        try{
            let report = await paymentReportModel.findByIdAndUpdate(data.id,{status:'denied',remark:data.remark})

            const childUser = await User.findOne({userName:report.username});
            const parentUser = await User.findById(childUser.parent_id);
           
            let childAccStatement = {}
            let ParentAccStatement = {}
            let date = Date.now()
            let date1 = Date.now() + 1000

            // //for child User//
            childAccStatement.child_id = childUser.id;
            childAccStatement.user_id = childUser.id;
            childAccStatement.parent_id = parentUser.id;
            childAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
            childAccStatement.creditDebitamount = data.amount * 1;
            childAccStatement.balance = childUser.balance + parseInt(data.amount);
            childAccStatement.date = date
            childAccStatement.userName = childUser.userName
            childAccStatement.role_type = childUser.role_type
            childAccStatement.Remark = '-'

            const accStatementChild = await AccModel.create(childAccStatement)
            childAccStatement.creditDebitamount = data.amount * -1;
            childAccStatement.balance = childUser.balance;
            childAccStatement.date = date1
            childAccStatement.description = 'Chips debited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
            childAccStatement.Remark = data.remark
            const accStatementChild1 = await AccModel.create(childAccStatement)
            if(!accStatementChild || !accStatementChild1){
                return next(new AppError("Ops, Something went wrong Please try again later", 500))
            }
            // // console.log(childAccStatement)
            // // for parent user // 
            ParentAccStatement.child_id = childUser.id;
            ParentAccStatement.user_id = parentUser.id;
            ParentAccStatement.parent_id = parentUser.id;
            ParentAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")"
            ParentAccStatement.creditDebitamount = data.amount * -1;
            ParentAccStatement.balance = parentUser.availableBalance - parseInt(data.amount);
            ParentAccStatement.date = date
            ParentAccStatement.userName = parentUser.userName;
            ParentAccStatement.role_type = parentUser.role_type
            ParentAccStatement.Remark = '-'

            // // console.log(ParentAccStatement)
            await AccModel.create(ParentAccStatement)
            ParentAccStatement.description = 'Chips debited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
            ParentAccStatement.creditDebitamount = data.amount * 1;
            ParentAccStatement.balance = parentUser.availableBalance;
            ParentAccStatement.date = date1
            ParentAccStatement.Remark = data.remark
            await AccModel.create(ParentAccStatement)

            socket.emit('deniePaymentReq',{status:'success',msg:'payment request denied'})
        }catch(err){
            socket.emit('deniePaymentReq',{status:'fail',msg:'Somethig went wrong',err})
            console.log(err)

        }
    })

    socket.on('paymentApprovaltable',async(data)=>{
        // console.log(data.filterData)
        if(data.filterData.status == "All"){
            delete data.filterData.status
        }
        if(data.filterData.pmethod == "All"){
            delete data.filterData.pmethod
        }
        
        if(data.filterData.fromDate && data.filterData.toDate){
            data.filterData.date = {$gte : new Date(data.filterData.fromDate),$lte : new Date(new Date(data.filterData.toDate))}
            delete data.filterData.fromDate;
            delete data.filterData.toDate;
        }else{
            if(data.filterData.fromDate){
                data.filterData.date = {$gte : data.filterData.fromDate}
                delete data.filterData.fromDate;

            }
            if(data.filterData.toDate){
                data.filterData.date = {$lte : new Date(new Date(data.filterData.toDate))}
                delete data.filterData.toDate;

            }
        }
        let limit;
        let page = data.page;
        let skip;
        if(data.refreshStatus){
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = limit * page
        }
        let childrenUsername = []
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }else{
            childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
            // children.map(ele => {
            //     childrenUsername.push(ele.userName) 
            // })
        }     
        if(data.LOGINDATA.LOGINUSER.userName != data.filterData.username){
        }
        else{
            data.filterData.username = {$in:childrenUsername}

        }

        let paymentreq = await paymentReportModel.find(data.filterData).sort({date:-1}).skip(skip).limit(limit)
        socket.emit('paymentApprovaltable',{paymentreq,page,refreshStatus:data.refreshStatus})
    })

    socket.on('getcountofpaymentreq',async(data)=>{
        try{
            // console.log(data)
            let childrenArr = []
            childrenArr = await User.distinct('userName', { parentUsers: data.LOGINUSER._id });
            // let children = await User.find({parentUsers:data.LOGINUSER._id})
            // children.map(ele => {
            //     childrenArr.push(ele.userName)
            // })
            let paymentreqcount = await paymentReportModel.count({username:{$in:childrenArr},status:'pending'})
            socket.emit('getcountofpaymentreq',{status:'success',paymentreqcount})
        }catch(err){
            socket.emit('getcountofpaymentreq',{status:'fail',msg:'something went wrong'})
        }
    })


    socket.on('getcountofWITHROWREQ',async(data)=>{
        try{
            let withrowReqCount = await withdowReqModel.count({sdmUserName:data.LOGINUSER.userName,reqStatus:'pending'})
            socket.emit('getcountofWITHROWREQ',{status:'success',withrowReqCount})
        }catch(err){
            socket.emit('getcountofWITHROWREQ',{status:'fail',msg:'something went wrong'})
        }
    })


    socket.on('channelId', async(data) => {

        console.log(data)
        if(data.LOGINDATA.LOGINUSER){
            let ip = data.LOGINDATA.IP.split('::ffff:')[1];
            let eventId = data.search.split('=')[1]
            let StreamData = await streamModel.findOne({eventId:eventId})
            let srs = ''
            if(StreamData){
                if(StreamData.status){
                    srs = StreamData.url
                    status = true
                }
            }else{
                liveStream = await liveStreameData(data.channelId, ip)
                console.log(liveStream, "liveStreamliveStreamliveStream")
                const src_regex = /src='([^']+)'/;
                let match1
                // let src
                if(liveStream.data){
            
                    match1 = liveStream.data.match(src_regex);
                    if (match1) {
                        srs = match1[1];
                        status = true
                    } else {
                        console.log("No 'src' attribute found in the iframe tag.");
                    }
                }
            }
            console.log(srs, "liveStreamliveStreamliveStream")
            socket.emit("channelId", srs)
        }
    })


    socket.on('addBenkDetailsUserSide', async(data) => {
        // console.log(data)
        let errorEmitted = false;
        if(data.data.accountholdername === ''){
            socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a Account Name'})
            errorEmitted = true;
        }
        if(data.data.displayname === ''){
            socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a Display Name'})
            errorEmitted = true;
        }
        if(data.data.pmethod === 'banktransferW'){
            if(data.data.accountnumber === ''){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a Account Number'})
                errorEmitted = true;
            }else if (data.data.accountnumber.length != 16){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a valid Account Number'})
                errorEmitted = true;
            }
            if(data.data.ifsccode === ''){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a Bank IFSC Code'})
                errorEmitted = true;
            }
            if(data.data.bankname === ''){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a Bank Name'})
                errorEmitted = true;
            }
            if(data.data.branchname === ''){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a Branch Name'})
                errorEmitted = true;
            }
        }else if (data.data.pmethod === 'upiW'){
            if(data.data.upiid === ''){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a UPI Id'})
                errorEmitted = true;
            }
        }else{
            if(data.data.phonenumber === ''){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a Phone Number'})
                errorEmitted = true;
            }else if (data.data.phonenumber.length != 10){
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a valid Phone Number'})
                errorEmitted = true;
            }
        }


        if(!errorEmitted){
            let user = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
            const passcheck = await user.correctPassword(data.data.password, user.password)
            if(passcheck){
                try{
                let NewDATA = {}
                Object.keys(data.data).map((ele) => {
                    if(data.data[ele] != ""){
                        NewDATA[ele] = data.data[ele]
                    }
                })
                    let filterdata = {}
                    let filterarr = []
                    if(NewDATA.pmethod === 'banktransferW'){
                        filterarr.push({accountnumber:data.data.accountnumber})
                    }else if(NewDATA.pmethod === 'upiW'){
                        filterarr.push({upiid:data.data.upiid})
                    }else{
                        filterarr.push({phonenumber:data.data.phonenumber})
                    }
                    filterdata.$or = filterarr
                    // console.log(filterdata)
                    NewDATA.userName = user.userName
                    if(!await manageAccountsUser.findOne(filterdata)){
                        await manageAccountsUser.create(NewDATA)
                        socket.emit('addBenkDetailsUserSide',{status:'success',msg:'payment method added successfully'})
                    }else{
                        socket.emit('addBenkDetailsUserSide',{status:'err',msg:'this account number is alredy exist'})
                    }
                }catch(err){
                    // console.log(err)
                    socket.emit('addBenkDetailsUserSide',{status:'err',msg:'something went wrong'})
                }
            }else{
                socket.emit('addBenkDetailsUserSide', {status:'err', msg : 'Please Provide a valid password'})
            }
        }
    })

    socket.on('FilterAccounts', async(data) => {
        if(data.LOGINDATA){
            let accounts = await manageAccountsUser.find({pmethod:data.val, userName:data.LOGINDATA.LOGINUSER.userName})
            if(data.val === 'All'){
                accounts = await manageAccountsUser.find({userName:data.LOGINDATA.LOGINUSER.userName})
            }
            socket.emit('FilterAccounts', accounts)
        }
    })

    socket.on('UpdateStatusAccount', async(data) => {
        let thatData = await manageAccountsUser.findById(data)
        if(thatData){
            let statusUpdated = !thatData.status
            await manageAccountsUser.findByIdAndUpdate(data, {status:statusUpdated})
        }
    })

    socket.on('getAccountsData', async(data) => {
        if(data.LOGINUSER){
            try{
                let accounts = await manageAccountsUser.find({userName:data.LOGINUSER.userName, pmethod:'banktransferW', status:true})
                socket.emit('getAccountsData', {status:'sucess', data:accounts})
            }catch{
                console.log(err)
                socket.emit('getAccountsData', {status:'err', msg:'Please try again leter'})
            }
        }
    })

    socket.on('getAccountsDataUPI', async(data) => {
        if(data.LOGINUSER){
            try{
                let accounts = await manageAccountsUser.find({userName:data.LOGINUSER.userName, pmethod:'upiW', status:true})
                socket.emit('getAccountsDataUPI', {status:'sucess', data:accounts})
            }catch{
                console.log(err)
                socket.emit('getAccountsDataUPI', {status:'err', msg:'Please try again leter'})
            }
        }
    })



    socket.on('getAccountDataPaytm', async(data) => {
        if(data.LOGINUSER){
            try{
                let accounts = await manageAccountsUser.find({userName:data.LOGINUSER.userName, pmethod:'paytmW', status:true})
                console.log(accounts, "accountsaccounts")
                socket.emit('getAccountDataPaytm', {status:'sucess', data:accounts})
            }catch{
                console.log(err)
                socket.emit('getAccountDataPaytm', {status:'err', msg:'Please try again leter'})
            }
        }
    })

    socket.on('tabAccountData', async(data) => {
        // console.log(data)
        if(data.LOGINDATA.LOGINUSER){
            try{
                let accounts = await manageAccountsUser.findById(data.id)
                // console.log(accounts, "accountsaccounts")
                if(accounts){
                    socket.emit('tabAccountData', {status:'sucess', data:accounts})
                }else{
                    socket.emit('tabAccountData', {status:'err', msg:'Please try again leter'})
                }
            }catch{
                console.log(err)
                socket.emit('tabAccountData', {status:'err', msg:'Please try again leter'})
            }
        }
    })


    socket.on('withrowReq', async(data) => {
        if(data.LOGINDATA.LOGINUSER){
            try{
                let loginUser = await User.findById(data.LOGINDATA.LOGINUSER._id)
                if(loginUser.availableBalance > data.data.amount){
                    let newData = {}
                    newData.userName =  data.LOGINDATA.LOGINUSER.userName
                    let sdmId 
                    if(data.LOGINDATA.LOGINUSER.parentUsers[1]){
                        sdmId = data.LOGINDATA.LOGINUSER.parentUsers[1]
                    }else{
                        sdmId = data.LOGINDATA.LOGINUSER.parent_id
                    }
                    let sdmUser = await User.findById(sdmId)
                    newData.sdmUserName = sdmUser.userName
                    newData.payMentMethodId = data.data.id
                    newData.amount = data.data.amount
                    newData.note = data.data.notes
                    let createdData = await withdowReqModel.create(newData)
                    if(createdData){
                        socket.emit('withrowReq', {status:'sucess', msg:'Withdrawal request submitted successfully.'})
                    }else{
                        socket.emit('withrowReq', {status:'err', msg:'Please try again leter'})
                    }
                }else{
                    socket.emit('withrowReq', {status:'err', msg:'Your withdrawal amount is within your available balance'})
                }
            }catch(err){
                console.log(err)
                socket.emit('withrowReq', {status:'err', msg:'Please try again leter'})
            }
        }
    })

    socket.on('GEtACcountData', async(data) => {
        try{
            let acc = await manageAccountsUser.findById(data)
            if(acc){
                socket.emit('GEtACcountData', {status:'sucess', data:acc})
            }else{
                socket.emit('GEtACcountData', {status:'sucesserr', msg:'Please try again leter'})
            }
        }catch(err){
            console.log(err)
            socket.emit('GEtACcountData', {status:'err', msg:'Please try again leter'})
        }
    })

    socket.on('reqApproveUpdate', async(data) => {
        // console.log(data)
        try{
            let reqData = await withdowReqModel.findById(data.data.id)
            if(reqData){
                // console.log(reqData, "reqDatareqDatareqData")
                let userCe = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
                const passcheck = await userCe.correctPassword(data.data.password, userCe.password)
                if(passcheck){
                    let date123 = Date.now()
                    let user = await User.findOne({userName:reqData.userName})
                    let parentUser = await User.findById(user.parent_id)
                    let amount = (data.data.approvedamount * 1)
                    let userAccData = {
                        child_id:user.id,
                        user_id:user.id,
                        parent_id:user.parent_id,
                        description:'Settlement(withdraw) ' + user.name + '(' + user.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")",
                        creditDebitamount : -amount,
                        balance: user.availableBalance - amount,
                        date: date123,
                        userName:reqData.userName,
                        role_type:user.role_type,
                        Remark:reqData.note
                    }
                    let ParentData = {
                        child_id:user.id,
                        user_id:user.parent_id,
                        parent_id:user.parent_id,
                        description:'Settlement(withdraw) ' + user.name + '(' + user.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")",
                        creditDebitamount : amount,
                        balance: parentUser.availableBalance + amount,
                        date: date123,
                        userName:parentUser.userName,
                        role_type:parentUser.role_type,
                        Remark:reqData.note
                    }
                    let updatedParentUser = await User.findByIdAndUpdate(user.parent_id, {$inc:{availableBalance:amount, balance:amount}})
                    let updatedUser = await User.findByIdAndUpdate(user.id, {$inc:{availableBalance: -amount, balance: -amount}})
                    if(updatedParentUser && updatedUser){
                        await AccModel.create(userAccData)
                        await AccModel.create(ParentData)
                        let updatedReq = await withdowReqModel.findByIdAndUpdate(data.data.id, {approvalDate:date123, reqStatus:'transferred'})
                        socket.emit('reqApproveUpdate', {status:'sucess', updatedReq, reqStatus:'transferred',date123 })
                    }
                }else{
                    socket.emit('reqApproveUpdate', {status:'err', msg:'Please Provide a valid Password'})
                }
            }else{
                socket.emit('reqApproveUpdate', {status:'err', msg:'Please try again leter'})
            }
        }catch(err){
            console.log(err)
            socket.emit('reqApproveUpdate', {status:'err', msg:'Please try again leter'})
        }
    })


    socket.on('reqCancelUpdate', async(data) => {
        try{
            let reqData = await withdowReqModel.findById(data.data.id)
            if(reqData){
                let userCe = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
                const passcheck = await userCe.correctPassword(data.data.password, userCe.password)
                if(passcheck){
                    let date1234 = Date.now()
                    let cancelUpdate  = await  withdowReqModel.findByIdAndUpdate(data.data.id, {reqStatus:'cancel', sdmRemark:data.data.remark, approvalDate:date1234})
                    socket.emit('reqCancelUpdate', {status:'sucess', cancelUpdate, reqStatus:'cancel', date1234})
                }else{
                    socket.emit('reqCancelUpdate', {status:'err', msg:'Please provide a valid password'})
                }
            }else{
                socket.emit('reqCancelUpdate', {status:'err', msg:'Please try again leter'})
            }
        }catch(err){
            console.log(err)
            socket.emit('reqCancelUpdate', {status:'err', msg:'Please try again leter'})
        }
    })


    socket.on('editPaymentMethodUserSide', async(data) => {
        try{
            let resData = await manageAccountsUser.findById(data)
            if(resData){
                socket.emit('editPaymentMethodUserSide', {status:'sucess', data:resData})
            }else{
                socket.emit('editPaymentMethodUserSide', {status:'err', msg:'Please try again leter'})
            }
        }catch(err){
            console.log(err)
            socket.emit('editPaymentMethodUserSide', {status:'err', msg:'Please try again leter'})
        }
    })

    socket.on('editData', async(data) => {
        try{
            let thatmethod = await manageAccountsUser.findById(data.data.id)
            if(thatmethod){
                let errorEmitted = false;
                if(data.data.accountholdername === ''){
                    socket.emit('editData', {status:'err', msg : 'Please Provide a Account Name'})
                    errorEmitted = true;
                }
                if(data.data.displayname === ''){
                    socket.emit('editData', {status:'err', msg : 'Please Provide a Display Name'})
                    errorEmitted = true;
                }
                if(thatmethod.pmethod === 'banktransferW'){
                    if(data.data.accountnumber === ''){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a Account Number'})
                        errorEmitted = true;
                    }else if (data.data.accountnumber.length != 16){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a valid Account Number'})
                        errorEmitted = true;
                    }
                    if(data.data.ifsccode === ''){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a Bank IFSC Code'})
                        errorEmitted = true;
                    }
                    if(data.data.bankname === ''){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a Bank Name'})
                        errorEmitted = true;
                    }
                    if(data.data.branchname === ''){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a Branch Name'})
                        errorEmitted = true;
                    }
                }else if (thatmethod.pmethod === 'upiW'){
                    if(data.data.upiid === ''){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a UPI Id'})
                        errorEmitted = true;
                    }
                }else{
                    if(data.data.phonenumber === ''){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a Phone Number'})
                        errorEmitted = true;
                    }else if (data.data.phonenumber.length != 10){
                        socket.emit('editData', {status:'err', msg : 'Please Provide a valid Phone Number'})
                        errorEmitted = true;
                    }
                }


                if(!errorEmitted){
                    let user = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
                    const passcheck = await user.correctPassword(data.data.password, user.password)
                    if(passcheck){
                        let data1 = await manageAccountsUser.findByIdAndUpdate(data.data.id, data.data)
                        if(data1){
                            socket.emit('editData', {status:'sucess', msg:'Updated Sucessfully!!'})
                        }
                    }else{
                        socket.emit('editData', {status:'err', msg:'Please provide a valid password'})
                    }
                }

            }else{
                console.log('WORKING123456')
                socket.emit('editData', {status:'err', msg:'Please try again leter'})
            }
        }catch(err){
            console.log(err)
            socket.emit('editData', {status:'err', msg:'Please try again leter'})
        }
    })



    socket.on('deleteMethodUSERACC', async(data) => {
        if(data.LOGINDATA.LOGINUSER){
            if(data.data.checkbox){
                // console.log(data.data)
                let deleteData = await manageAccountsUser.findByIdAndDelete(data.data.id)
                if(deleteData){
                    socket.emit('deleteMethodUSERACC', {status:'sucess', msg:'deleted Sucessfully!!'})
                }else{
                    socket.emit('deleteMethodUSERACC', {status:'err', msg:'Please try again leter'})
                }
            }else{
                socket.emit('deleteMethodUSERACC', {status:'err', msg:'Please try again leter'})
            }
        }else{
            socket.emit('deleteMethodUSERACC', {status:'err', msg:'Please try again leter'})
        }
    })


    socket.on('WithdrawLoadMoreAdmin', async(data) => {
        let limit;
        let page = data.page;
        let skip;
        if(data.refreshStatus){
            // console.log('working')
            limit = (10 * page) + 10
            skip = 0
        }else{
            limit = 10
            skip = limit * page
        }
        let userName = data.LOGINDATA.LOGINUSER.userName
        if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
            let ParentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
            userName = ParentUser.userName
        }
        let filterData = {}
        filterData.sdmUserName = userName
        if(data.filterData.userName){
            filterData.userName = data.filterData.userName
        }
        if(data.filterData.status && data.filterData.status != 'All'){
                filterData.reqStatus = data.filterData.status
        }

        if(data.filterData.fromDate && data.filterData.toDate){
            filterData.reqDate = {$gte : new Date(data.filterData.fromDate),$lte : new Date(new Date(data.filterData.toDate))}
        }else if (data.filterData.fromDate && !data.filterData.toDate){
            filterData.reqDate =  {$gte : data.filterData.fromDate}
        }else if(!data.filterData.fromDate && data.filterData.toDate) {
            filterData.reqDate = {$lte : new Date(new Date(data.filterData.toDate))}
        }
        let reqData = await withdowReqModel.find(filterData).sort({reqDate:-1}).skip(skip).limit(limit)
        if(data.refreshStatus){
            socket.emit('WithdrawLoadMoreAdmin', {reqData, page, refresh:true})
        }else{
            socket.emit('WithdrawLoadMoreAdmin', {reqData, page})
        }

    })



    socket.on('withdrawalRequestDataUserSide', async(data) => {
        // console.log(data)
        let filterData = {}
        if(data.LOGINDATA.LOGINUSER){
            let page = data.page
            filterData.userName = data.LOGINDATA.LOGINUSER.userName
            if(data.filterData.select && data.filterData.select !== "All"){
                filterData.reqStatus = data.filterData.select
            }

            if(data.filterData.fdate && data.filterData.tdate){
                filterData.reqDate = {$gte : new Date(data.filterData.fdate),$lte : new Date(new Date(data.filterData.tdate))}
            }else if(data.filterData.fdate && !data.filterData.tdate){
                filterData.reqDate = {$gte : data.filterData.fdate}
            }else if(!data.filterData.fdate && data.filterData.tdate){
                filterData.reqDate = {$lte : new Date(new Date(data.filterData.tdate))}
            }

            let returnData = await withdowReqModel.find(filterData).skip(10 * page).limit(10)
            socket.emit('withdrawalRequestDataUserSide', {returnData, page})
        }

    })


    socket.on('cashoutCheck', async(data) => {
        let Status = false
        let Bets = []
        if(data.LOGINDATA.LOGINUSER){
            Bets = await Bet.find({userId:data.LOGINDATA.LOGINUSER._id, marketId:data.id})
        }
        if(Bets.length > 0){
            Status = true
        }
        socket.emit('cashoutCheck', {Status})
    })

    socket.on('HTMLSCOREDATA', async(data) => {
        let matchScore = await scores(data)
        socket.emit("HTMLSCOREDATA", matchScore)
    })


    socket.on('cashOOut', async(data) => {
        // console.log(data)
        if(data.LOGINDATA.LOGINUSER){
            let runners = await runnerData.findOne({marketId:data.id})
            runners = JSON.parse(runners.runners)
            console.log(runners, "runnersrunners")
            let bets = await Bet.aggregate([
                {
                    $match:{
                        status:'OPEN',
                        eventId:data.eventID,
                        marketId:data.id,
                        userId:data.LOGINDATA.LOGINUSER._id
                    }
                },
                {
                    $group:{
                        _id:null,
                        firstAmount:{
                            $sum:{
                                $cond:{
                                    if:{$eq : ['$secId', `${runners[0].secId}`]},
                                    then:  {
                                        $sum: "$exposure"
                                    },
                                    else:  {
                                        $sum: -"$exposure"
                                    },
                                }
                            }
                        },
                        secondAmount:{
                            $sum:{
                                $cond:{
                                    if:{$eq : ['$secId', `${runners[1].secId}`]},
                                    then:  {
                                        $sum: "$exposure"
                                    },
                                    else:  {
                                        $sum: -"$exposure"
                                    },
                                }
                            }
                        }
                    }
                }
            ])
            if(bets.length > 0){
                bets = bets[0]
                let data = {}
                let upperAmt = 0
                let biggerValueSecId
                if( !isNaN(bets.firstAmount) &&  !isNaN(bets.secondAmount)){
                    upperAmt = bets.firstAmount - bets.secondAmount
                    biggerValueSecId = bets.firstAmount > bets.secondAmount ? runners[0].secId : bets.firstAmount < bets.secondAmount ? runners[1].secId : 'values are equal';
                }else if(isNaN(bets.firstAmount) &&  !isNaN(bets.secondAmount)){
                    upperAmt = bets.secondAmount
                    biggerValueSecId = runners[1].secId
                }else if (!isNaN(bets.firstAmount) &&  isNaN(bets.secondAmount)){
                    upperAmt = bets.firstAmount
                    biggerValueSecId = runners[0].secId
                }
                // console.log(upperAmt, biggerValueSecId)
                let divedAmount = 0
                let marketOddsData = await marketDetailsBymarketID([data.id])
                console.log(marketOddsData)
                // marketOddsData = marketOddsData.data.items[0].odds
                // const selectedItem = marketOddsData.find(item => item.selectionId === biggerValueSecId);
                // if (selectedItem) {
                //     const layPrice1 = parseFloat(selectedItem.layPrice1);
                //     const otherItem = marketOddsData.find(item => item.selectionId !== biggerValueSecId);
                    
                //     if (otherItem) {
                //       const backPrice1Other = parseFloat(otherItem.backPrice1);
                      
                //       if (layPrice1 < backPrice1Other) {
                //         divedAmount = layPrice1
                //         data.secId = biggerValueSecId
                //       } else {
                //         divedAmount = backPrice1Other
                //         data.secId = otherItem.selectionId
                //       }
                //     } else {
                //       console.log('No other item found');
                //     }
                //   } else {
                //     console.log('Item with the given id not found');
                //   }
                //   console.log(divedAmount, data)
                // console.log(marketOddsData)
            }
        }
    })

})

http.listen(8080,()=> {
    console.log('app is running on port 8080')
})