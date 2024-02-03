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
                $('#myModalSE').modal('toggle')
                window.setTimeout(()=>{
                    location.reload(true)
                }, 100)
                // return res.data.user;
            }else{
                console.log(res, "1232321321321321321")

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
                window.setTimeout(()=>{
                    location.reload(true)
                }, 100)
                $('#myModalSE').modal('toggle')
                // return res.data.user;

            }else{
                console.log(res, "1232321321321321321")
            }
    
        }catch(err){
            console.log(err)
        setTimeout(alert(err.response.data.message), 1500)
        }
    }
}