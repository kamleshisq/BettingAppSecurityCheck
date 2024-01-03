import axios from "axios";
import { notificationsss } from "./notificationsss";

export const userLogin = async(data) => {
    const idFromStorage = sessionStorage.getItem("ID_KEY");
    console.log(idFromStorage, "idFromStorageidFromStorageidFromStorage")
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/userLogin',
            data
        });
        if(res.data.status === 'success'){
            notificationsss({message : 'Logged in successfully!!!!', status:"success"});
            console.log(res.data.data.sessionId)
            sessionStorage.setItem('sessionID', res.data.data.sessionId);
                setTimeout(function() {
                    location.reload();
                  }, 3000);
        }

    }catch(err){
        console.log(err)
        notificationsss({message : err.response.data.message, status:"error"});
    // setTimeout(alert(err.response.data.message), 1500)
    }
}