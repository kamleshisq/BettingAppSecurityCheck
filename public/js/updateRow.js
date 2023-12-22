export const updateRow = (user,rowId,currentUser) => {
//   console.log(currentUser)
    let html = "";
    if((rowId) % 2 != 0){

      html +=
      `<tr style="text-align: center;" class="blue" id="${rowId}">`
  }else{
      html +=
      `<tr style="text-align: center;" id="${rowId}">` 
  }
      
  html += `<td> ${rowId} </td>
      <td class="getOwnChild" data-bs-dismiss='${JSON.stringify(user)}'>`
      // console.log(user.roleName)
      if(user.roleName != 'user'){
          html+= `<a href='/admin/userManagement?id=${user._id}'>${user.userName}</a>`
      }else{
          html+= `${user.userName}`
      }

      html += `</td>
      <td> ${user.whiteLabel}</td>
      <td> ${user.creditReference}</td>
      <td> ${user.balance}</td>
      <td> ${user.availableBalance}</td>
      <td> ${user.downlineBalance}</td>
      <td style="color:#FE3030;"> ${user.clientPL}</td>
      <td> ${user.uplinePL}</td>
      <td> ${user.exposureLimit}</td>
      <td> ${user.exposure}</td>

      <td> ${user.lifeTimeCredit}</td>
      <td> ${user.lifeTimeDeposit}</td>`
          if(currentUser.role.authorization.includes('accountControl')){
              html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal" class="Withdraw"> D/W 
              </button></td>`
          }
          if(currentUser.role.authorization.includes('accountControl')){
              html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal2">C</button></td>`
          }
          if(currentUser.role.authorization.includes('changeUserPassword')){
              html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal3">P</button></td>`
          }
          if(currentUser.role.authorization.includes('userStatus')){
              html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal4">CS</button></td>
              `
          }
          if(currentUser.role.authorization.includes('userName')){
              html += `<td><button data-bs-toggle="modal" data-bs-target="#myModal5" class="UserDetails"><i class="fa-solid fa-database"></i></button></td>
              `
          }
        html += `</tr>`
        //   console.log(html)
        // console.log(rowId)
        $('tr[id = '+rowId+']').replaceWith(html)
}