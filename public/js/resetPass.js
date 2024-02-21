import axios from "axios"
import { toggleadminSide } from "./adminSideCustomPopup";
export const reset = async(data) =>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/changeUserPassword',
            data
        });
        if(res.data.status === 'success'){
            toggleadminSide("Password Changed Successfully!!!!!",true)
            $('#myModal3').modal('toggle')
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