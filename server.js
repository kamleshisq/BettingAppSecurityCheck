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
// http(req, res) => {}
io.on('connection', (socket) => {
    console.log('connected to client')
    let loginData = {}
    loginData.User = global._User
    loginData.Token = global._token

    socket.emit("loginUser", {
        loginData
    })
    const urlRequestAdd = async(url,method, Token) => {
        const login = await loginlogs.findOne({session_id:Token, isOnline:true})
        // console.log(login)

        var fullUrl = global._protocol + '://' + global._host + url
        // console.log(fullUrl)
        login.logs.push(method + " - " + fullUrl)
        login.save()
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
        urlRequestAdd(`/api/v1/users/searchUser?username = ${data.filterData.userName}& role=${data.filterData.role}& whiteLable = ${data.filterData.whiteLabel}`,'GET', data.LOGINDATA.LOGINTOKEN)
        socket.emit("getOwnChild", {status : 'success',response, currentUser,page,roles})
    })


    socket.on('userHistory',async(data)=>{
        let page = data.page;
        let limit = 10;
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        data.filterData.role_Type = {
            $in:role_type
        }
        // console.log(data.filterData)
        const user = await User.findOne({userName:data.filterData.userName})
        if(data.LOGINDATA.LOGINUSER.role_type == 1 && data.filterData.userName == "admin"){
            let users = await loginlogs.find().skip(page * limit).limit(limit)
            socket.emit('userHistory',{users,page})
        }else if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
            delete data.filterData['userName']
            // console.log(data.filterData)
            let users = await loginlogs.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('userHistory',{users,page})
        }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
            let users = await loginlogs.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('userHistory',{users,page})

        }
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
        urlRequestAdd(`/api/v1/users/updateUserStatusActive`,'POST', id.LOGINDATA.LOGINTOKEN)
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
        urlRequestAdd(`/api/v1/users/deleteUser`,'POST', id.LOGINDATA.LOGINTOKEN)
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

        urlRequestAdd(`/api/v1/Account/getUserAccStatement?id = ${data.id}&page=${data.page}&from = ${data.from}&from = ${data.from}&to = ${data.to}&search = ${data.search}`,'GET', data.LOGINDATA.LOGINTOKEN)


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
        urlRequestAdd(`/api/v1/Account/getUserAccStatement?id = ${data.id}&page=${data.page}&from = ${data.from}&from = ${data.from}&to = ${data.to}`,'GET', data.LOGINDATA.LOGINTOKEN)


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
        // console.log(data)
        let page = data.page;
        let limit = 10;
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        data.filterData.role_type = {
            $in:role_type
        }
        // console.log(data.filterData)
        const user = await User.findOne({userName:data.filterData.userName})
        if(data.LOGINDATA.LOGINUSER.role_type == 1 && data.filterData == "admin"){
            let games = await Bet.aggregate([
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
                    $skip:(page * limit)
                },
                {
                    $limit:limit
                }
            ])
            socket.emit('gameReport',{games,page})
        }else if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
            delete data.filterData['userName']
            let games = await Bet.aggregate([
                {
                    $match:data.filterData
                },
                {
                    $group:{
                        _id:{
                            userName:'$userName',
                            gameId: '$gameId'
                        },
                        gameCount:{$sum:1},
                        loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                        won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
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
                        returns:{$sum:'$returns'}
        
                    }
                },
                {
                    $skip:(page * limit)
                },
                {
                    $limit:limit
                }
            ])
            socket.emit('gameReport',{games,page})
        }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
            let games = await Bet.aggregate([
                {
                    $match:data.filterData
                },
                {
                    $group:{
                        _id:{
                            userName:'$userName',
                            gameId: '$gameId'
                        },
                        gameCount:{$sum:1},
                        loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                        won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
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
                        returns:{$sum:'$returns'}
        
                    }
                },
                {
                    $skip:(page * limit)
                },
                {
                    $limit:limit
                }
            ])
            socket.emit('gameReport',{games,page})

        }
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
        // console.log(data)
        let limit = 10;
        let page = data.page;
        const roles = await Role.find({role_type: {$gt:data.LOGINDATA.LOGINUSER.role.role_type}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        data.filterData.role_type = {
            $in:role_type
        }
        data.filterData.status = {
            $ne:"OPEN"
        }
        const user = await User.findOne({userName:data.filterData.userName})
        if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
            delete data.filterData['userName']
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('userBetDetail',{ubDetails,page})
        }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
            let ubDetails = await Bet.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('userBetDetail',{ubDetails,page})

        }
        
        
        
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
        // console.log(data)
        let page = data.page;
        let limit = 10;
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        data.filterData.role_type = {
            $in:role_type
        }
        // console.log(data.filterData)
        const user = await User.findOne({userName:data.filterData.userName})
        if(data.LOGINDATA.LOGINUSER.userName == data.filterData.userName){
            delete data.filterData['userName']
            let users = await User.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('userPLDetail',{users,page})
        }else if(data.LOGINDATA.LOGINUSER.role.role_level < user.role.role_level){
            let users = await User.find(data.filterData).skip(page * limit).limit(limit)
            socket.emit('userPLDetail',{users,page})

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
            onlineUsers = await User.find({is_Online:true, role_type:{$in:role_type}, userName:new RegExp(data.x)}).skip(page * limit).limit(limit)
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
        const result = await marketDetailsBymarketID(data)
        let finalResult = result.data
        socket.emit("marketId", finalResult)
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
    //     urlRequestAdd(`/api/v1/users/logOutSelectedUser`,'POST')
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
        let result = await placeBet(data)
        socket.emit("betDetails", result)
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
        const fullUrl = 'http://127.0.0.1/api/v1/notification/updateStatus?id=' + `${data.id}`
        fetch(fullUrl, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ` + data.LOGINDATA.LOGINTOKEN,
                'Content-Type': 'application/json',
                'accept': 'application/json' },
        }).then(res => res.json())
        .then(Data =>{
            socket.emit('updateStatus', Data)
        })
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
        User.aggregate([
            {
                $match:{
                    parentUsers:{$elemMatch:{$eq:data.LOGINUSER._id}}
                }
            },
            {
                $lookup: {
                  from: 'Bet', 
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'bets'
                }
            },
            {
                $unwind: '$bets'
            },
            {
                $match: {
                    'bets.status': 'OPEN'
                }
            },
            // {
            //     $group: {
            //       _id: '$secId',
            //       totalStake: { $sum: '$Stake' },
            //       count: { $sum: 1 }
            //     }
            // }
        ]).then(result => {
            console.log(result)
          socket.emit("aggreat", result)
        })
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
        socket.emit("VerticalMenuIdByData", verticalMenu)
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

})

http.listen(80,()=> {
    console.log('app is running on port 80')
})