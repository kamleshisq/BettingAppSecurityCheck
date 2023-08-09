export const userStatus = (data, rawId) => {
    console.log("Working", 454545)
    let url = data.status === 'true' ? '/api/v1/users/updateUserStatusActive' : '/api/v1/users/updateUserStatusInactive';
    $.ajax({
        url,
        type:'post',
        data:{id:data.id, Password:data.Password},
        success:function(data){
            if(data.status === 'success' ){
                if(!data.status){
                    $('tr[id = '+rawId+']').html('')
                }
                alert(data.message)
            }
            console.log(data)
        },
        error:function(error){
            alert(error.responseJSON.message)
        }
    })
}