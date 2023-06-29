import { login } from "./login";
import { logout } from "./logOut";
import { reset } from "./resetPass";
import { createUser } from "./createUser";
import { debitCredit } from "./debitCredit";
import { editUser } from "./editUser";
// import { betLockStatus } from "./batLockStatus";
import { createRole } from "./createRole";
import { updateRole } from "./updateRoleByaxios";
import { updatePassword } from "./updatePASSWORD";
import { userStatus } from "./userStatus";
import { betLockStatus } from "./betLock";
import { updateRow } from "./updateRow";
import {updatePromotion} from "./updatePromotion";
import { createPromotion } from "./createPromotion";
import { deletePromotion } from "./deletePormotion";
import { betLimit } from "./betLimit";
import { createHorizontalMenu } from "./createHorizontalMenu";
import { updateHorizontalMenu } from "./updateHorizonatlMenu";
// import { func } from "joi";


// console.log(document.querySelector('.loginForm'))
// console.log(document.getElementById('uname').textContent)
if(document.querySelector('.loginForm')){
    document.querySelector('.loginForm').addEventListener('submit', e =>{
    e.preventDefault();
    const email = document.getElementById('uname').value;
    const password = document.getElementById('password').value;
    // console.log(email)
    login(email, password);
})};

if(document.querySelector('.logOut')){
    document.querySelector('.logOut').addEventListener('click', function(e){
        e.preventDefault()
        // console.log("working")
        logout()
    })
};

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
// console.log(formDataObj)
createUser(formDataObj)
});

$(document).on('click','.updateBetLimit',function(e){
    let rowId = $(this).parent().parent().attr('id')
    $('.rowId').attr('data-rowid',rowId)
    let modleName = $(this).data('bs-target')
    let form = $(modleName).find('.form-data')
    let betLimit = $(this).parent().data('details')
    form.find('input[name = "min_stake"]').val(betLimit.min_stake)
    form.find('input[name = "max_stake"]').val(betLimit.max_stake)
    form.find('input[name = "max_profit"]').val(betLimit.max_profit)
    form.find('input[name = "max_odd"]').val(betLimit.max_odd)
    form.find('input[name = "delay"]').val(betLimit.delay)
    form.find('input[name = "type"]').val(betLimit.type)
    form.find('input[name = "id"]').val(betLimit._id)
})

$(document).on('submit','.passReset-form',function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form)
    const formDataObj = Object.fromEntries(fd.entries())
    reset(formDataObj);
});


$(document).on('submit','#edit-form',async function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form);
    let formDataObj = Object.fromEntries(fd.entries());
    // console.log(formDataObj);
    let rowId = $('.rowId').attr('data-rowid')
    const user = await editUser(formDataObj)
    // console.log(user)
    let currentUser = $('#currentUserDetails').data('currentuser')
    // console.log(user)
    updateRow(user,rowId,currentUser)
});

$(document).on('submit','.form-betLimit',async function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    // console.log(data)
    let res = await betLimit(data)
    if(res){
        let betLimit = res
        let rowId = $('.rowId').attr('data-rowid')
        $('#'+rowId).html(`
            <td class="btn-filter">${betLimit.type}</td>
            <td><input type="text" class="form-datas" value='${betLimit.min_stake}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.max_stake}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.max_profit}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.max_odd}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.delay}'></td>
            <td data-details='${JSON.stringify(betLimit)}'><button type="button" data-bs-toggle="modal" data-bs-target="#myModal2"class="updateBetLimit">Update</button></td>`)
        
    }
    
})

