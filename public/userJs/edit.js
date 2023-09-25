$('document').ready(function(){
    $('.user-edit-form').submit(function(e){
        e.preventDefault();
        let data = new FormData($(this)[0]) 
        const formDataObj = Object.fromEntries(data.entries());
        // console.log(formDataObj)
        $.ajax({
            url:'/api/v1/users/edit',
            type:'post',
            data:formDataObj,
            success:function(data){
                // console.log(data)
                if(data.status == 'success'){
                    alert('update successfullt')
                    setTimeout(()=> {
                        location.href = '/'
                    })
                }
            },error:function(err){
                // console.log(err)
                alert(err.responseJSON.message)
            }

        })
    })
})