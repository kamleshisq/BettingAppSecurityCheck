




const socket = io();
socket.on('connect', () => {
    console.log("websocket Connected")
    let LOGINDATA = {}
    socket.on('loginUser',(data) => {
        LOGINDATA.LOGINUSER = data.loginData.User
        LOGINDATA.LOGINTOKEN = data.loginData.Token
        const {
            host, hostname, href, origin, pathname, port, protocol, search
          } = window.location
        //   console.log(pathname)
        //   console.log(host, hostname, href, origin ,port, protocol, search)

    // console.log(LOGINTOKEN, LOGINUSER)
    // console.log(window.location.href)
    // let query = window.location.href.split('?')[1]
    // let id;
    // let P = 0;
    // if(query){
    //     id = query.split('=')[1]
    // }
    // // console.log(id)
    // if(id){
    //     socket.emit('load', {P:P, id:id})
    // }else{
    //     socket.emit('load', {P:P})
    // }

    //....................FOR UPDATE ROLE...................//

   $(document).on('submit', ".change-pass-model-form", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    socket.emit('UserUpdatePass', {data, LOGINDATA});
   })

   socket.on('UserUpdatePass', async(data)=>{
    console.log(data)
    if(data.status === "success"){
        alert("password updated")
    }else{
        alert(data.message)
    }
   })

    socket.on("alertMessage", async(data) => {
        console.log(data)
        alert(data)
    })

    $(document).on('click', ".promotionLink", function(){
        let id = $(this).attr('id')
        socket.emit("updatePromotion", id)
    })

    if(pathname == "/admin/updateRole"){
        let x = "121"
        // let y = document.getElementById("mySelect").value
        function sendData(){
            
            if(x != document.getElementById("mySelect").value){
                x = document.getElementById("mySelect").value
                socket.emit("dataId", (x))
                setTimeout(()=>{
                  sendData()
                }, 300)
            }else{
                setTimeout(()=>{
                    sendData()
                }, 300)
            }
          }
          sendData()

          socket.on("sendData", data => {
            // console.log(data)
            // console.log(data[1])
            let html = ""
            if(data[0].role.authorization.includes("createDeleteUser")){
                html += `<label for="authorization">create and delete users</label><br>
                        <input type="checkbox" name="authorization" value="createDeleteUser" checked><br>`
            }else{
                html += `<label for="authorization">create and delete users</label><br>
                        <input type="checkbox" name="authorization" value="createDeleteUser" ><br>`
            }
            if(data[0].role.authorization.includes("userStatus")){
                html += `<label for="authorization">User Status</label><br>
                        <input type="checkbox" name="authorization" value="userStatus" checked><br>`
            }else{
                html += `<label for="authorization">User Status</label><br>
                        <input type="checkbox" name="authorization" value="userStatus" ><br>`
            }
            if(data[0].role.authorization.includes("userName")){
                html += `<label for="authorization">Users Details</label><br>
                        <input type="checkbox" name="authorization" value="userName" checked><br>`
            }else{
                html += `<label for="authorization">Users Details</label><br>
                        <input type="checkbox" name="authorization" value="userName" ><br>`
            }
            if(data[0].role.authorization.includes("betLockAndUnloack")){
                html += `<label for="authorization">bet lock and unlock</label><br>
                        <input type="checkbox" name="authorization" value="betLockAndUnloack" checked><br>`
            }else{
                html += `<label for="authorization">bet lock and unlock</label><br>
                        <input type="checkbox" name="authorization" value="betLockAndUnloack" ><br>`
            }
            if(data[0].role.authorization.includes("changeUserPassword")){
                html += `<label for="authorization">Password</label><br>
                        <input type="checkbox" name="authorization" value="changeUserPassword" checked><br>`
            }else{
                html += `<label for="authorization">Password</label><br>
                        <input type="checkbox" name="authorization" value="changeUserPassword" ><br>`
            }
            if(data[0].role.authorization.includes("roleController")){
                html += `<label for="authorization">Role Controller</label><br>
                        <input type="checkbox" name="authorization" value="roleController" checked><br>`
            }else{
                html += `<label for="authorization">Role Controller</label><br>
                        <input type="checkbox" name="authorization" value="roleController" ><br>`
            }
            if(data[0].role.authorization.includes("accountControl")){
                html += `<label for="authorization">Account Controller</label><br>
                        <input type="checkbox" name="authorization" value="accountControl" checked><br>`
            }else{
                html += `<label for="authorization">Account Controller</label><br>
                        <input type="checkbox" name="authorization" value="accountControl" ><br>`
            }
            if(data[0].role.authorization.includes("allUserLogOut")){
                html += `<label for="authorization">All User Logout</label><br>
                        <input type="checkbox" name="authorization" value="allUserLogOut" checked><br>`
            }else{
                html += `<label for="authorization">All User Logout</label><br>
                        <input type="checkbox" name="authorization" value="allUserLogOut" ><br>`
            }
            if(data[0].role.authorization.includes("dashboard")){
                html += `<label for="authorization">Dashboard</label><br>
                        <input type="checkbox" name="authorization" value="dashboard" checked><br>`
            }else{
                html += `<label for="authorization">Dashboard</label><br>
                        <input type="checkbox" name="authorization" value="dashboard" ><br>`
            }
            
            document.getElementById('user_controller').innerHTML = html
        
            for(let i = 0; i < data[1].roles.length; i++){
                // console.log(data[0].role.userAuthorization)
                // console.log(data[1].roles[i].role_type)
                // document.getElementById(data[1].roles[i].role_type).checked = true
                // console.log(document.getElementById(data[1].roles[i].role_type))
                if(data[0].role.userAuthorization.includes(`${data[1].roles[i].role_type}`)){
                    document.getElementById(data[1].roles[i].role_type).checked = true
                    // console.log(document.getElementById(data[1].roles[i].role_type), "checked")
                }else{
                    document.getElementById(data[1].roles[i].role_type).checked = false
                    // console.log(data[1].roles[i].role_type)
                }
            }
        
            let html1 = ""
            document.getElementById("role_controller").innerHTML = `
            <label for="level">Role Level</label>
            <input type="number" name="level" placeholder='${data[0].role.role_level}' id='role_level'>`
        })
    }







    //..................FOR user management page...........//




    // console.log(window.location.href)

    if(pathname.startsWith('/admin/userManagement')){
        function getOwnChild(id,page,token) {
            socket.emit(token,{
                id,
                page
            })
        
        }


        
        // socket.on('getOwnChild',(data) => {
            // console.log(data)
            // let response = data.response;
            // if(data.status === 'success')
            // {
                
            //     $('table').html("<tr>"+
            //     "<th>S.No</th>"+
            //     "<th>User Name</th>"+
            //     "<th>White lable</th>"+
            //     "<th>Credit Reference</th>"+
            //     "<th>Balance</th>"+
            //     "<th>Available Balance</th>"+
            //     "<th>Downlevel Balance</th>"+
            //     "<th>Client P/L</th>"+
            //     "<th>Upline P/L</th>"+
            //     "<th>Exposure</th>"+
            //     "<th>Exposure limit</th>"+
            //     "<th>Lifetime Credit</th>"+
            // " <th>Lifetime Deposite</th>"+
            //     "<th>Action</th>"+
            // "</tr>")
            // let html ="";
            // for(let i = 0; i < response.length; i++){ 
            //     html +=
            //     `<tr>
            //         <td> ${i+1} </td>
            //         <td class="getOwnChild" data-id='${JSON.stringify(response[i])}'>${response[i].userName}</td>
            //         <td> ${response[i].whiteLabel}</td>
            //         <td> ${response[i].creditReference}</td>
            //         <td> ${response[i].balance}</td>
            //         <td> ${response[i].availableBalance}</td>
            //         <td> ${response[i].downlineBalance}</td>
            //         <td> ${response[i].clientPL}</td>
            //         <td> ${response[i].uplinePL}</td>
            //         <td> ${response[i].exposure}</td>
            //         <td> ${response[i].exposureLimit}</td>
            //         <td> ${response[i].lifeTimeCredit}</td>
            //         <td> ${response[i].lifeTimeDeposit}</td>
            //         <td>`
            //             if(data.currentUser.role.authorization.includes('userStatus')){
            //                 html += `<button class="userStatus" type="userStatus" id="${response[i]._id}" data-myval='${JSON.stringify(response[i])}'>U/S</button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
            //                 html += `<button class="betLockStatus" id="${response[i]._id}" data-myval='${JSON.stringify(response[i])}'>BetLock status</button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('changeUserPassword')){
            //                 html += `<button ><a href="/resetPassword?id=${response[i]._id} ">change password</a></button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('accountControl')){
            //                 html += `<button ><a href="/accountStatement?id=${response[i]._id} ">A/S</a></button>
            //                 <button ><a href="/DebitCredit?id=${response[i]._id}">D/C</a></button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('userName')){
            //                 html += `<button ><a href="/updateUser?id=${response[i]._id} ">Details</a></button>`
            //             }
            //           html += `</td> </tr>`
            // }
            // $('table').append(html)
            //     html = '';
            //     for(let i=0;i<data.Rows;i++){
            //         html += `<a href="#" class="pagination">${i + 1}</a>`
            //     }
            //     $('.pageLink').html(html)
            //     $('#back').attr('data-me',JSON.stringify(data.me));
            // }
        // })
        //   $(document).on('click','.getOwnChild',function(e){
        //         e.preventDefault();
        //         let id = $(this).data('id')._id
        //         if($(this).data('id').role.roleName != 'user'){
        //             // sessionStorage.setItem('grandParentDetails',sessionStorage.getItem('parentDetails'))
        //             // sessionStorage.setItem('parentDetails',JSON.stringify($(this).data('id')))
        //             $('.pageLink').attr('data-page','1')
        //             // console.log(id)
        
        //             getOwnChild(id,0,'getOwnChild')
        
        //         }
        //     })
        
        //     $(document).on('click','#back',function(e){
        //         e.preventDefault();
        //         let parentId;
        //         parentId = JSON.parse(document.querySelector('#back').getAttribute('data-me')).parent_id  
        //         let loginuserparentid = JSON.parse(sessionStorage.getItem('loginUserDetails')).parent_id
        //         // console.log(parentId)
        //         // console.log(loginuserparentid)
        //         if(parentId != loginuserparentid){
        //                 getOwnChild(parentId,0,'getOwnChild')
        //         }
        //     })
            
        //     $(document).on('click','.pagination',function(e){
        //         let page = $(this).text()
        //         $('.pageLink').attr('data-page',page)
        //         let id = JSON.parse(document.querySelector('#back').getAttribute('data-me'))._id;
        //         // console.log(id)
        
        //         getOwnChild(id,page - 1,'getOwnChild')
        
        //     })
        let count = 11;
        socket.on('getOwnChild',(data) => {
            // console.log(data)
            // console.log('rows',data.result)
            // let headHight = document.getElementsByClassName('HeadRow').height()
            // console.log( "user row height", $('.UserRow').height())
            // loadHight += (data.result * $('.UserRow').height()) 
            let response = data.response;
            if(data.status === 'success')
            {
                if(data.page == 0){
                    count = 1;

                        $('table').html(`<tr style="text-align: center;font-size: 11px;">`+
                        "<th>S.No</th>"+
                        "<th>User Name</th>"+
                        "<th>White lable</th>"+
                        "<th>Credit Reference</th>"+
                        "<th>Balance</th>"+
                        "<th>Available Balance</th>"+
                        "<th>Downlevel Balance</th>"+
                        "<th>Client P/L</th>"+
                        "<th>Upline P/L</th>"+
                        "<th>Exposure Limit</th>"+
                        "<th>Exposure</th>"+
                        "<th>Lifetime Credit</th>"+
                    " <th>Lifetime Deposite</th>"+
                        "<th>Action</th>"+
                    "</tr>")
                }
                
            let html ="";
            for(let i = 0; i < response.length; i++){ 
                if((i+1) % 2 != 0){

                    html +=
                    `<tr style="text-align: center;" class="blue" id="${count + i}">`
                }else{
                    html +=
                    `<tr style="text-align: center;"id="${count + i}">` 
                }
                    
                html += `<td> ${count + i} </td>
                    <td class="getOwnChild" data-bs-dismiss='${JSON.stringify(response[i])}'>`
                    if(response[i].roleName != 'user'){
                        html+= `<a href='/admin/userManagement?id=${response[i]._id}'>${response[i].userName}</a>`
                    }else{
                        html+= `${response[i].userName}`
                    }

                    html += `</td>
                    <td> ${response[i].whiteLabel}</td>
                    <td> ${response[i].creditReference}</td>
                    <td> ${response[i].balance}</td>
                    <td> ${response[i].availableBalance}</td>
                    <td> ${response[i].downlineBalance}</td>
                    <td style="color:#FE3030;"> ${response[i].clientPL}</td>
                    <td> ${response[i].uplinePL}</td>
                    <td> ${response[i].exposureLimit}</td>
                    <td> ${response[i].exposure}</td>
        
                    <td> ${response[i].lifeTimeCredit}</td>
                    <td> ${response[i].lifeTimeDeposit}</td>
                    `
                        if(data.currentUser.role.authorization.includes('accountControl')){
                            html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal" class="Deposite"> D/W </button></td>`
                        }
                        if(data.currentUser.role.authorization.includes('accountControl')){
                            html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal2" class="CreaditChange">C</button></td>`
                        }
                        if(data.currentUser.role.authorization.includes('changeUserPassword')){
                            html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal3" class="PasswordChange">P</button></td>`
                        }
                        if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
                            html += `<td><button type="button" class="betLockStatus">B</button></td>`
                        }
                        if(data.currentUser.role.authorization.includes('userStatus')){
                            html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal4" class="StatusChange">CS</button></td>
                            `
                        }
                        if(data.currentUser.role.authorization.includes('userName')){
                            html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal5" class="UserDetails"><i class="fa-solid fa-database"></i></button></td>
                            `
                        }
                      html += `</td> </tr>`
            }
            count += 10;
            $('table').append(html)
                // html = '';
                // for(let i=0;i<data.Rows;i++){
                //     html += `<a href='/userManagement?id=${data.me_id}&page=${i}' class="pagination">${i + 1}</a>`
                // }
                // $('.pageLink').html(html)
                // $('#meDetails').attr('data-me',JSON.stringify(data.me));
            }
        })


        //.........for search in user management page.............//

        let filterData = {}
        let S = false
        let W = false
        let R = false

        $('#searchUser, #ROLEselect, #WhiteLabel').bind("change keyup", function(){
            // console.log($(this).hasClass("searchUser"), 123)
            if($(this).hasClass("WhiteLabel")){
                    filterData.whiteLabel = $(this).val()
                    if(filterData.whiteLabel != "" && filterData.whiteLabel != undefined){
                        W = true
                    }else{
                        W = false
                        delete filterData.whiteLabel 
                    }
            }
            if($(this).hasClass("ROLEselect")){
                    filterData.role_type = $(this).val()
                    if(filterData.role_type != "" && filterData.role_type != undefined){
                        R = true
                    }else{
                        R = false
                        delete filterData.role_type 
                    }
            }

            if($(this).hasClass("searchUser")){
                    filterData.userName = $(this).val()
                    // console.log(filterData.userName)
                    if(filterData.userName.length >= 0){
                        S = true
                    }else{
                        S = false
                        delete filterData.userName
                    }
            }
        // console.log(W,S,R)
        // if(W || S || R){
               let page =  0;
               $('.pageLink').attr('data-page',1)
               let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;
               socket.emit("search", {filterData,page,id, LOGINDATA })
        // }
    })

    $(window).scroll(function() {
        if($(document).height()-$(window).scrollTop() == window.innerHeight){
            // console.log(W,S,R)
            let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;

            let page = parseInt($('.pageLink').attr('data-page'));
        //  console.log(page)


            $('.pageLink').attr('data-page',page + 1)
            if(W || S || R){
                    
                    
                // let page = parseInt($('.pageLink').attr('data-page'));
                // $('.pageLink').attr('data-page',page + 1)
                // console.log(W, S, R)
                socket.emit("search", {filterData,page,id, LOGINDATA })
            }else{
                getOwnChild(id,page ,'getOwnChild')
            }
        }
     }); 
        // socket.on("searchUser", (data)=>{
        //     // console.log(data[1]._id)
        //     console.log(data)
        //     let html = "";
        //     if(data.page == 0){
        //         count = 1;
        //         html = `
        //         <tr>
        //           <th>S.No</th>
        //           <th>User Name</th>
        //           <th>White lable</th>
        //           <th>Credit Reference</th>
        //           <th>Balance</th>
        //           <th>Available Balance</th>
        //           <th>Downlevel Balance</th>
        //           <th>Client P/L</th>
        //           <th>Upline P/L</th>
        //           <th>Exposure</th>
        //           <th>Exposure limit</th>
        //           <th>Lifetime Credit</th>
        //           <th>Lifetime Deposite</th>
        //           <th>Action</th>
        //         </tr>` 
        //         $('table').html(html)  
        //     }
        //     html = ""
        //     for(let i = 0; i < data.user.length; i++){
        //         if(data.user.roleName == 'user'){
        //             html += `<tr>
        //         <td>${i + count}</td>
        //         <td>${data.user[i].userName}</td>
        //         <td>${data.user[i].whiteLabel}</td>
        //         <td>${data.user[i].creditReference}</td>
        //         <td>${data.user[i].balance}</td>
        //         <td>${data.user[i].availableBalance}</td>
        //         <td>${data.user[i].downlineBalance}</td>
        //         <td>${data.user[i].clientPL}</td>
        //         <td>${data.user[i].uplinePL}</td>
        //         <td>${data.user[i].exposure}</td>
        //         <td>${data.user[i].exposureLimit}</td>
        //         <td>${data.user[i].lifeTimeCredit}</td>
        //         <td>${data.user[i].lifeTimeDeposit}</td>
        //         <td>`
        //         }else{
        //             html += `<tr>
        //         <td>${i + count}</td>
        //         <td><a href='/userManagement?id=${data.user[i]._id}'>${data.user[i].userName}</a></td>
        //         <td>${data.user[i].whiteLabel}</td>
        //         <td>${data.user[i].creditReference}</td>
        //         <td>${data.user[i].balance}</td>
        //         <td>${data.user[i].availableBalance}</td>
        //         <td>${data.user[i].downlineBalance}</td>
        //         <td>${data.user[i].clientPL}</td>
        //         <td>${data.user[i].uplinePL}</td>
        //         <td>${data.user[i].exposure}</td>
        //         <td>${data.user[i].exposureLimit}</td>
        //         <td>${data.user[i].lifeTimeCredit}</td>
        //         <td>${data.user[i].lifeTimeDeposit}</td>
        //         <td>`
        //         }
        //         if(data.currentUser.role.authorization.includes('userStatus')){
        //             html += `<button class="userStatus" type="userStatus" id="${data.user[i]._id}" data-myval='${JSON.stringify(data.user[i])}'>U/S</button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
        //             html += `<button class="betLockStatus" id="${data.user[i]._id}" data-myval='${JSON.stringify(data.user[i])}'>BetLock status</button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('changeUserPassword')){
        //             html += `<button ><a href="/resetPassword?id=${data.user[i]._id} ">change password</a></button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('accountControl')){
        //             html += `<button ><a href="/accountStatement?id=${data.user[i]._id} ">A/S</a></button>
        //             <button ><a href="/DebitCredit?id=${data.user[i]._id} ">D/C</a></button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('userName')){
        //             html += `<button ><a href="/updateUser?id=${data.user[i]._id} ">Details</a></button>`
        //         }
        //         html += `</td> </tr> `
        //     }
        //     count += 10;
        //     // html += "</table>"
        //     $('table').append(html)
        //     // document.getElementById("table1").innerHTML = html
        // })

        socket.on('searchErr',(data) => {
            alert(data.message)
        })



        // socket.on('searchUser2', (data) => {
        //     // console.log(data)
        //     let html = `<table style="width:100%">
        //     <tr>
        //       <th>S.No</th>
        //       <th>User Name</th>
        //       <th>White lable</th>
        //       <th>Credit Reference</th>
        //       <th>Balance</th>
        //       <th>Available Balance</th>
        //       <th>Downlevel Balance</th>
        //       <th>Client P/L</th>
        //       <th>Upline P/L</th>
        //       <th>Exposure</th>
        //       <th>Exposure limit</th>
        //       <th>Lifetime Credit</th>
        //       <th>Lifetime Deposite</th>
        //       <th>Action</th>
        //     </tr>
        //     <tr>
        //     <td>1</td>
        //     <td class="getOwnChild" data-id='${JSON.stringify(data.user)}'>${data.user.userName}</td>
        //     <td>${data.user.whiteLabel}</td>
        //     <td>${data.user.creditReference}</td>
        //     <td>${data.user.balance}</td>
        //     <td>${data.user.availableBalance}</td>
        //     <td>${data.user.downlineBalance}</td>
        //     <td>${data.user.clientPL}</td>
        //     <td>${data.user.uplinePL}</td>
        //     <td>${data.user.exposure}</td>
        //     <td>${data.user.exposureLimit}</td>
        //     <td>${data.user.lifeTimeCredit}</td>
        //     <td>${data.user.lifeTimeDeposit}</td>
        //     <td>`
        //     if(data.currentUser.role.authorization.includes('userStatus')){
        //         html += `<button class="userStatus" type="userStatus" id="${data.user._id}" data-myval='${JSON.stringify(data.user)}'>U/S</button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
        //         html += `<button class="betLockStatus" id="${data.user._id}" data-myval='${JSON.stringify(data.user)}'>BetLock status</button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('changeUserPassword')){
        //         html += `<button ><a href="/resetPassword?id=${data.user._id} ">change password</a></button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('accountControl')){
        //         html += `<button ><a href="/accountStatement?id=${data.user._id} ">A/S</a></button>
        //         <button ><a href="/DebitCredit?id=${data.user._id} ">D/C</a></button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('userName')){
        //         html += `<button ><a href="/updateUser?id=${data.user._id} ">Details</a></button>`
        //     }
        //   html += `</td> </tr> </table>`
        // //     <button class="userStatus" type="userStatus" id="${data.user._id }" data-myval="${JSON.stringify(data.user)}">U/S</button>
        // //       <button class="betLockStatus" id="${data.user._id}" data-myval="${JSON.stringify(data.user)}">BetLock status</button>
        // //       <button ><a href="/resetPassword?id=${data.user._id}">change password</a></button>
        // //       <button ><a href="/accountStatement?id=${data.user._id}">A/S</a></button>
        // //       <button ><a href="/updateUser?id=${data.user._id}">Details</a></button>
        // //       <button><a href="/DebitCredit?id=${data.user._id}">D/C</a></button>
        // //     </td>
        // // </tr>
        // // </table>
        //     document.getElementById("table1").innerHTML = html
        // })

        socket.on('load1', (data) => {
            // console.log(data)
        })

    }




    //for inactive users//
    if(pathname == "/admin/inactiveUser"){
        $(document).on('click','.userStatusActive',function(e){
            e.preventDefault();
            let id = $(this).data('id')
            socket.emit('UserActiveStatus', {id, LOGINDATA})
        })
        $(document).on('click','.Delete',function(e){
            e.preventDefault();
            let id = $(this).data('id')
            socket.emit("deleteUser", {id, LOGINDATA});
        })
        socket.on("inActiveUserDATA", (data) => {
            let html = `<table style="width:100%">
            <tr>
              <th>S.No</th>
              <th>User Name</th>
              <th>White lable</th>
              <th>Action</th>
            </tr>`
            for(let i = 0; i < data.length; i++){
                html += `<tr>
                <td>${i + 1}</td>
                <td>${data[i].userName}</td>
                <td>${data[i].whiteLabel}</td>
                <td>
                  <button class="userStatusActive" type="userStatusActive" id="userStatusActive" data-id="${data[i]._id}">User status Active</button>
                  <button class="Delete" type="Delete" id="Delete" data-id="${data[i]._id}">Delete</button>
                </td>
              </tr>`
            }
            html += `</table>`
            // console.log(html)
            document.getElementById('table1_Inactive').innerHTML = html
        })
        socket.on('inActiveUserDATA1', (data) => {
            let html = `<table style="width:100%">
            <tr>
              <th>S.No</th>
              <th>User Name</th>
              <th>White lable</th>
              <th>Action</th>
            </tr>`
            for(let i = 0; i < data.length; i++){
                html += `<tr>
                <td>${i + 1}</td>
                <td>${data[i].userName}</td>
                <td>${data[i].whiteLabel}</td>
                <td>
                  <button class="userStatusActive" type="userStatusActive" id="userStatusActive" data-id="${data[i]._id}">User status Active</button>
                  <button class="Delete" type="Delete" id="Delete" data-id="${data[i]._id}">Delete</button>
                </td>
              </tr>`
            }
            html += `</table>`
            // console.log(html)
            document.getElementById('table1_Inactive').innerHTML = html
        })
    }
    //for online users//
    if(pathname == "/admin/loginUser"){
        // $(document).on('click','.userLogout',function(){
        //     let id = $(this).data('id');
        //     $(this).parent().parent().html('')
        //     socket.emit('logOutUser',{id, LOGINDATA})
        // })
        // socket.on('logOutUser',(data) => {
        //     // console.log(data.users)

        // })
    }




    if(pathname == "/admin/useracount"){


        function generatePDF(table) {
            const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(`
                    <html>
                        <head>
                        <title>Account Statement</title>
                        <style>
                            .ownAccDetails {
                                color: black;
                                border: none;
                                background-color: inherit;
                                padding: 14px 28px;
                                font-size: 16px;
                                cursor: pointer;
                                display: inline-block;
                            }
                            body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            }
                            table {
                            border-collapse: collapse;
                            width: 100%;
                            }
                            th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            }
                            th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                            }
                        </style>
                        </head>
                        <body>
                        ${table.outerHTML}
                        </body>
                    </html>
                    `);
                    printWindow.document.close();

                    printWindow.print();
                
          }

        document.getElementById('pdfDownload').addEventListener('click', function() {
            console.log("Working")
            const table = document.getElementById('table12');
            
            if (table) {
              generatePDF(table);
            }
          });

        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

        function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            const csv = [];
            
            for (const row of rows) {
              const rowData = [];
              const columns = row.querySelectorAll('td, th');
              
              for (const column of columns) {
                rowData.push(column.innerText);
              }
              
              csv.push(rowData.join(','));
            }
            
            return csv.join('\n');
          }


        document.getElementById('downloadBtn').addEventListener('click', function() {
            const table = document.getElementById('table12');             
            if (table) {
              const csvContent = convertToCSV(table);
              downloadCSV(csvContent, 'AccountStatement.csv');
            }
          });

        // console.log($('.searchUser'))
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })
        let model 

        $(document).on('click','.ownAccDetails',function(e){
            let modelId = $(this).attr('id')
            let modelId1 = $(this).attr("data-bs-target")
            model =  $(modelId1)
            socket.emit("ElementID", modelId)
        })

        socket.on('getMyBetDetails',(data)=>{
            // console.log(data)
            let html = ``
            if(data.transactionId){
                html += `<thead>
                <tr style="text-align: center;font-size: 11px;color: #fff;">
                  <th>Date</th>
                  <th>Event</th>
                  <th>Market</th>
                  <th>Bet on</th>
                  <th>odds</th>
                  <th>Stake</th>
                  <th>Status</th>
                  <th>Returns</th>
                </tr>
            </thead>`
                html += `<tbody class="new-body" style="font-size: 11px;">
                <tr style="text-align: center;" class="blue"><td>${new Date(data.date)}</td>
                <td>${data.event}</td>`
                if(data.marketName){
                    html += `<td>${data.marketName}</td>`
                }else{
                    html += `<td>-</td>`
                }

                if(data.selectionName){
                    html += `<td>${data.selectionName}</td>`
                }else{
                    html += `<td>-</td>`
                }
                if(data.oddValue){
                    html += `<td>${data.oddValue}</td>`
                }else{
                    html += `<td>-</td>`
                }

                html += `
                <td>${data.Stake}</td>
                <td>${data.status}</td>
                <td>${data.returns}</td></tr></tbody>`
                model.find('table').html(html)
            }else{
                html += `<thead>
                <tr style="text-align: center;font-size: 11px;color: #fff;">
                  <th>Date</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>From/To</th>
                  <th>Closing</th>
                  <th>Description</th>
                  <th>Remarks</th>
                </tr>
            </thead>
            <tbody class="new-body" style="font-size: 11px;">`
                html += `<tr style="text-align: center;" class="blue"><td>${new Date(data.date)}</td>`
                if(data.creditDebitamount>0){
                    html += `<td>${data.creditDebitamount}</td><td>0</td>`
                    if(data.parent_id.userName == data.user_id.userName){
                        html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
                    }else{
                        html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                    }
                }else{
                    html += `<td>0</td><td>${data.creditDebitamount}</td>`
                    if(data.parent_id.userName == data.user_id.userName){
                        html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                    }else{
                        html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
                    }
                }
                
                        html += `
                        <td>${data.balance}</td>
                        <td>${data.description}</td>
                        <td>-</td></tr></tbody>`
                        // console.log(html)
                        model.find('table').html(html)
                    }
            // console.log(model)
        })
            // let 
            // let data = $(this).parent().parent().data('details')
            // let html = '';
            // if(data.hasOwnProperty('transactionId')){
            //     socket.emit('getMyBetDetails',data.transactionId)
                
            //         // console.log(data)
                   

            // }
            
    
            //     
            // }

        
        
            // console.log(data)


        
            socket.on("ACCSEARCHRES", async(data)=>{
                // console.log(data, 565464)
                let html = ``
        if(data.page === 1){
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }else if(data.page === null){
            document.getElementById("button").innerHTML = ``
        }else{
            html = document.getElementById('search').innerHTML
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }
            })

        let searchU 
        let SUSER
        let match = false
        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                // console.log(val,1234)
                var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }
                // console.log(match, 123)
             if(match) {
                searchU = true
                let  data = {}
                let Fdate = document.getElementById("Fdate").value
                let Tdate = document.getElementById("Tdate").value
                if(!Fdate){
                    Fdate = 'undefined'
                }
                if(!Tdate){
                    Tdate = 'undefined'
                }
                data.Fdate = Fdate;
                data.Tdate = Tdate;
                data.userName = val
                SUSER = val
                data.Tdate = document.getElementById("Tdate").value
                data.page = 0
                data.LOGINDATA = LOGINDATA
                $('.pageLink').attr('data-page',1)
                // console.log(data, 456)
                 socket.emit( "UserSearchId", data)
             }else{
                searchU = false
             }
        });

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            searchU = true
                let  data = {}
                let Fdate = document.getElementById("Fdate").value
                let Tdate = document.getElementById("Tdate").value
                if(!Fdate){
                    Fdate = 'undefined'
                }
                if(!Tdate){
                    Tdate = 'undefined'
                }
                data.Fdate = Fdate;
                data.Tdate = Tdate;
                data.userName = this.textContent
                SUSER = this.textContent
                data.Tdate = document.getElementById("Tdate").value
                data.page = 0
                data.LOGINDATA = LOGINDATA
                $('.pageLink').attr('data-page',1)
                // console.log(data, 456)
                 socket.emit( "UserSearchId", data)
        })

        $(document).on("click", ".load", function(){
            
            let page = 0;
            $('.pageLink').attr('data-page',1)
            let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;
           
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            let data = {}
            if(searchU){
                 data.id = SUSER,
                 data.page = page,
                 data.Fdate = Fdate,
                 data.Tdate = Tdate,
                 data.LOGINDATA = LOGINDATA
            }{
                 data.page = page,
                 data.Fdate = Fdate,
                 data.Tdate = Tdate,
                 data.LOGINDATA = LOGINDATA
            }
            socket.emit('AccountScroll',data)        
        })

        $(window).scroll(function() {
            // console.log(LOGINDATA)
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
            let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;
                // console.log(loginUser, id)
                let page = parseInt($('.pageLink').attr('data-page'));
                // console.log(page)
                Fdate = document.getElementById("Fdate").value
                Tdate = document.getElementById("Tdate").value
                $('.pageLink').attr('data-page',page + 1)
                let data = {}
               if(searchU){
                    data.id = SUSER,
                    data.page = page,
                    data.Fdate = Fdate,
                    data.Tdate = Tdate,
                    data.LOGINDATA = LOGINDATA
               }{
                    data.page = page,
                    data.Fdate = Fdate,
                    data.Tdate = Tdate,
                    data.LOGINDATA = LOGINDATA
               }
                
                socket.emit('AccountScroll',data)
            }
         }); 

         let count1 = 11
         socket.on("Acc", async(data) => {
            // console.log(data)
            if(data.json.status == "success"){
                if(data.page == 0){
                    count1 = 1;

                        $('table').html(`<tr style="text-align: center;font-size: 11px;">+
                        "<th>S.No</th>" +
                        "<th>Date</th>" +
                        "<th>Time</th>" +
                        "<th>Stake</th>" +
                        "<th>Credit</th>"+
                        "<th>Debit</th>"+
                        "<th>From / To</th>"+
                        "<th>Closing</th>"+
                        "<th>Description</th>"+
                        "<th>Remarks</th>"+
                      "</tr> `)
                }
                let html = "";
                for(let i = 0; i < data.json.userAcc.length; i++){
                    let date = new Date(data.json.userAcc[i].date);
                    // let abc =date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()
                    // console.log(abc)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue" >
                        <td>${count1 + i}</td>
                        <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td>${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].stake){
                            html += `<td>${data.json.userAcc[i].stake}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            html += `<td>${data.json.userAcc[i].creditDebitamount}</td>
                            <td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            html += `<td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td>`
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }
                            }else{
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td><td>-</td>`
                            }
                        }
                        html += `<td>${data.json.userAcc[i].balance}</td>
                        <td><button class="ownAccDetails" id="${data.json.userAcc[i]._id}" style="background-color: transparent;" data-bs-toggle="modal" data-bs-target="#myModal5"> ${data.json.userAcc[i].description}&nbsp;<i class="fa-solid fa-sort-down"></i></button></td>
                        <td>-</td>`
                    }else{
                        html += `<tr style="text-align: center;" >
                        <td>${count1 + i}</td>
                        <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td>${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].stake){
                            html += `<td>${data.json.userAcc[i].stake}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            html += `<td>${data.json.userAcc[i].creditDebitamount}</td>
                            <td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            html += `<td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td>`
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }
                            }else{
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td><td>-</td>`
                            }
                        }
                        html += `<td>${data.json.userAcc[i].balance}</td>
                        <td><button class="ownAccDetails" id="${data.json.userAcc[i]._id}" style="background-color: transparent;" data-bs-toggle="modal" data-bs-target="#myModal5"> ${data.json.userAcc[i].description}&nbsp;<i class="fa-solid fa-sort-down"></i></button></td>
                        <td>-</td>`
                    }
                }
                count1 += 10;
                $('table').append(html)
            }
         })

     
    }

    // if(pathname == "/admin/reports"){    
    //     // console.log("Working")
    //     $('.searchUser').keyup(function(){
    //         // console.log('working')
    //         if($(this).hasClass("searchUser")){
    //             // console.log($(this).val())
    //             if($(this).val().length >= 3 ){
    //                 let x = $(this).val(); 
    //                 // console.log(x)
    //                 socket.emit("SearchACC", {x, LOGINDATA})
    //             }else{
    //                 // document.getElementById('select').innerHTML = ``
    //             }
    //         }
    //     })


        if(pathname == "/admin/reports"){
            $('.searchUser').keyup(function(){
                // console.log('working')
                if($(this).hasClass("searchUser")){
                    // console.log($(this).val())
                    if($(this).val().length >= 3 ){
                        let x = $(this).val(); 
                        // console.log(x)
                        socket.emit("SearchACC", {x, LOGINDATA})
                    }else{
                        document.getElementById('search').innerHTML = ``
                        document.getElementById("button").innerHTML = ''
                    }
                }
            })
        
            $(document).on("click", ".next", function(e){
                e.preventDefault()
                let page = $(this).attr("id")
                let x = $("#searchUser").val()
                socket.emit("SearchACC", {x, LOGINDATA, page})
            })
    
    
            socket.on("ACCSEARCHRES", async(data)=>{
                // console.log(data, 565464)
                let html = ``
        if(data.page === 1){
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }else if(data.page === null){
            document.getElementById("button").innerHTML = ``
        }else{
            html = document.getElementById('search').innerHTML
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }
            })
    
            let searchU 
            let SUSER
            let fromDate
            let toDate
            let fGame
            let fBets
            let filterData = {}
            $(".searchUser").on('input', function(e){
                var $input = $(this),
                    val = $input.val();
                    var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }
    
                    if(match){
                        // console.log(match.text())
                        filterData = {}
                        filterData.userName = val
                        $('.pageId').attr('data-pageid','1')
                        socket.emit('userBetDetail',{filterData,LOGINDATA,page:0})
                    }
            })
    
    
            $('.filter').click(function(){
                let userName = $('.searchUser').val()
                fromDate = $('#fromDate').val()
                toDate = $('#toDate').val()
                fGame = $('#fGame').val()
                fBets = $('#fBets').val()
                let page = $('.pageId').attr('data-pageid','1')
                data.page = 0;
                if(fromDate != ''  && toDate != '' ){
                    filterData.date = {$gte : fromDate,$lte : toDate}
                }else{
    
                    if(fromDate != '' ){
                        filterData.date = {$gte : fromDate}
                    }
                    if(toDate != '' ){
                        filterData.date = {$lte : toDate}
                    }
                }
                if(userName != ''){
                    filterData.userName = userName
                }else{
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }
                filterData.betType = fGame
                filterData.status = fBets
                data.filterData = filterData
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userBetDetail',data)
    
            })

            $(document).on("click", ".searchList", function(){
                // console.log("working")
                // console.log(this.textContent)
                document.getElementById("searchUser").value = this.textContent
                filterData = {}
                filterData.userName = this.textContent
                $('.pageId').attr('data-pageid','1')
                socket.emit('userBetDetail',{filterData,LOGINDATA,page:0})
                
            })
    
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();
                var windowHeight = $(window).height() * window.devicePixelRatio;
                var documentHeight = $(document).height() * window.devicePixelRatio;
                if(scroll + windowHeight >= documentHeight){
                    console.log("working")
                    let page = parseInt($('.pageId').attr('data-pageid'));
                    $('.pageId').attr('data-pageid',page + 1)
                    let data = {}
                    let userName = $('.searchUser').val()
                    if(userName == ''){
                        filterData.userName = LOGINDATA.LOGINUSER.userName
                    }else{
                        filterData.userName = userName
                    }
                    if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                        filterData.date = {$gte : fromDate,$lte : toDate}
                    }else{
    
                        if(fromDate != undefined && fromDate != '' ){
                            filterData.date = {$gte : fromDate}
                        }
                        if(toDate != undefined && toDate != '' ){
                            filterData.date = {$lte : toDate}
                        }
                    }
                    if(fGame !== undefined ){
                        filterData.betType = fGame
                    }
                    if(fBets != undefined ){
                        filterData.status = fBets
                    }
    
                    data.filterData = filterData;
                    data.page = page
                    data.LOGINDATA = LOGINDATA
                    // console.log(data)
                    socket.emit('userBetDetail',data)
    
    
    
                }
             }); 
             

            let count = 11
            socket.on('userBetDetail',(data) => {
                if(data.page === 0){
                    count = 1
                }
                let page = data.page
                let bets = data.ubDetails;
                let html = '';
                 for(let i = 0; i < bets.length; i++){
                     let date = new Date(bets[i].date)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
                    }
                    html += `<td>${i + count}</td>
                    <td>${bets[i].userName}</td>
                    <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}</td>
                    <td>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>`
                    if(bets[i].match){
                        html += `<td>-</td>
                        <td>${bets[i].match}</td>
                        <td>${bets[i].marketName}</td>
                        <td>${bets[i].selectionName}</td>
                        <td>${bets[i].oddValue}</td>`
                    }else{
                        html += `<td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>`
                    }
                    html += `
                    <td>${bets[i].status}</td>
                    <td>${bets[i].Stake}</td>
                    <td>${bets[i].returns}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].event}</td></tr>`
                }
                count += 10
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
            })
    
        }

        
    // }

    if(pathname == "/admin/casinocontrol"){
        let baccarat = false;
        let RGV = false;
        let EZ = false;
        let EG = false;
        $(BACCARAT).click(function(){
            if(!baccarat){
                // console.log("1")
                socket.emit('baccarat', "on")
                baccarat = true
            }
        })

        $("#RGV").click(function(){
            if(!RGV){
                // console.log(2)
                socket.emit('RGV', "on")
                RGV=true
            }
        })

        $('#EZ').click(function(){
            if(!EZ){
                socket.emit('EZ', "on")
                EZ = true
            }
        })

        $('#EG').click(function(){
            if(!EG){
                socket.emit('EG', "on")
                EG = true
            }
        })

        socket.on('baccarat1', (data1) => {
            let html = ""
            for(let i = 0 ; i < data1.length; i++){
                if(data1[i].status){
                    html += `<div class="new-head" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;">
                    <span>${data1[i].game_name} (${data1[i].sub_provider_name})</span>
                    <span>OFF &nbsp; <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider round"></span>
                    </label>&nbsp; ON</span>
                  </div>`
                }else{
                    html += `<div class="new-head" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;">
                    <span>${data1[i].game_name} (${data1[i].sub_provider_name})</span>
                    <span>OFF &nbsp; <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                    </label>&nbsp; ON</span>
                  </div>`
                }
            }
            document.getElementById('accordion-body').innerHTML = html
        });

        socket.on("RGV1", (data)=>{
            let html = ""
            // console.log(data.data)
            for(let i = 0; i < data.data.length ; i++){
                if((i%2)==0){
                    html += `<div class="col-lg-4">
                        <div class="new-head" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;margin-bottom: 10px;">
                      <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>
                      <span>OFF &nbsp; <label class="switch">`
                      if(data.data[i].status){
                        html += `<input type="checkbox" checked>`
                      }else{
                        html += `<input type="checkbox">`
                      }
                      html +=`<span class="slider round"></span>
                      </label>&nbsp; ON</span>
                    </div>`
                }else if(((i%2)-1)==0){
                    html += `<div class="new-head" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;margin-bottom: 10px;">
                      <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>
                      <span>OFF &nbsp; <label class="switch">`
                      if(data.data[i].status){
                        html += `<input type="checkbox" checked>`
                      }else{
                        html += `<input type="checkbox">`
                      }
                      html +=`<span class="slider round"></span>
                      </label>&nbsp; ON</span>
                    </div>
                    </div>`
                }else{
                    html += `<div class="new-head" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;margin-bottom: 10px;">
                      <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>
                      <span>OFF &nbsp; <label class="switch">`
                      if(data.data[i].status){
                        html += `<input type="checkbox" checked>`
                      }else{
                        html += `<input type="checkbox">`
                      }
                      html +=`<span class="slider round"></span>
                      </label>&nbsp; ON</span>
                    </div>`
                }
            }
            if(data.provider == "RGV"){
                document.getElementById('RGVd').innerHTML = html
            }else if(data.provider == "EZ"){
                document.getElementById('EZUGId').innerHTML = html
            }else if(data.provider == "EG"){
                document.getElementById('ZEd').innerHTML = html
            }
        })
    }



    if(pathname == "/ALLGAMEFORTESTING"){
        // console.log('working')
        $('.img').click(function(){
            let id = this.id;
            socket.emit('IMGID', {id, LOGINDATA})
         });

         socket.on('URLlINK', (data) =>{
            // console.log(data)
            document.getElementById('data123').innerHTML = `<iframe src="${data}" width="100%" height="1000"></iframe>`
         })
    }

    if(pathname == "/admin/plreport"){
        // let fromDate
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })
        // let toDate
        let filterData = {}
        

        socket.on("ACCSEARCHRES", async(data)=>{
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        $(window).scroll(function() {
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                // if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                //     filterData.date = {$gte : fromDate,$lte : toDate}
                // }else{

                //     if(fromDate != undefined && fromDate != '' ){
                //         filterData.date = {$gte : fromDate}
                //     }
                //     if(toDate != undefined && toDate != '' ){
                //         filterData.date = {$lte : toDate}
                //     }
                // }    
                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userPLDetail',data)



            }
         }); 

        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }

                if(match){
                    // console.log(match.text())
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('userPLDetail',{filterData,LOGINDATA,page:0})
                }
        })
        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            socket.emit('userPLDetail',{filterData,LOGINDATA,page:0})
           
        })

        socket.on('userPLDetail',(data)=>{
            // console.log(data.page)
            let users = data.users
            let page = data.page;
            let html = '';
            for(let i = 0; i < users.length; i++){
                if((i%2) == 0){
                    html += `<tr style="text-align: center;" class="blue">`
                }else{
                    html += `<tr style="text-align: center;">`
                }
                html += `<td>${users[i].userName}</td>
                <td>${users[i].Won}</td>
                <td>${users[i].Loss}</td>
                <td>${users[i].myPL}</td>
                </tr>`
            }
            if(page == 0){
                $('.new-body').html(html)
            }else{
                $('.new-body').append(html)
            }
          
          
        })


    }
    if(pathname == "/admin/userhistoryreport"){
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })

        socket.on("ACCSEARCHRES", async(data)=>{
            // console.log(data, 565464)
            let html = ``
        if(data.page === 1){
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }else if(data.page === null){
            document.getElementById("button").innerHTML = ``
        }else{
            html = document.getElementById('search').innerHTML
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }
        })

        let fromDate
        let toDate
        let filterData  = {}
        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }

                if(match){
                    // console.log(match.text())
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('userHistory',{filterData,LOGINDATA,page:0})
                }
        })

        $('.filter').click(function(){
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.login_time = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != '' ){
                    filterData.login_time = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.login_time = {$lte : toDate}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('userHistory',data)
        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            let userName = this.textContent
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.login_time = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != '' ){
                    filterData.login_time = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.login_time = {$lte : toDate}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('userHistory',data)
        })

        $(window).scroll(function() {
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                    filterData.login_time = {$gte : fromDate,$lte : toDate}
                }else{

                    if(fromDate != undefined && fromDate != '' ){
                        filterData.login_time = {$gte : fromDate}
                    }
                    if(toDate != undefined && toDate != '' ){
                        filterData.login_time = {$lte : toDate}
                    }
                }

                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userHistory',data)



            }
         }); 
        
        let count = 11
        socket.on('userHistory',(data)=>{
            if(data.page == 0){
                count = 1
            }
            let html = '';
            let page = data.page
            Logs = data.users
            for(let i = 0; i < Logs.length; i++){
                 let date = new Date(Logs[i].login_time)
                if((i%2) == 0){
                    html += `<tr style="text-align: center;" class="blue">`
                }else{
                    html += `<tr style="text-align: center;">`
                }
                html += `<td>${i+count}</td>
                <td>${Logs[i].userName}</td>
                <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()},${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                <td>${Logs[i].ip_address}</td>`
                if(Logs[i].isOnline){
                    html += `<td>Active</td>`
                }else{
                    html += `<td>LogOut</td>`   
                }
                html += `</tr>`
            }
            count += 10
            if(page == 0){
                $('.new-body').html(html)
            }else{
                $('.new-body').append(html)
            }


         
        })
    }

    if(pathname == "/admin/gamereport"){
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })

        socket.on("ACCSEARCHRES", async(data)=>{
            let html = ``
        if(data.page === 1){
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }else if(data.page === null){
            document.getElementById("button").innerHTML = ``
        }else{
            html = document.getElementById('search').innerHTML
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }
        })

        let filterData = {}
        $(window).scroll(function() {
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                // if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                //     filterData.date = {$gte : fromDate,$lte : toDate}
                // }else{

                //     if(fromDate != undefined && fromDate != '' ){
                //         filterData.date = {$gte : fromDate}
                //     }
                //     if(toDate != undefined && toDate != '' ){
                //         filterData.date = {$lte : toDate}
                //     }
                // }    
                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('gameReport',data)



            }
         }); 

        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }

                if(match){
                    // console.log(match.text())
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('gameReport',{filterData,LOGINDATA,page:0})
                }
        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            socket.emit('gameReport',{filterData,LOGINDATA,page:0})
            
        })

        socket.on('gameReport',(data)=>{
            // console.log(data)
            let page = data.page;
            let games = data.games;
            let html = '';
            let count 
            if(page != 0){
                count = (10 * page) + 1
            }else{
                count = 1
            }
            for(let i = 0;i<games.length;i++){
                if(i % 2 == 0){
                  html += `<tr style="text-align: center;">`
                }else{
                  html += `<tr style="text-align: center;" class="blue">`
                }
                  html += `<td>${count + i}</td>
                  <td>${games[i]._id}</td>
                  <td>${games[i].gameCount}</td>
                  <td>${games[i].betCount}</td>
                  <td>${games[i].won}</td>
                  <td>${games[i].loss}</td>`
                if(games[i].returns >= 0){
                  html += `<td style="color: #46BCAA;">+${games[i].returns}</td>`
                }else{
                  html += `<td style="color: #FE3030;">${games[i].returns}</td>`
                }
                html += `</tr>`
                count++
            }

            if(data.page == 0){
            $('.new-body').html(html)
            }else{
            $('.new-body').append(html)
            }
        })
    }

    if(pathname == "/admin/onlineUsers"){
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchOnlineUser", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
        socket.on("SearchOnlineUser", (data) =>{
            console.log(data, 565464)
            let html = ``
    if(data.page === 1){
        for(let i = 0; i < data.onlineUsers.length; i++){
            html += `<li class="searchList" id="${data.onlineUsers[i]._id}">${data.onlineUsers[i].userName}</li>`
        }
        document.getElementById('search').innerHTML = html
        document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
    }else if(data.page === null){
        document.getElementById("button").innerHTML = ``
    }else{
        html = document.getElementById('search').innerHTML
        for(let i = 0; i < data.onlineUsers.length; i++){
            html += `<li class="searchList" id="${data.onlineUsers[i]._id}">${data.onlineUsers[i].userName}</li>`
        }
        document.getElementById('search').innerHTML = html
        document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
    }
        })

        $(".logout").click(function(){
            let id = $(this).attr("id")
            socket.emit("SelectLogoutUserId", id)
        })

        socket.on("SelectLogoutUserId", (data) => {
            console.log(data)
            alert("User Logout")
                window.setTimeout(()=>{
                    window.location = '/admin/onlineUsers '
                },500)
        });

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            socket.emit('OnlineUser',{filterData,LOGINDATA,page:0})
            
        })

        socket.on('OnlineUser', async(data) => {
            console.log(data)
            let html = `<tr style="text-align: center;" class="blue">
            <td>1</td>
            <td>${data.onlineUsers.userName}</td>
            <td>

                <button type="button" id="${data.onlineUsers._id}" class="logout">Logout</button>
            </td>
        </tr>`
        $('.new-body').html(html)

        })


        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchOnlineUser", {x, LOGINDATA, page})
        })
    }

    if(pathname == "/admin/betmoniter"){
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })

        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })


        socket.on("ACCSEARCHRES", async(data)=>{
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        let toDate;
        let fromDate;
        let filterData = {}
        $(".searchUser").on('input', function(e){
            var $input = $(this),
                    val = $input.val();
                    var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }

                if(match){
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('betMoniter',{filterData,LOGINDATA,page:0})
                }
        })


        $('.filter').click(function(){
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.date = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != '' ){
                    filterData.date = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.date = {$lte : toDate}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('betMoniter',data)

        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            socket.emit('betMoniter',{filterData,LOGINDATA,page:0})
            
        })

        $(window).scroll(function() {
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                    filterData.date = {$gte : fromDate,$lte : toDate}
                }else{

                    if(fromDate != undefined && fromDate != '' ){
                        filterData.date = {$gte : fromDate}
                    }
                    if(toDate != undefined && toDate != '' ){
                        filterData.date = {$lte : toDate}
                    }
                }

                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('betMoniter',data)



            }
            }); 
            
            let count = 11
            socket.on('betMoniter',(data) => {
                // console.log(data)
                if(data.page === 0){
                    count = 1
                }
                let bets = data.ubDetails;
                let html = '';
                    for(let i = 0; i < bets.length; i++){
                        let date = new Date(bets[i].date)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
                    }
                    html += `<td>${i + count}</td>
                    <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                    <td>${bets[i].userName}</td>
                    <td>${bets[i].event}</td>
                    `
                    if(bets[i].match){
                        html += `
                        <td>${bets[i].marketName}</td>
                        <td>${bets[i].oddValue}</td>
                        <td>${bets[i].match}</td>
                        <td>${bets[i].selectionName}</td>`
                    }else{
                        html += `<td>-</td>
                        <td>-</td><td>-</td><td>-</td>`
                    }
                    html += `
                    <td>${bets[i].Stake}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].status}</td>
                    <td>${bets[i].returns}</td>
                    <td><button class="voidBet" id="${bets[i]._id}">Cancel Bet</button></td>
                    </tr>`
                }
                count += 10;
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
            })

    
    $(document).on('click', '.voidBet', async function(e){
        e.preventDefault()
        socket.emit('voidBet', this.id)
    })
    socket.on("voidBet", (data)=>{
        alert("Bet Canceled successfully")
        window.location.href = "/admin/betmoniter"
    })

            

    }






    if(pathname == "/admin/voidbet"){
        // console.log("Working")
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    // document.getElementById('select').innerHTML = ``
                }
            }
        })


        socket.on("ACCSEARCHRES", async(data)=>{
            // console.log(data)
            let html = ` `
            for(let i = 0; i < data.length; i++){
                html += `<option><button onclick="myFunction(${data[i].userName})">${data[i].userName}</button>`
            }
            // console.log(html)
            document.getElementById('select').innerHTML = html

            let datalist = document.querySelector('#text_editors');
            // console.log(datalist)
            let  select = document.querySelector('#select');
            // console.log(select)
            let options = select.options;
            // console.log(options)



            / when user selects an option from DDL, write it to text field /
            select.addEventListener('change', fill_input);

            function fill_input() {
                    input.value = options[this.selectedIndex].value;
            hide_select();
            }

            / when user wants to type in text field, hide DDL /
            let input = document.querySelector('.searchUser');
            input.addEventListener('focus', hide_select);

            function hide_select() {
            datalist.style.display = '';
            //   button.textContent = "▼";
            }
        })

        let toDate;
        let fromDate;
        let filterData = {}
        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                list = $input.attr('list'),
                match = $('#'+list + ' option').filter(function() {
                    return ($(this).val() === val);
                });

                if(match.length > 0){
                    // console.log(match.text())
                    filterData = {}
                    filterData.userName = match.text()
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('voidBET',{filterData,LOGINDATA,page:0})
                }
        })


        $('.filter').click(function(){
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.date = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != '' ){
                    filterData.date = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.date = {$lte : toDate}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('voidBET',data)

        })

        $(window).scroll(function() {
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                    filterData.date = {$gte : fromDate,$lte : toDate}
                }else{

                    if(fromDate != undefined && fromDate != '' ){
                        filterData.date = {$gte : fromDate}
                    }
                    if(toDate != undefined && toDate != '' ){
                        filterData.date = {$lte : toDate}
                    }
                }

                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('voidBET',data)



            }
            }); 
            
            let count = 11
            socket.on('voidBET',(data) => {
                // console.log(data)
                let bets = data.ubDetails;
                let html = '';
                    for(let i = 0; i < bets.length; i++){
                        let date = new Date(bets[i].date)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
                    }
                    html += `<td>${i + count}</td>
                    <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                    <td>${bets[i].userName}</td>
                    <td>${bets[i].event}</td>
                    `
                    if(bets[i].match){
                        html += `
                        <td>${bets[i].marketName}</td>
                        <td>${bets[i].oddValue}</td>
                        <td>${bets[i].match}</td>
                        <td>${bets[i].selectionName}</td>`
                    }else{
                        html += `<td>-</td>
                        <td>-</td><td>-</td><td>-</td>`
                    }
                    html += `
                    <td>${bets[i].Stake}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].status}</td>
                    <td>${bets[i].returns}</td>
                    </tr>`
                }
                count += 10;
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
            })

    }


    if(pathname === "/exchange_sports/tennis"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 500)
        }
        marketId()

        socket.on("marketId", async(data) => {
            $(document).ready(function() {
          
                $(".0").each(function() {
                let id = this.id
                const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
                });

                $(".1").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
                });

                $(".2").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
                });

            })

            $(document).on("click", ".click", function(){
                window.location.href = `/exchange_sports/live_match?id=${this.id}`
            })
            
        })
    }



    if(pathname === "/exchange_sports/inplay"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
          
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 500)
        }
        marketId()

        socket.on("marketId", (data) => {
            $(document).ready(function() {
          
                $(".0").each(function() {
                let id = this.id
                const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
                });

                $(".1").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
                });

                $(".2").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
                });

            })
        })

        $(document).on("click", ".click", function(){
                window.location.href = `/exchange_sports/live_match?id=${this.id}`
        })
    }

    if(pathname === "/exchange_sports/live_match"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".market").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 500)
        }
        marketId()


        socket.on("marketId", async(data) => {
            // console.log(data)
            $(document).ready(function() {
          
                $(".BACK").each(function() {
                let id = this.id
                const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                for(let i = 0; i < 3; i++){
                    if($(this).hasClass(`${i}`)){
                        // this.innerHTML = `<button id="123">${foundItem.odds[i].backPrice1}</button>, <button id="123">${foundItem.odds[i].backPrice2}</button>, <button id="123">${foundItem.odds[i].backPrice3}</button>`
                        document.getElementById(`${this.id}0`).innerHTML = `${foundItem.odds[i].backPrice3}`
                        document.getElementById(`${this.id}1`).innerHTML = `${foundItem.odds[i].backPrice2}`
                        document.getElementById(`${this.id}2`).innerHTML = `${foundItem.odds[i].backPrice1}`

                    }
                }
                });

                $(".LAY").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    for(let i = 0; i < 3; i++){
                        if($(this).hasClass(`${i}`)){
                            // this.innerHTML = `<button id="123">${foundItem.odds[i].layPrice1}</button>, <button id="123">${foundItem.odds[i].layPrice2}</button>, <button id="123">${foundItem.odds[i].layPrice3}</button>`
                            document.getElementById(`${this.id}3`).innerHTML = `${foundItem.odds[i].layPrice1}`
                            document.getElementById(`${this.id}4`).innerHTML = `${foundItem.odds[i].layPrice2}`
                            document.getElementById(`${this.id}5`).innerHTML = `${foundItem.odds[i].layPrice3}`
                        }
                    }
                    });
             
            })
        })

        function eventID(){
            let eventId = $(".eventName").attr("id")
            socket.emit("eventId", eventId)
            setTimeout(()=>{
                eventID()
              }, 500)

        }
        eventID()
        socket.on("eventId", async(data)=>{
            if(data != ""){
                let score = JSON.parse(data)
                document.getElementById("Score").innerHTML = score[0].data
            }
        })

        // document.getElementsByClassName('button').addEventListener('click', function() {
        //     console.log("1234")
        //   var popup = document.getElementById('popupForm');
        //   popup.style.display = 'block';
        // });
        const buttons = document.getElementsByClassName('button');
        let popup = document.getElementById('popupForm');
        let form = $(popup).find('#bet-form')
        Array.from(buttons).forEach(function(button) {
            button.addEventListener('click', function() {
              popup.style.display = 'block';
            });
          });

          
    document.addEventListener('click', function(event) {
        if (!popup.contains(event.target) && !Array.from(buttons).some(button => button.contains(event.target))) {
          popup.style.display = 'none';
          form.find('input[name = "odds"]').val("")
        }

        if(Array.from(buttons).some(button => button.contains(event.target))){
            form.find('input[name = "odds"]').val("")
            form.find('input[name = "title"]').removeClass()
        }
      });



    //   $(document).on('click','.button',function(e){
    //     let modleName = $(".popup")
    //     let form = $(modleName).find('#bet-form')
    //     let eventName = $(".eventName").text()
    //     let marketId = $(".match_odd").attr('id')
    //     let x = parseFloat($(this).text())
    //     let id = parseFloat($(this).attr("id"))
    //     // form.find('input[name = "odds"]').val(x)
    //     form.find('input[name="odds"]').prop('value', x)
    //     form.find('input[name = "title"]').addClass(id);
    //     form.find('input[name = "button"]').addClass(marketId);
    //     form.find('input[name = "title"]').val(eventName)
    // })

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('button')) {
          e.preventDefault();
      
          var modleName = document.querySelector('.popup');
          var form = modleName.querySelector('#bet-form');
          var eventName = document.querySelector('.eventName').textContent;
          var marketId = document.querySelector('.match_odd').getAttribute('id');
          var x = parseFloat(e.target.textContent.trim());
          var id = e.target.getAttribute('id');
      
          form.querySelector('input[name="odds"]').value = x;
          form.querySelector('input[name="title"]').classList.add(id);
          form.querySelector('input[name="button"]').classList.add(marketId);
          form.querySelector('input[name="title"]').value = eventName;
        }
      });      

    async function checkOdd() {
    //    console.log('working')
        let modleName = $(".popup")
        let form = $(modleName).find('#bet-form')
        let formOddsbuttonId = form.find('input[name = "title"]').attr("class");
        let odds = $(`#${formOddsbuttonId}`).text()
        if(form.find('input[name = "odds"]').val() != odds && form.find('input[name = "odds"]').val() != ''){
            alert('odds value change')
            form.find('input[name = "odds"]').val(odds)
        }
       setTimeout(()=>{
        formOdds = null
        checkOdd()
      }, 300)
    }


    $(document).on('submit', '#bet-form', async function(e){
        e.preventDefault()
        let form = $(this)[0];
        let fd = new FormData(form);
        let data = Object.fromEntries(fd.entries());
        data.secId = $("#bet-title").attr("class").slice(0, -1);
        data.market = $("#SUBMIT").attr("class");
        data.eventId = $('.eventName')[0].id
        data.spoetId = $('.details')[0].id
        let modleName = $(".popup")
        let form1 = $(modleName).find('#bet-form')
        let formOddsbuttonId = form1.find('input[name = "title"]').attr("class");
        let odds = $(`#${formOddsbuttonId}`).text()
        if(odds != data.odds && !data.option1){
            alert('odds value change')
            form1.find('input[name = "odds"]').val(odds)
            data.odds = odds
        }else{
            form1.find('input[name = "odds"]').val(odds)
            data.odds = odds
        }
        // console.log(data)
        socket.emit('betDetails', {data, LOGINDATA});
    })

    socket.on("betDetails" , (data) => {
        alert(data)
    })




    }

    if(pathname === "/exchange_sports/cricket"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 500)
        }
        marketId()


        socket.on("marketId", async(data) => {
            // console.log(data)
            $(document).ready(function() {
          
                $(".0").each(function() {
                let id = this.id
                const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
                });

                $(".1").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
                });

                $(".2").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
                });

            })

            $(document).on("click", ".click", function(){
                window.location.href = `/exchange_sports/live_match?id=${this.id}`
            })

        })
    }


    if(pathname === "/exchange_sports/football"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 500)
        }
        marketId()

        socket.on("marketId", async(data) => {
            $(document).ready(function() {
          
                $(".0").each(function() {
                let id = this.id
                const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
                });

                $(".1").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
                });

                $(".2").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
                });

            })

            $(document).on("click", ".click", function(){
                window.location.href = `/exchange_sports/live_match?id=${this.id}`
            })
            
        })
    }




    if(pathname === '/admin/Notification'){

        $(document).on('submit', '.addNotification', async function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            socket.emit("createNotification", {data, LOGINDATA})
        })

        socket.on('createNotification', async(data)=>{
            if(data.status != "success"){
                alert(data.message)
            }else{
                alert("Notification added successfully")
                window.location.href = '/admin/Notification'
            }
        })

        $(document).on('click', '.update', async function(){
            let id = $(this).attr('id')
            socket.emit('updateStatus', {id, LOGINDATA})
        })

        $(document).on('click', '.Delete', async function(){
            let id = $(this).attr('id')
            socket.emit('deleteNotification', {id, LOGINDATA})
        })

        socket.on('updateStatus', async(data)=>{
            let html = ``
            if(data.status){
                html += `<a class="btn-green">Enable </a>`
            }else{
                html += `<a class="btn-green">Disable </a>`
            }
            document.getElementById(`${data.id}`).innerHTML = html
        })

        socket.on('deleteNotification', async(data)=>{
            if(data.status === 'success'){
                alert("Deleted successfully")
                window.setTimeout(()=>{
                    window.location = '/admin/Notification'
                },500)
            }else{
                alert(data.message)
            }
        })




    };





    if(pathname === "/"){
        $(document).on('click', '.foo', async function(){
            let id = $(this).attr('id')
            socket.emit("PromotionId", id)
        })

        socket.on("PromotionId", async(data) => {
            window.open(`${data.link}`, "_blank");
        })
    }


    if(pathname === "/admin/promotion"){
        $(document).on('click','.promotionDetails', function(){
            let id = $(this).attr('id')
            socket.emit("PromotionIdByData", id)
        });

        socket.on("PromotionIdByData", async(data) => {
            
                let modleName = "#myModal5"
                let form = $(modleName).find('.form-data1')
                let PMD = data
                form.attr('id', PMD._id);
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "name"]').attr('value',PMD.position)
                form.find('input[name = "link"]').attr('value',PMD.link)
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                }
                if(PMD.video){
                    form.find('#img').html(`<video src="../img/${PMD.position}.mp4" type="video/mp4" height=100 width=100>`)
                }else{
                    form.find('#img').html(`<img src="../img/${PMD.position}.png" height=100 width=100>`)
                }
        })
    }



    if(pathname === "/admin/liveMarket"){
        function marketId(){
            socket.emit("aggreat", LOGINDATA)
              setTimeout(()=>{
                if(pathname === "/admin/liveMarket"){
                    marketId()
                }
              }, 500)
        }
        marketId()
        

        socket.on("aggreat", async(data) => {
            data.forEach(item => {
                document.getElementById(`${item._id}`).innerText = item.totalStake
                document.getElementById(`${item._id}B`).innerText = item.count
            })
        })
    }


    if(pathname === "/admin/cms"){

        //FOR VERTICLE MENU//
        $(document).on('submit', '.form-data20', async function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            // console.log(data)
            socket.emit("createVerticalMenu", {data, LOGINDATA})
        })

        socket.on("createVerticalMenu", async(data)=>{
            if(data.status === "success"){
                alert("Menu Added Successfully")
                    window.setTimeout(()=>{
                        window.location = '/admin/cms'
                    },500)
            }else{
                alert(`${data.err.message}`)
            }
        })


        $(document).on('click','.getVerticalMenuDetails', function(){
            let id = $(this).attr('id')
            socket.emit("VerticalMenuIdByData", id)
            // console.log(id)
        });

        socket.on("VerticalMenuIdByData", async(data) => {
                let modleName = "#myModal5"
                let form = $(modleName).find('.form-data21')
                let PMD = data.verticalMenu
                form.attr('id', PMD._id);
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "menuName"]').attr('value',PMD.menuName)
                form.find('input[name = "num"]').attr('value',PMD.num)
                form.find('input[name = "url"]').attr('value',PMD.url)
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                }
                let html = ``
                for(let i =0 ; i<data.page.length; i++){
                    if(data.page[i].Name === data.verticalMenu.page){
                        html += `<option selected value="${data.page[i].Name}">${data.page[i].Name}</option>`
                    }else{
                        html += `<option value="${data.page[i].Name}">${data.page[i].Name}</option>`
                    }
                }
                document.getElementById('page123').innerHTML = html
        })

        $(document).on('submit', ".form-data21", function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            let id  = $(this).attr('id')
            data.id = id
            socket.emit("updateVerticalMenu", data)
        });
        
        socket.on("updateVerticalMenu", async(data)=>{
            alert(`${data}`)
                    window.setTimeout(()=>{
                        window.location = '/admin/cms'
                    },500)
        })

        $(document).on('click', ".deleteVerticalMenuDetails", function(e){
            let id = $(this).attr('id')
            socket.emit("deleteVerticalMenu", id)
        })

        socket.on("deleteVerticalMenu", async(data) => {
            alert("Menu Deleted Successfully")
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },500)
        })


        $(document).on('click', ".getHorizontalMenuDetails", function(e){
            let id = $(this).attr('id')
            socket.emit("HorizontalMenuIdByData", id)
        })
        socket.on('HorizontalMenuIdByData', async(data) => {
                let modleName = "#myModal6"
                let form = $(modleName).find('.form-data23')
                let PMD = data
                form.attr('id', PMD._id);
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "menuName"]').attr('value',PMD.menuName)
                form.find('input[name = "url"]').attr('value',PMD.url)
                form.find('input[name = "num"]').attr('value',PMD.Number)
                form.find('input[name = "page"]').attr('value',PMD.page)
                document.getElementById('img').innerHTML = `<img src="../imgForHMenu/${PMD.icon}.png" alt="img" class="form__user-photo">`
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                }
        })

        $(document).on('click', ".deleteHorizontalMenu", function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            socket.emit("deleteHorizontalMenu", id)
        })
        socket.on('deleteHorizontalMenu', async(data)=>{
            alert("Menu deleted")
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        $(document).on("click", ".getBannerDetails", function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            socket.emit("getBannerDetails", id)
        })

        socket.on("getBannerDetails", async(data) => {
            let modleName = "#myModal7"
                let form = $(modleName).find('.form-data25')
                let PMD = data
                form.attr('id', PMD._id);
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "bannerName"]').attr('value',PMD.bannerName)
                form.find('input[name = "url"]').attr('value',PMD.url)
                document.getElementById('banner12').innerHTML = `<img src="../banner/${PMD.banner}.png" alt="img" class="form__user-photo">`
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                }
        })

        $(document).on("click", ".deleteBanner", function(e){
            let id = $(this).attr('id')
            socket.emit("deleteBanner", id)
        })

        socket.on("deleteBanner", data =>{
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        socket.emit("CmsPage", "Connected")
        socket.on('CmsPage', async(data) => {
            for(let i = 0; i < data.length; i++){
                let form = $(`#${data[i]._id}`)
                form.find('input[name = "url"]').attr('value', data[i].mainUrl)
                form.find('input[name = "name"]').attr('value', data[i].name)
                form.find('input[name = "Number"]').attr('value', data[i].Number)
                form.find('input[name = "check"]').removeAttr('checked');
                if(data[i].status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                }
            }
        })

        $(document).on('click', ".btn-filter-image", function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            let modleName = "#addImage"
            let form = $(modleName).find('.form-data26')
            form.attr('id', id);
        })

        $(document).on('click', '.dleteImageSport', function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            socket.emit("dleteImageSport" , id)
        })
        socket.on('dleteImageSport', async(data)=>{
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        $(document).on('click', '.dleteImageRoyal', function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            socket.emit("dleteImageRoyal" , id)
        })
        socket.on('dleteImageRoyal', async(data)=>{
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        $(document).on('click', '.dleteImageCasino', function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            socket.emit("dleteImageCasino" , id)
        })
        socket.on('dleteImageCasino', async(data)=>{
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        socket.on('UpdateSport', async(data) => {
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })


        $(document).on('click', ".deleteSlider", function(e){
            e.preventDefault()
            let id = $(this).attr('id')
            socket.emit('deleteSlider', id)
        })
        socket.on('deleteSlider', async(data) => {
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })
    }


    if(pathname === "/exchange"){
        
        function marketId(){
            socket.emit("liveData" , "data12")
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()

        socket.on('liveData', async(data) => {
            let html = ``
            for(let i = 0; i < data.LiveCricket.length; i++){
                if(data.LiveCricket[i].marketList.match_odd != null){
                   html += `<a href="/exchange_sports/live_match?id=${data.LiveCricket[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg02.svg" alt="">
                                    ${data.LiveCricket[i].eventData.name}
                                </a>`
                }
            }
            for(let i = 0; i < data.liveFootBall.length; i++){
                if(data.liveFootBall[i].marketList.match_odd != null){
                   html += `<a href="/exchange_sports/live_match?id=${data.liveFootBall[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg03.svg" alt="">
                                    ${data.liveFootBall[i].eventData.name}
                                </a>`
                }
            }
            for(let i = 0; i < data.liveTennis.length; i++){
                if(data.liveTennis[i].marketList.match_odd != null){
                   html += `<a href="/exchange_sports/live_match?id=${data.liveTennis[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg04.svg" alt="">
                                    ${data.liveTennis[i].eventData.name}
                                </a>`
                }
            }
            document.getElementById('liveMatch_data').innerHTML = html
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                    if($(this).val() != "-"){
                        ids.push(this.id);
                    }
                });
          
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 500)
        }
        marketId()

        socket.on("marketId", (data) => {
            $(document).ready(function() {
          
                $(".0L").each(function() {
                    
                        let id = this.id
                        const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                        console.log(foundItem)
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[0].layPrice1}</span>`
                });

                $(".0B").each(function() {
                    
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
                });

                $(".1L").each(function() {
                        let id = this.id
                        const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[1].layPrice1}</span>`
                });

                $(".1B").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[1].backPrice1}</span>`
                });

                $(".2B").each(function() {
                        let id = this.id
                        const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[2].backPrice1}</span>`
                });

                $(".2L").each(function() {
                    let id = this.id
                    const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[2].layPrice1}</span>`
                });
            })
        })
    }


    if(pathname === '/exchange_inPlay/match'){
        let id = search.split('=')[1]
        function eventID(){
            socket.emit("eventId", id)
            setTimeout(()=>{
                eventID()
              }, 500)

        }
        eventID()
        socket.on("eventId", async(data)=>{
            if(data != ""){
                let score = JSON.parse(data)
                document.getElementById("score").innerHTML = score[0].data
            }
        })
        
    }


    


   






    
})
})