$(document).on('submit','.acc-form',async function(e) {
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let formDataObj = Object.fromEntries(fd.entries());
    // const url = window.location.href
    // const id = url.split("=")[1]
    // formDataObj.id = id
    // console.log(formDataObj)
    let rowId = $('.rowId').attr('data-rowid')
    // console.log(rowId)
    const user = await debitCredit(formDataObj)
    let currentUser = $('#currentUserDetails').data('currentuser')
    updateRow(user,rowId,currentUser)
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

$('.createRole-form').submit(function(e) {
    e.preventDefault()
    let authorization = [];
    let authCheck = document.querySelectorAll("input[name='authorization']:checked");
    for (let i = 0 ; i < authCheck.length; i++) {
     authorization.push(authCheck[i].value)
    }
    let roleAuthorization = [];
    let checkboxes = document.querySelectorAll("input[name='userAuthorization']:checked");
    for (let i = 0 ; i < checkboxes.length; i++) {
        roleAuthorization.push(checkboxes[i].value)
    }
    let roleName = $('#roleName').val();
    let data = {
        authorization,
        userAuthorization:roleAuthorization,
        roleName
    }
    createRole(data)
})

// $('#searchUser').keyup(function(){
//     let data = $(this).val()
//     searchUser(data)
// })


if(document.querySelector(".updateRole")){
    document.querySelector(".updateRole").addEventListener('submit', e => {
        e.preventDefault()
    let roleName = document.getElementById("mySelect").value
    let role_level = document.getElementById("role_level").value
    let authorization = [];
    let roleAuthorization = [];
    let authCheck = document.querySelectorAll("input[name='authorization']:checked");
    for (let i = 0 ; i < authCheck.length; i++) {
        roleAuthorization.push(authCheck[i].value)
    }
    let checkboxes = document.querySelectorAll("input[name='userAuthorization']:checked");
    for (let i = 0 ; i < checkboxes.length; i++) {
        authorization.push(checkboxes[i].value)
    }
    let data = {
        authorization,
        userAuthorization:roleAuthorization,
        roleName,
        role_level
    }
    // console.log(data)
    updateRole(data)
    })
};

if(document.querySelector('.ChangeFORM')){
    document.querySelector('.ChangeFORM').addEventListener('submit', e =>{
    e.preventDefault();
    // console.log("working")   
    const form = document.getElementById('changePass-form');
    let data = new FormData(form) 
    const formDataObj = Object.fromEntries(data.entries());
    // console.log(formDataObj)
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


$(document).on('click','.betLockStatus', function(e) {
    const rowId = $(this).parent().parent().attr('id');
    
    const data = $(this).parent().siblings('.getOwnChild').data('bs-dismiss')
    // console.log(rowId)
    // console.log(data)
    betLockStatus(data,rowId)
    // console.log(user)
    // let currentUser = $('#currentUserDetails').data('currentuser')
    // updateRow(user,rowId,currentUser)

})

$(document).on('submit','.userStatus',function(e) {
    e.preventDefault()
    
    let form = $(this)[0];
    let fd = new FormData(form);
    let formDataObj = Object.fromEntries(fd.entries());
    let rowId = $('.rowId').attr('data-rowid')
    // console.log(rowId)
    // console.log(formDataObj)
    userStatus(formDataObj,rowId)
});

   $(document).on('click','.StatusChange',function(){
        let rowId = $(this).parent().parent().attr('id')
        // console.log(rowId)
        $('.rowId').attr('data-rowid',rowId)
        let modleName = $(this).data('bs-target')
        let form = $(modleName).find('.form-data')
        let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
        let me = $('#meDatails').data('me')
        form.find('input[name = "id"]').attr('value',userData._id)
    })

$(document).on('click','.Deposite',function(e){
    let rowId = $(this).parent().parent().attr('id')
    $('.rowId').attr('data-rowid',rowId)
    let modleName = $(this).data('bs-target')
    let form = $(modleName).find('.form-data')
    let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
    let me = $('#meDatails').data('me')
    // console.log(me.userName)
    // console.log(userData)
    // console.log(form.find('input[name = "fromUser"]'))
    // form.find('input[name = "fromUser"]').attr('value',me.userName)
    form.find('input[name = "toUser"]').attr('value',userData.userName)
    form.find('input[name = "fuBalance"]').attr('value',me.balance)
    form.find('input[name = "tuBalance"]').attr('value',userData.balance)
    form.find('input[name = "clintPL"]').attr('value',userData.clientPL)
    form.find('input[name = "fromUser"]').attr('value','admin')
    form.find('input[name = "id"]').attr('value',userData._id)
    // console.log(form)
})

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

$(document).on('click','.CreaditChange',function(){
    let rowId = $(this).parent().parent().attr('id')
        $('.rowId').attr('data-rowid',rowId)
    let modleName = $(this).data('bs-target')
    let form = $(modleName).find('.form-data')
    let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
    let me = $('#meDatails').data('me')
    form.find('input[name = "credit"]').attr('value',userData.creditReference)
    form.find('input[name = "newCreadit"]').attr('value','0')
})

$(document).on('click','.UserDetails',function(){
    // let rowId = $(this).parent().parent().attr('id')
        // $('.rowId').attr('data-rowid',rowId)
    let modleName = $(this).data('bs-target')
    let form = $(modleName).find('.form-data')
    let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
    let me = $('#meDatails').data('me')
    // console.log(userData)
    form.find('input[name = "name"]').attr('value',userData.name)
    form.find('input[name = "userName"]').attr('value',userData.userName)
    form.find('input[name = "id"]').attr('value',userData._id)
    form.find('input[name = "exposureLimit"]').attr('value',userData.exposureLimit)
    form.find('select option[value="'+userData.role._id+'"]').attr('selected','selected')
    let rowId = $(this).parent().parent().attr('id')
    // console.log(rowId)
    $('.rowId').attr('data-rowid',rowId)
});

$(document).on('click','.PasswordChange',function(){
    let rowId = $(this).parent().parent().attr('id')
    // console.log(rowId)
    $('.rowId').attr('data-rowid',rowId)
    let modleName = $(this).data('bs-target')
    let form = $(modleName).find('.form-data')
    let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
    let me = $('#meDatails').data('me')
    form.find('input[name = "id"]').attr('value',userData._id)
});


$(document).on('click','.RoleDetails',function(){
    // console.log("Working")
    let modleName = $(this).data('bs-target')
    let form = $(modleName).find('.UpdateRole-form')
    // let x = form.find('input[id="check"]').length
    // console.log(x)
    // for(let i = 0; i < x ; i++){
    //     document.getElementsByClassName(`${i}`).checked = false
    // }
    form.find('input:checkbox').removeAttr('checked');
    let roledata = $(this).parent('td').siblings('.getRoleForPopUP').data('bs-dismiss')
    form.find('input[name = "name"]').attr('value',roledata.roleName)
    // console.log(roledata.authorization)
    for(let i = 0; i < roledata.authorization.length; i++){
        form.find(`input[value = "${roledata.authorization[i]}"]`).attr("checked", "checked");
    }
    for(let i = 0; i < roledata.userAuthorization.length; i++){
        form.find(`input[value = "${roledata.userAuthorization[i]}"]`).attr("checked", "checked");
    }
    document.getElementById("role_controller").innerHTML = `
            <label for="level"> <h3>Role Level </h3></label><br>
            <input type="number" name="level" placeholder='${roledata.role_level}' id='role_level'>`
});
// console.log($(".RoleDetails"))
// console.log($(".load"))


$(document).on('submit', ".form-data1", function(e){
    e.preventDefault()
    let id = $('.form-data1').attr('id')
    let check = document.getElementById('check')
    const form = new FormData();
    form.append('Id', id)
    form.append('position',document.getElementById('name').value)
    form.append("link", document.getElementById('link').value)
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
    createPromotion(form)
});

$(document).on('click', ".Delete", function(){
    let data = {}
    data.id = $(this).attr('id')
    deletePromotion(data)
})

$(document).on('submit', '.form-data22', function(e){
    e.preventDefault()
    const form = new FormData();
    form.append('menuName', document.getElementById('menuName').value)
    form.append('url', document.getElementById('url').value)
    form.append('num', document.getElementById('num').value)
    form.append('page', document.getElementById('page').value)
    form.append('Icon', document.getElementById('Icon').files[0])
    createHorizontalMenu(form)
});

$(document).on('submit', ".form-data23", function(e){
    e.preventDefault()
    let id = $('.form-data23').attr('id')
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    data.id = id
    console.log(data)
    // form.append('image',document.getElementById('file').files[0])
    // console.log(form)
    updateHorizontalMenu(data)
})
