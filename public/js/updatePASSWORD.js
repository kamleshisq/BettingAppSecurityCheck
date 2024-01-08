import axios from "axios";

export const updatePassword = async(data)=>{
    // console.log(data, "123")
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/updateCurrentUserPass',
            data
        });
        if(res.data.status === 'success'){
            alert('updated successfully!!!!');
            window.setTimeout(()=>{
                location.reload();
            }, 100)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}