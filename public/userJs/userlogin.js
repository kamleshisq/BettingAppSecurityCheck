// console.log("js")
import axios from "axios";
$(document).on('submit', ".myloginmodl-form-dv", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    // console.log(userName, password)
    const userLogin = async(data) => {
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/auth/userLogin',
                data
            });
            if(res.data.status === 'success'){
                alert('Logged in successfully!!!!');
                sessionStorage.setItem('loginUserDetails',JSON.stringify(res.data.data.user));
                sessionStorage.setItem('token',JSON.stringify(res.data.token));
                sessionStorage.setItem('roles',JSON.stringify(res.data.data.roles))
                // sessionStorage.setItem('grandParentDetails','{"parent_id":"0"}');
                // console.log(res.data)
                if(res.data.count){
                    window.setTimeout(()=>{
                        location.assign('/updatePassWord')
                    }, 100)
                }else{
                    setTimeout(function() {
                        location.reload();
                      }, 300);
                }
            }
    
        }catch(err){
            console.log(err)
        setTimeout(alert(err.response.data.message), 1500)
        }
    }
    userLogin(data)
});
