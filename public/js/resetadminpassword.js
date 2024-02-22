import axios from "axios"
import { toggleadminSide } from "./adminSideCustomPopup";
export const resetadminpassword = async(data) =>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/changeUserPasswordAdmin',
            data
        });
        if(res.data.status === 'success'){
            location.href = `/passcodeview?sessiontoken=${sessionStorage.getItem('sessiontoken')}&passcode=${res.data.passcode}`
            
        }else {
            toggleadminSide(res.data.message,true)
        }

    }catch(err){
        console.log(err)
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}