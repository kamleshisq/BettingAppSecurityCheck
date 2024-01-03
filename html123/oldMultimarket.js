if(pathname === "/exchange/multimarkets"){
        // $(document).ready(function(){
        //     $(".exchange-pg-inn-tbl .button").click(function(){
        //       $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').removeClass('open');
        //       $(this).parents('tr').next().find('.my-exc-inn-colaps-txt-dv').addClass('open');
        //     });
        //     $(".my-exc-inn-colaps-txt-dv .close-btn").click(function(){
        //       $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').removeClass('open');
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

        function showLoader() {
            document.getElementById("loader-overlay").style.display = "flex";
          }
          
          function hideLoader() {
            document.getElementById("loader-overlay").style.display = "none";
          }
        // if(LOGINDATA.LOGINUSER != ""){
        //     socket.emit("MultiMarketPage", LOGINDATA)
        // }
        function marketId(){
            $(document).ready(function() {
                var ids = [];
                var pairs = [];
          
                $(".market").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 1000)
        }
        marketId()
        let first = true
        socket.on("marketId", async(data) => {
            // console.log(data)
            // console.log("working")
            $(".match_odd_Blue").each(function() {
                    
                let id = this.id
      
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item.odds){
                        section = item.odds.find(odd => odd.selectionId == id);
                        return section !== undefined;
                    }
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
                            let data2 = htmldiv.find('span:first').next().text()
                            if(data1 != section.backPrice1 || data2 != section.backSize1 ){
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
                            let data2 = htmldiv.find('span:first').next().text()
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
                            let data2 = htmldiv.find('span:first').next().text()
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
                    if(item.odds){
                        section = item.odds.find(odd => odd.selectionId == id);
                        return section !== undefined;
                    }
                });
                let marketId = this.closest('table').id
                let check = data.resumeSuspendMarkets.some(item => item.marketId == marketId)
                let parentElement = this.parentNode
                if(this.id == `${section.selectionId}4` ){
                    if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            let data2 = htmldiv.find('span:first').next().text()
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
                            let data2 = htmldiv.find('span:first').next().text()
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
                    // if(!data.status){
                    //     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                    //     <i class="fa-solid fa-lock"></i>
                    //     </span>`
                    //     this.removeAttribute("data-bs-toggle");
                    //     parentElement.classList.add("suspended");
                    //     $(this).parent().find(".match-status-message").text("Suspended")
                    // }else 
                    if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
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
                            let data2 = htmldiv.find('span:first').next().text()
                            // console.log(data1)
                            if(data1 != section.layPrice3 || data2 !=section.laySize3 ){
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
                            let data2 = htmldiv.find('span:first').next().text()
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
                            let data2 = htmldiv.find('span:first').next().text()
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
                            let data2 = htmldiv.find('span:first').next().text()
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
                let parentElement = this.parentNode
                if(this.id == `${section.selectionId}4` ){
                    if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            let data2 = htmldiv.find('span:first').next().text()
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
                            let data2 = htmldiv.find('span:first').next().text()
                            // console.log(data1)
                            if(data1 != section.layPrice2 || data2 != section.laySize2){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if (this.id == `${section.selectionId}6`){
                    if(!data.status){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
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
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            let data2 = htmldiv.find('span:first').next().text()
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



        $(document).ready(function () {
            $(".button").click(function () {
            if(this.classList.contains('match_odd_Blue') || this.classList.contains('match_odd_Red')){
                let odds = $(this).children("span:first-child").attr('data-id');
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                let secId2;
                if($(this).hasClass('match_odd_Blue')){
                  secId2 = secId.slice(0,-1) + '1'
                  }else{
                  secId2 = secId.slice(0,-1) + '4'
                  }
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId2}1`);;
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
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
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
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                let secId2;
                if($(this).hasClass('winner_Blue')){
                  secId2 = secId.slice(0,-1) + '1'
                  }else{
                  secId2 = secId.slice(0,-1) + '4'
                  }
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
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
                numSpan.text(odds);
      
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
    
          $(document).ready(function () {
            $(".nww-bet-slip-wrp-col2-inn span").click(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
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
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = (parseFloat(newStake) * betValue) - parseFloat(newStake);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
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
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = ((parseFloat(newStake) * betValue) / 100);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
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
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = (parseFloat(newStake) * 2) - parseFloat(newStake);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
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
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    let result = parseFloat(newStake)
                    // if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                    //     result = (parseFloat(newStake) * 2) - parseFloat(newStake);
                    // }else{
                    //     result = ((parseFloat(newStake) * betValue)/100)
                    // }
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
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
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass('winner_Blue')){
                        result = (NewStake * Odds) - NewStake;
                    }else{
                        result = (NewStake * Odds) / 100
                    }
                }else{
                    result = NewStake
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
      
      
          $(document).on('click','.tbl-td-with5',function(e){
                // console.log("WORKING")
                $(".minus").closest("tr").find('.set-stake-form-input2').val(0)
                $(".minus")
                .closest("tr")
                .find(".c-gren")
                .text('00');
               
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
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass('winner_Blue')){
                        result = (NewStake * Odds) - NewStake;
                    }else{
                        result = (NewStake * Odds) / 100
                    }
                }else{
                    // if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                    //     result = (NewStake * 2) - NewStake;
                    // }else{
                    //     result = (NewStake * Odds) / 100
                    // }
                    result - NewStake
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


            $(document).ready(function () {
                $(".eventId").click(function () {
                    // console.log("working")
                let data = {}
                let secforFency 
                data.title = $(this).closest("tr").find(".name").text()
                data.eventId = $(this).attr("id");
                data.odds = $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                let secId = $(this).closest("tr").find(".beton").attr('id')
                data.secId = secId.slice(0,-1)
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
                    specificSpan = $(`#${secforFency}`).children("span").eq(1).text();
                    // console.log(`#${secforFency}`)
                }else{
                    specificSpan = $(`#${secId.slice(0,-1)}`).children("span:first-child").text();
                    
                }
                let check = $(this).closest("tr").find("#changes").prop("checked");
                // console.log(data)
                if(specificSpan == data.odds){
                    if(data.stake === "" || data.stake == 0){
                        // alert("Please select stake")
                        togglePopupMain('popup-2', "redPopUP2", "Please select stake")
                    }else{
                        if(data.odds != '\n                        \n                      '){
                            // alert('132456')
                            showLoader();
                            socket.emit("betDetails", {data, LOGINDATA})
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
                                showLoader();
                                socket.emit("betDetails", {data, LOGINDATA})
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
    
            socket.on("betDetails" , (data) => {
                hideLoader()
                // console.log(data.result)
                // function togglePopup(idname, id){
                //     document.getElementById(idname).classList.toggle("active");
                //     document.getElementById(id).innerText  = data.result.toUpperCase()
                //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
                //   }
                if(data.result === "Bet placed successfully"){
                    togglePopupMain('popup-1', "redPopUP", data.result.toUpperCase())
                }else{
                    togglePopupMain('popup-2', "redPopUP2", data.result.toUpperCase())
                }
                
                let html2 = ""
                document.getElementById("betsTitleSide").innerHTML = `<h5>Open Bets (${data.openBet.length})</h5>`
                if(data.openBet.length === 1){
                    html2 = `<table class="table-new-d">
                    <thead>
                      <tr class="thead-border my-open-bet-trr">
                        <th>Selection</th>
                        <th>Odds</th>
                        <th>Stake</th>
                      </tr>
                    </thead>
                    <tbody id="tableBET">`
                    if(data.openBet[0].bettype2 === "BACK"){
                       html2 +=  `<tr class="back-inplaymatch" >`
                    }else{
                        html2 +=  `<tr class="lay-inplaymatch" >`
                    }
                       html2 += `<td>${ data.openBet[0].selectionName}</td>
                        <td>${ data.openBet[0].oddValue }</td>
                        <td>${ data.openBet[0].Stake }</td>
                      </tr>
                    </tbody>
                  </table>`
                  document.getElementById('length1').innerHTML = html2
                }else{
                    for(let i = 0; i < data.openBet.length; i++){
                        if(data.openBet[i].bettype2 === "BACK"){
                            html2 +=  `<tr class="back-inplaymatch" >`
                         }else{
                             html2 +=  `<tr class="lay-inplaymatch" >`
                         }
                        html2 += `
                        <td>${ data.openBet[i].selectionName}</td>
                        <td>${ data.openBet[i].oddValue }</td>
                        <td>${ data.openBet[i].Stake }</td>
                      </tr>`
                    }
                    document.getElementById('tableBET').innerHTML = html2
                }
            })



            $(document).on('click','.tbl-td-with5',function(e){
                // console.log("WORKING")
                $(".minus").closest("tr").find('.set-stake-form-input2').val(0)
                $(".minus")
                .closest("tr")
                .find(".c-gren")
                .text('00');
            })


    }