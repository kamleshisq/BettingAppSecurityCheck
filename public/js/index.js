import { login } from "./login";
import { logout } from "./logOut";
import {logoutUser} from "./logOutUser"
import { reset } from "./resetPass";
import {resetadminpassword} from './resetadminpassword'
import { createUser } from "./createUser";
import { debitCredit } from "./debitCredit";
import {creditDebitSettle} from "./creditDebitSettle"
import { editUser } from "./editUser";
// import { betLockStatus } from "./batLockStatus";
import { createRole } from "./createRole";
import { updateRole } from "./updateRoleByaxios";
import {deleteRole} from "./deleteRole"
import { updatePassword } from "./updatePASSWORD";
import { userStatus } from "./userStatus";
// import { betLockStatus } from "./betLock";
import { updateRow } from "./updateRow";
import {updatePromotion} from "./updatePromotion";
import { createPromotion } from "./createPromotion";
import { deletePromotion } from "./deletePormotion";
// import { betLimit } from "./betLimit";
import { createHorizontalMenu } from "./createHorizontalMenu";
import { updateHorizontalMenu } from "./updateHorizonatlMenu";
import { createBanner } from "./createBanner";
import { updateBanner } from "./updateBanner";
import { createPage } from "./createpage";
import { addImage } from "./addImage";
import { editSliderInImage } from "./editSliderInImage";
import { updateSlider } from "./updateSlider";
import { createSlider } from "./addSlider";
import { userLogin } from "./userLogin";
import { createAndLoginUser } from "./createAndLoginUser";
import { KYC } from "./kyc";
import { paymentDeposite } from "./paymentDeposite";
import { notificationsss } from "./notificationsss";
import { updateBasicDetails } from "./updateBasicDetails";
import session from "express-session";
// import { func } from "joi";



// console.log(document.querySelector('.loginForm'))
// console.log(document.getElementById('uname').textContent)
// if(document.querySelector('.loginForm')){
//     document.querySelector('.loginForm').addEventListener('submit', e =>{
//     e.preventDefault();
//     console.log("WORKING")
//     const email = document.getElementById('uname').value;
//     const password = document.getElementById('password').value;
//     // console.log(email)
//     login(email, password);
// })};

const {
    host, hostname, href, origin, pathname, port, protocol, search
  } = window.location



