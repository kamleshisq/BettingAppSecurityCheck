import axios from "axios";

export const debitCredit = async(data)=>{
    // console.log(data)
    if(data.type == "deposit"){
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/deposit',
                data
            });
            if(res.data.status === 'success'){
                alert('deposit successfully!!!!');
                $("#myModal").modal("toggle");
                // window.setTimeout(()=>{
                //     location.assign('/userManagement')
                // }, 100)
                location.reload(true)
            }
    
        }catch(err){
            console.log(err)
            setTimeout(alert(err.response.data.message), 1500)
        }
    }else{
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/Account/withdrawl',
                data
            });
            if(res.data.status === 'success'){
                alert('withdrawl successfully!!!!');
                // window.setTimeout(()=>{
                //     location.assign('/userManagement')
                // }, 100)
                $("#myModal").modal("toggle");
                location.reload(true)

            }
    
        }catch(err){
            console.log(err)
        setTimeout(alert(err.response.data.message), 1500)
        }
    }
}