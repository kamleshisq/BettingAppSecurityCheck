if(pathname === "/myAccountStatment"){

        function generatePDF(table) {
            const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(`
                    <html>
                        <head>
                        <title>Account Statement</title>
                        <style>
                            .ownAccDetails {
                                color: black;
                                border: none;
                                background-color: inherit;
                                padding: 14px 28px;
                                font-size: 16px;
                                cursor: pointer;
                                display: inline-block;
                            }
                            body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            }
                            table {
                            border-collapse: collapse;
                            width: 100%;
                            }
                            th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            }
                            th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                            }
                        </style>
                        </head>
                        <body>
                        ${table.outerHTML}
                        </body>
                    </html>
                    `);
                    printWindow.document.close();

                    printWindow.print();
                
          }

        document.getElementById('pdfDownload').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');
            
            if (table) {
              generatePDF(table);
            }
          });

        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

          function sanitizeCellValue(value) {
            // Define a character whitelist (allow only printable ASCII and basic punctuation)
            const allowedCharactersRegex = /[\x20-\x7E\u0020-\u007E]/g;
            
            return value.match(allowedCharactersRegex).join('').trim();
          }
          
          function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            
            let csv = '';
            for (const row of rows) {
              const columns = row.querySelectorAll('td, th');
              let rowData = '';
              for (const column of columns) {
                const data = sanitizeCellValue(column.innerText);
                rowData += (data.includes(',') ? `"${data}"` : data) + ',';
              }
              csv += rowData.slice(0, -1) + '\n';
            }
            
            return csv;
          }

        document.getElementById('downloadBtn').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');             
            if (table) {
              const csvContent = convertToCSV(table);
              downloadCSV(csvContent, 'AccountStatement.csv');
            }
          });


        // $(window).scroll(function() {
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     var documentHeight = $(document).height();
        //     if (scroll + windowHeight >= documentHeight) {
                // let page = parseInt($('.pageId').attr('data-pageid'));
                // $('.pageId').attr('data-pageid',page + 1)
                // let fromDate = $('#Fdate').val()
                // let toDate = $('#Tdate').val()
                // let type = $("#select").val()
                // let filterData = {}
                // filterData.fromDate = fromDate,
                // filterData.toDate = toDate
                // filterData.type = type
                // socket.emit("ACCSTATEMENTUSERSIDE", {page, LOGINDATA, filterData})
        //     }
        // });


        $(function () {
            $("div").slice(0, 4).show();
            $("#loadMore").on('click', function (e) {
                e.preventDefault();
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let fromDate = $('#Fdate').val()
                let toDate = $('#Tdate').val()
                let type = $("#select").val()
                let filterData = {}
                filterData.fromDate = fromDate,
                filterData.toDate = toDate
                filterData.type = type
                socket.emit("ACCSTATEMENTUSERSIDE", {page, LOGINDATA, filterData})
            });
        });

        const FdateInput = document.getElementById('Fdate');
        const TdateInput = document.getElementById('Tdate');
        const selectElement = document.getElementById('select');
        FdateInput.addEventListener('change', handleInputChange);
        TdateInput.addEventListener('change', handleInputChange);
        selectElement.addEventListener('change', handleInputChange);
        function handleInputChange(event) {
            let fromDate = $('#Fdate').val()
            let toDate = $('#Tdate').val()
            let type = $("#select").val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            filterData.type = type
            page = 0
            $('.pageId').attr('data-pageid',1)
            socket.emit("ACCSTATEMENTUSERSIDE", {page, LOGINDATA, filterData})
          }


        let count = 21
        socket.on("ACCSTATEMENTUSERSIDE", async(data) => {
            if(data.userAcc.length > 0){
            console.log(data.page)
            if(data.page === 0){
                count = 1
            }
            let page = data.page
            let userAcc = data.userAcc;
            let html = '';
             for(let i = 0; i < userAcc.length; i++){
                var date = new Date(userAcc[i].date);
                var options = { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                };
                var formattedTime = date.toLocaleString('en-US', options);
                html += `<tr class="acount-stat-tbl-body-tr">
                    <td>${i+count}</td>
                    <td>${formattedTime}</td>`
                    if(userAcc[i].creditDebitamount > 0){
                        html += `<td>${userAcc[i].creditDebitamount}</td>
                        <td>0</td>`
                    }else{
                        html += ` <td>0</td>
                        <td>${userAcc[i].creditDebitamount}</td>`
                    }

                    if(userAcc[i].stake){
                        html += `<td>${userAcc[i].stake}</td>`
                    }else{
                        html += "<td>-</td>"
                    }

                    html += `<td>0</td>
                    <td>${userAcc[i].balance}</td>
                    <td>${userAcc[i].description}</td>
                    <td>-</td>`
            }
            count += 20
            if(data.page == 0){
                $('.acount-stat-tbl-body').html(html)
            }else{
                $('.acount-stat-tbl-body').append(html)         
            }
        }else{
            console.log("working")
                $('.loadMoredive').html("")
        }
        })
    }

    $(window).scroll(function() {
      // $(window).scroll(function() {
          var scroll = $(window).scrollTop();
          var windowHeight = $(window).height();
          var documentHeight = $(document).height();
          if (scroll + windowHeight >= documentHeight) {
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
   



   socket.on("ACCSTATEMENTUSERSIDE", async(data) => {
    let limit = 20;
    let page = data.page;
    // console.log(page)
    // console.log(data.LOGINDATA.LOGINUSER)
    let filter = {}
    filter.user_id = data.LOGINDATA.LOGINUSER._id
    if(data.filterData.fromDate != "" && data.filterData.toDate == ""){
        filter.date = {
            $gt : new Date(data.filterData.fromDate)
        }
    }else if(data.filterData.fromDate == "" && data.filterData.toDate != ""){
        filter.date = {
            $lt : new Date(data.filterData.toDate)
        }
    }else if (data.filterData.fromDate != "" && data.filterData.toDate != ""){
        filter.date = {
            $gte : new Date(data.filterData.fromDate),
            $lt : new Date(data.filterData.toDate)
        }
    }
    if(data.filterData.type === "2"){
        filter.stake = {
            $ne:undefined
        }
    }else if (data.filterData.type === "1"){
        filter.stake = undefined
    }
    // console.log(filter)
    let userAcc = await AccModel.find(filter).sort({date: -1}).skip(page * limit).limit(limit)
    socket.emit("ACCSTATEMENTUSERSIDE", {userAcc, page})
    })


    socket.on("ACCSTATEMENTUSERSIDE", async(data) => {
      if(data.userAcc.length > 0){
      console.log(data.page)
      if(data.page === 0){
          count = 1
      }
      let page = data.page
      let userAcc = data.userAcc;
      let html = '';
       for(let i = 0; i < userAcc.length; i++){
          var date = new Date(userAcc[i].date);
          var options = { 
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
          };
          var formattedTime = date.toLocaleString('en-US', options);
          html += `<tr class="acount-stat-tbl-body-tr">
              <td>${i+count}</td>
              <td>${formattedTime}</td>`
              if(userAcc[i].creditDebitamount > 0){
                  html += `<td>${userAcc[i].creditDebitamount}</td>
                  <td>0</td>`
              }else{
                  html += ` <td>0</td>
                  <td>${userAcc[i].creditDebitamount}</td>`
              }

              if(userAcc[i].stake){
                  html += `<td>${userAcc[i].stake}</td>`
              }else{
                  html += "<td>-</td>"
              }

              html += `<td>0</td>
              <td>${userAcc[i].balance}</td>
              <td>${userAcc[i].description}</td>
              <td>-</td>`
      }
      count += 20
      if(data.page == 0){
          $('.acount-stat-tbl-body').html(html)
      }else{
          $('.acount-stat-tbl-body').append(html)         
      }
  }else{
      console.log("working")
          $('.loadMoredive').html("")
  }
  })