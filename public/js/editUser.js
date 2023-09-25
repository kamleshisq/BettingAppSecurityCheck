import axios from "axios";
export const editUser = async(data) => {

    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/updateUser',
            data
        });
        if(res.data.status === 'success'){
            alert('data update successfully!!!!');
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
        