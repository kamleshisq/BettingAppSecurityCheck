import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const debitCredit = async(data)=>{
    // console.log(data)
    if(data.type == "deposit"){
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/deposit',
                data
            });
            if(res.data.status === 'success'){
                toggleadminSide('deposit successfully!!!!',true);
                $("#myModal").modal("toggle");
                // window.setTimeout(()=>{
                //     location.assign('/userManagement')
                // }, 100)
                location.reload(true)
            }
    
        }catch(err){
            console.log(err)
            setTimeout(toggleadminSide(err.response.data.message,false), 1500)
        }
    }else{
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/withdrawl',
                data
            });
            if(res.data.status === 'success'){
                toggleadminSide('withdrawl successfully!!!!',true);
                // window.setTimeout(()=>{
                //     location.assign('/userManagement')
                // }, 100)
                $("#myModal").modal("toggle");
                location.reload(true)

            }
    
        }catch(err){
            console.log(err)
        setTimeout(toggleadminSide(err.response.data.message,false), 1500)
        }
    }
}