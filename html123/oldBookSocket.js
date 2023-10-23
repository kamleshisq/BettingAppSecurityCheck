socket.on('UerBook', async(data) => {
                console.log(data)
                if(data.Bets.length > 0){
                    if(data.Bets[0].userName){
                        
                    }else{
                    let team1 = data.matchName.split(' v ')[0].toLowerCase()
                    let team2 = data.matchName.split(' v ')[1].toLowerCase()
                    let html = `<tr class="headDetail"><th>User name</th>
                    <th>${team1}</th>
                    <th>${team2}</th></tr>`

                    for(let i = 0; i < data.Bets.length; i++){
                        html += `<tr class="tabelBodyTr userBookParentTr"><td class="userBookParent" data-usename="${data.Bets[i].User.userName}">${data.Bets[i].User.userName}</td>`
                        let team1Data = data.Bets[i].Bets[0].selections.find(item => item.selectionName.toLowerCase().includes(team1))
                        let team2Data = data.Bets[i].Bets[0].selections.find(item => item.selectionName.toLowerCase().includes(team2))
                        if(team1Data){
                             if (team1Data.winAmount > 0){
                                html += `<td class="green">${team1Data.winAmount.toFixed(2)}</td>`
                             }else{
                                html += `<td class="red">${team1Data.winAmount.toFixed(2)}</td>`
                             }
                        }else{
                            if (team2Data.lossAmount > 0){
                                html += `<td class="green">${team2Data.lossAmount.toFixed(2)}</td>`
                             }else{
                                html += `<td class="red">${team2Data.lossAmount.toFixed(2)}</td>`
                             }
                        }

                        if(team2Data){
                            if (team2Data.winAmount > 0){
                               html += `<td class="green">${team2Data.winAmount.toFixed(2)}</td>`
                            }else{
                               html += `<td class="red">${team2Data.winAmount.toFixed(2)}</td>`
                            }
                       }else{
                           if (team1Data.lossAmount > 0){
                               html += `<td class="green">${team1Data.lossAmount.toFixed(2)}</td>`
                            }else{
                               html += `<td class="red">${team1Data.lossAmount.toFixed(2)}</td>`
                            }
                       }
                       html += '</tr>'
                      
                    }
                //     let team1 = data.Bets[0].Bets.teamA
                //     let team2 = data.Bets[0].Bets.teamB
                //     let html = `<tr class="headDetail"><th>User name</th>
                //     <th>${team1}</th>
                //     <th>${team2}</th></tr>`
                //     let sumOfTeamA = 0
                //     let sumOfTeamB = 0
                //     for(let i = 0; i < data.Bets.length; i++){
                //         html += `
                //         <tr class="tabelBodyTr userBookParentTr">
                //             <td class="userBookParent" data-usename="${data.Bets[i].ele.userName}">${data.Bets[i].ele.userName}</td>`
                //             if(data.type == 'bookList'){
                //                 if(data.Bets[i].Bets.teama.toFixed(2) > 0){
                //                 html += `<td class="red">${data.Bets[i].Bets.teama.toFixed(2) * -1}</td>`
                //             }else{
                //                 html += `<td class="green">${data.Bets[i].Bets.teama.toFixed(2) * -1}</td>`
                //             }
                            
                //             if(data.Bets[i].Bets.teamb.toFixed(2) > 0){
                //                 html += `<td class="red">${data.Bets[i].Bets.teamb.toFixed(2) * -1}</td></tr>`
                //             }else{
                //                 html += `<td class="green">${data.Bets[i].Bets.teamb.toFixed(2) * -1}</td></tr>`
                //             }
                //         }else{

                //             if(data.Bets[i].Bets.teama.toFixed(2) > 0){
                //                 html += `<td class="green">${data.Bets[i].Bets.teama.toFixed(2)}</td>`
                //             }else{
                //                 html += `<td class="red">${data.Bets[i].Bets.teama.toFixed(2) * 1}</td>`
                //             }
                            
                //             if(data.Bets[i].Bets.teamb.toFixed(2) > 0){
                //                 html += `<td class="green">${data.Bets[i].Bets.teamb.toFixed(2)}</td></tr>`
                //             }else{
                //                 html += `<td class="red">${data.Bets[i].Bets.teamb.toFixed(2) * 1}</td></tr>`
                //             }
                //         }
                //         sumOfTeamA += data.Bets[i].Bets.teama
                //         sumOfTeamB += data.Bets[i].Bets.teamb
                //     }
                //     if(data.type == 'bookList'){
                //         html += `<tr class="totleCount">
                //         <td>Total</td>`
                //         if(sumOfTeamA.toFixed(2) > 0){
                //             html += `<td class="red"> ${sumOfTeamA.toFixed(2) * -1}</td>`
                //         }else{
                //             html += `<td class="green">${sumOfTeamA.toFixed(2) * -1}</td>`
                //         }
                        
                //         if(sumOfTeamB.toFixed(2) > 0){
                //             html += `<td class="red">${sumOfTeamB.toFixed(2) * -1}</td></tr>`
                //         }else{
                //             html += `<td class="green">${sumOfTeamB.toFixed(2) * -1}</td></tr>`
                //         }
                //     }else{
                //         html += `<tr class="totleCount">
                //         <td>Total</td>`
                //         if(sumOfTeamA.toFixed(2) > 0){
                //             html += `<td class="green"> ${sumOfTeamA.toFixed(2)}</td>`
                //         }else{
                //             html += `<td class="red">${sumOfTeamA.toFixed(2) * 1}</td>`
                //         }
                        
                //         if(sumOfTeamB.toFixed(2) > 0){
                //             html += `<td class="green">${sumOfTeamB.toFixed(2)}</td></tr>`
                //         }else{
                //             html += `<td class="red">${sumOfTeamB.toFixed(2) * 1}</td></tr>`
                //         }
                //     }
                // if(data.type == 'bookList'){
                //     document.getElementById('match_odd_Book').innerHTML = html

                // }else{
                    document.getElementById('match_odd').innerHTML = html

                // }
                    }
                }else{
                    if(data.type == 'bookList'){
                        $('#match_odd_Book').html(`<tbody><tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr></tbody>`)
                    }else{
                        $('#match_odd').html(`<tbody><tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr></tbody>`)
                    }
                }
            })