$(document).ready(function(){ 
    console.log(pathname, "pathnamepathnamepathname")
    const linkColor = document.querySelectorAll('.nav_link')
	const operationPathnameArr = ['/admin/houseManagement','/admin/streammanagement','/admin/whiteLableAnalysis','/admin/commissionMarkets','/admin/settlement','/admin/gameanalysis','/admin/Notification','/admin/betmoniter','/admin/onlineUsers','/admin/alertbet','/admin/betlimit','/admin/voidbet']
    const reportsPathnameArr = ['/admin/gamereport','/admin/myaccount','/admin/adminaccount','/admin/useraccount','/admin/settlementHistory','/admin/reports','/admin/userhistoryreport','/admin/plreport','/admin/commissionReport','/admin/uplinecommissionReport','/admin/downlinecommissionReort']
    const cmsPathnameArr = ['/admin/cms','/admin/pageManager','/admin/gameRules','/admin/promotion','/admin/globalSettings']
    const patmentArr = ['/admin/paymentapproval','/admin/paymentmethods','/admin/withdrawalRequest']
    let newpathname = pathname + `?sessiontoken=${sessionStorage.getItem('sessiontoken')}`
	function colorLink(){
        if(linkColor){
        linkColor.forEach(l=> l.classList.remove('active'))
        $("a[href='"+newpathname+"'").addClass('active')
        if(operationPathnameArr.includes(pathname) || reportsPathnameArr.includes(pathname) || cmsPathnameArr.includes(pathname) || patmentArr.includes(pathname)){
            $("a[href='"+newpathname+"'").parent().parent().siblings('a').addClass('active')
            $("a[href='"+newpathname+"'").parent().parent().addClass('open')
        }
        if(pathname == '/admin/catalogcontrol/compitations' || pathname == '/admin/catalogcontrol/compitations/events'){
            $("a[href='"+'/admin/catalogcontrol'+"'").addClass('active')
        }else if(pathname == '/admin/riskAnalysis' || pathname == '/admin/matchBets'){
            $("a[href='"+'/admin/liveMarket'+"'").addClass('active')
        }else if(pathname.startsWith('/admin/userdetails' || pathname == '/admin/allOperators' ||  pathname == '/admin/profiledetail')){
            $("a[href='"+'/admin/userManagement'+"'").addClass('active')
        }else if(pathname.startsWith('/admin/settlementIn')){
            $("a[href='"+'/admin/settlement'+"'").addClass('active')
            $("a[href='"+'/admin/settlement'+"'").parent().parent().siblings('a').addClass('active')
            $("a[href='"+'/admin/settlement'+"'").parent().parent().addClass('open')
        }else if(pathname.startsWith('/admin/streammanagement/event')){
            $("a[href='"+'/admin/streammanagement'+"'").addClass('active')
            $("a[href='"+'/admin/streammanagement'+"'").parent().parent().siblings('a').addClass('active')
            $("a[href='"+'/admin/streammanagement'+"'").parent().parent().addClass('open')
        }else if(pathname.startsWith('/admin/betlimit/sport') || pathname.startsWith('/admin/betlimit/sports') ||  pathname.startsWith('/admin/betlimit/sports/event') || pathname.startsWith('/admin/betlimit/sports/match')){
            $("a[href='"+'/admin/betlimit'+"'").addClass('active')
            $("a[href='"+'/admin/betlimit'+"'").parent().parent().siblings('a').addClass('active')
            $("a[href='"+'/admin/betlimit'+"'").parent().parent().addClass('open')
        }else if(pathname.startsWith('/admin/gamereport/match') || pathname.startsWith('/admin/gamereport/match/market') || pathname.startsWith('/admin/gamereport/match/market/report')){
            $("a[href='"+'/admin/gamereport'+"'").addClass('active')
            $("a[href='"+'/admin/gamereport'+"'").parent().parent().siblings('a').addClass('active')
            $("a[href='"+'/admin/gamereport'+"'").parent().parent().addClass('open')
        }
        }
	}
    colorLink()

    $('input:checked').parents('.switch').addClass("on");
    $('input:checkbox').change(function(){
        if($(this).is(":checked")) {
            $(this).parents('.switch').addClass("on");
        } else {
            $(this).parents('.switch').removeClass("on");
        }
    });
    
    $('.searchUser').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
          event.preventDefault()  
        }
      });

});






$(document).on('click','.passcodemsgbox',function(e){
    console.log('hewr')
    function copyElementTextToClipboard(elementId) {
        // Find the element by its ID
        var element = document.getElementById(elementId);
      
        // Check if the element exists
        if (element) {
          // Get the text content of the element
          var textToCopy = element.textContent || element.innerText;
          // Copy the text to the clipboard using the Clipboard API or document.execCommand()
          if (navigator.clipboard) {
            // Use Clipboard API
            navigator.clipboard.writeText(textToCopy)
              .then(function() {
                console.log("Text copied to clipboard");
              })
              .catch(function(err) {
                console.error("Error copying text to clipboard: ", err);
              });
          } else {
            // Fallback for browsers that do not support the Clipboard API
            console.log('inclicpbosar')
            var tempInput = document.createElement("textarea");
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
          }
        } else {
          console.error("Element with ID '" + elementId + "' not found.");
        }
      }
      
      // Example usage:
      copyElementTextToClipboard("passcodeb");
      

})

let userId = sessionStorage.getItem('sessionID')
console.log(userId)
if(!userId){
    console.log('WORKING123456789')
}

$(document).on("submit", ".loginFormAdmin", function(e){
    e.preventDefault()
    try{
        $(this).find('button[type="submit"]').addClass("loading");
    }catch(err){
        console.log(err)
    }
    const email = document.getElementById('uname').value;
    const password = document.getElementById('password').value;
    login(email, password);
})

$(document).on('click', ".logOut", function(e){
    e.preventDefault()
    logout()
})


