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
            setTimeout(function() {
                window.location.reload();
              }, 2000);
            // sessionStorage.setItem('loginUserDetails',JSON.stringify(res.data.data.user));
            // sessionStorage.setItem('roles',JSON.stringify(res.data.data.roles))
        }

    }catch(err){
        console.log(err)
        notificationsss({message : err.response.data.message, status:"error"});
        // setTimeout(function() {
        //     window.location.reload();
        //   }, 2000);
    // setTimeout(alert(err.response.data.message), 1500)
    }
}