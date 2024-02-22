import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const logoutUser = async() => {
    try{
        const res = await axios({
            method: 'GET',
            url:`/api/v1/auth/logOut`
        });
        if(res.data.status === 'success'){
                location.href = '/'
        }
    }catch(err){
        console.log(err);
        toggleadminSide('Error logging out! Try again.',false)
    }
}