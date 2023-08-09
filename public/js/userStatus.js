export const userStatus = (data) => {
    let url = data.status === 'true' ? '/api/v1/users/updateUserStatusActive' : '/api/v1/users/updateUserStatusInactive';
    $.ajax({
        url,
        type:'post',
        data:{id:data.id},
        success:function(data){
            if(data.status === 'success' && !data.status){

                $('tr[id = '+rawId+']').html('')
                alert(data.message)
            }
            console.log(data)
        },
        error:function(error){
            alert(error.responseJSON.message)
        }
    })
}