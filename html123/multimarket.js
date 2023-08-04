 socket.on("MultiMarketPage", (data)=>{
            let html = ""
            for(let i = 0; i < data.multimarket.marketIds.length; i++){
                let result
                result = data.sportListData[0].gameList[0].eventList.find(item => item.marketList.match_odd != null&&  item.marketList.match_odd.marketId == data.multimarket.marketIds[i])
                if(!result){
                    let footBall = data.sportListData[1].gameList.find(item => item.sport_name === "Football")
                    footBall = footBall.eventList
                    result = footBall.find(item => item.marketList.match_odd != null&&  item.marketList.match_odd.marketId == data.multimarket.marketIds[i])
                    if(!result){
                        let Tennis = data.sportListData[1].gameList.find(item => item.sport_name === "Tennis")
                        Tennis = Tennis.eventList
                        result = Tennis.find(item => item.marketList.match_odd != null&&  item.marketList.match_odd.marketId == data.multimarket.marketIds[i])
                    }
                }
                if(result){
                    html += `<div class="exchange-pg-inn-banner-col2">
                    <div class="exchange-pg-inn-banner-col-titi">
                        <div class="exchange-pg-inn-banner-col-titi-txt">
                            <h6 class="market" id="${result.marketList.match_odd.marketId}"><span> ${result.eventData.name} || Match Odds</span> &nbsp; <i class="fa-solid fa-circle-info"></i></h6>
                        </div>
                        <div class="exchange-pg-inn-banner-col-titi-txt-tim">
                            <h6><b>Min : ${data.SportLimits[0].min_stake}, Max : ${data.SportLimits[0].max_stake}</b></h6>
                        </div>
                    </div>
                  
                    <div class="exchange-pg-inn-tbl">
                        <table class="acount-stat-tbl">
                  
                            <thead class="acount-stat-tbl-hed2">
                                <tr class="acount-stat-tbl-hed-tr2" >
                                    <th colspan="2" style="text-align: left;" class="bod-red-lft ">Market</th>
                                    <th style="text-align: center;" colspan="3">Back</th>
                                    <th style="text-align: center;" colspan="3" class="bod-red-rit">Lay</th>
                                </tr>
                            </thead>`
                            let runners = JSON.parse(result.marketList.match_odd.runners); 
                                  const runners1 = []; 
                                  const secIds = []; 
                                  runners.forEach(item => {
                                      runners1.push(item.runner);
                                      secIds.push(item.secId);
                                  });
                            html += `<tbody class="acount-stat-tbl-body">`
                              for(let i = 0; i < runners1.length; i++){
                                html += `
                                <tr class="acount-stat-tbl-body-tr tbl-data-href" data-href='#'>
                                    <td colspan="2" style=" text-align: left;">
                                      ${runners1[i]}
                                    </td>
                                    
                                    <td class="tbl-td-with5" >
                                      <span data-bs-toggle="collapse" href="#bt-slp-colps-match-odds-i" role="button" aria-expanded="false" aria-controls="bt-slp-colps-match-odds-i" class="tbl-bg-blu-spn match_odd_Blue button collapsed" id="${secIds[i]}1" >
                                                  
                                      </span>
                                    </td>
                                    <td class="tbl-td-with5" >
                                      <span data-bs-toggle="collapse" href="#bt-slp-colps-match-odds-i" role="button" aria-expanded="false" aria-controls="bt-slp-colps-match-odds-i" class="tbl-bg-blu-spn match_odd_Blue button collapsed" id="${secIds[i]}2">
                                                  
                                      </span> 
                                    </td>
                  
                                    
                  
                                    <td class="tbl-td-with5" >
                                      <span data-bs-toggle="collapse" href="#bt-slp-colps-match-odds-i" role="button" aria-expanded="false" aria-controls="bt-slp-colps-match-odds-i" class="tbl-bg-blu-spn match_odd_Blue button collapsed" id="${secIds[i]}3">
                                                  
                                      </span>
                                    </td>
                                    <td class="tbl-td-with5" >
                                      <span data-bs-toggle="collapse" href="#bt-slp-colps-match-odds-i" role="button" aria-expanded="false" aria-controls="bt-slp-colps-match-odds-i" class="tbl-bg-pech-spn match_odd_Red button collapsed" id="${secIds[i]}4">
                                                  
                                      </span>  
                                    </td>
                                    <td class="tbl-td-with5" >
                                      <span data-bs-toggle="collapse" href="#bt-slp-colps-match-odds-i" role="button" aria-expanded="false" aria-controls="bt-slp-colps-match-odds-i" class="tbl-bg-pech-spn match_odd_Red button collapsed" id="${secIds[i]}5">
                                                  
                                      </span>
                                    </td>
                                    <td class="tbl-td-with5" >
                                      <span data-bs-toggle="collapse" href="#bt-slp-colps-match-odds-i" role="button" aria-expanded="false" aria-controls="bt-slp-colps-match-odds-i" class="tbl-bg-pech-spn match_odd_Red button collapsed" id="${secIds[i]}6">
                                                  
                                      </span>  
                                    </td>
                                    
                                    
                                    
                                </tr>
                                <tr>
                                  <td colspan="8">
                                    <div class="my-exc-inn-colaps-txt-dv collapse" id="bt-slp-colps-match-odds-i" >
                                      
                                    </div>
                                  </td>
                                </tr>`
                            }
                            html += "</tbody></table></div></div>"
                        }
                
                
            }

            document.getElementById("container").innerHTML = html
        })