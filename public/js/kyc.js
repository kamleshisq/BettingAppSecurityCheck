import axios from "axios";

export const KYC = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/Kyc/uploadDoc ',
            data
        });
        if(res.data.status === 'success'){
            alert('image added successfully!!!!');
            // $(".popup_body").removeClass("popup_body_show");

           
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}