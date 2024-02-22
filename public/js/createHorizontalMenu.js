import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const createHorizontalMenu = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/horizontalMenu/createMenu',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide('Menu created successfully!!!!',true);
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.assign('/admin/cms')
            }, 200)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}