import axios from "axios";

export const logout = async() => {
    try{
        const res = await axios({
            method: 'GET',
            url:'/api/v1/auth/admin_logOut'
        });
        if(res.data.status === 'success'){
                location.href = '/adminlogin'
        }
    }catch(err){
        console.log(err);
        alert('Error logging out! Try again.')
    }
}