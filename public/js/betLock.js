import { toggleadminSide } from "./adminSideCustomPopup";

export const betLockStatus = (data,rowId) => {
    let url = !data.betLock ? '/api/v1/users/updateUserStatusBettingLock' : '/api/v1/users/updateUserStatusBettingUnlock';
    // let message = !data.betLock ? 'user lock successfully' : 'user unlock successfully'
    $.ajax({
        url,
        type:'post',
        data:{id:data._id},
        success:function(data){
            // console.log(data)
            if(data.status === 'success'){
                //alert(data.message)
				toggleadminSide(data.message,true)
                // let html = `<td class='getOwnChild' data-bs-dismiss='${JSON.stringify(data.user)}'>`;
                // if(data.user.roleName != 'user'){
                //     html += `<a href='/admin/userManagement?id=${data.user._id}'>${data.user.userName}</a></td>`
                // }else{
                //     html += `${data.user.userName}</td>`
                // }
                // $('tr[id = '+rowId+']').children().eq(1).replaceWith((html))
                
				setTimeout(function(){window.location.reload(true)}, 3000);
            }

            // let id = JSON.parse(document.querySelector('#back').getAttribute('data-me'))._id
            // let page = document.querySelector('.pageLink').getAttribute('data-page')
            // getOwnChild(id,0,'getOwnChild')
        },
        error:function(error){
            //alert(error.responseJSON.message)
			toggleadminSide(error.responseJSON.message,false)
        }
    })
}