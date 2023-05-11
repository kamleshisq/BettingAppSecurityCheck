// console.log("js")
// import axios from "axios";
if(document.querySelector('.userLoginForm')){
    document.querySelector('.userLoginForm').addEventListener('submit', e =>{
    e.preventDefault();
    const userName = document.getElementById('uname').value;
    const password = document.getElementById('password').value;
    // console.log(userName, password)
    const userLogin = async(userName, password) => {
        $.ajax({
            url:'/api/v1/auth/userLogin',
            type:'post',
            data:{userName, password},
            success:function(data){
                // console.log(data)
                sessionStorage.setItem('loginUserDetails',JSON.stringify(data.data.user));
                setTimeout(alert('login successfully'),window.location.href = '/userDashboard')
            },
            error:function(error){
                (error)
                setTimeout(alert(error.responseJSON.message),3000)
            }
        })
    }
    userLogin(userName, password)
})};
