export const betLockStatus = (data,rowId) => {
    let url = !data.betLock ? '/api/v1/users/updateUserStatusBettingLock' : '/api/v1/users/updateUserStatusBettingUnlock';
    // let message = !data.betLock ? 'user lock successfully' : 'user unlock successfully'
    $.ajax({
        url,
        type:'post',
        data:{id:data._id},
        success:function(data){
            // console.log(data)
            alert(data.message)
            $('tr[id = '+rowId+']').children().eq(13).children().eq(1).replaceWith((`<button class="betLockStatus" id="${data.user._id}" data-myval='${JSON.stringify(data.user)}'>BetLock status</button>`))

            // let id = JSON.parse(document.querySelector('#back').getAttribute('data-me'))._id
            // let page = document.querySelector('.pageLink').getAttribute('data-page')
            // getOwnChild(id,0,'getOwnChild')
        },
        error:function(error){
            alert(error.responseJSON.message)
        }
    })
}