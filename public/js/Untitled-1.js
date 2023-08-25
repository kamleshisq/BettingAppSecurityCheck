for(let i = 0; i < bets.length; i++){
                let date = new Date(bets[i].date)
                if((i%2) == 0){
                     html += `<tr style="text-align: center;" class="blue"></tr>`
                }else{
                    html += `<tr style="text-align: center;" ></tr>`
                }
                html += `td${i + 1}</td>
                <td>${bets[i].userName}</td>
                <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                <td>${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                if(bets[i].Sport){
                html += `<td>${bets[i].Sport}</td>
                <td>${bets[i].Match}</td>
                <td>${bets[i].Market}</td>
                <td>${bets[i].betOn}</td>
                <td>${bets[i].Odds}</td>`
                }else{
                   html += `<td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>`
                }
                html += `<td>${bets[i].status}</td>
                <td>${bets[i].Stake}</td>
                <td>${bets[i].returns}</td>
                <td>${bets[i].transactionId}</td>
                <td>${bets[i].event}</td>`
            }



            