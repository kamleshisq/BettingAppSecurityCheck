export const updateRow = (user,rowId) => {
    let html = "";
    html +=
    `<tr id = ${rowId}>
        <td> ${rowId} </td>
        <td class="getOwnChild" data-id='${JSON.stringify(user)}'>`
        if(user.roleName != 'user'){
            html+= `<a href='/userManagement?id=${user._id}'>${user.userName}</a>`
        }else{
            html+= `${user.userName}`
        }

        html += `</td>
        <td> ${user.whiteLabel}</td>
        <td> ${user.creditReference}</td>
        <td> ${user.balance}</td>
        <td> ${user.availableBalance}</td>
        <td> ${user.downlineBalance}</td>
        <td> ${user.clientPL}</td>
        <td> ${user.uplinePL}</td>
        <td> ${user.exposure}</td>
        <td> ${user.exposureLimit}</td>
        <td> ${user.lifeTimeCredit}</td>
        <td> ${user.lifeTimeDeposit}</td>
        <td>`
            let currentUser = JSON.parse(sessionStorage.getItem('loginUserDetails'))
            if(currentUser.role.authorization.includes('userStatus')){
                html += `<button class="userStatus" type="userStatus" id="${user._id}" data-myval='${JSON.stringify(user)}'>U/S</button>`
            }
            if(currentUser.role.authorization.includes('betLockAndUnloack')){
                html += `<button class="betLockStatus" id="${user._id}" data-myval='${JSON.stringify(user)}'>BetLock status</button>`
            }
            if(currentUser.role.authorization.includes('changeUserPassword')){
                html += `<div class="popup_main">
                <!-- <button class="open_popup">Open Pop Up 1</button> -->
                <button class="open_popup">change password</button>

                <div class="popup_body">
                  <div class="popup_back"></div>
                    <div class="popup_contain">
                      <div class="popup_close">x</div>
                        <h2>reset password</h2>

                        <div class="ResetFORM">
                          <form class= "passReset-form" enctype="multipart/form-data" >
                            <!-- <div class="imgcontainer">
                              <img src="img_avatar2.png" alt="Avatar" class="avatar">
                            </div> -->
                          
                            <div class="container">
                              <input type="hidden" name="id" value=${user._id}>
                              <label for="npsw"><b>New Password</b></label>
                              <input type="password" placeholder="Enter Password" name="password" required >
        
                              <label for="cpsw"><b>Confirm Password</b></label>
                              <input type="password" placeholder="Enter Password" name="passwordConfirm" required >
                                  
                              <button type="submit">Submit</button>
                            </div>
                          </form>
                        </div>                      
                      </div>
                </div>`
            }
            if(currentUser.role.authorization.includes('accountControl')){
                html += `<button ><a href="/accountStatement?id=${user._id} ">A/S</a></button>
                <div class="popup_main">
                <button class="open_popup">D/C</button>
                <div class="popup_body">
                    <div class="popup_back"></div>
                    <div class="popup_contain">
                        <div class="popup_close">x</div>
                        <h2>Account</h2>

                        <div class="AccForm">
                            <form class= "acc-form" >
                            <!-- <div class="imgcontainer">
                                <img src="img_avatar2.png" alt="Avatar" class="avatar">
                            </div> -->
                            
                            <div class="container">
                        
                                <label for="amount"><b>Amount</b></label>
                                <input type="number" name="amount" required >
                                <input type="hidden" name="id" value='${user._id}'>
                                <label for="type"><b>Select</b></label>
                                <select name="type">
                                <option value=deposit >Deposit</option>
                                <option value=withdrawl >withdrawl</option>
                                </select>
                                <button type="submit">Submit</button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
                </div>`
            }
            if(currentUser.role.authorization.includes('userName')){
                html += `
                <div class="popup_main">
                <!-- <button class="open_popup">Open Pop Up 1</button> -->
                <button class="open_popup">Details</button>
                <!-- <button ><a href="/updateUser?id=<%=users[i]._id %>">Details</a></button> -->
                <div class="popup_body">
                  <div class="popup_back"></div>
                    <div class="popup_contain">
                      <div class="popup_close">x</div>
                        <h2>Update User</h2>

                        <div class="editForm">
                          <form class= "edit-form">
                            <!-- <div class="imgcontainer">
                              <img src="img_avatar2.png" alt="Avatar" class="avatar">
                            </div> -->
                          
                            <div class="container" >
                              <label for="uname"><b>Username</b></label>
                              <input type="text" placeholder="Enter Username" name="userName" required  value=${user.userName}>
                              <input type="hidden"  name="id" value=${user._id}>
                        
                              <label for="name"><b>Name</b></label>
                              <input type="text" placeholder="Enter name" name="name" required value=${user.name}>
                        
                              <select name="role">`
                               let roles = JSON.parse(sessionStorage.getItem('roles'))
                                for(let j=0;j<roles.length; j++){
                                  if(user.role_type===roles[j].role_type){ 
                                    html += `<option value=${roles[j]._id} selected>${roles[j].roleName}</option>`
                                  }else{
                                    html += `<option value=${roles[j]._id} >${roles[j].roleName}</option>`
                                  }
                                }
                        
                              html += `</select>
                        
                              <button type="submit">Save</button>
                            </div>
                          </form>
                        </div>
                      
                    </div>
                </div>
              </div>`
            }
          html += `</td> </tr>`
        //   console.log(html)
        // console.log(rowId)
        $('tr[id = '+rowId+']').replaceWith(html)
}