import toggleadminSide from "./adminSideCustomPopup";
export const betLockStatus = (data) => {
    let url = !data.betLock ? '/api/v1/users/updateUserStatusBettingLock' : '/api/v1/users/updateUserStatusBettingUnlock';
    let message = !data.betLock ? 'user lock successfully' : 'user unlock successfully'
    $.ajax({
        url,
        type:'post',
        data:{id:data._id},
        success:function(data){
            // alert(message)
            // window.location.reload(true)
        },
        error:function(error){
            //alert(error.responseJSON.message)
			toggleadminSide(error.responseJSON.message,false)
        }
    })
}