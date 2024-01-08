import axios from "axios";

export const createPage = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/pages/createPage',
            data
        });
        if(res.data.status === 'success'){
            alert(res.data.message);
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.reload();
            }, 200)
        }else{
            alert(res.data.message)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}