import axios from "axios"
export const reset = async(data) =>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/changeUserPasswordAdmin',
            data
        });
        if(res.data.status === 'success'){
            alert("Password Changed Successfully!!!!!")
            location.href = `/admin/dashboard?sessiontoken=${sessionStorage.getItem('sessiontoken')}`
            return res.data.user;
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}