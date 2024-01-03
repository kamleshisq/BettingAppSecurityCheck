if(pathname === '/exchange_inPlay/match'  ){

        function fencyDetails( status ){
            let eventId = search.split('=')[1]
            socket.emit("marketIdbookDetailsFANCY", {LOGINDATA, eventId, status})
        }


        if(document.getElementById('myIframe')){
            let channelId = document.getElementById('myIframe').getAttribute('data-id');
            // console.log(channelId, "channelIdchannelIdchannelId")
            socket.emit('channelId', {channelId, search, LOGINDATA})
    
            socket.on('channelId', data => {
                // console.log(data)
                try{
                    function xorEncrypt(input, key) {
                        let output = '';
                        for (let i = 0; i < input.length; i++) {
                          output += String.fromCharCode(input.charCodeAt(i) ^ key);
                        }
                        return output;
                      }
                      const encryptionKey = 'JK';
                      const encryptedUrl = xorEncrypt(data, encryptionKey);
                      $(document).ready(function() {
                        $('#myIframe').attr('src', encryptedUrl);
                    });
                    // window.addEventListener('load', function() {
                    //     const iframe = document.getElementById('myIframe');
                    //     iframe.src = encryptedUrl;
                    //   });
    
                }catch(err){
                    console.log(err)
                }
            })
        }
        // $(document).ready(function(){
        //     $(".exchange-pg-inn-tbl .button").click(function(event){
        //       $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').slideUp()
        //       $('tr.tbl-data-href td .button').removeAttr("style");
        //       $(this).parents('tr').next().find('.my-exc-inn-colaps-txt-dv').slideDown();
        //       $(this).parents('tr').find('.button').css({"pointer-events": "none"});
        //       event.stopPropagation()
        //     });
        //     $("tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv").click(function(event){
        //       event.stopPropagation()
        //     });
        //     $(".my-exc-inn-colaps-txt-dv .close-btn, body").click(function(){
        //       $('tr.tbl-data-href td .button').removeAttr("style");
        //       $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').slideUp()
        //     });
        //   });

        $(document).ready(function(){
            $("table .button").click(function(){
              $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').removeClass('open');
              $(this).parents('tr').next().find('.my-exc-inn-colaps-txt-dv').addClass('open');
            });
            $(".my-exc-inn-colaps-txt-dv .close-btn").click(function(){
              $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').removeClass('open');
            });
        });
        
        function cashoutCheck(){
            $(document).ready(function(){
                let id = $('.mo').attr('id')
                // console.log(id, "111111111111111111111111111111")
                socket.emit('cashoutCheck', {LOGINDATA, id})
                setTimeout(()=>{
                    cashoutCheck()
                  }, 5000)
            })
        }
        cashoutCheck()

        socket.on('cashoutCheck', data => {
            if(data.Status){
                // console.log($('.mo'))
                let tables = $('.mo')
                tables.each(function (index, table) {
                    $(table).find('thead tr th:first').html('Market <button class="site-button cashout">CASHOUT</button>');
                })
            }
        })

        $(document).on('click', ".cashout", function(e){
            let id = $(this).closest('table').attr('id')
            let eventID = search.split('=')[1]
            // console.log('Working123456987')
            socket.emit('cashOOut', {LOGINDATA, id, eventID})
        })

        socket.on('cashOOut', async(data) => {
            $(".my-exc-inn-colaps-txt-dv").removeClass("open");

            $('.button').each(function() { 
                let thatSpan = $(this);
                let status = false 
                let id = $(thatSpan).attr('id')
                // console.log(id, `${data.secId}4`)
                if(data.betType === "LAY" && id === `${data.secId}4`){
                    // thatSpan = $(`#${data.secId}4`)
                    status = true
                }else if(data.betType === "BACK" && id === `${data.secId}1`) {
                    status = true
                }
                if(status){
                    $(thatSpan).parents('tr').next().find('.my-exc-inn-colaps-txt-dv').addClass('open');
                    let beton = $(thatSpan).closest("tr").find("td:first-child").text();
                    let secondPTag = $(thatSpan).closest("tr").next().find(".beton");
                    let numSpan = $(thatSpan).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                    let secId = $(thatSpan).attr('id')
                    let secId2;
                    if($(thatSpan).hasClass('match_odd_Blue')){
                        secId2 = secId.slice(0,-1) + '1'
                    }else{
                        secId2 = secId.slice(0,-1) + '4'
                    }
                    secondPTag.text(`Bet on :${beton}@${data.odds}`).attr("id", `${secId2}1`);;
                    numSpan.text(data.odds);
                    // console.log(thatSpan, $(thatSpan).hasClass('tbl-bg-blu-spn'))
                    if($(thatSpan).hasClass('tbl-bg-blu-spn')){
                        $(thatSpan).closest("tr").next().removeClass('lay-inplaymatch')
                        $(thatSpan).closest("tr").next().addClass('back-inplaymatch')
                    }else{
                        $(thatSpan).closest("tr").next().removeClass('back-inplaymatch')
                        $(thatSpan).closest("tr").next().addClass('lay-inplaymatch')
                    }
                    $(thatSpan).closest("tr").next().find(".set-stake-form-input2").val(parseFloat(data.stake.toFixed(2)))
                    var result = (parseFloat(data.stake) * parseFloat(data.odds)) - parseFloat(data.stake);
                    $(thatSpan)
                          .closest("tr")
                          .next()
                          .find(".c-gren")
                          .text(result.toFixed(2));
                }
            })
            // console.log(data)   
            // let thatSpan
            // if(data.betType === "LAY"){
            //     thatSpan = $(`#${data.secId}4`)
            // }else{
            //     thatSpan = $(`#${data.secId}1`)
            // }
            // console.log(thatSpan, thatSpan.length, "thatSpanthatSpan")
            // $(".my-exc-inn-colaps-txt-dv").removeClass("open");
            // $(thatSpan).parents('tr').next().find('.my-exc-inn-colaps-txt-dv').addClass('open');
            // let beton = $(thatSpan).closest("tr").find("td:first-child").text();
            // let secondPTag = $(thatSpan).closest("tr").next().find(".beton");
            // let numSpan = $(thatSpan).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
            // let secId = $(thatSpan).attr('id')
            // let secId2;
            // if($(thatSpan).hasClass('match_odd_Blue')){
            //     secId2 = secId.slice(0,-1) + '1'
            // }else{
            //     secId2 = secId.slice(0,-1) + '4'
            // }
            // secondPTag.text(`Bet on :${beton}@${data.odds}`).attr("id", `${secId2}1`);;
            // numSpan.text(data.odds);
            // console.log(thatSpan, $(thatSpan).hasClass('tbl-bg-blu-spn'))
            // if($(thatSpan).hasClass('tbl-bg-blu-spn')){
            //     $(thatSpan).closest("tr").next().removeClass('lay-inplaymatch')
            //     $(thatSpan).closest("tr").next().addClass('back-inplaymatch')
            // }else{
            //     $(thatSpan).closest("tr").next().removeClass('back-inplaymatch')
            //     $(thatSpan).closest("tr").next().addClass('lay-inplaymatch')
            // }
            // $(thatSpan).closest("tr").next().find(".set-stake-form-input2").val(parseFloat(data.stake.toFixed(2)))
            // var result = (parseFloat(data.stake) * parseFloat(data.odds)) - parseFloat(data.stake);
            // $(thatSpan)
            //       .closest("tr")
            //       .next()
            //       .find(".c-gren")
            //       .text(result.toFixed(2));
        })

        function marketLimitId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".market-limit").each(function() {
                    if (!ids.includes(this.id)) {
                        ids.push(this.id);
                    }
                });
                // console.log(ids)
                socket.emit("marketLimitId", ids)
              });
        }
        marketLimitId()


        function marketNotificationId(){
            $(document).ready(function() {
            var marketIds = [];

            $('.marketNotification').each(function(){
                if(!marketIds.includes(this.id)){
                    marketIds.push(this.id)
                }
            })
            socket.emit("marketnotificationId", marketIds)
            setTimeout(()=>{
                marketNotificationId()
              }, 1000 * 60)
        });
        }
        marketNotificationId()

        socket.on('marketnotificationId', async(data) => {
            data.forEach(item => {
                $('.marketNotification').each(function(){
                    if(this.id == item.marketId){
                        // console.log("WORKING")
                        $(this).html(`<marquee>${item.message}</marquee>`)
                    }
                })
            })
        })




        socket.on('marketLimitId', data => {
            // console.log(data, 'returnData')
            $('.market-limit').each(function(){
                let limitData = data.find(item => item.type == this.id)
                if(limitData){
                    this.innerHTML = `<b>Min : ${limitData.min_stake}, Max : ${limitData.max_stake}</b>`
                }
            })
        })



        function showLoader() {
            document.getElementById("loader-overlay").style.display = "flex";
          }
          
          function hideLoader() {
            document.getElementById("loader-overlay").style.display = "none";
          }


        let id = search.split('=')[1]
        function eventID(){
            socket.emit("eventId", id)
            setTimeout(()=>{
                eventID()
              }, 500)

        }
        eventID()
        socket.on("eventId", async(data)=>{
            if(data != ""){
                let score = JSON.parse(data)
                let element = document.getElementsByClassName("score")
                for(let i = 0; i < element.length; i++){
                    element[i].innerHTML = score[0].data
                }
                // document.getElementById("score").innerHTML = score[0].data
            }
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".market").each(function() {
                  ids.push(this.id);
                });
                let eventId = search.split('=')[1]
                socket.emit("marketId", {ids, eventId})
              });
              setTimeout(()=>{
                marketId()
              }, 5000)
        }
        marketId()

        let first = true
        socket.on("marketId", async(data) => {
            // console.log("working")
            $(".match_odd_Blue").each(function() {
                    
                let id = this.id

                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}1` ){
                    if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      $(this).addClass('lock-span')
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data2, "data2data2data2data2")
                            if(data1 != section.backPrice1 || data2 != section.backSize1){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                        }else{

                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            if(data1 != section.backPrice2 || data2 !=  section.backSize2){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.backPrice3 || data2 != section.backSize3){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                    }
                }
            })


            $(".match_odd_Red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                let marketId = this.closest('table').id
                let check = data.resumeSuspendMarkets.some(item => item.marketId == marketId)
                let parentElement = this.parentNode
                if(this.id == `${section.selectionId}4` ){
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                        </span>`
                        this.removeAttribute("data-bs-toggle");
                        parentElement.classList.add("suspended");
                        $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else if(check){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.layPrice1 || data2 != section.laySize1){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.layPrice2 || data2 != section.laySize2){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if (this.id == `${section.selectionId}6`){
                    // console.log(data)
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                        </span>`
                        this.removeAttribute("data-bs-toggle");
                        parentElement.classList.add("suspended");
                        $(this).parent().find(".match-status-message").text("Suspended")
                    }
                   else if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                    //     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                    //     <i class="fa-solid fa-lock"></i>
                    //   </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else if(check){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                  
                    }
                    else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.layPrice3 || data2 != section.laySize3){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }
            })



            $(".winner_Blue").each(function() {
                    
                let id = this.id

                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}1` ){
                    if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            if(data1 != section.backPrice1 || data2 != section.backSize1){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                        }else{

                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            if(data1 != section.backPrice2 || data2 != section.backSize2){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.backPrice3 || data2 != section.backSize3){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                    }
                }
            })



            $(".winner_Red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                let marketId = this.closest('table').id
                let check = data.resumeSuspendMarkets.some(item => item.marketId == marketId)
                // console.log(check,data.status ,"checkcheckcheckcheck")
                let parentElement = this.parentNode
                if(this.id == `${section.selectionId}4` ){
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                        </span>`
                        this.removeAttribute("data-bs-toggle");
                        parentElement.classList.add("suspended");
                        $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else if(check){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.layPrice1 || data2 != section.laySize1){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.layPrice2 || data2 != section.laySize2){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }
                else if (this.id == `${section.selectionId}6`){
                    // console.log(data)
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                        </span>`
                        this.removeAttribute("data-bs-toggle");
                        parentElement.classList.add("suspended");
                        $(this).parent().find(".match-status-message").text("Suspended")
                    }
                   else if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                    //     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                    //     <i class="fa-solid fa-lock"></i>
                    //   </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else if(check){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                  
                    }
                    else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                             let data2 = htmldiv.find('span:first').next().text().trim()
                            // console.log(data1)
                            if(data1 != section.layPrice3 || data2 != section.laySize3){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }
            })
            // $(".tied_match_Blue").each(function() {
                    
            //     let id = this.id
            //     id = id.slice(0, -1);
            //     let section = null;
            //     console.log(data.finalResult)
            //     data.finalResult.items.some(item => {
            //         if(item && item.odds){
            //             console.log(item, 4564654654)
            //             section = item.odds.find(odd => odd.selectionId == id);
            //             return section !== undefined;
            //         }
            //     });
            //     console.log(section)
            //     if(this.id == `${section.selectionId}1` ){
            //         if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
            //             // this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
            //             this.innerHTML = `<span><b>${section.backPrice1}</b></span> 
            //                             <span>${section.backSize1}</span>`
            //         }
            //     }else if(this.id == `${section.selectionId}2`){
            //         if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
            //             // this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
            //             this.innerHTML = `<span><b>${section.backPrice2}</b></span> 
            //             <span>${section.backSize2}</span>`
            //         }
            //     }else if (this.id == `${section.selectionId}3`){
            //         if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
            //             // this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
            //             this.innerHTML = `<span><b>${section.backPrice3}</b></span> 
            //             <span>${section.backSize3}</span>`
            //         }
            //     }
            // })


            // $(".tied_match_Red").each(function() {
                    
            //     let id = this.id
            //     id = id.slice(0, -1);
            //     let section = null;
            //     data.finalResult.items.some(item => {
            //         if(item && item.odds){
            //         section = item.odds.find(odd => odd.selectionId == id);
            //         return section !== undefined;
            //         }
            //     });
            //     if(this.id == `${section.selectionId}4` ){
            //         if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice1}</b></span> 
            //                                 <span>${section.laySize1}</span>`
            //         }
            //     }else if(this.id == `${section.selectionId}5`){
            //         if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice2}</b></span> 
            //                             <span>${section.laySize2}</span>`
            //         }
            //     }else if (this.id == `${section.selectionId}6`){
            //         if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice3}</b></span> 
            //                             <span>${section.laySize3}</span>`
            //         }
            //     }
            // })
            $(".bookmaker_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                let item = data.finalResult.items.some(item => {
                    if(item){
                        // console.log(id)
                        if(item.runners){
                            // console.log(item)
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                if(this.id == `${section.secId}1` ){
                    if( section.back == "-" || section.back == "1,000.00" || section.back == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        // this.innerHTML = `<span><b>${section.layPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.back}</b></span> <span> ${section.backSize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                    }
                }
            })

            $(".bookmaker_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                let sectionData 
                data.finalResult.items.some(item => {
                    if(item){
                        sectionData = item
                        if(item.runners){
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                let parentElement = this.parentNode
                let marketId = this.closest('table').id
                let check = data.resumeSuspendMarkets.some(item => item.marketId == marketId)
                // console.log(parentElement)
                if(this.id == `${section.secId}2` ){
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                        parentElement.classList.add("suspended");
                        $(this).parent().find(".match-status-message").text("Suspended")
                    }else if( section.lay == "-" || section.lay == "1,000.00" || section.lay == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      if( section.back == "-" || section.back == "1,000.00" || section.back == "0"){
                          parentElement.classList.add("suspended");
                          $(this).parent().find(".match-status-message").text("Suspended")
                      }
                    }else if(sectionData.win_result != 'undefined' && sectionData.win_result != " " && sectionData.win_result != ""){
                        this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text('Result Declared')
                    }else if(check){
                        parentElement.classList.add("suspended");
                          $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else{
                        this.setAttribute("data-bs-toggle", "collapse");
                            parentElement.classList.remove("suspended")
                            $(this).parent().find(".match-status-message").text("")
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.lay}</b></span> <span> ${section.laySize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                        // this.innerHTML = `<b>${section.layPrice}</b> <br> ${section.laySize}`
                    }
                    if( !(section.back == "-" || section.back == "1,000.00" || section.back == "0") && data.status){
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                    }
                   
                }
            })

            $(".odd_even_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                if(this.id == `${section.market_id}1` ){
                    if( section.odd == "-" || section.odd == "1,000.00" || section.odd == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        let x = ((section.odd * 100) - 100).toFixed(2)
                        this.innerHTML = `<span><b>1</b></span> <span> ${x}</span>` 
                    }
                }
            })

            $(".odd_even_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                let parentElement = this.parentNode
                if(this.id == `${section.market_id}2` ){
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else if (data.forFancy  && data.forFancy.length > 0){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if(section.ball_running){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Ball Running")
                    }else if(section.win_result != 'undefined' && section.win_result != " " && section.win_result != ""){
                        this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text('Result Declared')
                    }else if(section.suspended){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if( section.even == "-" || section.even == "1,000.00" || section.even == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        $(this).parent().find(".match-status-message").text("")
                        parentElement.classList.remove("suspended")
                        let x = ((section.even * 100) - 100).toFixed(2)
                        this.innerHTML = `<span><b>1</b></span> <span> ${x}</span>` 
                    }
                }
            });

            $(".only_over_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                if(this.id == `${section.market_id}1` ){
                    if( section.yes == "-" || section.yes == "1,000.00" || section.yes == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        // this.innerHTML = `<span><b>${section.yes}</b></span>` 
                        let x = (parseFloat(section.yes_rate) + 100)/100
                        // this.innerHTML = `<span><b>${x}</b></span> <span> ${section.yes}</span>`
                        this.innerHTML = `<span><b>${section.yes}</b></span> <span> ${section.yes_rate}</span>`
                    }
                }
            });


            $(".only_over_red").each(function() {
                    // console.log(data.forFancy, "data.forFancydata.forFancydata.forFancy")
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                let parentElement = this.parentNode
                // console.log(section.ball_running)
                if(this.id == `${section.market_id}2` ){
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else if (data.forFancy && data.forFancy.length > 0){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if(section.ball_running){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Ball Running")
                    }else if(section.win_result != 'undefined' && section.win_result != " " && section.win_result != ""){
                        this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text('Result Declared')
                    }else if(section.suspended){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else if( section.no == "-" || section.no == "1,000.00" || section.no == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        $(this).parent().find(".match-status-message").text("")
                        parentElement.classList.remove("suspended")
                        let x = (parseFloat(section.no_rate) + 100)/100
                        // this.innerHTML = `<span><b>${x}</b></span> <span> ${section.no}</span>`
                        this.innerHTML = `<span><b>${section.no}</b></span> <span> ${section.no_rate}</span>`
                        // this.innerHTML = `<span><b>${section.no}</b></span>` 
                    }
                }
            });

            first = false
            const spanElement2 = document.querySelectorAll('.button');
                setTimeout(() => {
                    spanElement2.forEach(spanElement => {
                        if(spanElement.style){
                            spanElement.style.backgroundColor = '';
                        }// Remove background color
                      });
                    
                },300)
        })

        // const buttons = document.querySelectorAll(".button");
        // buttons.forEach((button) => {
        //   button.addEventListener("click", (event) => {
        //     const clickedButton = event.target;
        //     const firstChildValue = clickedButton.firstElementChild.innerText;
        //     const numSpan = document.querySelector(".nww-bet-slip-wrp-col1-txt-num");
        //     numSpan.innerText = firstChildValue;
        //   });
        // });
      
        // jQuery approach
        let clickTime
        $(document).ready(function () {
            $(".button").click(function () {
                clickTime = Date.now()
                const urlParams = new URLSearchParams(window.location.search);

                let marketId = $(this).closest("table").attr("id");
                if(!marketId){
                    marketId = $(this).closest("tr").prev().find('.market').attr('id')
                }
                let eventId = urlParams.get('id');
                socket.emit('checkDelay', {eventId, marketId})
            if(this.classList.contains('match_odd_Blue') || this.classList.contains('match_odd_Red')){
                let odds = $(this).children("span:first-child").attr('data-id');
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let secondPTag2 = $(this).closest("tr").next().find(".selection-name");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                let secId2;
                if($(this).hasClass('match_odd_Blue')){
                  secId2 = secId.slice(0,-1) + '1'
                  }else{
                  secId2 = secId.slice(0,-1) + '4'
                  }
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId2}1`);;
                secondPTag2.text(`Bet on :${beton}@${odds}`).attr("id", `${secId2}1`);;
                numSpan.text(odds);

                if($(this).hasClass('tbl-bg-blu-spn')){
                    $(this).closest("tr").next().removeClass('lay-inplaymatch')
                    $(this).closest("tr").next().addClass('back-inplaymatch')
                }else{
                    $(this).closest("tr").next().removeClass('back-inplaymatch')
                    $(this).closest("tr").next().addClass('lay-inplaymatch')
                }

            }else if(this.classList.contains('bookmaker_blue') || this.classList.contains('bookmaker_red')){
                let odds = $(this).children("span:first-child").text();
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let secondPTag2 = $(this).closest("tr").next().find(".selection-name");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
                secondPTag2.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
                numSpan.text(odds);

                if($(this).hasClass('tbl-bg-blu-spn')){
                    $(this).closest("tr").next().removeClass('lay-inplaymatch')
                    $(this).closest("tr").next().addClass('back-inplaymatch')
                }else{
                    $(this).closest("tr").next().removeClass('back-inplaymatch')
                    $(this).closest("tr").next().addClass('lay-inplaymatch')
                }
            }else if(this.classList.contains('winner_Blue') || this.classList.contains('winner_Red')){
                let odds = $(this).children("span:first-child").attr('data-id');
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag2 = $(this).closest("tr").next().find(".selection-name");
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                let secId2;
                if($(this).hasClass('winner_Blue')){
                  secId2 = secId.slice(0,-1) + '1'
                  }else{
                  secId2 = secId.slice(0,-1) + '4'
                  }
                secondPTag2.text(`Bet on :${beton}@${odds}`).attr("id", `${secId2}1`);;
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId2}1`);;
                numSpan.text(odds);

                if($(this).hasClass('tbl-bg-blu-spn')){
                    $(this).closest("tr").next().removeClass('lay-inplaymatch')
                    $(this).closest("tr").next().addClass('back-inplaymatch')
                }else{
                    $(this).closest("tr").next().removeClass('back-inplaymatch')
                    $(this).closest("tr").next().addClass('lay-inplaymatch')
                }
            }else{
                let odds = $(this).children("span").eq(1).text();
                let textToshow = $(this).children("span").eq(0).text();
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let secondPTag2 = $(this).closest("tr").next().find(".selection-name");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);
                secondPTag2.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);
                numSpan.text(textToshow);

                if($(this).hasClass('tbl-bg-blu-spn')){
                    $(this).closest("tr").next().removeClass('lay-inplaymatch')
                    $(this).closest("tr").next().addClass('back-inplaymatch')
                }else{
                    $(this).closest("tr").next().removeClass('back-inplaymatch')
                    $(this).closest("tr").next().addClass('lay-inplaymatch')
                }
            }
            });
          });

          function marketplusminus ( data ){
            // console.log(data)
            let table = data.element.closest('table')
            let check = table.find('tr').length
            // console.log(check, "CHECK")
            if(check < 8){
                if(table.hasClass("market")){
                    let trLength = table.find("tr:eq(1)").find('td').length
                    // console.log(trLength, "staleDiffstaleDiffstaleDiff")
                    if(trLength === 4 || trLength === 8){
                        if(data.status){
                            // console.log(data.plusMinus, "newvaluenewvaluenewvalue")
                            let beforevalue  = data.element.closest('tr').prev().find('td:eq(1)').find('span').text()
                            let newvale = (beforevalue * 1) - (data.result * 1) - (data.plusMinus * 1)
                            data.element.closest('tr').prev().find('td:eq(1)').find('span').text(newvale.toFixed(2))
                            data.element.closest('table').find('tr:eq(1), tr:eq(3), tr:eq(5)').each(function(){
                                let oldValue = $(this).find('td:eq(1)').find('span').text()
                                let newvalue = (oldValue * 1) + (data.result * 1)
                                // console.log(newvalue , "newvaluenewvaluenewvalue")
                                $(this).find('td:eq(1)').find('span').text(newvalue.toFixed(2))
                                if(newvalue > 0){
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-gren');
                                }else{
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-reed');
                                }
                            })
                        }else{
                            let beforevalue  = data.element.closest('tr').prev().find('td:eq(1)').find('span').text()
                            let newvale = (beforevalue * 1) + (data.result * 1) + (data.NewStake * 1)
                            data.element.closest('tr').prev().find('td:eq(1)').find('span').text(newvale.toFixed(2))
                            data.element.closest('table').find('tr:eq(1), tr:eq(3), tr:eq(5)').each(function(){
                                let oldValue = $(this).find('td:eq(1)').find('span').text()
                                let newvalue = (oldValue * 1) - (data.NewStake * 1)
                                $(this).find('td:eq(1)').find('span').text(newvalue.toFixed(2))
                                // console.log(newvalue)
                                if(newvalue > 0){
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-gren');
                                }else{
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-reed');
                                }
                            })
                        }
                    }else{
                        table.find('th:eq(0)').after('<th></th>')
                        if(data.status){
                            // let thathtml = ''
                            if((data.plusMinus * -1) > 0){
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.plusMinus * -1).toFixed(2)}</span>`);
                            }else{
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.plusMinus * -1).toFixed(2)}</span>`);
                            }
                            if((data.result * 1) > 0){
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.result * 1).toFixed(2)}</span>`);
                            }else{
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.result * 1).toFixed(2)}</span>`);
                            }
                            data.element.closest('tr').prev().find("td:eq(0)").after(newTd)
                            table.find('tr:eq(1), tr:eq(3), tr:eq(5)').each(function () {
                                var firstTd = $(this).find('td:first-child');
                            
                                if (firstTd.length === 1 && (firstTd.siblings().length === 6 || firstTd.siblings().length === 2)) {
                                    // console.log('Working:', firstTd);
                                    firstTd.after(newTd2.clone()); 
                                }
                            });
                            table.find('tr:eq(2), tr:eq(4), tr:eq(6)').each(function () {
                                $(this).find('td:eq(0)').attr('colspan', 9)
                            })
                        }else{
                            if((data.result * 1) > 0){
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.result * 1).toFixed(2)}</span>`);
                            }else{
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.result * 1).toFixed(2)}</span>`);
                            }
                            if((data.NewStake * -1) > 0){
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.NewStake * -1).toFixed(2)}</span>`);
                            }else{
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.NewStake * -1).toFixed(2)}</span>`);
                            }
                            data.element.closest('tr').prev().find("td:eq(0)").after(newTd)
                            table.find('tr:eq(1), tr:eq(3), tr:eq(5)').each(function () {
                                var firstTd = $(this).find('td:first-child');
                            // console.log(firstTd.siblings().length, "firstTd.siblings().lengthfirstTd.siblings().lengthfirstTd.siblings().length")
                                if (firstTd.length === 1 && (firstTd.siblings().length === 6 || firstTd.siblings().length === 2)) {
                                    // console.log('Working:', firstTd);
                                    firstTd.after(newTd2.clone()); 
                                }
                            });
                            table.find('tr:eq(2), tr:eq(4), tr:eq(6)').each(function () {
                                $(this).find('td:eq(0)').attr('colspan', 9)
                            })
                        }
                    }
                }
            }else{
                if(table.hasClass("market")){
                    let trLength = table.find("tr:eq(1)").find('td').length
                    if(trLength === 4 || trLength === 8){ 
                        if(data.status){
                            let beforevalue  = data.element.closest('tr').prev().find('td:eq(1)').find('span').text()
                            let newvale = (beforevalue * 1) - (data.result * 1) - (data.plusMinus * 1)
                            data.element.closest('tr').prev().find('td:eq(1)').find('span').text(newvale.toFixed(2))
                            for (var i = 1; i < check; i += 2) {
                                var selector = 'tr:eq(' + i + ')';
                                table.find(selector).each(function () {
                                    let oldValue = $(this).find('td:eq(1)').find('span').text()
                                    let newvalue = (oldValue * 1) + (data.result * 1)
                                    $(this).find('td:eq(1)').find('span').text(newvalue.toFixed(2))
                                    if(newvalue > 0){
                                        $(this).find('td:eq(1)').find('span').attr('class', 'c-gren');
                                    }else{
                                        $(this).find('td:eq(1)').find('span').attr('class', 'c-reed');
                                    }
                                })
                            }
                        }else{
                            let beforevalue  = data.element.closest('tr').prev().find('td:eq(1)').find('span').text()
                            let newvale = (beforevalue * 1) + (data.result * 1) + (data.NewStake * 1)
                            data.element.closest('tr').prev().find('td:eq(1)').find('span').text(newvale.toFixed(2))
                            for (var i = 1; i < check; i += 2) {
                                var selector = 'tr:eq(' + i + ')';
                                table.find(selector).each(function () {
                                    let oldValue = $(this).find('td:eq(1)').find('span').text()
                                    let newvalue = (oldValue * 1) - (data.NewStake * 1)
                                    $(this).find('td:eq(1)').find('span').text(newvalue.toFixed(2))
                                    if(newvalue > 0){
                                        $(this).find('td:eq(1)').find('span').attr('class', 'c-gren');
                                    }else{
                                        $(this).find('td:eq(1)').find('span').attr('class', 'c-reed');
                                    }
                                })
                            }

                        }
                    }else{
                        table.find('th:eq(0)').after('<th></th>')
                        if(data.status){
                            if((data.plusMinus * -1) > 0){
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.plusMinus * -1).toFixed(2)}</span>`);
                            }else{
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.plusMinus * -1).toFixed(2)}</span>`);
                            }
                            if((data.result * 1) > 0){
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.result * 1).toFixed(2)}</span>`);
                            }else{
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.result * 1).toFixed(2)}</span>`);
                            }
                            data.element.closest('tr').prev().find("td:eq(0)").after(newTd)
                            for (var i = 1; i < check; i += 2) {
                                var selector = 'tr:eq(' + i + ')';
                                
                                // Use your existing logic
                                table.find(selector).each(function () {
                                    var firstTd = $(this).find('td:first-child');
                                    
                                    if (firstTd.length === 1 && (firstTd.siblings().length === 6 || firstTd.siblings().length === 2)) {
                                        firstTd.after(newTd2.clone());
                                    }
                                });
                            }
                            for (var i = 2; i < check; i += 2) {
                                var selector = 'tr:eq(' + i + ')';
                                table.find(selector).each(function () {
                                    $(this).find('td:eq(0)').attr('colspan', 9);
                                });
                            }
                        }else{
                            if((data.result * 1) > 0){
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.result * 1).toFixed(2)}</span>`);
                            }else{
                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.result * 1).toFixed(2)}</span>`);
                            }
                            if((data.NewStake * -1) > 0){
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(data.NewStake * -1).toFixed(2)}</span>`);
                            }else{
                                var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(data.NewStake * -1).toFixed(2)}</span>`);
                            }
                            data.element.closest('tr').prev().find("td:eq(0)").after(newTd)
                            for (var i = 1; i < check; i += 2) {
                                var selector = 'tr:eq(' + i + ')';
                                table.find(selector).each(function () {
                                    var firstTd = $(this).find('td:first-child');
                                    
                                    if (firstTd.length === 1 && (firstTd.siblings().length === 6 || firstTd.siblings().length === 2)) {
                                        firstTd.after(newTd2.clone());
                                    }
                                });
                            }
                            
                            for (var i = 2; i < check; i += 2) {
                                var selector = 'tr:eq(' + i + ')';
                                table.find(selector).each(function () {
                                    $(this).find('td:eq(0)').attr('colspan', 9);
                                });
                            }
                        }
                    }
                }
            }
          }

          function marketIdbookDetails( status ){
            let eventId = search.split('=')[1]
            socket.emit("marketIdbookDetails", {LOGINDATA, eventId, status})
    }
    
    marketIdbookDetails( false )
    fencyDetails( false )
          
    
    function Onlyminus ( data ){
            console.log(data)
            if(data.check == 0){
                marketIdbookDetails( false )
            }else{
                let table = data.element.closest('table')
                if(table.hasClass("market")){
                    let trLength = table.find("tr:eq(1)").find('td').length
                    if(trLength === 4 || trLength === 8){
                        if(data.status){
                            // console.log(data.plusMinus, "newvaluenewvaluenewvalue")
                            let beforevalue  = data.element.closest('tr').prev().find('td:eq(1)').find('span').text()
                            // console.log(beforevalue)
                            let newvale = (beforevalue * 1) + (data.result * 1) + (data.plusMinus * 1)
                            // console.log(newvale)
                            data.element.closest('tr').prev().find('td:eq(1)').find('span').text(newvale.toFixed(2))
                            data.element.closest('table').find('tr:eq(1), tr:eq(3), tr:eq(5)').each(function(){
                                let oldValue = $(this).find('td:eq(1)').find('span').text()
                                // console.log(oldValue)
                                let newvalue = (oldValue * 1) - (data.result * 1)
                                $(this).find('td:eq(1)').find('span').text(newvalue)
                                if(newvalue > 0){
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-gren');
                                }else{
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-reed');
                                }
                            })
                        }else{
                            let beforevalue  = data.element.closest('tr').prev().find('td:eq(1)').find('span').text()
                            let newvale = (beforevalue * 1) - (data.result * 1) - (data.NewStake * 1)
                            data.element.closest('tr').prev().find('td:eq(1)').find('span').text(newvale.toFixed(2))
                            data.element.closest('table').find('tr:eq(1), tr:eq(3), tr:eq(5)').each(function(){
                                let oldValue = $(this).find('td:eq(1)').find('span').text()
                                let newvalue = (oldValue * 1) + (data.NewStake * 1)
                                $(this).find('td:eq(1)').find('span').text(newvalue.toFixed(2))
                                // console.log(newvalue)
                                if(newvalue > 0){
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-gren');
                                }else{
                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-reed');
                                }
                            })
                        }
                    }
                }
            }
          }



          $(document).ready(function () {
            $(".nww-bet-slip-wrp-col2-inn span").click(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
                // console.log(IdButton, "IdButtonIdButtonIdButton")
                let diff
                let element = $(this)
                let diffStake 
                let plusMinus
            if($(this).closest('tr').hasClass('back-inplaymatch')){
                if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass("winner_Blue")){
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                        newStake = parseFloat(spanId) + parseFloat(OldStake) 
                    }
                    diffStake = parseFloat(spanId)
                    // console.log(diffStake, "diffStakediffStakediffStake")
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = (parseFloat(newStake) * betValue) - parseFloat(newStake);
                    diff = (parseFloat(diffStake) * betValue) - parseFloat(diffStake);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                  let statusCHECK12 = true
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                        statusCHECK12 = false
                        let oldValue = $(this).closest("tr").find(".set-stake-form-input2").val()
                        if(oldValue > diffStake){
                            staleDiff = parseFloat(oldValue) - parseFloat(diffStake)
                            resultDiff = (staleDiff * betValue) - staleDiff;
                            let data = {
                                result : resultDiff,
                                element,
                                status:false,
                                NewStake : staleDiff,
                                check : spanId
                            }
                            Onlyminus(data)
                        }else{
                            staleDiff = parseFloat(diffStake) - parseFloat(oldValue)
                            diff = (staleDiff * betValue) - staleDiff;
                            let data = {
                                result : diff,
                                element,
                                status:false,
                                NewStake : staleDiff
                            }
                            marketplusminus(data)
                        }
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 = (parseFloat(spanId) * betValue) - parseFloat(spanId)
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                    if(statusCHECK12){
                        let data = {
                            result : diff,
                            element,
                            status:false,
                            NewStake : diffStake
                        }
                        marketplusminus(data)
                    }
                }else{
                    // console.log(IdButton)
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                      newStake = parseFloat(spanId) + parseFloat(OldStake)
                    }
                    diffStake = parseFloat(spanId)
                    var escapedId = buttonId.replace(/\./g, '\\.');
                    let IdButton = $(this).closest("tr").prev().find(`#${escapedId}`)
                    // console.log(IdButton, escapedId)
                    var betValue
                    if(IdButton.hasClass('only_over_blue')|| IdButton.hasClass('odd_even_blue')){
                        betValue = parseFloat(
                            $(this).closest("tr").find(".selection-name").text().split('@')[1]
                          );
                    }else{
                         betValue = parseFloat(
                          $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                        );
                    }
                    // console.log(betValue)
                    var result = ((parseFloat(newStake) * betValue) / 100);
                    diff = ((parseFloat(diffStake) * betValue) / 100);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                  let statusCHECK12 = true
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                        statusCHECK12 = false
                        let oldValue = $(this).closest("tr").find(".set-stake-form-input2").val()
                        if(oldValue > diffStake){
                            staleDiff = parseFloat(oldValue) - parseFloat(diffStake)
                            resultDiff = (staleDiff * betValue) / 100
                            let data = {
                                result : resultDiff,
                                element,
                                status:false,
                                NewStake : staleDiff,
                                check : spanId
                            }
                            Onlyminus(data)
                        }else{
                            staleDiff = parseFloat(diffStake) - parseFloat(oldValue)
                            diff = (staleDiff * betValue) / 100
                            let data = {
                                result : diff,
                                element,
                                status:false,
                                NewStake : staleDiff
                            }
                            marketplusminus(data)
                        }
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 = ((parseFloat(spanId) * betValue) / 100)
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                    if(statusCHECK12){
                        let data = {
                            result : diff,
                            element,
                            status:false,
                            NewStake : diffStake
                        }
                        marketplusminus(data)
                    }
                }
            }else{
                if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass("winner_Red")){
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                      newStake = parseFloat(spanId) + parseFloat(OldStake)
                    }
                    diffStake = parseFloat(spanId)
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = (parseFloat(newStake) * 2) - parseFloat(newStake);
                    diff = parseFloat(spanId)
                    plusMinus = (diff * betValue) - diff;
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))\
                  let statusCHECK12 = true
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                        statusCHECK12 = false
                        let oldValue = $(this).closest("tr").find(".set-stake-form-input2").val()
                        if(oldValue > diffStake){
                            staleDiff = parseFloat(oldValue) - parseFloat(diffStake)
                            resultDiff = staleDiff;
                            plusMinus = (staleDiff * betValue) - staleDiff;
                            let data = {
                                result:resultDiff,
                                element,
                                status:true,
                                NewStake : staleDiff,
                                plusMinus,
                                check:spanId
                            }
                            Onlyminus(data)
                        }else{
                            staleDiff = parseFloat(diffStake) - parseFloat(oldValue)
                            diff = staleDiff
                            plusMinus = (staleDiff * betValue) - staleDiff;
                            let data = {
                                result : diff ,
                                element,
                                status:true,
                                NewStake : staleDiff,
                                plusMinus
                            }
                            marketplusminus(data)
                        }
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 = (parseFloat(spanId) * 2) - parseFloat(spanId)
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                    if(statusCHECK12){
                        let data = {
                            result : diff ,
                            element,
                            status:true,
                            NewStake : diffStake,
                            plusMinus
                        }
                        marketplusminus(data)
                    }
                }else{
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                      newStake = parseFloat(spanId) + parseFloat(OldStake)
                    }
                    diffStake = parseFloat(spanId)
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    let result = parseFloat(newStake)
                    diff = parseFloat(spanId)
                    if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                        plusMinus = (diffStake * betValue) / 100
                    }else{
                        plusMinus = (diffStake * betValue) / 100
                    }
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                  let statusCHECK12 = true
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                        statusCHECK12 = false
                        let oldValue = $(this).closest("tr").find(".set-stake-form-input2").val()
                        // console.log(diffStake, oldValue, oldValue > diffStake)
                        if(oldValue > diffStake){
                            staleDiff = parseFloat(oldValue) - parseFloat(diffStake)
                            resultDiff = staleDiff;
                            plusMinus = (staleDiff * betValue) / 100
                            let data = {
                                result:resultDiff,
                                element,
                                status:true,
                                NewStake : staleDiff,
                                plusMinus,
                                check:spanId
                            }
                            // console.log(data)
                            Onlyminus(data)
                        }else{
                            staleDiff = parseFloat(diffStake) - parseFloat(oldValue)
                            // console.log(staleDiff, "staleDiffstaleDiff")
                            diff = staleDiff

                            plusMinus = (staleDiff * betValue) / 100
                            // console.log(plusMinus, "plusMinusplusMinusplusMinus")
                            let data = {
                                result : diff ,
                                element,
                                status:true,
                                NewStake : staleDiff,
                                plusMinus
                            }
                            // console.log(data)
                            marketplusminus(data)
                        }
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 = parseFloat(spanId)
                    //   if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                    //     result2 = (parseFloat(spanId) * 2) - parseFloat(spanId)
                    //   }else{
                    //     result2 = ((parseFloat(spanId) * betValue)/100).toFixed(2)
                    //   }
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                    let data = {
                        result : diff ,
                        element,
                        status:true,
                        NewStake : diffStake,
                        plusMinus
                    }
                    marketplusminus(data)
                }
            }
            });
          });

          $(document).ready(function () {
            $(".set-stake-form-input2").change(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    var spanId = $(this).val()
                    var betValue = parseFloat(
                        $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                      );
                      var result 
                      if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass('winner_Blue')){
                        result = (parseFloat(spanId) * betValue) - parseFloat(spanId);
                      }else{
                        result = (parseFloat(spanId) * betValue) / 100
                      }
                      $(this)
                      .closest("tr")
                      .find(".c-gren")
                      .text(result.toFixed(2));
                }else{
                    var spanId = $(this).val()
                    var betValue = parseFloat(
                        $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                      );
                      let result = parseFloat(spanId)
                    //   if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                    //        result = (parseFloat(spanId) * 2) - parseFloat(spanId);
                    //   }else{
                    //         result = (parseFloat(spanId) * betValue) / 100
                    //   }
                      $(this)
                      .closest("tr")
                      .find(".c-gren")
                      .text(result.toFixed(2));
                }
            })
          })
        
          $(document).ready(function(){
            $(".minus").click(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
                let spanId =  ($(this).closest("tr").find('.set-stake-form-input2').val())
                let Odds = parseFloat($(this).closest('tr').find(".nww-bet-slip-wrp-col1-txt-num").text())
                let NewStake = spanId - 100;
                let result
                let element = $(this)
                let staleDiff = 100
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass('winner_Blue')){
                        result = (NewStake * Odds) - NewStake;
                        resultDiff = (staleDiff * Odds) - staleDiff;
                    }else{
                        var escapedId = buttonId.replace(/\./g, '\\.');
                        let IdButton = $(this).closest("tr").prev().find(`#${escapedId}`)
                        if(IdButton.hasClass('only_over_blue')|| IdButton.hasClass('odd_even_blue')){
                            Odds = parseFloat(
                                $(this).closest("tr").find(".selection-name").text().split('@')[1]
                              );
                        }
                        result = (NewStake * Odds) / 100
                        resultDiff = (staleDiff * Odds) / 100
                    }
                    let data = {
                        result : resultDiff,
                        element,
                        status:false,
                        NewStake : staleDiff,
                        check : NewStake
                    }
                    Onlyminus(data)
                }else{
                    result = NewStake
                    let resultDiff = 100

                    if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('winner_Blue')){
                        plusMinus = (100 * Odds) - 100;
                         
                    }else{
                        plusMinus = (100 * Odds) / 100
                    }
                    let data = {
                        result:resultDiff,
                        element,
                        status:true,
                        NewStake : 100,
                        plusMinus,
                        check:NewStake
                    }
                    Onlyminus(data)
                    // if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                    //     result = (NewStake * 2) - NewStake;
                    // }else{
                    //     result = (NewStake * Odds) / 100
                    // }
                }
                if(!spanId){
                    $(this).closest("tr").find('.set-stake-form-input2').val(0)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(0);
                }else if(NewStake < 0){
                    $(this).closest("tr").find('.set-stake-form-input2').val(0)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(0);
                }
                else{
                    // console.log("WORKING")
                    $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(result.toFixed(2));
                }
            })
          })


          

          
          $(document).ready(function(){
            $(".plus").click(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
                // console.log(IdButton)
                let spanId =  ($(this).closest("tr").find('.set-stake-form-input2').val())
                let Odds = parseFloat($(this).closest('tr').find(".nww-bet-slip-wrp-col1-txt-num").text())
                // let NewStake = parseFloat(spanId) + 100;
                let NewStake 
                if(spanId){
                    NewStake = parseFloat(spanId) + 100;
                }else{
                    NewStake = 100
                }
                let result
                let element = $(this)
                let plusMinus = 0
                let oldResult = $(this).closest("tr").find('.set-stake-form-input2').val()
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    let diff = 0
                    if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass('winner_Blue')){
                        result = (NewStake * Odds) - NewStake;
                        diff = (100 * Odds) - 100;
                    }else{
                        var escapedId = buttonId.replace(/\./g, '\\.');
                        let IdButton = $(this).closest("tr").prev().find(`#${escapedId}`)
                        if(IdButton.hasClass('only_over_blue')|| IdButton.hasClass('odd_even_blue')){
                            Odds = parseFloat(
                                $(this).closest("tr").find(".selection-name").text().split('@')[1]
                              );
                        }
                        result = (NewStake * Odds) / 100
                        diff = (100 * Odds) / 100
                    }
                    let data = {
                        result : diff,
                        element,
                        status:false,
                        NewStake : 100
                    }
                    marketplusminus(data)
                }else{
                    result = NewStake
                    let diff = 100
                    if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('winner_Blue')){
                        plusMinus = (100 * Odds) - 100;
                         
                    }else{
                        plusMinus = (100 * Odds) / 100
                    }
                    let data = {
                        result : diff ,
                        element,
                        status:true,
                        NewStake : 100,
                        plusMinus
                    }
                    marketplusminus(data)
                }
                // console.log(result)

                if(!spanId){
                    $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(result.toFixed(2));
                }else if(NewStake < 0){
                    $(this).closest("tr").find('.set-stake-form-input2').val(0)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(0);
                }
                else{
                    // console.log("WORKING")
                    $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(result.toFixed(2));
                }
            })
          })
          // Get all the rows with class "acount-stat-tbl-body-tr"
        //   const rows = document.querySelectorAll(".acount-stat-tbl-body-tr");
        
        //   // Iterate over each row and handle the click event
        //   rows.forEach(row => {
        //     handleRowClick(row);
        //   });


        // var buttons = document.querySelectorAll('.button1');
        // let elements = document.getElementsByClassName("betOn");
        // buttons.forEach(function(button) {
        //     button.addEventListener('click', function() {
        //       var parentRow = button.closest('tr');
        //       var teamName = parentRow.querySelector('td:first-child').innerText.trim();
        //       var buttonId = button.id;
        //       var spanInnerText = button.querySelector('span:first-child').innerText.trim();
        //       console.log('Team Name:', teamName);
        //       console.log('Button ID:', buttonId);
        //       console.log(this.id)
        //       console.log('Span Inner Text:', spanInnerText);
        //       elements[0].innerHTML  = `Bet on  :${teamName}@${spanInnerText}`
        //       elements[0].id = parentRow.querySelector('td:first-child').id;
        //       var elements2 = document.getElementsByClassName('oddsvalue');
        //       elements2[0].innerHTML = spanInnerText
        //       elements2[0].id = this.id;
        //     });
        //   });

        // const buttons = document.querySelectorAll('.button1');
        // buttons.forEach(function(button) {
        //     button.addEventListener('click', function() {
        //         const runnerNameElement = this.closest('.table-data').querySelector('.runnerName');
        //         const teamName = runnerNameElement.textContent.trim();
        //         const spanInnerText = this.querySelector('b').textContent.trim();
        //         const marketId = runnerNameElement.getAttribute('id');
        //         var buttonId = button.id;
        //         console.log('Team Name:', teamName);
        //         console.log('Button ID:', buttonId);
        //         console.log(this.id.slice(-1))
        //         console.log('Span Inner Text:', spanInnerText);
        //         let elements = document.getElementsByClassName(`betOn${marketId.slice(-1)}`);
        //         for (let i = 0; i < elements.length; i++) {
        //             elements[i].innerHTML = `Bet on: ${teamName}@${spanInnerText}`;
        //             elements[i].id = marketId.slice(0, -1);
        //           }
        //         var elements2 = document.getElementsByClassName(`oddsvalue${marketId.slice(-1)}`);
        //         for (let i = 0; i < elements2.length; i++) {
        //             elements2[i].innerHTML = spanInnerText
        //             elements2[i].id = this.id;
        //           }
                
                
        //     });
        //   });

        






       // Add a common class to the containers that wrap each section of the HTML


          


        
          


        //   var buttonsforOddEven = document.querySelectorAll('.odd_even button');
        // let elementsforOddEven = document.getElementsByClassName("betOn");
        // buttonsforOddEven.forEach(function(button) {
        //     button.addEventListener('click', function() {
        //       var parentRow = button.closest('tr');
        //       var teamName = parentRow.querySelector('td:first-child').innerText.trim();
        //       var buttonId = button.id;
        //       var spanInnerText = button.querySelector('span:first-child').innerText.trim();
        //       console.log('Team Name:', teamName);
        //       console.log('Button ID:', buttonId);
        //       console.log(this.id)
        //       console.log('Span Inner Text:', spanInnerText);
        //       elementsforOddEven[0].innerHTML  = `Bet on  :${teamName}@${spanInnerText}`
        //       elementsforOddEven[0].id = parentRow.querySelector('td:first-child').id;
        //       var elements2 = document.getElementsByClassName('oddsvalue');
        //       elements2[0].innerHTML = spanInnerText
        //       if(button.id.slice(-1) == 1){
        //         elements2[0].id = "odd_Even_Yes ";
        //       }else if(button.id.slice(-1) == 2){
        //         elements2[0].id = "odd_Even_No ";
        //     }
        //     });
        //   });

            // var spans = document.querySelectorAll('.exc-pg-rit-tabtxt-data-stack-num-col span');
            // var stakeSpan = document.querySelector('#stakeSpan'); 
            // var resultElement = document.querySelector('.c-gren');
            // spans.forEach(function(span) {
            // span.addEventListener('click', function() {
            //     var spanInnerText = span.innerText.trim();
            //     var currentStake = parseFloat(stakeSpan.innerText.trim());
            //     var newStake = currentStake + parseFloat(spanInnerText.replace(/,/g, ''));
            //     stakeSpan.innerText = newStake.toFixed(2);
            //     var elements3 = document.getElementsByClassName('oddsvalue');
            //     var multiplicationResult = (newStake * parseFloat(elements3[0].innerText)) - parseFloat(stakeSpan.innerText);
            //     resultElement.innerText = multiplicationResult.toFixed(2);
            // });
            // });

            // document.addEventListener('DOMContentLoaded', function() {
            //     const stakeAmountSpans = document.querySelectorAll('.nww-bet-slip-wrp-col2-inn span');
            //     stakeAmountSpans.forEach(span => {
            //         span.addEventListener('click', () => {
            //             console.log("working")
            //             const stakeAmount = span.textContent.trim();
            //             const profitElement = span.closest('.my-exc-inn-colaps-txt-body').querySelector('.c-gren');
            //             document.getElementById("Stake").value = stakeAmount;
            //         });
            //     });
            // });

            // function handleClickableSpan(event) {
            //     const clickedSpan = event.target;
            //     const customStakeInput = clickedSpan.closest(".nww-bet-slip-wrp").querySelector(".set-stake-form-input2");
            //     customStakeInput.value = clickedSpan.textContent;
            //     const oddsElement = clickedSpan.closest(".nww-bet-slip-wrp").querySelector(".nww-bet-slip-wrp-col1-txt-num");
            //     const oddsValue = parseFloat(oddsElement.textContent);
            //     const stakeValue = parseFloat(customStakeInput.value);
            //     const profitValue = (oddsValue * stakeValue) - stakeValue;
            //     const profitElement = clickedSpan.closest(".nww-bet-slip-wrp").querySelector(".nww-bet-slip-wrp-col1-txt b");
            //     profitElement.textContent = profitValue.toFixed(2);
            //   }
            
            //   // Get all the clickable spans
            //   const clickableSpans = document.querySelectorAll(".nww-bet-slip-wrp-col2-inn span");
            
            //   // Attach a click event listener to each clickable span
            //   clickableSpans.forEach((span) => {
            //     span.addEventListener("click", handleClickableSpan);
            //   });

        // $(document).on("click", ".eventId", function(e){
        //     e.preventDefault()
        //     let data = {}
        //     let title = document.getElementsByClassName("eventTitle")
        //     let odd = document.getElementsByClassName("oddsvalue")
        //     let market = document.getElementsByClassName("betOn")
        //     data.title = title[0].innerText.trim();
        //     data.eventId = title[0].id
        //     data.odds = odd[0].innerText.trim();
        //     data.secId = odd[0].id.slice(0,-1)
        //     data.market = market[0].id
        //     data.stake = document.getElementById("stakeSpan").innerText.trim();
        //     data.spoetId = this.id
        //     // console.log(data)
        //     socket.emit("betDetails", {data, LOGINDATA})
        // })
        let checkTime
          socket.on('checkDelay', data => {
            if(data.delay && data.delay != 0){
                checkTime = clickTime + data.delay * 1000
            }

          })
        $(document).ready(function () {
            $(".eventId").click(function () {
                // console.log("working")
            let data = {}
            let secforFency 
            data.title = $(this).closest("tr").find(".name").text()
            data.eventId = $(this).attr("id");
            data.odds = $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
            let secId = $(this).closest("tr").find(".beton").attr('id')
            // console.log(secId, "secIdsecIdsecIdsecId")
            data.secId = secId.slice(0,-1)
            var escapedId =  data.secId.replace(/\./g, '\\.');
            let IdButton = $(this).closest("tr").prev().find(`#${escapedId}`)
            if(IdButton.hasClass('only_over_blue') || IdButton.hasClass('odd_even_blue') || IdButton.hasClass('odd_even_red') || IdButton.hasClass('only_over_red')){
                data.odds = parseFloat(
                    $(this).closest("tr").find(".selection-name").text().split('@')[1]
                    );
            }
            data.market = $(this).closest("table").attr("id");
            data.stake = $(this).closest("tr").find(".set-stake-form-input2").val()
            data.spoetId = $(this).closest("tr").find(".c-gren").attr('id')
            if(data.market == undefined){
                data.market = $(this).closest("tr").prev().find('.market').attr('id')
                // console.log(data.market)
                secforFency = secId.slice(0,-1)
                secforFency = secforFency.replace(".", "\\.");
                if(secId.charAt(secId.length - 2) == 1){
                    data.secId = "odd_Even_Yes"
                }else{
                    data.secId = "odd_Even_No"
                }
            }
            let specificSpan 
            if(data.secId.startsWith('odd_Even_')){
                console.log($(`#${secforFency}`).children("span").eq(1))
                specificSpan = $(`#${secforFency}`).children("span").eq(1).text();
                console.log(specificSpan)
            }else{
                specificSpan = $(`#${secId.slice(0,-1)}`).children("span:first-child").text();
                
            }
            let check = $(this).closest("tr").find("#changes").prop("checked");
            console.log(specificSpan, data.odds, "data.oddsdata.oddsdata.odds")
            if(specificSpan == data.odds){
                if(data.stake === "" || data.stake == 0){
                    // alert("Please select stake")
                    togglePopupMain('popup-2', "redPopUP2", "Please select stake")
                }else{
                    if(data.odds != '\n                        \n                      '){
                        // alert('132456')
                        if(checkTime){
                            if(checkTime < Date.now()){
                                // console.log('WORKING')
                                togglePopupMain("popup-2", "redPopUP2", "Odds out of range")
                            }else{
                                // console.log(data)
                                    showLoader();
                                    socket.emit("betDetails", {data, LOGINDATA})
                            }
                        }else{
                            // console.log(data)
                                    showLoader();
                                    socket.emit("betDetails", {data, LOGINDATA})
                        }
                        // console.log(data)
                    }else{
                        togglePopupMain("popup-2", "redPopUP2", "Bet Not Allowed In this market")
                    }
                }
            }else{
                if(check ){
                    data.oldOdds = data.odds
                    data.odds = specificSpan
                    if(data.stake === ""){
                        // alert("Please select stake")
                        togglePopupMain('popup-2', "redPopUP2", "Please select stake")
                    }else{
                        if(data.odds != '\n                        \n                      '){
                            // alert('132456')
                            if(checkTime){
                                if(checkTime < Date.now()){
                                    togglePopupMain("popup-2", "redPopUP2", "Odds out of range")
                                }else{
                                    // console.log(data)
                                    showLoader();
                                    socket.emit("betDetails", {data, LOGINDATA})
                                }
                            }else{
                                // console.log(data)
                                    showLoader();
                                    socket.emit("betDetails", {data, LOGINDATA})
                            }
                        }else{
                            togglePopupMain("popup-2", "redPopUP2", "Bet Not Allowed In this market")
                        }
                    }
                }else{
                    togglePopupMain('popup-2', "redPopUP2", "Odds out of range")
                }
            }
            });
          });

        // function handlePlaceBetClick(event) {
        //     const clickedLink = event.target;
        //     const parentContainer = clickedLink.closest(".nww-bet-slip-wrp");
        //     let data = {
        //         spoetId : clickedLink.dataset.sportId,
        //         title : parentContainer.querySelector(".eventTitle").textContent,
        //         eventId : parentContainer.querySelector(".eventTitle").id,
        //         odds : parentContainer.querySelector(".nww-bet-slip-wrp-col1-txt-num").textContent,
        //         secId : parentContainer.querySelector(".nww-bet-slip-wrp-col1-txt-num").id.slice(0,-1),
        //         market : parentContainer.querySelector("[class^='betOn']").id,
        //         stake : parentContainer.querySelector(".set-stake-form-input2").value,
        //     }
        //     socket.emit("betDetails", {data, LOGINDATA})
        //   }
        
        //   // Get all the "PLACE BET" links
        //   const placeBetLinks = document.querySelectorAll(".PLACEBET");
        
        //   // Attach a click event listener to each link
        //   placeBetLinks.forEach((link) => {
        //     link.addEventListener("click", handlePlaceBetClick);
        //   });

        
        $(document).on('click', ".close-btn", function(){
            marketIdbookDetails( false )
        })

        $(document).on('click','.tbl-td-with5',function(e){
            // console.log("WORKING")
            marketIdbookDetails( false )
            $(".minus").closest("tr").find('.set-stake-form-input2').val(0)
            $(".minus")
            .closest("tr")
            .find(".c-gren")
            .text('00');
           
      })
        socket.on('marketIdbookDetails', data => {
            if(data && data.betsMarketIdWise && data.betsMarketIdWise.length != 0){
                for(let i = 0; i < data.betsMarketIdWise.length; i++){
                    let team1Data
                    let team2Data
                    let team3Data
                    let status = false
                    if(data.betsMarketIdWise[i].runnersData && data.betsMarketIdWise[i].runnersData.length === 3){
                        status = true
                        team1Data = data.betsMarketIdWise[i].selections.find(item => item.selectionName == data.betsMarketIdWise[i].runnersData[0].runner)
                        team2Data = data.betsMarketIdWise[i].selections.find(item => item.selectionName == data.betsMarketIdWise[i].runnersData[1].runner)
                        team3Data = data.betsMarketIdWise[i].selections.find(item => item.selectionName == data.betsMarketIdWise[i].runnersData[2].runner)
                    }else if(data.betsMarketIdWise[i].runnersData && data.betsMarketIdWise[i].runnersData.length === 2) {
                        team1Data = data.betsMarketIdWise[i].selections.find(item => item.selectionName == data.betsMarketIdWise[i].runnersData[0].runner)
                        team2Data = data.betsMarketIdWise[i].selections.find(item => item.selectionName == data.betsMarketIdWise[i].runnersData[1].runner)
                    }
                    let team1Amount
                    let team2Amount
                    let team3Amount
                    if(status){
                        if(team1Data && team2Data && team3Data){
                            team1Amount = team1Data.totalAmount - team2Data.exposure - team3Data.exposure
                            team2Amount = team2Data.totalAmount - team1Data.exposure - team3Data.exposure
                            team3Amount = team3Data.totalAmount - team2Data.exposure - team1Data.exposure
                        }else if ((team1Data && team2Data) && !team3Data){
                            team1Amount = team1Data.totalAmount - team2Data.exposure
                            team2Amount = team2Data.totalAmount - team1Data.exposure
                            team3Amount = - team2Data.exposure - team1Data.exposure
                        }else if (!team1Data && (team2Data && team3Data)){
                            team1Amount = - team2Data.exposure - team3Data.exposure
                            team2Amount = team2Data.totalAmount - team3Data.exposure
                            team3Amount = team3Data.totalAmount - team2Data.exposure 
                        }else if (team1Data && !team2Data && team3Data){
                            team1Amount = team1Data.totalAmount - team3Data.exposure
                            team2Amount = - team1Data.exposure - team3Data.exposure
                            team3Amount = team3Data.totalAmount - team1Data.exposure
                        }else if (team1Data && !team2Data && !team3Data){
                            team1Amount = team1Data.totalAmount
                            team2Amount = - team1Data.exposure
                            team3Amount = - team1Data.exposure
                        }else if (!team1Data && team2Data && !team3Data){
                            team1Amount = - team2Data.exposure
                            team2Amount = team2Data.totalAmount
                            team3Amount = - team2Data.exposure 
                        }else if (!team1Data && !team2Data && team3Data){
                            team1Amount =  - team3Data.exposure
                            team2Amount =  - team3Data.exposure
                            team3Amount = team3Data.totalAmount 
                        }
                    }else{
                        if(team1Data && team2Data){
                            team1Amount = team1Data.totalAmount - team2Data.exposure
                            team2Amount = team2Data.totalAmount - team1Data.exposure
                        }else if (!team1Data && team2Data){
                            team1Amount = - team2Data.exposure
                            team2Amount = team2Data.totalAmount
                        }else if(team1Data && !team2Data){
                            team1Amount = team1Data.totalAmount
                            team2Amount = - team1Data.exposure
                        }
    
                    }
                    $("table.market").each(function() { 
                        let check = $(this).find('tr').length

                        if(check < 8){
                            if(this.id == data.betsMarketIdWise[i]._id){
                                var table = $(this);
                                let trLength = table.find("tr:eq(1)").find('td').length
                                table.find('tr:eq(2), tr:eq(4), tr:eq(6)').each(function(){
                                    $(this).find('td:eq(0)').attr('colspan', 9)
                                })
                                if(trLength === 4 || trLength === 8){
                                    if(team1Amount > 0){
                                        var newTd = `<span class="c-gren" >+${team1Amount.toFixed(2)}</span>`;
                                    }else{
                                        var newTd = `<span class="c-reed" >${team1Amount.toFixed(2)}</span>`;
                                    }
                                    if(team2Amount > 0){
                                        var newTd2 = `<span class="c-gren" >+${team2Amount.toFixed(2)}</span>`;
                                    }else{
                                        var newTd2 = `<span class="c-reed" >${team2Amount.toFixed(2)}</span>`;
                                    }
                                    if(status){
                                        if(team3Amount > 0){
                                            var newTd3 = `<span class="c-gren" >+${team3Amount.toFixed(2)}</span>`;
                                        }else{
                                            var newTd3 = `<span class="c-reed" >${team3Amount.toFixed(2)}</span>`;
                                        }
            
                                        table.find("tr:eq(1)").find("td:eq(1)").html(newTd);
                                        table.find("tr:eq(3)").find("td:eq(1)").html(newTd2);
                                        table.find("tr:eq(5)").find("td:eq(1)").html(newTd3);
                                    }else{
                                        table.find("tr:eq(1)").find("td:eq(1)").html(newTd);
                                        table.find("tr:eq(3)").find("td:eq(1)").html(newTd2);
                                    }
                                }else{
                                    table.find('th:eq(0)').after('<th></th>')
                                    if(team1Amount > 0){
                                        var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${team1Amount.toFixed(2)}</span>`);
                                    }else{
                                        var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${team1Amount.toFixed(2)}</span>`);
                                    }
                                    if(team2Amount > 0){
                                        var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${team2Amount.toFixed(2)}</span>`);
                                    }else{
                                        var newTd2 = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${team2Amount.toFixed(2)}</span>`);
                                    }
                                    if(status){
                                        if(team3Amount > 0){
                                            var newTd3 = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${team3Amount.toFixed(2)}</span>`);
                                        }else{
                                            var newTd3 = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${team3Amount.toFixed(2)}</span>`);
                                        }
            
                                        table.find("tr:eq(1)").find("td:eq(0)").after(newTd);
                                        table.find("tr:eq(3)").find("td:eq(0)").after(newTd2);
                                        table.find("tr:eq(5)").find("td:eq(0)").after(newTd3);
                                    }else{
                                        table.find("tr:eq(1)").find("td:eq(0)").after(newTd);
                                        table.find("tr:eq(3)").find("td:eq(0)").after(newTd2);
                                    }
                                }
                            }else{
                                // console.log('WORKING')
                                if(!data.betsMarketIdWise.some(item => item._id == this.id)){
                                    var table = $(this);
                                    let trLength = table.find("tr:eq(1)").find('td').length
                                    // console.log(trLength)
                                    if(trLength === 4 || trLength === 8){
                                        table.find("tr:eq(1)").find("td:eq(1)").remove();
                                        table.find("tr:eq(3)").find("td:eq(1)").remove();
                                        table.find("tr:eq(5)").find("td:eq(1)").remove();
                                        table.find('th:eq(1)').remove();
                                    }
                                }
                            }
                        }else{
                            if(this.id == data.betsMarketIdWise[i]._id){
                                // console.log(data.betsMarketIdWise[i])
                                let showData = []
                                for(let j = 0; j < data.betsMarketIdWise[i].runnersData.length; j++){
                                        console.log("got here")
                                        let checkRunn = data.betsMarketIdWise[i].selections.find(item => item.selectionName == data.betsMarketIdWise[i].runnersData[j].runner)
                                        // console.log(checkRunn, 123456789)
                                        let amount = 0
                                        if(checkRunn){
                                            amount = checkRunn.totalAmount
                                            for(const run in data.betsMarketIdWise[i].selections){
                                                if(data.betsMarketIdWise[i].selections[run].selectionName !== checkRunn.selectionName){
                                                    amount = amount - data.betsMarketIdWise[i].selections[run].exposure
                                                }
                                            }
                                        }else{
                                            for(const run in data.betsMarketIdWise[i].selections){
                                                amount = amount - data.betsMarketIdWise[i].selections[run].exposure
                                            }
                                        }
                                        // console.log(amount)
                                        showData.push(amount)
                                    }
                                    console.log(showData)
                                    var table = $(this);
                                    let trLength = table.find("tr:eq(1)").find('td').length
                                    if(trLength === 4 || trLength === 8){
                                        for (var t = 1; t < check; t += 2) {
                                            var selector = 'tr:eq(' + t + ')';
                                            let length = Math.floor((t + 1) / 2) - 1
                                            table.find(selector).each(function () {
                                                $(this).find('td:eq(1)').find('span').text(showData[length].toFixed(2))
                                                if(showData[length] > 0){
                                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-gren');
                                                }else if(showData[length] < 0){
                                                    $(this).find('td:eq(1)').find('span').attr('class', 'c-reed');
                                                }
                                            })
                                        }
                                    }else{
                                        for (var t = 1; t < check; t += 2) {
                                            var selector = 'tr:eq(' + t + ')';
                                            let html = ''
                                            let length = Math.floor((t + 1) / 2) - 1
                                            if(showData[length] > 0){
                                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-gren" >+${(showData[length]).toFixed(2)}</span>`);
                                            }else{
                                                var newTd = $("<td class='tbl-td-with5'>").html(`<span class="c-reed" >${(showData[length]).toFixed(2)}</span>`);
                                            }
                                            table.find(selector).each(function () {
                                                var firstTd = $(this).find('td:first-child');
                                                
                                                if (firstTd.length === 1 && (firstTd.siblings().length === 6 || firstTd.siblings().length === 2)) {
                                                    firstTd.after(newTd.clone());
                                                }
                                            });
                                        }
                                        for (var t = 2; t < check; t += 2) {
                                            var selector = 'tr:eq(' + t + ')';
                                            table.find(selector).each(function () {
                                                $(this).find('td:eq(0)').attr('colspan', 9);
                                            });
                                        }
                                    }
                                }else{
                                    if(!data.betsMarketIdWise.some(item => item._id == this.id)){
                                        var table = $(this);
                                        let trLength = table.find("tr:eq(1)").find('td').length
                                        // console.log(trLength)
                                        if(trLength === 4 || trLength === 8){
                                            for (var t = 1; t < check; t += 2) {
                                                var selector = 'tr:eq(' + t + ')';
                                                
                                                // Use your existing logic
                                                table.find('th:eq(1)').remove();
                                                table.find(selector).each(function () {
                                                    var firstTd = $(this).find('td:eq(1)');
                                                    
                                                    firstTd.remove()
                                                });
                                            }
                                            // table.find('th:eq(1)').remove();
                                        }
                                    }
                                }
                        }
                    })
                }
            }else{
                $("table.market").each(function() {
                    var table = $(this);
                    let check = table.find('tr').length
                    if(check < 8){
                        let trLength = table.find("tr:eq(1)").find('td').length
                        if(trLength === 4 || trLength === 8){
                            table.find("tr:eq(1)").find("td:eq(1)").remove();
                            table.find("tr:eq(3)").find("td:eq(1)").remove();
                            table.find("tr:eq(5)").find("td:eq(1)").remove();
                            table.find('th:eq(1)').remove();
                        }
                    }else{
                        let trLength = table.find("tr:eq(1)").find('td').length
                        if(trLength === 4 || trLength === 8){
                            for (var t = 1; t < check; t += 2) {
                                var selector = 'tr:eq(' + t + ')';
                                
                                // Use your extsttng logtc
                                table.find('th:eq(1)').remove();
                                table.find(selector).each(function () {
                                    var firstTd = $(this).find('td:eq(1)');
                                    
                                    firstTd.remove()
                                });
                            }
                        }
                    }
                })
            }
            // if()
        })
        socket.on("betDetails" , (data) => {
            marketIdbookDetails( true )
            fencyDetails( false )
            hideLoader()
            // console.log(data.result)
            // function togglePopup(idname, id){
            //     document.getElementById(idname).classList.toggle("active");
            //     document.getElementById(id).innerText  = data.result.toUpperCase()
            //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
            //   }
            if(data.result === "Bet placed successfully"){
                togglePopupMain('popup-1', "redPopUP", data.result.toUpperCase())
                $('.my-exc-inn-colaps-txt-dv').each(function(){
                    $(this).removeClass('open')
                })
            }else{
                togglePopupMain('popup-2', "redPopUP2", data.result.toUpperCase())
            }
            let buttonALlin = document.getElementsByClassName("ALLIN")
            for (let i = 0; i < buttonALlin.length; i++) {
                buttonALlin[i].id = `${data.user.availableBalance}`; // Replace "newId" with the desired ID value
            }
            // buttonALlin[0].id = 
            let html2 = ""
            document.getElementById("betsTitleSide").innerHTML = `<h5>Open Bets (${data.openBet.length})</h5>`
            document.getElementById("pills-profilebb-tab").innerHTML = `Open Bets (${data.openBet.length})`
            // console.log(data.openBet, "data.openBet.data.openBet.data.openBet.")
            if(data.openBet.length === 1){
                html2 = `<table class="table-new-d">
                <thead>
                  <tr class="thead-border my-open-bet-trr">
                    <th>Selection</th>
                    <th>Odds</th>
                    <th>Stake</th>
                  </tr>
                </thead>
                <tbody id="tableBET">
                  `
                if(data.openBet[0].bettype2 === "BACK"){
                    html2 += `<tr class="back-inplaymatch">`
                }else{
                    html2 += `<tr class="lay-inplaymatch">`
                }
                if(data.openBet[0].selectionName.includes('@')){
                    let oddValue1 = data.openBet[0].selectionName.split('@')[1]
                    let selectionName = data.openBet[0].selectionName.split('@')[0]
                    let oddValue2 = data.openBet[0].oddValue
                    html2 += `<td>${selectionName}@${oddValue2}</td>
                      <td>${ oddValue1 }</td>
                      <td>${ data.openBet[0].Stake }</td>
                    </tr>
                  </tbody>
                </table>`
                }else{
                    html2 += `<td>${ data.openBet[0].selectionName}</td>
                      <td>${ data.openBet[0].oddValue }</td>
                      <td>${ data.openBet[0].Stake }</td>
                    </tr>
                  </tbody>
                </table>`
                }
              document.getElementById('length1').innerHTML = html2
              document.getElementById('length2').innerHTML = html2
            }else{
                for(let i = 0; i < data.openBet.length; i++){
                    if(data.openBet[i].bettype2 === "BACK"){
                        html2 += `<tr class="back-inplaymatch">`
                    }else{
                        html2 += `<tr class="lay-inplaymatch">`
                    }
                    if(data.openBet[i].selectionName.includes('@')){
                        let oddValue1 = data.openBet[i].selectionName.split('@')[1]
                        let selectionName = data.openBet[i].selectionName.split('@')[0]
                        let oddValue2 = data.openBet[i].oddValue
                        html2 += `<td>${selectionName}@${oddValue2}</td>
                        <td>${ oddValue1 }</td>
                        <td>${ data.openBet[i].Stake }</td>
                      </tr>`
                    }else{
                        html2 += `<td>${ data.openBet[i].selectionName}</td>
                        <td>${ data.openBet[i].oddValue }</td>
                        <td>${ data.openBet[i].Stake }</td>
                      </tr>`
                    }
                }
                // console.log(html2, "tableBETtableBET")
                document.getElementById('tableBET').innerHTML = html2
                document.getElementById('tableBET1').innerHTML = html2
            }
        })


        socket.on('marketIdbookDetailsFANCY', data => {
            if(data.betDetails && data.betDetails.length != 0){
                $("td.market").each(function() {
                    if(data.betDetails.some(item => item == this.id)){
                        let text = $(this).contents().filter(function() {
                            return this.nodeType === 3; // Filter out non-text nodes
                        }).text().trim();
                        text += '<button class="site-button fancy-book" data-bs-toggle="modal" data-bs-target="#FANCTPOPUP">Book</button>'
                        $(this).html(text)
                    } 

                })
            }
        })
        
        $(document).on('click', '.fancy-book', function(){
            let id = $(this).closest('td').attr('id')
            $('#FANCYBOOKDATA').html('<p>Please wait a moment</p>')
            socket.emit('getFancyBookDATAuserSide', {id, LOGINDATA})
        })
        
        socket.on('getFancyBookDATAuserSide', async(data) => {
            if(data.status === "ODD"){
                let html = ''
                    html += `<table id="FANCYBOOK"
                    <tbody>
                    <tr class="headDetail"><th>Runner Name</th>
                    <th>Profit/Loss</th></tr>`
                    if(data.betDetails[0]._id === "odd_Even_No"){
                        if(data.betDetails[0].totalWinAmount2 < 0){
                            html += `<tr><td>0.0 or Less</td><td class="c-reed" >${(data.betDetails[0].totalWinAmount2).toFixed(2)}</td></tr>`
                        }else{
                            html += `<tr><td>0.0 or Less</td><td class="c-gren" >${(data.betDetails[0].totalWinAmount2).toFixed(2)}</td></tr>`
                        }

                        if(data.betDetails[1]){
                            if(data.betDetails[1].totalWinAmount2 < 0){
                                html += `<tr><td>1.0 or More</td><td class="c-reed" >${(data.betDetails[1].totalWinAmount2).toFixed(2)}</td></tr>`
                            }else{
                                html += `<tr><td>1.0 or More</td><td class="c-gren" >${(data.betDetails[1].totalWinAmount2).toFixed(2)}</td></tr>`
                            }
                        }else{
                            if(data.betDetails[0].totalAmount < 0){
                                html += `<tr><td>1.0 or More</td><td class="c-reed" >${(data.betDetails[0].totalAmount).toFixed(2)}</td></tr>`
                            }else{
                                html += `<tr><td>1.0 or More</td><td class="c-gren" >${(data.betDetails[0].totalAmount).toFixed(2)}</td></tr>`
                            }
                        }

                    }else if(data.betDetails[0]._id === "odd_Even_Yes") {
                        if(data.betDetails[0].totalWinAmount2 < 0){
                            html += `<tr><td>1.0 or More</td><td class="c-reed" >${(data.betDetails[0].totalWinAmount2).toFixed(2)}</td></tr>`
                        }else{
                            html += `<tr><td>1.0 or More</td><td class="c-gren" >${(data.betDetails[0].totalWinAmount2).toFixed(2)}</td></tr>`
                        }

                        if(data.betDetails[1]){
                            if(data.betDetails[1].totalWinAmount2 < 0){
                                html += `<tr><td>0.0 or Less</td><td class="c-reed" >${(data.betDetails[1].totalWinAmount2).toFixed(2)}</td></tr>`
                            }else{
                                html += `<tr><td>0.0 or Less</td><td class="c-gren" >${(data.betDetails[1].totalWinAmount2).toFixed(2)}</td></tr>`
                            }
                        }else{
                            if(data.betDetails[0].totalAmount < 0){
                                html += `<tr><td>0.0 or Less</td><td class="c-reed" >${(data.betDetails[0].totalAmount).toFixed(2)}</td></tr>`
                            }else{
                                html += `<tr><td>0.0 or Less</td><td class="c-gren" >${(data.betDetails[0].totalAmount).toFixed(2)}</td></tr>`
                            }
                        }
                    }
                     html += `</tbody>
                    </table>`
                    $('#FANCYBOOKDATA').html(html)
            }else{
                let html = ""
                    html += `<table id="FANCYBOOK"
                    <tbody>
                    <tr class="headDetail"><th>Runner Name</th>
                    <th>Profit/Loss</th></tr>`
                    for(let i = 0; i < data.dataToshow.length; i++){
                        // console.log(data.dataToshow[i])
                        html += `<tr><td>${data.dataToshow[i].message}</td>`
                        if(data.dataToshow[i].sum < 0){
                            html += `<td class="c-reed" >${(data.dataToshow[i].sum).toFixed(2)}</td></tr>`
                        }else{
                            html += `<td class="c-gren" >${(data.dataToshow[i].sum).toFixed(2)}</td></tr>`
                        }
                    } 
                    html += `</tbody>
                    </table>`
                    $('#FANCYBOOKDATA').html(html)
            }
        })

        function OddsCheck(){
            $(document).ready(function(){
                var ids = [];
          
                $(".market").each(function() {
                  ids.push(this.id);
                });
                let eventId = search.split('=')[1]
                // console.log(ids, eventId)
                socket.emit('OddsCheck', {ids, eventId})
                setTimeout(()=>{
                    OddsCheck()
                  }, 5000)
            })
        }
        OddsCheck()

        socket.on('OddsCheck', data => {
            $('.market-limit').each(function(){
                let id = this.id
                let thisMarketLimit = data.find(item => item.marketId == id)
                // console.log(thisMarketLimit)
                if(thisMarketLimit){
                    let html = `<b>Min : ${thisMarketLimit.Limits.min_stake}, Max : ${thisMarketLimit.Limits.max_stake}</b>` 
                    $(this).html(html)
                }
            })
        })
    }