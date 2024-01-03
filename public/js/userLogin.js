import axios from "axios";
import { notificationsss } from "./notificationsss";

export const userLogin = async(data) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/userLogin',
            data
        });
        if(res.data.status === 'success'){
            notificationsss({message : 'Logged in successfully!!!!', status:"success"});
            // sessionStorage.setItem('loginUserDetails',JSON.stringify(res.data.data.user));
            // sessionStorage.setItem('roles',JSON.stringify(res.data.data.roles))
            // sessionStorage.setItem('logintime',Date.now())
            // localStorage.setItem('logintimeUser', Date.now());
            sessionStorage.setItem('sessionID', res.data.data.sessionID);

            // sessionStorage.setItem('grandParentDetails','{"parent_id":"0"}');
            // console.log(res.data)
            // if(res.data.count){
            //     window.setTimeout(()=>{
            //         location.assign('/updatePassWord')
            //     }, 100)
            // }else{
                setTimeout(function() {
                    location.reload();
                  }, 300);
            // }
        }

    }catch(err){
        console.log(err)
        notificationsss({message : err.response.data.message, status:"error"});
    // setTimeout(alert(err.response.data.message), 1500)
    }
}