// let sentinterval1 = setInterval(()=>{
//     // console.log('WORKING', localStorage.getItem('logintime'))
//     if(pathname.startsWith('/admin')){
//         if(localStorage.getItem('logintimeAdmin')){
//             // console.log(Date.now()-parseInt(localStorage.getItem('logintimeAdmin')))
//             if(Date.now()-parseInt(localStorage.getItem('logintimeAdmin')) >= 1000  * 60 * 30){
//                 clearInterval(sentinterval1)
//                 localStorage.removeItem('logintimeAdmin')
//                 logout()
                
                
//             }
//         }else{
//             if($('body header').attr('data-logindata')){
//                 location.reload(true)
//             }
//         }
//     }else{
//         if(localStorage.getItem('logintimeUser')){
//             // console.log(Date.now()-parseInt(localStorage.getItem('logintimeUser')))
//             if(Date.now()-parseInt(localStorage.getItem('logintimeUser')) >= 1000  * 60 * 30){
//                 // if(pathname.startsWith('/admin')){
//                 //     logout()
//                 // }else{
//                 // }
//                 clearInterval(sentinterval1)
//                 localStorage.removeItem('logintimeUser')
//                 logoutUser()
//             }
//         }else{
//             if($('body').attr('data-logindata')){
//                 window.location.reload(true)
//             }
//         }
//     }
// },1000)


$(document).on('click', ".logOutUser", function(e){
    e.preventDefault()
    logoutUser()
})

// if(document.querySelector("ResetFORM")){
//     document.querySelector("ResetFORM").addEventListener("submit", e => {
//         e.preventDefault();
//         // const oldPassword = document.getElementById("opsw").value;
//         const newPass = document.getElementById("npsw").value;
//         const confirmPassword = document.getElementById("cpsw").value

//         reset(newPass, confirmPassword)
//     })
// };

$('#Add-User').submit(function(e){
e.preventDefault();
const form = document.getElementById('Add-User');
let data = new FormData(form) 
const formDataObj = Object.fromEntries(data.entries());
if(formDataObj.role == "select"){
    alert('please select role of user')
}

if(formDataObj.whiteLabel == ""){
    formDataObj.whiteLabel = document.getElementById("whiteLabel").value
}

let checkedValues = [];
if(formDataObj.role == "650bccdbb3fdc8c922c34bbe"){
    let checkboxes = document.querySelectorAll("input[name='operator']:checked");
    for (let i = 0 ; i < checkboxes.length; i++) {
        checkedValues.push(checkboxes[i].value)
    }
}
formDataObj.OperatorAuthorization = checkedValues
formDataObj.sessiontoken = sessionStorage.getItem('sessiontoken')
// console.log(formDataObj, "+==> data")
// console.log(formDataObj);
createUser(formDataObj)
});



$(document).on('submit','.passReset-form',function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form)
    const formDataObj = Object.fromEntries(fd.entries())
    let id = form.id
    formDataObj.id = id
    formDataObj.sessiontoken = sessionStorage.getItem('sessiontoken')
    // console.log(formDataObj)
    reset(formDataObj);
});

$(document).on('submit','.resetpasswordAdmin',function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form)
    const formDataObj = Object.fromEntries(fd.entries())
    formDataObj.sessiontoken = sessionStorage.getItem('sessiontoken')
    // console.log(formDataObj)
    resetadminpassword(formDataObj);
});


$(document).on('submit','#edit-form',async function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form);
    let formDataObj = Object.fromEntries(fd.entries());
    // console.log(formDataObj);
    let rowId = $('.rowId').attr('data-rowid')
    formDataObj.sessiontoken = sessionStorage.getItem('sessiontoken')
    const user = await editUser(formDataObj)
    // console.log(user)
    let currentUser = $('#currentUserDetails').data('currentuser')
    // console.log(user)
    updateRow(user,rowId,currentUser)
});

// $(document).on('submit', ".myloginmodl-form-dv", function(e){
//     e.preventDefault()
//     let form = $(this)[0];
//     let fd = new FormData(form);
//     let data = Object.fromEntries(fd.entries());
//     socket.emit('Login', data);
//     })



$(document).on('submit','.acc-form',async function(e) {
    e.preventDefault()
    let form = $(this)[0];
    let id = form.id
    let fd = new FormData(form);
    let formDataObj = Object.fromEntries(fd.entries());
    formDataObj.id = id ;
    // console.log(formDataObj)
    if(formDataObj.amount == 0){
        alert('please enter amount greater than 0')
    }else{
        formDataObj.sessiontoken = sessionStorage.getItem('sessiontoken')
        await debitCredit(formDataObj)
        // var trElements = document.querySelectorAll('tr.trtable');
        // console.log(trElements)
        // console.log(user)
        // trElements.forEach(function(trElement) {
        //     if (trElement.getAttribute('data-id') === user.id) {
        //     }
        // })    
    }
    // const url = window.location.href
    // const id = url.split("=")[1]
    // formDataObj.id = id
    // console.log(formDataObj)
    // let rowId = $('.rowId').attr('data-rowid')
 
    // console.log(rowId)
    // let currentUser = $('#currentUserDetails').data('currentuser')
    // updateRow(user,rowId,currentUser)
    // console.log(user)
})

