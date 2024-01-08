import axios from "axios";

export const editSliderInImage = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/slider/editSliderInImage',
            data
        });
        if(res.data.status === 'success'){
            alert('Edited successfully!!!!');
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