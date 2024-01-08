import axios from "axios";

export const addImage = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/slider/addImage',
            data
        });
        if(res.data.status === 'success'){
            alert('image added successfully!!!!');
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