$(document).on('submit','.Settlement-form',async function(e) {
    e.preventDefault()
    let form = $(this)[0];
    let id = form.id
    let fd = new FormData(form);
    let formDataObj = Object.fromEntries(fd.entries());
    formDataObj.id = id ;
    if(formDataObj.amount == 0){
        alert('please enter amount greater than 0')
    }else{
        formDataObj.sessiontoken = sessionStorage.getItem('sessiontoken')
        creditDebitSettle(formDataObj)
    }
    // console.log(formDataObj)
    // const url = window.location.href
    // const id = url.split("=")[1]
    // formDataObj.id = id
    // console.log(formDataObj)
    // let rowId = $('.rowId').attr('data-rowid')
    // const user = await creditDebitSettle(formDataObj)
    // var trElements = document.querySelectorAll('tr.trtable');
    // // console.log(trElements)
    // // console.log(user)
    // trElements.forEach(function(trElement) {
    //     if (trElement.getAttribute('data-id') === user.id) {
    //         console.log(trElement, 4545445454)
    //     }
    // })
    // console.log(rowId)
    // let currentUser = $('#currentUserDetails').data('currentuser')
    // updateRow(user,rowId,currentUser)
    // console.log(user)
})

// $('.edit-form').submit(function(e){
//     e.preventDefault();
//     let form = $(this)[0];
//     let fd = new FormData(form)
//     const formDataObj = Object.fromEntries(fd.entries())
//     editUser(formDataObj)
// });

// $(document).on('click','.betLockStatus',function(e) {
//     e.preventDefault();
//     const data = $(this).data('myval')
//     betLockStatus(data)
// })


// $('#searchUser').keyup(function(){
//     let data = $(this).val()
//     searchUser(data)
// })


// if(document.querySelector(".updateRole")){
//     document.querySelector(".updateRole").addEventListener('submit', e => {
//         e.preventDefault()
//     let roleName = document.getElementById("mySelect").value
//     let role_level = document.getElementById("role_level").value
//     let authorization = [];
//     let roleAuthorization = [];
//     let authCheck = document.querySelectorAll("input[name='authorization']:checked");
//     for (let i = 0 ; i < authCheck.length; i++) {
//         roleAuthorization.push(authCheck[i].value)
//     }
//     let checkboxes = document.querySelectorAll("input[name='userAuthorization']:checked");
//     for (let i = 0 ; i < checkboxes.length; i++) {
//         authorization.push(checkboxes[i].value)
//     }
//     let data = {
//         authorization,
//         userAuthorization:roleAuthorization,
//         roleName,
//         role_level
//     }
//     // console.log(data)
//     updateRole(data)
//     })
// };




if(document.querySelector('.ChangeFORM')){
    document.querySelector('.ChangeFORM').addEventListener('submit', e =>{
    e.preventDefault();
    // console.log("working")   
    const form = document.getElementById('changePass-form');
    let data = new FormData(form) 
    const formDataObj = Object.fromEntries(data.entries());
    // console.log(formDataObj)
    formDataObj.sessiontoken = sessionStorage.getItem('sessiontoken')
    updatePassword(formDataObj);
})};


// console.log("abc")
// if(document.querySelector('#whitelabel')){
//     let x = document.getElementById('whitelabel').value
//         console.log(x, "123456789")
//         document.getElementById('for_new_whitelabel').textContent = x
//     document.querySelector('#whitelabel').addEventListener("onchange", function(){
//         // let x = document.getElementById('whitelabel').value
//         // console.log(x)
//     })
// }
$('#whitelabel').on('change',function(){
    let whitLable = $(this).find(":selected").val();
    // let x = document.getElementById('whitelabel').value
    // console.log(x)
    document.getElementById('for_new_whitelabel').value = whitLable

});

