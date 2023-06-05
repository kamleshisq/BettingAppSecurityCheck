const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fetch = require('node-fetch');
const gameAPI = require('./utils/gameAPI');
const Role = require('./model/roleModel');
const User = require("./model/userModel");
const Bet = require("./model/betmodel");
const Promotion = require("./model/promotion")
const userController = require("./websocketController/userController");
const accountControl = require("./controller/accountController");
const loginlogs = require('./model/loginLogs');
const gameModel = require('./model/gameModel');

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
                'Authorization': `Bearer ` + global._token, // notice the Bearer before your token
            }
        }).then(data => data.json()));
        const resultData = {data:[], role:[]};
        // console.log('here')
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
        let page = data.page; 
        let limit = 10
        // const me = await User.findById(data.id)
        const roles = await Role.find({role_level: {$gt:data.LOGINDATA.LOGINUSER.role.role_level}});
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
                if(role_type.includes(data.filterData.role_type)){
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
                // console.log(data.filterData)
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
            fullUrl = 'http://127.0.0.1:8000/api/v1/Account/getUserAccStatement?id=' + id.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate  
        }else{
            fullUrl = 'http://127.0.0.1:8000/api/v1/Account/getUserAccStatement?id=' + data.LOGINDATA.LOGINUSER._id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate  

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
        let user = await User.findOne({userName:data.userName})
        // console.log(data)
        let fullUrl = 'http://127.0.0.1:8000/api/v1/Account/getUserAccStatement?id=' + user.id + "&page=" + data.page + "&from=" + data.Fdate + "&to=" + data.Tdate
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
        let fullUrl = "http://127.0.0.1:8000/api/v1/bets/betListByUserId?id=" + user._id;
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
        let gameData = await gameModel.findById(data)
        let urldata = await gameAPI(gameData)
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

    socket.on("SearchACC", async(data) => {
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
                user = await User.find({userName:regexp})
        }else{
                // let role_Type = {
                //     $in:role_type
                // }
                // let xfiletr  = {}
                // xfiletr.role_Type = role_Type
                // xfiletr.userName = regexp
                // console.log(data.filterData)
                // console.log(xfiletr)
                user = await User.find({ role_type:{$in: role_type}, userName: regexp })
        }
        // console.log(user)
        socket.emit("ACCSEARCHRES", user)
    })

    socket.on('userBetDetail',async(data)=>{
        // console.log(data)
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
})

http.listen(8000,()=> {
    console.log('app is running on port 8000')
})