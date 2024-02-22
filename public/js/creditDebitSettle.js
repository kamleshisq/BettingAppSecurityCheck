import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const creditDebitSettle = async(data)=>{
    // console.log(data)
    if(data.type == "deposit"){
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/depositSettle',
                data
            });
            if(res.data.status === 'success'){
                toggleadminSide('deposit successfully!!!!',true);
                $('#myModalSE').modal('toggle')
                window.setTimeout(()=>{
                    location.reload(true)
                }, 100)
                // return res.data.user;
            }
    
        }catch(err){
            console.log(err)
        setTimeout(toggleadminSide(err.response.data.message,false), 1500)
        }
    }else{
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/withdrawlSettle',
                data
            });
            if(res.data.status === 'success'){
                toggleadminSide('withdrawl successfully!!!!',true);
                window.setTimeout(()=>{
                    location.reload(true)
                }, 100)
                $('#myModalSE').modal('toggle')
                // return res.data.user;

            }
    
        }catch(err){
            console.log(err)
        setTimeout(toggleadminSide(err.response.data.message,false), 1500)
        }
    }
}