import axios from "axios";

export const createPromotion = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/promotion/createPromotionPosition',
            data
        });
        // console.log(res)
        if(res.data.status === 'success'){
            alert('Created successfully!!!!');
                window.setTimeout(()=>{
                    location.reload();
                }, 100)
        }

    }catch(err){
        // console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}