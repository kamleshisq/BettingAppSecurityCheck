import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const updateBanner = async(data)=>{
    try{
        // console.log(data,'==data')
        const res = await axios({
            method: 'POST',
            url: '/api/v1/banner/updateBanner',
            data
        });

        // console.log(res,'==>res')
        if(res.data.status === 'success'){
            toggleadminSide('updated successfully!!!!',true);
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