// $('document').ready(function(){
//     var urlParams = new URLSearchParams(window.location.search);

//     // Get value of single parameter
//     var page = urlParams.get('page');   // alert(page)

//     $('.pageLink').attr('data-page',page)

// })

$(document).on('click','.open_popup',function () {
    $(this).parent(".popup_main").children(".popup_body").addClass("popup_body_show");
    let rowId = $(this).parent().parent().parent().attr('id')
    // console.log(rowId)
    $('.rowId').attr('data-rowid',rowId)
});
$(document).on('click','.popup_close',function () {
    $(".popup_body").removeClass("popup_body_show");
});
$(document).on('click','.popup_back',function () {
    $(".popup_body").removeClass("popup_body_show");
});




$(document).on('submit','.userStatus',function(e) {
    e.preventDefault()
    
    let form = $(this)[0];
    let fd = new FormData(form);
    let id = form.id
    let formDataObj = Object.fromEntries(fd.entries());
    formDataObj.id = id
    let rowId = $('.rowId').attr('data-rowid')
    // console.log(formDataObj, "WORKING1212121")
    // var trElement = document.querySelector(`tr[data-id="${id}"]`);
    // let rowId = trElement.id
    // console.log(rowId)
    // console.log(formDataObj)
    userStatus(formDataObj, rowId)
});

   



$(document).on('click','.Withdraw',function(){
    let rowId = $(this).parent().parent().attr('id')
    $('.rowId').attr('data-rowid',rowId)
    let modleName = $(this).data('bs-target')
    let form = $(modleName).find('.form-data')
    let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
    let me = $('#meDatails').data('me')
    form.find('input[name = "fromUser"]').attr('value',me.userName)
    form.find('input[name = "toUser"]').attr('value',userData.userName)
    form.find('input[name = "fuBalance"]').attr('value',me.balance)
    form.find('input[name = "tuBalance"]').attr('value',userData.balance)
    form.find('input[name = "clintPL"]').attr('value',userData.clientPL)
    form.find('input[name = "id"]').attr('value',userData._id)
})

// $(document).on('click','.CreaditChange',function(){
//     let rowId = $(this).parent().parent().attr('id')
//         $('.rowId').attr('data-rowid',rowId)
//     let modleName = $(this).data('bs-target')
//     let form = $(modleName).find('.form-data')
//     let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
//     let me = $('#meDatails').data('me')
//     form.find('input[name = "credit"]').attr('value',userData.creditReference)
//     form.find('input[name = "newCreadit"]').attr('value','0')
// })

// $(document).on('click','.UserDetails',function(){
//     // let rowId = $(this).parent().parent().attr('id')
//         // $('.rowId').attr('data-rowid',rowId)
//     let modleName = $(this).data('bs-target')
//     let form = $(modleName).find('.form-data')
//     let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
//     let me = $('#meDatails').data('me')
//     // console.log(userData)
//     form.find('input[name = "name"]').attr('value',userData.name)
//     form.find('input[name = "userName"]').attr('value',userData.userName)
//     form.find('input[name = "id"]').attr('value',userData._id)
//     form.find('input[name = "exposureLimit"]').attr('value',userData.exposureLimit)
//     form.find('select option[value="'+userData.role._id+'"]').attr('selected','selected')
//     let rowId = $(this).parent().parent().attr('id')
//     // console.log(rowId)
//     $('.rowId').attr('data-rowid',rowId)
// });



$('.createRole-form1').submit(function(e) {
    e.preventDefault()
    let authorization = []; 
    let authCheck = document.querySelectorAll("input[name='operator']:checked");
    for (let i = 0 ; i < authCheck.length; i++) {
     authorization.push(authCheck[i].value)
    }
    let roleAuthorization = [];
    let checkboxes = document.querySelectorAll("input[name='adminControll']:checked");
    for (let i = 0 ; i < checkboxes.length; i++) {
        roleAuthorization.push(checkboxes[i].value)
    }
    let roleName = $('#roleName').val();
    let data = {
        operationAuthorization:authorization,
        AdminController:roleAuthorization,
        roleName,
        name:roleName,
        sessiontoken : sessionStorage.getItem('sessiontoken')
    }
    // console.log(data)
    createRole(data)
})



