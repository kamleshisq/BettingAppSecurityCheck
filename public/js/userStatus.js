export const userStatus = (data,rawId) => {
    let url = !data.isActive ? '/api/v1/users/updateUserStatusActive' : '/api/v1/users/updateUserStatusInactive';
    let message = !data.isActive ? 'user active successfully' : 'user inactive successfully'
    // let rowId = rowId;
    // console.log(rowId)
    $.ajax({
        url,
        type:'post',
        data:{id:data._id},
        success:function(data){
            $('tr[id = '+rawId+']').html('')
            alert(message)

            // $('tr[id = '+rawId+']').html('
            // ')
            // let id = JSON.parse(document.querySelector('#back').getAttribute('data-me'))._id
            // let page = document.querySelector('.pageLink').getAttribute('data-page')
            // getOwnChild(id,0,'getOwnChild')
            // console.log($(this).parent().parent().hide())
            // $(this).parent().parent().hide()
        },
        error:function(error){
            alert(error.responseJSON.message)
        }
    })
}