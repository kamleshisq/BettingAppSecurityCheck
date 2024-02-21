import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const updateSlider = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/slider/updateSlider',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide('updeted successfully!',true);
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.reload();
            }, 200)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}