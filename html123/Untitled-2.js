socket.on("marketId", (data) => {
            $(document).ready(function() {
          
                $(".0L").each(function() {
                    
                        let id = this.id
                        const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                        if(data.betLimits[0].max_odd < foundItem.odds[0].layPrice1){
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                        }else if (foundItem.odds[0].layPrice1 == "-"){
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                        }else{
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[0].layPrice1}</span>`
                        }
                });

                $(".0B").each(function() {
                    
                    let id = this.id
                    const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    if(data.betLimits[0].max_odd < foundItem.odds[0].backPrice1){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                    }else if (foundItem.odds[0].backPrice1 == "-"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                    }else{
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
                    }
                });

                $(".1L").each(function() {
                        let id = this.id
                        const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                        if(data.betLimits[0].max_odd < foundItem.odds[1].layPrice1){
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                        }else if (foundItem.odds[1].layPrice1 == "-"){
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                        }else{
                            // this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[1].layPrice1}</span>`
                        }
                });

                $(".1B").each(function() {
                    let id = this.id
                    const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    if(data.betLimits[0].max_odd < foundItem.odds[1].backPrice1){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                    }else if (foundItem.odds[1].backPrice1 == "-"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                    }else{
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[1].backPrice1}</span>`
                    }
                });

                $(".2B").each(function() {
                        let id = this.id
                        const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                        if(data.betLimits[0].max_odd < foundItem.odds[2].backPrice1){
                            this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                        }else if (foundItem.odds[2].backPrice1 == "-"){
                            this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                        }else{
                            // this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
                            this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[2].backPrice1}</span>`
                        }
                });

                $(".2L").each(function() {
                    let id = this.id
                    const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    if(data.betLimits[0].max_odd < foundItem.odds[2].layPrice1){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                    }else if (foundItem.odds[2].layPrice1 == "-"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                        <i class="fa-solid fa-lock"></i>
                                      </span>`
                    }else{
                        // this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[2].layPrice1}</span>`
                    }
                });
            })
        })