import axios from "axios";

export const updateRole = async(data)=>{
    // console.log(data)
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/role/updateRoleById',
            data
        });
        if(res.data.status === 'success'){
            alert('Updated successfully successfully!!!!');
            window.setTimeout(()=>{
                location.reload(true)
            }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}