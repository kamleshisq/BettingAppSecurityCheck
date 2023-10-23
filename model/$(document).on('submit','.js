$(document).on('submit','.form-betLimit',async function(e){
    e.preventDefault();
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    // console.log(data)
    let res = await betLimit(data)
    if(res){
        let betLimit = res
        let rowId = $('.rowId').attr('data-rowid')
        $('#'+rowId).html(`
            <td class="btn-filter">${betLimit.type}</td>
            <td><input type="text" class="form-datas" value='${betLimit.min_stake}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.max_stake}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.max_profit}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.max_odd}'></td>
            <td><input type="text" class="form-datas" value='${betLimit.delay}'></td>
            <td data-details='${JSON.stringify(betLimit)}'><button type="button" data-bs-toggle="modal" data-bs-target="#myModal2"class="updateBetLimit">Update</button></td>`)
        alert("updated SuccessFully")
    }
    
})