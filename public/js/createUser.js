import axios from "axios";

export const createUser = async(data)=>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/createUser',
            data
        });
        if(res.data.status === 'success'){
            alert('user created successfully!!!!');
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.reload();
            }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}