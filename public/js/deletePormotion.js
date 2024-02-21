import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const deletePromotion = async(data)=>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/promotion/deletePosition',
            data
        });
        // console.log(res)
        if(res.data.status === 'success'){
            toggleadminSide('deleted successfully!!!!',true);
                window.setTimeout(()=>{
                    location.reload();
                }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}