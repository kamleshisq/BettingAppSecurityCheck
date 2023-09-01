import axios from "axios";

export const creditDebitSettle = async(data)=>{
    // console.log(data)
    if(data.type == "deposit"){
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/depositSettle',
                data
            });
            if(res.data.status === 'success'){
                alert('deposit successfully!!!!');
                $(".popup_body").removeClass("popup_body_show");
                // window.setTimeout(()=>{
                //     location.assign('/userManagement')
                // }, 100)
                return res.data.user;
            }
    
        }catch(err){
            console.log(err)
        setTimeout(alert(err.response.data.message), 1500)
        }
    }else{
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/withdrawlSettle',
                data
            });
            if(res.data.status === 'success'){
                alert('withdrawl successfully!!!!');
                // window.setTimeout(()=>{
                //     location.assign('/userManagement')
                // }, 100)
                $(".popup_body").removeClass("popup_body_show");
                return res.data.user;

            }
    
        }catch(err){
            console.log(err)
        setTimeout(alert(err.response.data.message), 1500)
        }
    }
}