export const userStatus = (data, rawId) => {
    // let url = data.status === 'true' ? '/api/v1/users/updateUserStatusActive' : '/api/v1/users/updateUserStatusInactive';
    let url = '/api/v1/users/updateUserStatusActive'
    $.ajax({
        url,
        type:'post',
        data:{id:data.id, Password:data.Password},
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
            }
            // console.log(data, 1212121)
        },
        error:function(error){
            alert(error.responseJSON.message)
        }
    })
}