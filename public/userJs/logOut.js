// import axios from "axios";
$("document").ready(function(){
    $('.logOut').click(function(e){
        logout()
    })
const logout = () => {
        $.ajax({
            type: 'GET',
            url:'/api/v1/auth/logOut',
            success:function(data){
                if(data.status === 'success'){
                    alert('Logged out successfully!!!!');
                    window.setTimeout(()=>{
                        location.assign('/')
                    },1000)
                }
            },

            error:function(err){
                // console.log(err);
                alert(err.responseJSON.message)
            }
        });

}
})
