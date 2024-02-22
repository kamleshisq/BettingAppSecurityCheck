import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const editUser = async(data) => {

    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/updateUser',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide('data update successfully!!!!',true);
            $(".popup_body").removeClass("popup_body_show");
            // window.setTimeout(()=>{
            //     location.assign('/userManagement')
            // }, 100)
            return res.data.user;
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}
        