import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const createPromotion = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/promotion/createPromotionPosition',
            data
        });
        // console.log(res)
        if(res.data.status === 'success'){
            toggleadminSide('Created successfully!!!!',true);
                window.setTimeout(()=>{
                    location.reload();
                }, 100)
        }

    }catch(err){
        // console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}