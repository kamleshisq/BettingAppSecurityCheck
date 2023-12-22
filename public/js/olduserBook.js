// console.log(data)
if(data.Bets.length > 0){
    if(data.Bets[0].userName){
        let team1 = data.matchName.split(' v ')[0].toLowerCase()
        let team2 = data.matchName.split(' v ')[1].toLowerCase()
        let html = '';
        for(let i = 0; i < data.Bets.length; i++){
            html += ` <tr class="tabelBodyTr userBookParentTr pr${data.Id}"><td class="userBookParent" data-usename="${data.Bets[i].User.userName}">${data.Bets[i].User.userName}</td>`
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

        let string = `tr:has(td:first-child[data-usename='${data.Id}'])`
        // console.log(string)
        // console.log($('#match_odd').find(string))
        $('#match_odd').find(string).after(html)

    }else if (data.Bets[0].status === 'User'){
        let team1 = data.matchName.split(' v ')[0].toLowerCase()
        let team2 = data.matchName.split(' v ')[1].toLowerCase()
        let html = '';
        for(let i = 0; i < data.Bets.length; i++){
            html += ` <tr class="tabelBodyTr children pr${data.Id}"><td  data-usename="${data.Bets[i].User.userName}">${data.Bets[i].User.userName}</td>`
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

        // $('#match_odd').find('tr.active').after(html)
        let string = `tr:has(td:first-child[data-usename='${data.Id}'])`
        $('#match_odd').find(string).after(html)
    }
    else{
    let team1 = data.matchName.split(' v ')[0].toLowerCase()
    let team2 = data.matchName.split(' v ')[1].toLowerCase()
    let html = `<tr class="headDetail"><th>User name</th>
    <th>${team1}</th>
    <th>${team2}</th></tr>`

    for(let i = 0; i < data.Bets.length; i++){
        html += `<tr class="tabelBodyTr userBookParentTr pr${data.Id}"><td class="userBookParent" data-usename="${data.Bets[i].User.userName}">${data.Bets[i].User.userName}</td>`
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
    document.getElementById('match_odd').innerHTML = html
    }
}else{
    if(data.type == 'bookList'){
        $('#match_odd_Book').html(`<tbody><tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr></tbody>`)
    }else{
        $('#match_odd').html(`<tbody><tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr></tbody>`)
    }
}