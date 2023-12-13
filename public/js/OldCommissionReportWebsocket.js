if(pathname === "/admin/commissionReport"){

        const FdateInput = document.getElementById('Fdate');
        const TdateInput = document.getElementById('Tdate');
        FdateInput.addEventListener('change', handleInputChangeCommission);
        TdateInput.addEventListener('change', handleInputChangeCommission);
        function handleInputChangeCommission() {
            // console.log("Work")
            let fromDate = $('#Fdate').val()
            let toDate = $('#Tdate').val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            page = 0
            $('.pageId').attr('data-pageid',1)
            socket.emit("CommissionRReport", {page, LOGINDATA, filterData})
        }

        // $(window).scroll(async function() {
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     var documentHeight = $(document).height();
        //     if (scroll + windowHeight >= documentHeight) {
        //         console.log("working")
        //         let page = parseInt($('.pageId').attr('data-pageid'));
        //         $('.pageId').attr('data-pageid',page + 1)
        //         let filterData = {};
        //         let fromDate1 = $('#Fdate').val()
        //         let toDate = $('#Tdate').val()
        //         console.log(fromDate1)
        //         filterData.fromDate = fromDate1,
        //         filterData.toDate = toDate
        //         socket.emit("CommissionRReport", {page, LOGINDATA, filterData})
        //     }
        //   })

          $(document).on('click', ".load-more", function(e){
            // console.log("working")
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let filterData = {};
                let fromDate1 = $('#Fdate').val()
                let toDate = $('#Tdate').val()
                // console.log(fromDate1)
                filterData.fromDate = fromDate1,
                filterData.toDate = toDate
                socket.emit("CommissionRReport", {page, LOGINDATA, filterData})
          })

          let count = 11
          socket.on("CommissionRReport", data => {
            // console.log(data)
            // if(data.CommissionData.length > 0){
                if(data.page === 0){
                    count = 1
                }
                let page = data.page
                let userAcc = data.CommissionData;
                let html = ""
                for(let i = 0; i < userAcc.length; i++){
                    let date = new Date(userAcc[i].date)
                    html += `<tr style="text-align: center;" class="blue"><td>${count + i}</td>
                    <td class="text-nowrap">${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                    <td class="text-nowrap">${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                if(userAcc[i].creditDebitamount > 0){
                    html += ` <td>${userAcc[i].creditDebitamount}</td>
                    <td>-</td>`
                }else{
                    html += ` <td>-</td>
                    <td>${userAcc[i].creditDebitamount}</td>`
                }
                html += `<td>${userAcc[i].balance}</td>
                <td>${userAcc[i].description}</td>
            </tr>`
                }

                count += 10
                if(data.page == 0){
                    // console.log(html)
                    if(!(data.CommissionData.length < 10)){
                        document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                    }
                    if(data.CommissionData.length === 0){
                        html += `<tr class="empty_table"><td>No record found</td></tr>`
                    }
                    $('.table-body').html(html)

                }else{
                    $('.table-body').append(html)         
                    if((data.CommissionData.length < 10)){
                        document.getElementById('load-more').innerHTML = ""
                    }
                }
          })


    }