$(document).on('click','.RoleDetails',function(){
    let modleName = $(this).data('bs-target')
    let roledata = $(this).parent().parent('td').siblings('.getRoleForPopUP').data('bs-dismiss')
    // console.log(roledata)
    let form = $(modleName).find('.UpdateRole-form')
    // let x = form.find('input[id="check"]').length
    // console.log(x)
    // for(let i = 0; i < x ; i++){
    //     document.getElementsByClassName(`${i}`).checked = false
    // }
    form.attr('id', roledata._id);
    form.find('input:checkbox').removeAttr('checked');
    // console.log(roledata, 45654654654)
    form.find('input[name = "name"]').attr('value',roledata.name)
    // console.log(roledata.authorization)
    for(let i = 0; i < roledata.authorization.length; i++){
        form.find(`input[value = "${roledata.authorization[i]}"]`).attr("checked", "checked");
    }
    for(let i = 0; i < roledata.userAuthorization.length; i++){
        form.find(`input[value = "${roledata.userAuthorization[i]}"]`).attr("checked", "checked");
    }
    for(let i = 0; i < roledata.AdminController.length; i++){
        form.find(`input[value = "${roledata.AdminController[i]}"]`).attr("checked", "checked");
    }
    for(let i = 0; i < roledata.operationAuthorization.length; i++){
        form.find(`input[value = "${roledata.operationAuthorization[i]}"]`).attr("checked", "checked");
    }
    // document.getElementById("role_controller").innerHTML = `
    //         <label for="level"> <h3>Role Level </h3></label><br>
    //         <input type="number" name="level" placeholder='${roledata.role_level}' id='role_level'>`
});

$(document).on("submit", ".UpdateRole-form", function(e){
    e.preventDefault()
    let id = $(this).attr("id")
    let roleName = document.getElementById("mySelect").value
    let authorization = [];
    let AdminController = []
    let roleAuthorization = [];
    let operationAuthorization = [];
    // let authCheck = document.querySelectorAll("input[name='authorization']:checked");
    // for (let i = 0 ; i < authCheck.length; i++) {
    //     roleAuthorization.push(authCheck[i].value)
    // }
    // let checkboxes = document.querySelectorAll("input[name='userAuthorization']:checked");
    // for (let i = 0 ; i < checkboxes.length; i++) {
    //     authorization.push(checkboxes[i].value)
    // }
    let operator = document.querySelectorAll("input[name='operator']:checked");
    for( let i = 0; i < operator.length; i++){
        operationAuthorization.push(operator[i].value)
    }
    let adminAuth = document.querySelectorAll("input[name='adminControll']:checked");
    for( let i = 0; i < adminAuth.length; i++){
        AdminController.push(adminAuth[i].value)
    }

    let data = {
        id,
        // authorization,
        // userAuthorization:roleAuthorization,
        roleName,
        operationAuthorization,
        AdminController,
        sessiontoken : sessionStorage.getItem('sessiontoken')
        }
    // console.log(data)
    updateRole(data)
})
$(document).on('click','.deleteRole',function(e){
    let roledata = $(this).parent().parent('td').siblings('.getRoleForPopUP').data('bs-dismiss')
    if(confirm('do you want to delete this role')){
        deleteRole({"id":roledata._id,'sessiontoken' :sessionStorage.getItem('sessiontoken')})
    }
})

$(document).on('submit', ".form-data1", function(e){
    e.preventDefault()
    let id = $('.form-data1').attr('id')
    let check = document.getElementById('check')
    const form = new FormData();
    form.append('Id', id)
    form.append('position',document.getElementById('name').value)
    form.append("link", document.getElementById('link').value)
    form.append('sessiontoken' ,sessionStorage.getItem('sessiontoken'))
    if(check.checked == true){
        form.append('status',"on")
    }else{
        form.append('status',"off")
    }
    form.append('image',document.getElementById('file').files[0])
    // console.log(form)
    updatePromotion(form)
});


$(document).on('submit', '.form-data2', function(e){
    e.preventDefault()
    const form = new FormData();
    form.append('position', document.getElementById('name1').value)
    form.append('link', document.getElementById('url1').value)
    form.append('image', document.getElementById('file1').files[0])
    form.append('sessiontoken' ,sessionStorage.getItem('sessiontoken'))
    createPromotion(form)
});

