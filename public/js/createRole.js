import { toggleadminSide } from "./adminSideCustomPopup";
export const createRole = (data) => {
    $.ajax({
        url:'/api/v1/role/createRole',
        type:'post',
        data,
        success:function(data){
            setTimeout(toggleadminSide('role created successfully',true),
            window.location.reload(true))
        },
        error:function(error){
            toggleadminSide(error.responseJSON.message,false)
        }
    })
}