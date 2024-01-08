export const userStatus = (data, rawId) => {
    // let url = data.status === 'true' ? '/api/v1/users/updateUserStatusActive' : '/api/v1/users/updateUserStatusInactive';
    let url = '/api/v1/users/updateUserStatusActive'
    $.ajax({
        url,
        type:'post',
        data:{id:data.id, status:data.status  ,Password:data.Password, sessiontoken:sessionStorage.getItem('sessiontoken')},
        success:function(data){
            if(data.status === 'success' ){
                if(!data.status){
                    $('tr[id = '+rawId+']').html('')
                }
                if(data.message){
                    alert(data.message)
                }else{
                    alert("Updated!")
                }
            }else{
                alert(data.message)
            }
            // console.log(data, 1212121)
        },
        error:function(err){
            console.log(err)
            alert(err.responseJSON.message)
        }
    })
}