// import axios from "axios";
$('document').ready(function(){
    $('.user-registration-form').submit( async function(e){
        e.preventDefault();
        let data = new FormData($(this)[0]) 
        const formDataObj = Object.fromEntries(data.entries());
        // console.log(formDataObj)
            $.ajax({
                url:'/api/v1/auth/userSignUp',
                type:'post',
                data:formDataObj,
                success:function(data){

                    if(data.status === 'success'){
                        alert('you are registered successfully')
                        setTimeout(()=> {
                            location.href = '/'
                        })
                    }
                },
                error:function(err){
                    alert(err.responseJSON.message)
                }
            })

    })
})