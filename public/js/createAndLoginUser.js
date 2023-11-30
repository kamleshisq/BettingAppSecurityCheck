import axios from "axios";
import { notificationsss } from "./notificationsss";

export const createAndLoginUser = async(data) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/loginAndCreateUser',
            data
        });
        if(res.data.status === 'success'){
            notificationsss({message : 'Registered successfully!!!!', status:"success"});
            sessionStorage.setItem('loginUserDetails',JSON.stringify(res.data.data.user));
            sessionStorage.setItem('roles',JSON.stringify(res.data.data.roles))
            // sessionStorage.setItem('grandParentDetails','{"parent_id":"0"}');
            // console.log(res.data)
            // if(res.data.count){
            //     window.setTimeout(()=>{
            //         location.assign('/updatePassWord')
            //     }, 100)
            // }else{
                setTimeout(function() {
                    window.location.reload();
                  }, 300);
            // }
        }

    }catch(err){
        console.log(err)
        notificationsss({message : err.response.data.message, status:"error"});
        setTimeout(function() {
            window.location.reload();
          }, 2000);
    // setTimeout(alert(err.response.data.message), 1500)
    }
}