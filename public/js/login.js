import axios from "axios";

export const login = async(userName, password)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/login',
            data:{
                userName,
                password
            }
        });
        if(res.data.status === 'success'){
            alert('Logged in successfully!!!!');
            sessionStorage.setItem('loginUserDetails',JSON.stringify(res.data.data.user));
            sessionStorage.setItem('roles',JSON.stringify(res.data.data.roles))
            // sessionStorage.setItem('grandParentDetails','{"parent_id":"0"}');
            // console.log(res.data)
            if(res.data.data.user.role.authorization.includes('dashboard')){
                window.setTimeout(()=>{
                    location.assign('/dashboard')
                }, 100)
            }else{
                window.setTimeout(()=>{
                    location.assign('/userManagement')
                }, 100)
            }
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}