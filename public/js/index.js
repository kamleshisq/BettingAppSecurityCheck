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
        console.log("working")
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

$('.createForm').submit(function(e){
e.preventDefault();
const form = document.getElementById('my-form');
let data = new FormData(form) 
const formDataObj = Object.fromEntries(data.entries());
// console.log(formDataObj)
createUser(formDataObj)
});

$(document).on('submit','.passReset-form',function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form)
    const formDataObj = Object.fromEntries(fd.entries())
    reset(formDataObj);
});

$(document).on('submit','.edit-form',async function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form);
    let formDataObj = Object.fromEntries(fd.entries());
    // console.log(formDataObj);
    let rowId = $('.rowId').attr('data-rowid')
    const user = await editUser(formDataObj)
    // console.log(user)
    updateRow(user,rowId)

});

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

    updateRow(user,rowId)
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
    let id = document.getElementById("mySelect").value
    let role_level = document.getElementById("role_level").value
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
    let data = {
        authorization,
        userAuthorization:roleAuthorization,
        id,
        role_level
    }
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


$(document).on('click','.betLockStatus',function(e) {
    const rowId = $(this).parent().parent().attr('id');
    
    const data = $(this).data('myval')
    // alert('hiii')
    betLockStatus(data,rowId)
})
$(document).on('click','.userStatus',function(e) {
    const rowId = $(this).parent().parent().attr('id');
    const data = $(this).data('myval')
    // console.log(rowId)
    // console.log(data)
    userStatus(data,rowId)
})