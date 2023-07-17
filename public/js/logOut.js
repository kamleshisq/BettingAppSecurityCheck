import axios from "axios";

export const logout = async() => {
    try{
        const res = await axios({
            method: 'GET',
            url:'/api/v1/auth/logOut'
        });
        if(res.data.status === 'success'){
            // alert('Logged out successfully!!!!');
            window.setTimeout(()=>{
                location.href = '/'
            },100)
        }
    }catch(err){
        console.log(err);
        alert('Error logging out! Try again.')
    }
}