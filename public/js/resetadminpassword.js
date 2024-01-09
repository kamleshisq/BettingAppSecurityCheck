import axios from "axios"
export const resetadminpassword = async(data) =>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/changeUserPasswordAdmin',
            data
        });
        if(res.data.status === 'success'){
            location.href = `/passcodeview?sessiontoken=${sessionStorage.getItem('sessiontoken')}`
            
        }else {
            alert(res.data.message)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}