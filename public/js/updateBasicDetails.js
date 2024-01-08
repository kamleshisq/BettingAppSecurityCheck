import axios from "axios";

export const updateBasicDetails = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/globalRoutes/updateBasicDetails',
            data
        });
        if(res.data.status === 'sucess'){
            alert('updated successfully!!!!');
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