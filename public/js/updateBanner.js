import axios from "axios";

export const updateBanner = async(data)=>{
    try{
        // console.log(data,'==data')
        const res = await axios({
            method: 'POST',
            url: '/api/v1/banner/updateBanner',
            data
        });

        // console.log(res,'==>res')
        if(res.data.status === 'success'){
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