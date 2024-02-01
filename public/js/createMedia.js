import axios from "axios";

export const createMedia = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/banner/createMedia',
            data
        });
        if(res.data.status === 'success'){
            alert('created successfully!!!!');
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.reload();
            }, 200)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}