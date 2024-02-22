import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const updatePassword = async(data)=>{
    // console.log(data, "123")
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/updateCurrentUserPass',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide('updated successfully!!!!',true);
            window.setTimeout(()=>{
                location.reload();
            }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}