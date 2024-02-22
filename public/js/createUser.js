import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const createUser = async(data)=>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/createUser',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide('user created successfully!!!!',true);
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.reload();
            }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}