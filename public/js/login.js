import axios from "axios";
import { notificationsss } from "./notificationsss";

export const login = async(userName, password)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/login',
            data:{
                userName,
                password
            }
        });
        if(res.data.status === 'success'){
            notificationsss({message:'Logged in successfully!!!!', status:"success"});
            sessionStorage.setItem('loginUserDetails',JSON.stringify(res.data.data.user));
            sessionStorage.setItem('token',JSON.stringify(res.data.token));
            sessionStorage.setItem('roles',JSON.stringify(res.data.data.roles))
            // sessionStorage.setItem('grandParentDetails','{"parent_id":"0"}');
            // console.log(res.data)
            // if(res.data.count){
            //     window.setTimeout(()=>{ 
            //         location.assign('/updatePassWord')
            //     }, 100)
            // }else{
            //     window.setTimeout(()=>{ 
            //         location.assign('/admin/userManagement')
            //     }, 100)
            // }
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}