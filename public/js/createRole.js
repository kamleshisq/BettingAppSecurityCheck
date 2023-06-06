export const createRole = (data) => {
    $.ajax({
        url:'/api/v1/role/createRole',
        type:'post',
        data,
        success:function(data){
            setTimeout(alert('role created successfully'),
            window.location.href='/admin/userManagement')
        },
        error:function(error){
            alert(error.responseJSON.message)
        }
    })
}