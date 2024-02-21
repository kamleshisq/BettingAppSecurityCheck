import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";

export const logout = async() => {
    try{
        const res = await axios({
            method: 'GET',
            url:`/api/v1/auth/admin_logOut?sessiontoken=${sessionStorage.getItem('sessiontoken')}
            `
        });
        if(res.data.status === 'success'){
                location.href = '/adminlogin'
        }
    }catch(err){
        console.log(err);
        toggleadminSide('Error logging out! Try again.',false)
    }
}