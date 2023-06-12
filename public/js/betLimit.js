import axios from "axios";

export const betLimit = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/betLimit/update',
            data
        });
        if(res.data.status == "success"){
            $(".popup_body").removeClass("popup_body_show");
            return res.data.betLimit
        }

    }catch(err){
        console.log(err)
        // setTimeout(alert(err.response.data.message), 1500)
    }
}