$(document).on('click', ".Delete", function(){
    let data = {}
    data.id = $(this).attr('id')
    data.sessiontoken = sessionStorage.getItem('sessiontoken')

    deletePromotion(data)
})

$(document).on('submit', '.form-data22', function(e){
    e.preventDefault()
    const form = new FormData();
    form.append('menuName', document.getElementById('menuName').value)
    form.append('url', document.getElementById('url').value)
    form.append('page', document.getElementById('page').value)
    form.append('Icon', document.getElementById('Icon').files[0])
    form.append('sessiontoken' ,sessionStorage.getItem('sessiontoken')
    )
    createHorizontalMenu(form)
});

$(document).on('submit', ".form-data23", function(e){
    e.preventDefault()
    let id = $('.form-data23').attr('id')
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append('id', id)
    fd.append('sessiontoken',sessionStorage.getItem('sessiontoken')
    )
    let data = Object.fromEntries(fd.entries());
    
    // console.log(data)
    // form.append('image',document.getElementById('file').files[0])
    // console.log(form)
    updateHorizontalMenu(fd)
})

$(document).on('submit', ".form-data24", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append('sessiontoken' ,sessionStorage.getItem('sessiontoken')
    )
    // console.log(fd)
    createBanner(fd)
})

$(document).on("submit", ".form-data25",function(e){
    e.preventDefault()
    let id = $(this).attr('id')
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append('id', id)
    fd.append('sessiontoken' , sessionStorage.getItem('sessiontoken')
    )
    // console.log(fd,'==>fd')
    updateBanner(fd)
})


$(document).on('submit', ".uploadEJS", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append(sessiontoken , sessionStorage.getItem('sessiontoken')
    )
    createPage(fd)
})



$(document).on('submit', ".form-data26", function(e){
    e.preventDefault()
    let id = $(this).attr('id')
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append('id', id)
    fd.append(sessiontoken , sessionStorage.getItem('sessiontoken'))

    addImage(fd)
})

$(document).on('submit', ".editImageSportForm", function(e){
    e.preventDefault()
    let id = $(this).attr('id')
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append('id', id)
    fd.append(sessiontoken , sessionStorage.getItem('sessiontoken'))
    editSliderInImage(fd)
})
 
$(document).on('submit', ".slider-form", function(e){
    e.preventDefault()
    let id = $(this).attr("id")
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append('id', id)
    fd.append(sessiontoken , sessionStorage.getItem('sessiontoken'))
    updateSlider(fd )
})

$(document).on('submit', ".addSlider-form", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    fd.append(sessiontoken , sessionStorage.getItem('sessiontoken'))
    createSlider(fd)
});


$(document).on('submit', ".myloginmodl-form-dv", function(e){
    console.log("myloginmodl-form-dv working")
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    // fd.append(sessiontoken , sessionStorage.getItem('sessiontoken'))
    userLogin(data)
})


$(document).on('submit', ".regestermodl-form", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    data.sessiontoken = sessionStorage.getItem('sessiontoken')

    // console.log(data)
    createAndLoginUser(data)
})

$(document).on("click", ".myloginmodl-demo-loginbtnn", function(e){
    e.preventDefault()
    // console.log("WORKING")
    userLogin({data:"Demo"})
})

$(document).on('submit', ".kycForm", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    // console.log(data)
    KYC(fd)
})

$(document).on('submit', '.basicDetailsFOrm', function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let id = $(this).attr("id")
    let table = $(this).closest('.fade').attr('id')
    fd.append('id', id)
    fd.append('table', table)
    fd.append('sessiontoken',sessionStorage.getItem('sessiontoken'))
    updateBasicDetails(fd)
    // console.log(data, "DATA23232")
})

$(document).on('submit','#navmod3 .payment-fom',function(e){
    e.preventDefault();
    $(this).find('button').prop("disabled", true);
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    // console.log(fd)
    function validateUTR(utr) {
        // Define your UTR validation criteria here
        var utrPattern = /^[A-Za-z0-9]{12,}$/; // Minimum 12 alphanumeric characters

        // Check if the UTR matches the pattern
        return utrPattern.test(utr);
    }

    let check = validateUTR(data.utr)
    if(check){
        paymentDeposite(fd)
    }else{
        notificationsss({message: 'Please enter valid UTR', status:"error"})
    }

    // /api/v1/Account/paymentDeposite
})