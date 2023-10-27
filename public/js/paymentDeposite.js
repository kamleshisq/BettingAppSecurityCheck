import axios from "axios";
import { notificationsss } from "./notificationsss";

export const paymentDeposite = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/Account/paymentDeposite',
            data
        });
        if(res.data.status === 'success'){
                notificationsss({message:"amount deposit successfully!!!", status:"success"});
                setTimeout(function() {
                    location.reload();
                  }, 2000);
            // $(".popup_body").removeClass("popup_body_show");
           
        }

    }catch(err){
        console.log(err)
    notificationsss({message: err.response.data.message, status:"error"})
    }
}