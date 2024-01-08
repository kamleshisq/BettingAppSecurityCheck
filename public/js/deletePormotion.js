import axios from "axios";

export const deletePromotion = async(data)=>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/promotion/deletePosition',
            data
        });
        // console.log(res)
        if(res.data.status === 'success'){
            alert('deleted successfully!!!!');
                window.setTimeout(()=>{
                    location.reload();
                }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}