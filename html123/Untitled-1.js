if(pathname == "/admin/reports"){
            $('.searchUser').keyup(function(){
                // console.log('working')
                if($(this).hasClass("searchUser")){
                    // console.log($(this).val())
                    if($(this).val().length >= 3 ){
                        let x = $(this).val(); 
                        // console.log(x)
                        socket.emit("SearchACC", {x, LOGINDATA})
                    }else{
                        document.getElementById('search').innerHTML = ``
                        document.getElementById("button").innerHTML = ''
                    }
                }
            })
        
            $(document).on("click", ".next", function(e){
                e.preventDefault()
                let page = $(this).attr("id")
                let x = $("#searchUser").val()
                socket.emit("SearchACC", {x, LOGINDATA, page})
            })
    
    
            socket.on("ACCSEARCHRES", async(data)=>{
                // console.log(data, 565464)
                let html = ``
        if(data.page === 1){
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }else if(data.page === null){
            document.getElementById("button").innerHTML = ``
        }else{
            html = document.getElementById('search').innerHTML
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }
            })
    
            let searchU 
            let SUSER
            let fromDate
            let toDate
            let fGame
            let fBets
            let filterData = {}
            $(".searchUser").on('input', function(e){
                var $input = $(this),
                    val = $input.val();
                    var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }
    
                    if(match){
                        // console.log(match.text())
                        filterData = {}
                        filterData.userName = val
                        $('.pageId').attr('data-pageid','1')
                        socket.emit('userBetDetail',{filterData,LOGINDATA,page:0})
                    }
            })
    
    
            $('.filter').click(function(){
                let userName = $('.searchUser').val()
                fromDate = $('#fromDate').val()
                toDate = $('#toDate').val()
                fGame = $('#fGame').val()
                fBets = $('#fBets').val()
                let page = $('.pageId').attr('data-pageid','1')
                data.page = 0;
                if(fromDate != ''  && toDate != '' ){
                    filterData.date = {$gte : fromDate,$lte : toDate}
                }else{
    
                    if(fromDate != '' ){
                        filterData.date = {$gte : fromDate}
                    }
                    if(toDate != '' ){
                        filterData.date = {$lte : toDate}
                    }
                }
                if(userName != ''){
                    filterData.userName = userName
                }else{
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }
                filterData.betType = fGame
                filterData.status = fBets
                data.filterData = filterData
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userBetDetail',data)
    
            })

            $(document).on("click", ".searchList", function(){
                // console.log("working")
                // console.log(this.textContent)
                document.getElementById("searchUser").value = this.textContent
                filterData = {}
                filterData.userName = this.textContent
                $('.pageId').attr('data-pageid','1')
                socket.emit('userBetDetail',{filterData,LOGINDATA,page:0})
                
            })
    
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();
                var windowHeight = $(window).height() * window.devicePixelRatio;
                var documentHeight = $(document).height() * window.devicePixelRatio;
                if(scroll + windowHeight >= documentHeight){
                    console.log("working")
                    let page = parseInt($('.pageId').attr('data-pageid'));
                    $('.pageId').attr('data-pageid',page + 1)
                    let data = {}
                    let userName = $('.searchUser').val()
                    if(userName == ''){
                        filterData.userName = LOGINDATA.LOGINUSER.userName
                    }else{
                        filterData.userName = userName
                    }
                    if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                        filterData.date = {$gte : fromDate,$lte : toDate}
                    }else{
    
                        if(fromDate != undefined && fromDate != '' ){
                            filterData.date = {$gte : fromDate}
                        }
                        if(toDate != undefined && toDate != '' ){
                            filterData.date = {$lte : toDate}
                        }
                    }
                    if(fGame !== undefined ){
                        filterData.betType = fGame
                    }
                    if(fBets != undefined ){
                        filterData.status = fBets
                    }
    
                    data.filterData = filterData;
                    data.page = page
                    data.LOGINDATA = LOGINDATA
                    // console.log(data)
                    socket.emit('userBetDetail',data)
    
    
    
                }
             }); 
             

            let count = 11
            socket.on('userBetDetail',(data) => {
                if(data.page === 0){
                    count = 1
                }
                let page = data.page
                let bets = data.ubDetails;
                let html = '';
                 for(let i = 0; i < bets.length; i++){
                     let date = new Date(bets[i].date)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
                    }
                    html += `<td>${i + count}</td>
                    <td>${bets[i].userName}</td>
                    <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}</td>
                    <td>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>`
                    if(bets[i].match){
                        html += `<td>-</td>
                        <td>${bets[i].match}</td>
                        <td>${bets[i].marketName}</td>
                        <td>${bets[i].selectionName}</td>
                        <td>${bets[i].oddValue}</td>`
                    }else{
                        html += `<td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>`
                    }
                    html += `
                    <td>${bets[i].status}</td>
                    <td>${bets[i].Stake}</td>
                    <td>${bets[i].returns}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].event}</td></tr>`
                }
                count += 10
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
            })
    
        }
