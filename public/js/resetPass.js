import axios from "axios"
export const reset = async(data) =>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/changeUserPassword',
            data
        });
        if(res.data.status === 'success'){
            alert("Password Changed Successfully!!!!!")
            $(".popup_body").removeClass("popup_body_show");
            // window.setTimeout(()=>{
            //     location.assign('/userManagement')
            // }, 100)
            return res.data.user;
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}