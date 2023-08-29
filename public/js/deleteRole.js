export const deleteRole = (data) => {
    $.ajax({
        url:'/api/v1/role/deleteRole',
        type:'post',
        data,
        success:function(data){
            setTimeout(alert('role deleted successfully'),1000)
            window.location.reload(true)
        },
        error:function(error){
            alert(error.responseJSON.message)
        }
    })
}