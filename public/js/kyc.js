import axios from "axios";
import { notificationsss } from "./notificationsss";

export const KYC = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/Kyc/uploadDoc ',
            data
        });
        if(res.data.status === 'success'){
                notificationsss({message:"Updated Successfully!!!", status:"success"});
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