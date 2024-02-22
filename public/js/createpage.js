import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const createPage = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/pages/createPage',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide(res.data.message,true);
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.reload();
            }, 200)
        }else{
            toggleadminSide(res.data.message,true)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}