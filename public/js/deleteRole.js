import { toggleadminSide } from "./adminSideCustomPopup";

export const deleteRole = (data) => {
    $.ajax({
        url:'/api/v1/role/deleteRole',
        type:'post',
        data,
        success:function(data){
            if(data.status == 'success'){
                setTimeout(toggleadminSide('role deleted successfully',true),1000)
                window.location.reload(true)
            }
        },
        error:function(error){
            toggleadminSide(error.responseJSON.message,false)
        }
    })
}