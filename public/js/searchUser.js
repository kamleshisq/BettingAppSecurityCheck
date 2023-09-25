export const searchUser = (data) => {
    $.ajax({
        url:`/api/v1/users/searchUser?search=${data}`,
        type:'get',
        success:function(data){
            let response = data.users;
    
            $('table').children().html("<tr>"+
            "<th>S.No</th>"+
            "<th>User Name</th>"+
            "<th>White lable</th>"+
            "<th>Credit Reference</th>"+
            "<th>Balance</th>"+
            "<th>Available Balance</th>"+
            "<th>Downlevel Balance</th>"+
            "<th>Client P/L</th>"+
            "<th>Upline P/L</th>"+
            "<th>Exposure</th>"+
            "<th>Exposure limit</th>"+
            "<th>Lifetime Credit</th>"+
           " <th>Lifetime Deposite</th>"+
            "<th>Action</th>"+
          "</tr>")

            $(function() 
            {
                $.each(response, function(i, item) {
                    var $tr = $('<tr>').append(
                        $('<td>').text(i+1),
                        $('<td>').attr('class','getOwnChild').attr('data-id',JSON.stringify(item)).text(item.userName),
                        $('<td>').text(item.whiteLabel),
                        $('<td>').text(item.creditReference),
                        $('<td>').text(item.balance),
                        $('<td>').text(item.availableBalance),
                        $('<td>').text(item.downlineBalance),
                        $('<td>').text(item.clientPL),
                        $('<td>').text(item.uplinePL),
                        $('<td>').text(item.exposure),
                        $('<td>').text(item.exposureLimit),
                        $('<td>').text(item.lifeTimeCredit),
                        $('<td>').text(item.lifeTimeDeposit),
                        $('<td>').append($('<button>').append($('<a>').attr('href',`#`).text('U/S')),$('<button>').attr("class","betLockStatus").attr('id',`${item._id}`).attr('data-myval',`${JSON.stringify(item)}`).text("BetLock status"),$('<button>').append($('<a>').attr('href',`/resetPassword?id=${item._id}`).text('Change Password')),$('<button>').append($('<a>').attr('href',`/accountStatement?id=${item._id}`).text('A/S')),
                        $('<button>').append($('<a>').attr('href',`/updateUser?id=${item._id}`).text('details')),$('<button>').append($('<a>').attr('href',`/DebitCredit?id=${item._id}`).text('D/C')))
                        
                    ); 
                    $('table').append($tr)
                });

            });
        },
        error:function(error){
            console.log(error)
        }
    })
}