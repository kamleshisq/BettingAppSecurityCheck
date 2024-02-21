import axios from "axios";
import { notificationsss } from "./notificationsss";
import { toggleadminSide } from "./adminSideCustomPopup";

export const login = async(userName, password)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/login',
            data:{
                userName:userName.toLowerCase() ,
                password
            }
        });
        if(res.data.status === 'success'){
            notificationsss({message:'Logged in successfully!!!!', status:"success"});
            sessionStorage.setItem('loginUserDetails',JSON.stringify(res.data.user));
            // sessionStorage.setItem('token',JSON.stringify(res.data.token));
            // sessionStorage.setItem('roles',JSON.stringify(res.data.data.roles))
            sessionStorage.setItem('logintime',Date.now())
            localStorage.setItem('logintimeAdmin', Date.now());
            // sessionStorage.setItem('notiCount',JSON.stringify(res.data.data.paymentreqcount))
            sessionStorage.setItem('sessiontoken',res.data.token)
            // sessionStorage.setItem('grandParentDetails','{"parent_id":"0"}');
            // console.log(res.data)
            if(res.data.count){
                window.setTimeout(()=>{
                    location.assign('/updatePassWord')
                }, 100)
            }else{
                window.setTimeout(()=>{
                    location.assign(`/admin/dashboard?sessiontoken=${sessionStorage.getItem('sessiontoken')}`)
                }, 100)
            }
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    $(".loginFormAdmin button[type='submit']").removeClass("loading");
    }
}