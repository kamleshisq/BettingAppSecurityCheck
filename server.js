const app = require('./app');
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
const mapBet = require("./websocketController/mapBetsController");
const commissionModel = require("./model/CommissionModel");
const catalogController = require("./model/catalogControllModel");
const commissionMarketModel = require("./model/CommissionMarketsModel");
const netCommissionModel = require('./model/netCommissionModel');
const commissionRepportModel = require('./model/commissionReport');
const { error } = require('console');
const checkPass = require("./websocketController/checkPassUser");
const { type } = require('os');
const checkPassAsync = util.promisify(checkPass.checkPass);
const betLimitMatchWisemodel = require('./model/betLimitMatchWise');
const voidbetAfterPlace = require('./utils/voideBetAfterPlace');
const voidBetBeforePlace = require('./utils/voidBetForOpen');
const rollBackBet = require('./utils/RollBackAfterPlace');
// const { Linter } = require('eslint');
io.on('connection', (socket) => {
    console.log('connected to client')
   
    // console.log(loginData.Token)
    // console.log(global._token)
    socket.emit("loginUser", {
        loginData:global.loginData
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






//......................FOR user management page .......................//


    socket.on("Parent", async(id) => {
       let child = await User.find({parent_id: id})
       socket.emit("child", child);
    })

    socket.on("search", async(data) => {
        // console.log(data.LOGINDATA.LOGINTOKEN);
        // console.log(data);
        let page = data.page; 
        let limit = 10
        let user
        // const me = await User.findById(data.id)
        // console.log(data.LOGINDATA)
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        if(Object.keys(data.filterData).length !== 0){

            data.filterData.parentUsers = { $elemMatch: { $eq: data.LOGINDATA.LOGINUSER._id } }
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
            if(data.LOGINDATA.LOGINUSER.role.role_level == 1){
                // console.log(data.filterData)
                // console.log(data.filterData)
                // user = await User.find({userName:new RegExp(data.filterData.userName,"i"), data.filterData})
                    if(data.filterData.role_type){
                    // console.log(parseInt(data.filterData.role_type))
                    if(role_type.includes(parseInt(data.filterData.role_type))){
                        user = await User.find(data.filterData).skip(page * limit).limit(limit)
                    }else{
                        socket.emit('searchErr',{
                            message:'you not have permition'
                        })
                    }
                }else{
                    data.filterData.role_type = {
                        $ne : 1
                    }
                    user = await User.find(data.filterData).skip(page * limit).limit(limit)
                }            
            }else{
                if(data.filterData.role_type){
                    if(role_type.includes((data.filterData.role_type) * 1)){
                        // console.log('here')
                        user = await User.find(data.filterData).skip(page * limit).limit(limit)
                    }else{
                        socket.on('searchErr',{
                            message:'you not have permition'
                        })
                    }
                }else{

                    let role_Type = {
                        $in:role_type
                    }
                    data.filterData.role_type = role_Type
                    console.log(data.filterData)
                    user = await User.find(data.filterData).skip(page * limit).limit(limit)
                }
            }
        }else{
            user = await User.find({parent_id:data.id}).skip(page * limit).limit(limit)
           }
        let currentUser = data.LOGINDATA.LOGINUSER

        // console.log(user)
        // console.log(page)
        let response = user;
        //urlRequestAdd(`/api/v1/users/searchUser?username = ${data.filterData.userName}& role=${data.filterData.role}& whiteLable = ${data.filterData.whiteLabel}`,'GET', data.LOGINDATA.LOGINTOKEN)
        socket.emit("getOwnChild", {status : 'success',response, currentUser,page,roles})
    })


    socket.on('userHistory',async(data)=>{
        console.log(data.filterData)
        let page = data.page;
        let limit = 10;
        let filter = {}
        if(data.filterData.userName){
            filter.userName = data.filterData.userName
        }
        if(data.filterData.fromDate && data.filterData.toDate){
            filter.login_time = {$gte:new Date(data.filterData.fromDate),$lte:new Date(data.filterData.toDate)}
        }else if(data.filterData.fromDate && !data.filterData.toDate){
            filter.login_time = {$gte:new Date(data.filterData.fromDate)}
        }else if(data.filterData.toDate && !data.filterData.fromDate){
            filter.login_time = {$lte:new Date(data.filterData.toDate)}
        }
        console.log(filter)
        let users = await loginlogs.aggregate([
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
                    'userDetails.parentUsers':{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}},
                }
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
        console.log(users)
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
        // console.log(id)
        // let data = {userId:`${id}`}
        let fullUrl =  `http://127.0.0.1/api/v1/auth/logOutSelectedUser?userId=`+id
        fetch(fullUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ` + loginData.Token }
        }).then(res => res.json())
        .then(json =>{
            console.log(json.status)
            if(json.status == "success"){
                socket.emit("SelectLogoutUserId", "success")
            }
        })
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
        if(data.id){
            // console.log()
            fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement?id=' + data.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate  
        }else{
            fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement?id=' + data.LOGINDATA.LOGINUSER._id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate 

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
        let limit = 10
        let dataM 
        console.log(data.filterData)
        console.log(data.LOGINDATA.LOGINUSER.userName)
        
        User.aggregate([
            {
              $match: {
                parentUsers: { $elemMatch: { $eq: data.LOGINDATA.LOGINUSER._id } }
              }
            },
            {
              $group: {
                _id: null,
                userIds: { $push: '$userName' } 
              }
            }
          ])
            .then((userResult) => {
              const userIds = userResult.length > 0 ? userResult[0].userIds : [];
                if(data.filterData.userName === data.LOGINDATA.LOGINUSER.userName){
                    dataM = {
                        status:{$ne:"OPEN"},
                        userName: { $in: userIds }
                    }
                }else{
                    dataM = {
                        userName: data.filterData.userName,
                        status: {$ne:"OPEN"}
                    }
                }
              Bet.aggregate([
                {
                  $match:dataM
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
                        returns:{$sum:{$cond:[{$eq:['$status','LOSS']},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}}
                        
                    }
                },
                {
                    $group:{
                        _id:'$_id.userName',
                        gameCount:{$sum:1},
                        betCount:{$sum:'$gameCount'},
                        loss:{$sum:'$loss'},
                        won:{$sum:'$won'},
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
                    $skip:(page * limit)
                },
                {
                    $limit:limit
                }
              ])
                .then((betResult) => {
                //   socket.emit("aggreat", betResult)
                let games = betResult
                socket.emit('gameReport',{games,page})
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        })

    socket.on("SearchACC", async(data) => {
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
                    parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}}
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

    socket.on('userBetDetail',async(data)=>{
        let limit = 10;
        let page = data.page;
        // console.log(data.filterData)
        // const roles = await Role.find({role_type: {$gt:data.LOGINDATA.LOGINUSER.role.role_type}});
        // let role_type =[]
        // for(let i = 0; i < roles.length; i++){
        //     role_type.push(roles[i].role_type)
        // }
        // data.filterData.role_type = {
        //     $in:role_type
        // }
        // data.filterData.status = {
        //     $ne:"OPEN"
        // }
        // const user = await User.findOne({userName:data.filterData.userName})
        // if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
        //     delete data.filterData['userName']
        //     let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
        //     socket.emit('userBetDetail',{ubDetails,page})
        // }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
        //     let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
        //     socket.emit('userBetDetail',{ubDetails,page})

        // }
        // if(data.fromDate && data.toDate){
        //     data.filterData.date = 
        // }

        if(data.fromDate && data.toDate){
            data.filterData.date = {$gte:new Date(data.fromDate),$lte:new Date(data.toDate)}
        }else if(data.fromDate && !data.toDate){
            data.filterData.date = {$gte:new Date(data.fromDate)}
        }else if(data.toDate && !data.fromDate){
            data.filterData.date = {$lte:new Date(data.toDate)}
        }

        if(data.filterData.betType === 'All'){
            delete data.filterData['betType']
        }

        if(data.filterData.status == 'All'){
            data.filterData.status = {$ne: "OPEN"}
        }
        console.log(data.filterData)

        let ubDetails = await Bet.aggregate([
            {
                $match: data.filterData
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
                    'userDetails.parentUsers':{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}},
                }
            },
            {
                $sort:{
                    date:-1
                }
            },
            {
                $skip:(page * 10)
            },
            { $limit : 10 }
        ])

        socket.emit('userBetDetail',{ubDetails,page})

        // User.aggregate([
        //     {
        //       $match: {
        //         parentUsers: { $elemMatch: { $eq: data.LOGINDATA.LOGINUSER._id } }
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
        //       const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
        //       data.filterData.userId = { $in: userIds }
        //       if(data.filterData.userName === data.LOGINDATA.LOGINUSER.userName){
        //           delete data.filterData['userName']
        //       }

        //       if(data.filterData.betType == "All"){
        //         delete data.filterData['betType']
        //       }
              
            //   if(data.filterData.status == 'All'){
            //     data.filterData.status = {$nin: ["OPEN", "ALERT"]}
            //   }
        //       console.log(data.filterData)
        //       Bet.aggregate([
        //         {
        //           $match: data.filterData
        //         },
        //         {
        //             $sort:{
        //                 date:-1
        //             }
        //         },
        //         {
        //             $skip:(page * limit)
        //         },
        //         {
        //             $limit:limit
        //         }
        //       ])
        //         .then((betResult) => {
        //         //   socket.emit("aggreat", betResult)
        //             let ubDetails = betResult
        //             socket.emit('userBetDetail',{ubDetails,page})
        //         })
        //         .catch((error) => {
        //           console.error(error);
        //         });
        //     })
        //     .catch((error) => {
        //       console.error(error);
        //     });
        
        
        // console.log(user)
    })


    socket.on('betMoniter',async(data)=>{
        console.log(data.filterData)
        if(data.filterData.marketName == "All"){
            delete data.filterData.marketName
        }
        if(data.filterData.marketName == "Fancy"){
            data.filterData.marketName = {$nin:["Match Odds", "Bookmaker 0%Comm"]}
        }
        if(data.filterData.betType == "All"){
            delete data.filterData.betType; 
        }
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
        data.filterData.status = 'OPEN';
        const user = await User.findOne({userName:data.filterData.userName})
        if(data.LOGINDATA.LOGINUSER.role_type == 1 && data.filterData.userName == 'admin'){
            delete data.filterData['userName']
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('betMoniter',{ubDetails,page})
        }
        else if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
            delete data.filterData['userName']
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('betMoniter',{ubDetails,page})
        }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('betMoniter',{ubDetails,page})

        }
    })


    socket.on('voidBET', async(data)=>{
        console.log(data)
        let limit = 10;
        let page = data.page;
        console.log(data.filterData)
        let filter = {
            status: "CANCEL"
        }
        if(data.filterData.userName && data.filterData.userName != data.LOGINDATA.LOGINUSER.userName ){
            filter.userName = data.filterData.userName
        }
        if(data.filterData.from_date && data.filterData.to_date){
            filter.date = {$gte:new Date(data.filterData.from_date),$lte:new Date(data.filterData.to_date)}
        }else if(data.filterData.from_date && !data.filterData.to_date){
            filter.date = {$gte:new Date(data.filterData.from_date)}
        }else if(data.filterData.to_date && !data.filterData.from_date){
            filter.date = {$lte:new Date(data.filterData.to_date)}
        }
        // if(data.filterData.Sport != "All"){
        //     filter.betType = data.filterData.Sport
        // }
        if(data.filterData.Sport != "All"){
            filter.betType = data.filterData.Sport
        }
        // if(data.filterData.market != All){

        // }
        if(data.filterData.market != "All"){
            if(data.filterData.market === "Match Odds"){
                filter.marketName = { '$regex': '^Match', '$options': 'i' }
            }else if (data.filterData.market === "Bookmaker 0%Comm"){
                filter.marketName = { '$regex': '^Bookma', '$options': 'i' }
            }else if (data.filterData.market === "Fancy"){
                filter.marketName = { '$not': { '$regex': '^(match|bookma)', '$options': 'i' } }
            }
        }
        console.log(filter)
        let betResult = await Bet.aggregate([
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
                    'userDetails.parentUsers':{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}},
                }
            },
            {
                $sort:{
                    date:-1
                }
            },
            {
                $skip:(10 * page)
            },
            {
                $limit:10
            }
        ])
        // console.log(betResult)
        socket.emit("voidBET", {betResult, page})

    })

    socket.on('userPLDetail',async(data)=>{
        let page = data.page;
        let limit = 10;
        let user = await User.findOne({userName:`${data.filterData.userName}`, parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}}})
        if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName && !user){
            let users = await User.find({parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}}}).skip(page * limit).limit(limit)
            socket.emit('userPLDetail',{users,page})
        }else{
            let users = await User.find({userName:`${data.filterData.userName}`, parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}}}).skip(page * limit).limit(limit)
            socket.emit('userPLDetail', {users, page})
        }
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
        console.log(data)
        let page
        let limit = 10
        page = data.page
        if(!page){
            page = 0
        }
        // const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        // let role_type =[]
        // for(let i = 0; i < roles.length; i++){
        //     role_type.push(roles[i].role_type)
        // }
        let onlineUsers
        if(data.filterData && page == 0){
                onlineUsers = await User.find({is_Online:true, userName:data.filterData.userName, parentUsers:{$in:[data.LOGINDATA.LOGINUSER._id]}})
                page = 0
        }else{
                onlineUsers = await User.find({is_Online:true, parentUsers:{$in:[data.LOGINDATA.LOGINUSER._id]}}).skip(page * limit).limit(limit)
                page++
        }
        // if(data.LOGINDATA.LOGINUSER.role_type === 1){
        // }else{
        // }
        // console.log(onlineUsers)
        socket.emit("OnlineUser",{onlineUsers, page})
    })

    socket.on("marketId", async(data) => {
        // console.log(data)
        const result = await marketDetailsBymarketID(data)
        let finalResult = result.data
        const betLimits = await betLimit.find({type:"Sport"})
        // console.log(finalResult)
        socket.emit("marketId", {finalResult,betLimits})
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
        // console.log(data)
        let marketDetails = await marketDetailsBymarketID([`${data.data.market}`])
        // console.log(marketDetails.data.items)
        let thatMarket = marketDetails.data.items[0]
        console.log(thatMarket, 11111)
        if(data.data.secId.startsWith('odd_Even_')){
            if(data.data.secId == "odd_Even_Yes"){
                let odds = thatMarket.odd
                if(!odds){
                    odds = thatMarket.yes
                }
                data.data.odds = odds
                
            }else{
                let odds = thatMarket.even
                if(!odds){
                    odds = thatMarket.no
                }
                data.data.odds = odds
            }
        }else if(thatMarket.title != "Bookmaker 0%Comm" && thatMarket.title != "TOSS" && thatMarket.title != 'BOOKMAKER 0% COMM'){
            // console.log(thatMarket, 45454545454)
            let realodd = thatMarket.odds.find(item => item.selectionId == data.data.secId.slice(0,-1))
            let name
            if(data.data.secId.slice(-1) > 3){
                name = `layPrice${data.data.secId.slice(-1) - 3}`
            }else{
                name = `backPrice${data.data.secId.slice(-1)}`
            }
            let odds = realodd[name];
            data.data.odds = odds
            data.data.secId = data.data.secId.slice(0,-1)
        }else if(thatMarket.title == "Bookmaker 0%Comm" || thatMarket.title == "TOSS" || thatMarket.title != 'BOOKMAKER 0% COMM'){
            // console.log(thatMarket, 4545454)
            let realodd = thatMarket.runners.find(item => item.secId == data.data.secId.slice(0,-1))
            let name
            console.log(data)
            if(data.data.secId.slice(-1) == 2){
                name = `layPrice${data.data.secId.slice(-1) - 3}`
                name =  name.slice(0, -2)
            }else{
                name = `backPrice${data.data.secId.slice(-1)}`
                name = name.slice(0, -1)
            }
            // console.log(name)
            // console.log(name)
            // console.log(realodd[name], realodd, "realodds")
            let odds = realodd[name];
            data.data.odds = odds
            data.data.secId = data.data.secId.slice(0,-1)
        }
        // console.log(data.data)
        let result = await placeBet(data)
        let openBet = []
        if(data.pathname === "/exchange/multimarkets"){
            openBet = await Bet.find({userId:data.LOGINDATA.LOGINUSER._id, status:"OPEN"})
        }else{
            openBet = await Bet.find({userId:data.LOGINDATA.LOGINUSER._id, status:"OPEN", match:data.data.title})
        }
        let user = await User.findById(data.LOGINDATA.LOGINUSER._id)
        socket.emit("betDetails", {result, openBet, user})
    })

    socket.on('voidBet', async(data) => {
        try{

            let bet = await Bet.findByIdAndUpdate(data, {status:"CANCEL"});
            // console.log(bet);
            let user = await User.findByIdAndUpdate(bet.userId, {$inc:{balance: bet.Stake, availableBalance: bet.Stake, myPL: bet.Stake, exposure:-bet.Stake}})
            let description = `Bet for ${bet.match}/stake = ${bet.Stake}/CANCEL`
            let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/CANCEL `
            let userAcc = {
                "user_id":user._id,
                "description": description,
                "creditDebitamount" : bet.Stake,
                "balance" : user.availableBalance + bet.Stake,
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": bet.Stake,
                "transactionId":`${bet.transactionId}`
            }
            let parentAcc
            if(user.parentUsers.length < 2){
                await User.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: bet.Stake, downlineBalance: bet.Stake}})
                let parent = await User.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance:-bet.Stake}})
                parentAcc = {
                    "user_id":parent._id,
                    "description": description2,
                    "creditDebitamount" : -bet.Stake,
                    "balance" : parent.availableBalance - (bet.Stake * 1),
                    "date" : Date.now(),
                    "userName" : parent.userName,
                    "role_type" : parent.role_type,
                    "Remark":"-",
                    "stake": bet.Stake,
                    "transactionId":`${bet.transactionId}Parent`
                }
                
            }else{
                await User.updateMany({ _id: { $in: user.parentUsers.slice(1) } }, {$inc:{balance: bet.Stake, downlineBalance: bet.Stake}})
                let parent = await User.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-bet.Stake}})
                parentAcc = {
                    "user_id":parent._id,
                    "description": description2,
                    "creditDebitamount" : -bet.Stake,
                    "balance" : parent.availableBalance - (bet.Stake * 1),
                    "date" : Date.now(),
                    "userName" : parent.userName,
                    "role_type" : parent.role_type,
                    "Remark":"-",
                    "stake": bet.Stake,
                    "transactionId":`${bet.transactionId}Parent`
                }
            }
            await AccModel.create(userAcc);
            await AccModel.create(parentAcc);
            socket.emit('voidBet', {bet, status:"success"})
        }catch(err){
            console.log(err)
            socket.emit("voidBet",{message:"err", status:"error"})
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
        // console.log(data.ids)
        // const sportData = await getCrkAndAllData()
        // const cricket = sportData[0].gameList[0].eventList
        // let liveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY");
        // const footBall = sportData[1].gameList.find(item => item.sport_name === "Football");
        // const Tennis = sportData[1].gameList.find(item => item.sport_name === "Tennis");
        // let liveFootBall = footBall.eventList.filter(item => item.eventData.type === "IN_PLAY");
        // let liveTennis = Tennis.eventList.filter(item => item.eventData.type === "IN_PLAY")
        // let liveData = liveCricket.concat(liveFootBall, liveTennis);
        // console.log(liveData)
        // console.log(data)
        // Bet.aggregate([
        //     {
        //       $match: {
        //         status: 'OPEN'
        //       }
        //     },
            // {
            //   $group: {
            //     _id: '$secId',
            //     totalStake: { $sum: '$Stake' },
            //     count: { $sum: 1 }
            //   }
            // }
        //   ])
            // .then(result => {
            //     // console.log(result)
            //   socket.emit("aggreat", result)
            // })
        //     User.aggregate([
        //         {
        //           $match: {
                    // parentUsers: { $elemMatch: { $eq: data.LOGINUSER._id } }
        //           }
        //         },
        //         {
        //           $lookup: {
        //             from: 'betmodels',
        //             localField: '_id',
        //             foreignField: 'userId',
        //             as: 'bets'
        //           }
        //         },
        //         {
        //           $unwind: '$bets'
        //         },
        //         {
        //           $match: {
        //             'bets.status': 'OPEN'
        //           }
        //         },
        //         {
        //           $group: {
                    // _id: '$secId',
                    // totalStake: { $sum: '$bets.Stake' },
                    // count: { $sum: 1 }
        //           }
        //         }
        // ]).then(result => {
        //     console.log(result)
        //   socket.emit("aggreat", result)
        // })
        User.aggregate([
            {
              $match: {
                parentUsers: { $elemMatch: { $eq: data.LOGINUSER._id } }
              }
            },
            {
              $group: {
                _id: null,
                userIds: { $push: '$_id' } 
              }
            }
          ])
            .then((userResult) => {
              const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
          
              Bet.aggregate([
                {
                  $match: {
                    userId: { $in: userIds },
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
                .then((betResult) => {
                  socket.emit("aggreat", betResult)
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });

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
        let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
        let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
        let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
        let liveFootBall = footBall.eventList.filter(item => item.eventData.type === "IN_PLAY");
        let liveTennis = Tennis.eventList.filter(item => item.eventData.type === "IN_PLAY")
        socket.emit("liveData", {liveFootBall, liveTennis, LiveCricket})
    })

    socket.on("UserUpdatePass", async(data) => {
        console.log(data.LOGINDATA.LOGINTOKEN)
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
        console.log(data)
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
            console.log(data.LOGINDATA.LOGINUSER._id)
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
    // console.log(page)
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
        let stakeArray = data.input1Values.map((key, index) => ({
            key: parseInt(key.replace(/,/g, ''), 10),
            value: parseInt(data.input2Values[index].replace(/,/g, ''), 10)
          }));
        let userId = data.LOGINDATA.LOGINUSER._id
        let check = await stakeLabelModel.find({userId})
        console.log(check.length)
        console.log(stakeArray, userId)
        if(check.length === 0){
            console.log("WORKING")
            try{
                let data = await stakeLabelModel.create({stakeArray:stakeArray,userId:userId})
                console.log(data)
                socket.emit("STAKELABEL", "Updated")
            }catch(err){
                socket.emit("STAKELABEL", "Please try again later")
            }
        }else{
            try{
                const data = await stakeLabelModel.findOneAndUpdate({userId:userId}, {stakeArray:stakeArray})
                console.log(data)
                socket.emit("STAKELABEL", "Updated")
            }catch(err){
                socket.emit("STAKELABEL", "Please try again later")
            }
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
        console.log(data.data)
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
        console.log(data)
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
        console.log(data)
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
        console.log(data);
    
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
        let filter = {}
        let result = {}
        const currentDate = new Date();

        const currentDateString = currentDate.toISOString().slice(0, 10);
        const oneDayAgo = new Date(currentDate);
        oneDayAgo.setDate(currentDate.getDate() - 1);
        const oneDayAgoString = oneDayAgo.toISOString().slice(0, 10);
        const threeDaysAgo = new Date(currentDate);
        threeDaysAgo.setDate(currentDate.getDate() - 3);
        const threeDaysAgoString = threeDaysAgo.toISOString().slice(0, 10);
        if (data.value === "today") {
            filter = {
                $gte: new Date(currentDateString),
                $lt: new Date(new Date(currentDateString).getTime() + 24 * 60 * 60 * 1000) // Next day
            };
        } else if (data.value === "yesterday") {
            filter = {
                $gte: new Date(oneDayAgoString),
                $lt: new Date(currentDateString)
            };
        } else if (data.value === "all") {
            filter = {
                $lt : new Date(currentDateString)
            };
        } else {
            filter = {
                $gte: new Date(threeDaysAgoString),
                $lt: new Date(currentDateString)
            };
        }

        const userCount = await loginLogs.aggregate([
            {
                $match:{
                    // isOnline: true,
                    login_time:filter
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
                  "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] },
                  "user.roleName" : "user",
                //   "user.is_Online" : true
                }
            },
            {
                $group: {
                    _id: null,
                    uniqueUsers: { $addToSet: "$user._id" } 
                }
            },
            {
                $project: {
                    totalAmount: { $size: "$uniqueUsers" } 
                }
            }
        ])

        if(userCount.length > 0){
            result.userCount = userCount[0].totalAmount
        }else{
            result.userCount = 0
        }

        const adminCount = await loginLogs.aggregate([
            {
                $match:{
                    // isOnline: true,
                    login_time:filter
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
                  "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] },
                  "user.roleName" : {$ne:"user"},
                //   "user.is_Online" : true
                }
            },
            {
                $group: {
                    _id: null,
                    uniqueUsers: { $addToSet: "$user._id" } 
                }
            },
            {
                $project: {
                    totalAmount: { $size: "$uniqueUsers" } 
                }
            }
        ])

        if(adminCount.length > 0){
            result.adminCount = adminCount[0].totalAmount
        }else{
            result.adminCount = 0
        }

        let turnOver = await AccModel.aggregate([
            {
                $match:{
                    userName:data.LOGINDATA.LOGINUSER.userName,
                    date:filter
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
        if(turnOver.length > 0){
            result.turnOver = turnOver[0].totalAmount
            result.Income = turnOver[0].Income
        }else{
            result.turnOver = 0
            result.Income = 0
        }

        if(data.value === "all"){
            betCount = await Bet.aggregate([
                // {
                //     $match:{
                //         date:filter
                //     }
                // },
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
                      "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] }
                    }
                  },
                {
                    $count: "totalBets"
                  }
              ])
        }else{
            betCount = await Bet.aggregate([
                {
                    $match:{
                        date:filter
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
                      "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] }
                    }
                  },
                {
                    $count: "totalBets"
                  }
              ])
        }
          console.log(betCount)
          if(betCount.length > 0){
            result.betCount = betCount[0].totalBets
          }
        // console.log(turnOver)
        // console.log(turnOver.length)

        socket.emit("FIlterDashBoard", {result})

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
            }
        }catch(err){
            console.log(err)
            socket.emit("FUndData",{message:"err", status:"error"})
        }
    })

    socket.on("alertBet", async(data) => {
        try{
            let bet = await Bet.findByIdAndUpdate(data, {status:"Alert"});
            socket.emit('alertBet', {bet, status:"success"})

        }catch(err){
            console.log(err)
            socket.emit("alertBet",{message:"err", status:"error"})
        }
    })

    socket.on("acceptBet", async(data) => {
        try{
            let bet = await Bet.findByIdAndUpdate(data, {status:"OPEN"});
            socket.emit('acceptBet', {bet, status:"success"})

        }catch(err){
            console.log(err)
            socket.emit("acceptBet",{message:"err", status:"error"})
        }
    })

    socket.on('AlertBet',async(data)=>{
        console.log(data.filterData)
        if(data.filterData.marketName == "All"){
            delete data.filterData.marketName
        }
        if(data.filterData.marketName == "Fancy"){
            data.filterData.marketName = {$nin:["Match Odds", "Bookmaker 0%Comm"]}
        }
        if(data.filterData.betType == "All"){
            delete data.filterData.betType; 
        }
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
        data.filterData.status = 'Alert';
        const user = await User.findOne({userName:data.filterData.userName})
        if(data.LOGINDATA.LOGINUSER.role_type == 1 && data.filterData.userName == 'admin'){
            delete data.filterData['userName']
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('AlertBet',{ubDetails,page})
        }
        else if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
            delete data.filterData['userName']
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('AlertBet',{ubDetails,page})
        }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('AlertBet',{ubDetails,page})

        }
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
        console.log(data)
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
            console.log(filter)
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
        console.log(filter)
        let userAcc = await AccModel.find(filter).sort({date: -1}).skip(page * limit).limit(limit)
        console.log(userAcc)
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
        console.log(data)
        await settlement.findOneAndUpdate({userId:data.LOGINDATA.LOGINUSER._id},{status:data.status})
    })

    socket.on('settlement',async(data)=>{
        console.log(data)
        const me = data.LOGINUSER
        let dataobj;

        if(data.fromdate && data.todate){
            let fromDate = new Date(data.fromdate)
            let toDate = new Date(data.todate)
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
            dataobj = {$lte:new Date(toDate)}
        }
        console.log(dataobj, "dateObj")
        let betsEventWise = await Bet.aggregate([
            {
                $match: {
                    // status:"OPEN" ,
                    eventDate: dataobj
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
                  "user.parentUsers": { $in: [me._id] }
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
              }
        ])
        socket.emit('settlement',{betsEventWise})

    })

    socket.on('settlementHistory',async(data)=>{
        let me = data.USER
        let page = data.page;
        let limit = 10
        // console.log(me)
        let History
        let filter = {}
        if(data.from_date && data.to_date){
            filter.date = {$gte:data.from_date,$lte:data.to_date}
        }else if(data.from_date && !data.to_date){
            filter.date = {$gte:data.from_date}
        }else if(data.to_date && !data.from_date){
            filter.date = {$lte:data.to_date}
        }
        console.log(filter)
        if(me.roleName === "Admin"){
            History = await settlementHistory.find(filter).sort({ date: -1 }).skip(page * limit).limit(limit)
        }else{
            filter.userId = me._id
            History = await settlementHistory.find(filter).sort({ date: -1 }).skip(page * limit).limit(limit)
        }
        if(me.roleName === "Admin"){
        }else{
            filter.userId = me._id
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
                let result = await voidBetBeforePlace(data)
                socket.emit('VoidBetIn', result)
            }
        }catch(err){
            console.log(err)
            socket.emit("VoidBetIn",{status:"error"})
        }     
    })


    socket.on('VoidBetIn2', async(data) => {
        try{
            let reultData = await voidbetAfterPlace(data)
            socket.emit('VoidBetIn2', reultData)
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
            console.log(data)
            let data1 = mapBet.mapbet(data)
            socket.emit("Settle", {message:"Settleed Process start", status:'success'})
            // socket.emit('Settle', {marketId:data.id, status:"success"})
        }catch(err){
            console.log(err)
            socket.emit("Settle",{message:"err", status:"error"})
        }
    })

    socket.on("VoidBetIn22", async(data) => {
        // let marketIds = [`${data.id}`]
        try{
             console.log(data, "BETDATA")
             if(data.result != ""){
                let bets = await Bet.aggregate([
                    {
                      $match: {
                        marketId: `${data.id}`,
                        status: "OPEN",
                      },
                    },
                    {
                      $lookup: {
                        from: "users",
                        localField: "userName",
                        foreignField: "userName",
                        as: "user",
                      },
                    },
                    {
                      $unwind: "$user",
                    },
                    {
                      $match: {
                        "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] },
                      },
                    },
                    {
                      $group: {
                        _id: null,
                        betIds: { $push: { $toString: "$_id" } }, 
                      },
                    },
                    {
                      $project: {
                        _id: 0, 
                        betIds: 1, 
                      },
                    },
                  ]);
                // console.log(bets)
                await Bet.updateMany({marketId:data.id, status:'OPEN'}, {$set:{result:data.result, status:'MAP'}})
                let betdata = await Bet.findOne({marketId:data.id})
                socket.emit('VoidBetIn22', {status:"success", betdata, result:data.result})
             }else{
                socket.emit('VoidBetIn22', {message:"Please select a result", status:"error"})
             }
            //  let data1 = mapBet.mapbet(data)
            //  socket.emit('VoidBetIn22', {marketId:data.id, status:"success"})
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
            let newdata = await commissionModel.findOneAndUpdate({userId:data.data.id}, newValues)

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
        console.log(CommissionData)
        socket.emit("CommissionRReport", {CommissionData, page})
    })

    socket.on('sportStatusChange',async(data) => {
        console.log(data)
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
        console.log(data)
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
            let cataLog = await catalogController.create(createData)
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
        console.log(data)
        try{
            if(data.isChecked){
                let data1 = await commissionMarketModel.create({marketId:data.marketId})
            }else{
                let data1 = await commissionMarketModel.findOneAndDelete({marketId:data.marketId})
            }
        }catch(err){
            console.log(err)
            socket.emit("commissionMarketbyId", "err")
        }
    })

    socket.on("claimCommission", async(data) => {
        console.log(data)
        let user = await User.findById(data.LOGINDATA.LOGINUSER._id)
        if(user){
            if(user.commission > 0){
                try{
                    await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id,{$inc:{availableBalance:user.commission, commission:-user.commission}})
                    let parenet = await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER.parent_id, {$inc:{availableBalance: -user.commission}})
                    let desc1 = `Claim Commisiion`
                    let desc2 = `Claim Commisiion of chiled user ${user.userName}`
                    let childdata = {
                        user_id:data.LOGINDATA.LOGINUSER._id,
                        description : desc1,
                        creditDebitamount : user.commission,
                        balance : user.availableBalance + user.commission,
                        date : Date.now(),
                        userName : user.userName,
                        role_type:user.role_type,
                    }
                    let perentData = {
                        user_id:data.LOGINDATA.LOGINUSER.parent_id,
                        description : desc2,
                        creditDebitamount : parenet.commission,
                        balance : parenet.availableBalance + user.commission,
                        date : Date.now(),
                        userName : parenet.userName,
                        role_type:parenet.role_type
                    }
                    await AccModel.create(childdata)
                    await AccModel.create(perentData)
                    await commissionRepportModel.updateMany({userId:data.LOGINDATA.LOGINUSER._id}, {status:'Deposit'})
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
            let Bets = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN" ,
                        eventId: data.id
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
                      "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] }
                    }
                  }
            ])
            socket.emit('BETONEVENT', {data:Bets, status:'success'})
        }catch(err){
            socket.emit('BETONEVENT', {message:"err", status:"error"})
        }
    })


    socket.on('UerBook', async(data) => {
        console.log(data)
        try{
            let Bets = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN" ,
                        marketId: data.marketId
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
                      "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] }
                    }
                  },
                {
                    $group: {
                    _id: {
                        userName: "$userName",
                        selectionName: "$selectionName",
                        matchName: "$match",
                    },
                    totalAmount: { $sum: { $multiply: ["$oddValue", "$Stake"] } },
                    },
                },
                {
                    $group: {
                    _id: "$_id.userName",
                    selections: {
                        $push: {
                        selectionName: "$_id.selectionName",
                        totalAmount: "$totalAmount",
                        matchName: "$_id.matchName",
                        },
                    },
                    },
                },
                {
                    $project: {
                    _id: 0,
                    userName: "$_id",
                    selections: 1,
                    },
                },
            ])
           console.log(Bets)
        //    console.log(Bets[0].selections)
           socket.emit('UerBook', Bets);
        }catch(err){

            socket.emit('UerBook', {message:"err", status:"error"})
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
        const roles = await Role.find({role_level: {$gt:me.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
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
                    returns:{$sum:{$cond:[{$in:['$status',['LOSS','OPEN']]},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}}
                    
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

        const marketAnalist =  await Bet.aggregate([
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
                    _id:'$marketName',
                    betcount:{$sum:1},
                    loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                    won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                    open:{$sum:{$cond:[{$in:['$status',['MAP','OPEN']]},1,0]}},
                    void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                    returns:{$sum:{$cond:[{$in:['$status',['LOSS','OPEN']]},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}}
                    
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
        socket.emit('gameAnalysis', {gameAnalist,marketAnalist, page})
    })

    socket.on('matchOdds',async(data)=>{
        let me = data.USER
        let page = data.page;
        let limit = 10
        const roles = await Role.find({role_level: {$gt:me.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
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
        console.log(data)
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

        console.log(users)
        let newUsers = users.map(async(ele) => {
            let userfilter;
            role_type = []
            roles = await Role.find({role_level: {$gt:ele.role.role_level}});
            for(let i = 0; i < roles.length; i++){
                role_type.push(roles[i].role_type)
            }
            if(ele.role_type == 2){
                userfilter = {
                    'userDetails.isActive':true,
                    'userDetails.roleName':{$ne:'Admin'},
                    'userDetails.role_type':{$in:role_type},
                    'userDetails.parentUsers':{$elemMatch:{$eq:(ele._id).toString()}}
                }
            }
            else if(ele.role_type == 5){
                userfilter = {
                    'userDetails.isActive':true,
                    'userDetails.userName':ele.userName
                }
            }

            

            let betDetails = await Bet.aggregate([
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
                    $match:userfilter
                },
                {
                    $group:{
                        _id:'$userName',
                        betcount:{$sum:1},
                        loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                        won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                        open:{$sum:{$cond:[{$in:['$status',['MAP','OPEN']]},1,0]}},
                        void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
                        returns:{$sum:{$cond:[{$in:['$status',['LOSS','OPEN']]},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}},
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

        console.log(result)

        socket.emit('childGameAnalist',{result,page,type,breadcum})



    })

    socket.on('getEvetnsOfSport',async(data)=>{
        console.log(data);
        const sportData = await getCrkAndAllData()
        console.log(sportData)
        let sportList;
        if(data.sport == '4'){
            sportList = sportData[0].gameList[0]
        }else{
            sportList = sportData[1].gameList.find(item => item.sportId == parseInt(data.sport))
        }

        socket.emit('getEvetnsOfSport',sportList)

    })

    socket.on('claimCommissionAdmin', async(data) => {
        console.log(data)
        let user = await User.findById(data.LOGINDATA.LOGINUSER._id)
        if(user){
            if(user.commission > 0){
                try{
                    await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id,{$inc:{availableBalance:user.commission, commission:-user.commission}})
                    let parenet = await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER.parent_id, {$inc:{availableBalance: -user.commission}})
                    let desc1 = `Claim Commisiion`
                    let desc2 = `Claim Commisiion of chiled user ${user.userName}`
                    let childdata = {
                        user_id:data.LOGINDATA.LOGINUSER._id,
                        description : desc1,
                        creditDebitamount : user.commission,
                        balance : user.availableBalance + user.commission,
                        date : Date.now(),
                        userName : user.userName,
                        role_type:user.role_type,
                    }
                    let perentData = {
                        user_id:data.LOGINDATA.LOGINUSER.parent_id,
                        description : desc2,
                        creditDebitamount : parenet.commission,
                        balance : parenet.availableBalance + user.commission,
                        date : Date.now(),
                        userName : parenet.userName,
                        role_type:parenet.role_type
                    }
                    await AccModel.create(childdata)
                    await AccModel.create(perentData)
                    await commissionRepportModel.updateMany({userId:data.LOGINDATA.LOGINUSER._id}, {status:'Deposit'})
                    socket.emit("claimCommissionAdmin", "Success")
                }catch(err){
                    console.log(err)
                    socket.emit("claimCommissionAdmin", "error")
                }
            }

           
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
        try{
            let check = await betLimit.findOne({type:data.type})
            if(check){
                await betLimit.findOneAndUpdate({type:data.type}, data)
                socket.emit('UpdateBetLimit', {status:'success'})
            }else{
                await betLimit.create(data)
                socket.emit('UpdateBetLimit', {status:'success'})
            }
        }catch(err){
            console.log(err)
            socket.emit('UpdateBetLimit', {message:"Please try again leter", status:"err"})
        }
    })

    socket.on('updateBetLimitMATCH', async(data) => {

        console.log(data)
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
            let resultDate = await rollBackBet(data)
            socket.emit('ROLLBACKDETAILS', resultDate)
        }catch(err){
            console.log(err)
            socket.emit("ROLLBACKDETAILS",{message:"err", status:"error"})
        }
    })
    
})

http.listen(80,()=> {
    console.log('app is running on port 80')
})