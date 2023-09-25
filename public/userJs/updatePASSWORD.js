// import axios from "axios";
if(document.querySelector('.ChangeFORM')){
    document.querySelector('.ChangeFORM').addEventListener('submit', e =>{
    e.preventDefault();
    // console.log("working")   
    const form = document.getElementById('changePass-form');
    let data = new FormData(form) 
    const formDataObj = Object.fromEntries(data.entries());
    // console.log(formDataObj)
    updatePassword(formDataObj);
})};
const updatePassword = (data)=>{
    // console.log(data, "123")
       $.ajax({
            type: 'POST',
            url: '/api/v1/users/updateCurrentUserPass',
            data,
            success:function(data){

                if(data.status === 'success'){
                    alert('updated successfully!!!!');
                    window.setTimeout(()=>{
                        location.assign('/')
                    }, 100)
                }
            },
            error:function(err){
                setTimeout(alert(err.responseJSON.message), 1500)

            }
        });


}