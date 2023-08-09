const app = require('./app');
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
io.on('connection', (socket) => {
    console.log('connected to client')
    let loginData = {}
    // console.log(global)
    loginData.User = global._User
    loginData.Token = global._token

    socket.emit("loginUser", {
        loginData
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
        // console.log(data.filterData);
        let page = data.page; 
        let limit = 10
        // const me = await User.findById(data.id)
        console.log(data.LOGINDATA)
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        data.filterData.parentUsers = { $elemMatch: { $eq: data.LOGINDATA.LOGINUSER._id } }
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        
        let user
        if(data.filterData.userName){
            var regexp = new RegExp(data.filterData.userName);
            data.filterData.userName = regexp
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
        let currentUser = data.LOGINDATA.LOGINUSER

        // console.log(user)
        // console.log(page)
        let response = user;
        //urlRequestAdd(`/api/v1/users/searchUser?username = ${data.filterData.userName}& role=${data.filterData.role}& whiteLable = ${data.filterData.whiteLabel}`,'GET', data.LOGINDATA.LOGINTOKEN)
        socket.emit("getOwnChild", {status : 'success',response, currentUser,page,roles})
    })


    socket.on('userHistory',async(data)=>{
        let page = data.page;
        let limit = 10;
        User.aggregate([
            {
              $match: {
                parentUsers: { $elemMatch: { $eq: data.LOGINDATA.LOGINUSER._id } }
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
              const userIds = userResult.length > 0 ? userResult[0].userIds : [];
              loginlogs.aggregate([
                {
                  $match:{
                    user_id:{$in:userIds}
                  }
                },{
                    $sort:{
                        login_time:-1
                    }
                },
                {
                    $skip:(limit * page)
                },
                {
                    $limit:limit
                }
              ])
                .then((Logs) => {
                //   socket.emit("aggreat", betResult)
                let users = Logs
                socket.emit('userHistory',{users,page})
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
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
        const fullUrl = global._protocol + '://' + global._host + `/api/v1/auth/logOutSelectedUser?userId=`+id
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
        let fullUrl
        if(data.id){
            let id = await User.findOne({userName:data.id})
            // console.log()
            fullUrl = 'http://127.0.0.1/api/v1/Account/getUserAccStatement?id=' + id.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate  
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

    socket.on('baccarat', async(A) => {
        // console.log(data)
        let data
        data = await gameModel.find({game_name:new RegExp("Baccarat","i")})
        socket.emit('baccarat1', data)
    })

    socket.on("RGV", async(A)=>{
        let data;
        data = await gameModel.find({sub_provider_name:"Royal Gaming Virtual"})
        // console.log(data)
        socket.emit("RGV1", {data, provider:"RGV"})
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
        let user
        if(data.LOGINDATA.LOGINUSER.role.role_level == 1){
                user = await User.find({userName:regexp}).skip(page * limit).limit(limit)
        }else{
                // let role_Type = {
                //     $in:role_type
                // }
                // let xfiletr  = {}
                // xfiletr.role_Type = role_Type
                // xfiletr.userName = regexp
                // console.log(data.filterData)
                // console.log(xfiletr)
                user = await User.find({ role_type:{$in: role_type}, userName: regexp, parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}} }).skip(page * limit).limit(limit)
        }
        page++
        if(user.length === 0 ){
            page = null
        }
        socket.emit("ACCSEARCHRES", {user, page})
    })

    socket.on('userBetDetail',async(data)=>{
        console.log(data)
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
        
        User.aggregate([
            {
              $match: {
                parentUsers: { $elemMatch: { $eq: data.LOGINDATA.LOGINUSER._id } }
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
              let Name123
              if(data.filterData.userName === data.LOGINDATA.LOGINUSER.userName){
                  Name123 = {
                      userId: { $in: userIds },
                      status: {$ne:"OPEN"}
                    }
              }else{
                Name123 = {
                    userId: { $in: userIds },
                    status: {$ne:"OPEN"},
                    userName: data.filterData.userName
              }}
              Bet.aggregate([
                {
                  $match: Name123
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
                    let ubDetails = betResult
                    socket.emit('userBetDetail',{ubDetails,page})
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        
        
        // console.log(user)
    })


    socket.on('betMoniter',async(data)=>{
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
            let ubDetails = await Bet.find({status:"OPEN"}).skip(page * limit).limit(limit)
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


    socket.on('voidBET',async(data)=>{
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
        data.filterData.status = 'CANCEL';
        const user = await User.findOne({userName:data.filterData.userName})
        if(data.LOGINDATA.LOGINUSER.role_type == 1 && data.filterData.userName == 'admin'){
            delete data.filterData['userName']
            let ubDetails = await Bet.find({status:"CANCEL"}).skip(page * limit).limit(limit)
            socket.emit('voidBET',{ubDetails,page})
        }
        else if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
            delete data.filterData['userName']
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('voidBET',{ubDetails,page})
        }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('voidBET',{ubDetails,page})

        }
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
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        let onlineUsers
        if(data.LOGINDATA.LOGINUSER.role_type === 1){
            onlineUsers = await User.find({is_Online:true, userName:new RegExp(data.x)}).skip(page * limit).limit(limit)
        }else{
            onlineUsers = await User.find({is_Online:true, role_type:{$in:role_type}, userName:new RegExp(data.x), parentUsers:{$elemMatch:{$eq:data.LOGINDATA.LOGINUSER._id}}}).skip(page * limit).limit(limit)
        }
        page++
        socket.emit("SearchOnlineUser",{onlineUsers, page})
    })

    socket.on('OnlineUser', async(data) => {
        let page
        page = data.page
        if(!page){
            page = 0
        }
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        let onlineUsers
        if(data.LOGINDATA.LOGINUSER.role_type === 1){
            onlineUsers = await User.findOne({is_Online:true, userName:data.filterData.userName})
        }else{
            onlineUsers = await User.find({is_Online:true, role_type:{$in:role_type}, userName:data.filterData.userName})
        }
        page++
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
        console.log(data)
        let marketDetails = await marketDetailsBymarketID([`${data.data.market}`])
        console.log(marketDetails.data.items)
        let thatMarket = marketDetails.data.items[0]
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
        }else{
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
        }
        // console.log(data.data)
        let result = await placeBet(data)
        let openBet = []
        if(data.pathname === "/exchange/multimarkets"){
            openBet = await Bet.find({userId:data.LOGINDATA.LOGINUSER._id, status:"OPEN"})
        }else{
            openBet = await Bet.find({userId:data.LOGINDATA.LOGINUSER._id, status:"OPEN", match:data.data.title})
        }
        socket.emit("betDetails", {result, openBet})
    })

    socket.on('voidBet', async(data) => {
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
        socket.emit("voidBet", "data")
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
        console.log(data)
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
           fevGames = fevGames1.gameId
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

    socket.on("chartMain", async(data) => {
        console.log(data)
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
                    $sum: { $abs: '$creditDebitamount' }
                  }
                },
              },
          ]);
          const dataArray = accountForGraph;
          const dates = dataArray.map(item => new Date(item._id.year, item._id.month - 1, item._id.day));
          const startDate = new Date(Math.min(...dates));
          const endDate = new Date(Math.max(...dates));
          
          // Step 3: Fill in missing dates with zero values
          const newDataArray = [];
          const currentDate1 = new Date(startDate);
          while (currentDate1 <= endDate) {
            const matchingData = dataArray.find(item =>
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
                  day: currentDate1.getDate()
                },
                totalIncome: 0,
                totalIncome2: 0
              });
            }
          
            currentDate1.setDate(currentDate1.getDate() + 1);
          }
          console.log(newDataArray);
        const Income = newDataArray.map(item => item.totalIncome);
        const Revanue = newDataArray.map(item => item.totalIncome2);
        socket.emit("chartMain", {Income, Revanue})
        
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
            socket.emit("BetLockUnlock", {user, status})

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
                console.log(data.LOGINDATA.LOGINUSER._id)
                let houseFund =  await houseFundModel.create({userId:data.LOGINDATA.LOGINUSER._id, amount:parseFloat(data.data.amount), Remark:data.data.Remark})
                await User.findByIdAndUpdate(data.LOGINDATA.LOGINUSER.id, {$in:{balance:parseFloat(data.data.amount), availableBalance:parseFloat(data.data.amount)}})
                socket.emit("FUndData", houseFund)
            }
        }catch(err){
            console.log(err)
            socket.emit("FUndData",{message:"err", status:"error"})
        }
    })
    
})

http.listen(80,()=> {
    console.log('app is running on port 80')
})