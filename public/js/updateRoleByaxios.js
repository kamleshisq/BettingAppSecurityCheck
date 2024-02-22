import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const updateRole = async(data)=>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/role/updateRoleById',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide('Updated successfully successfully!',true);
            window.setTimeout(()=>{
                location.reload(true)
            }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}