$(".only_over_red").each(function() {
                    // console.log(data.forFancy, "data.forFancydata.forFancydata.forFancy")
                    let marketId = $(this).closest('tr').find('.market').attr('id')
                    let macLimitStatus 
                    let limitOnTHis = limitData.find(item => item.marketId == marketId)
                    if(limitOnTHis){
                        if(limitOnTHis.Limits.max_odd){
                            macLimitStatus =  (limitOnTHis.Limits.max_odd - 1) * 100
                        }
                    }
                    // console.log(macLimitStatus, "FANCY")
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
                    // console.log(macLimitStatus < section.no)
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
                    }else if( section.no_rate == "-" || section.no_rate == "1,000.00" || section.no_rate == "0"|| (macLimitStatus != undefined && macLimitStatus < section.no_rate)){
                        // console.log('WORKING123456789')
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
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