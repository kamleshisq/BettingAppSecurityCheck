 socket.on('UerBook', async(data) => {
        let user = await User.findById(data.id)
        let childrenUsername = []
        if(user.userName == data.LOGINDATA.LOGINUSER.userName){
            let children = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id,role_type:2})
            children.map(ele => {
                childrenUsername.push(ele.userName) 
            })
        }else{
            childrenUsername.push(user.userName)
        }
        try{
            let Bets = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN",
                        marketId: data.marketId,
                        userName:{$in:childrenUsername}
                    }
                },
                {
                    $group: {
                        _id: {
                            userName: "$userName",
                            selectionName: "$selectionName",
                            matchName: "$match",
                        },
                        totalAmount: {
                            $sum: {
                                $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
                            }
                        },
                        Stake: { $sum: "$Stake" }
                    },
                },
                {
                    $group: {
                        _id: "$_id.userName",
                        selections: {
                            $push: {
                                selectionName: "$_id.selectionName",
                                totalAmount: "$totalAmount",
                                matchName: "$_id.matchName",
                                Stake: "$Stake"
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        userName: "$_id",
                        selections: {
                            $map: {
                                input: "$selections",
                                as: "selection",
                                in: {
                                    selectionName: "$$selection.selectionName",
                                    totalAmount: {
                                        $subtract: [
                                            "$$selection.totalAmount",
                                            {
                                                $reduce: {
                                                    input: "$selections",
                                                    initialValue: 0,
                                                    in: {
                                                        $cond: {
                                                            if: {
                                                                $and: [
                                                                    { $eq: ["$$this.matchName", "$$selection.matchName"] },
                                                                    { $ne: ["$$this.selectionName", "$$selection.selectionName"] }
                                                                ]
                                                            },
                                                            then: { $add: ["$$value", "$$this.Stake"] },
                                                            else: "$$value"
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    matchName: "$$selection.matchName",
                                    Stake: "$$selection.Stake"
                                }
                            }
                        }
                    },
                },
                // {
                //     $unwind: "$selections"
                // },
                {
                    $sort: {
                        "userName": 1, 
                        // "selections.selectionName": 1 
                    }
                }
            ]);
            
            
            
            

            // for (bet in Bets){
            //     for(selcet in Bets[bet].selections){}
            // }
            
            
            
            
        //    console.log(Bets[0].selections)
           socket.emit('UerBook', {Bets,type:data.type,newData:data.newData});
        //    socket.emit();
        }catch(err){
            console.log(err)
            socket.emit('UerBook', {message:"err", status:"error"})
        }
    })



            //     <div class="search">
            //     <div class="input-group">
            //         <div class="input-group-prepend">
            //           <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-magnifying-glass"></i></span>
            //         </div>
            //         <input type="text" id="searchUser" data-marketid="" list="text_editors" class="form-control searchUser" placeholder="search user" aria-label="Username" aria-describedby="basic-addon1" autocomplete="off">
            //         <div class="wrapper">
            //           <ul id="search" class="users">
                    
            //           </ul>
            //           <ul id="button" class="button">
                        
            //           </ul>
            //         </div>
            //     </div>
            // </div>


            socket.on('UerBook', async(data) => {
                if(data.Bets.length > 0){
                    let match = data.Bets[0].Bets.selections[0].matchName
                    let team1 = match.split('v')[0]
                    let team2 = match.split('v')[1]
                    let html = `<tr class="headDetail"><th>User name</th>
                    <th>${team1}</th>
                    <th>${team2}</th></tr>`
                    let sumOfTeamA = 0
                    let sumOfTeamB = 0
                    let sumOfTeamC = 0
                    for(let i = 0; i < data.Bets.length; i++){
                        // console.log(data[i], "+==> in Loop DAta")
                        let team1data = 0 
                        let team2data = 0
                        // console.log(data[i].selections[0].selectionName.toLowerCase(), team1.toLowerCase)
                        if(data.Bets[i].Bets.selections[0].selectionName.toLowerCase().includes(team1.toLowerCase)){
                            // console.log("2121222122121")
                            team1data = data.Bets[i].Bets.selections[0].totalAmount
                            sumOfTeamA += team1data
                            if(data.Bets[i].Bets.selections[1]){
                                team2data = data.Bets[i].Bets.selections[1].totalAmount
                                sumOfTeamB += team2data
                            }else{
                                team2data = -data.Bets[i].Bets.selections[0].Stake
                                sumOfTeamB += team2data
                            }
                        }else{
                            if(data.Bets[i].Bets.selections[1]){
                                team1data = data.Bets[i].Bets.selections[1].totalAmount
                                sumOfTeamA += team1data
                            }else{
                                team1data = -data.Bets[i].Bets.selections[0].Stake
                                sumOfTeamA += team1data
                            }
                            team2data = data.Bets[i].Bets.selections[0].totalAmount
                            sumOfTeamB += team2data
                        }

                        html += `
                        <tr class="tabelBodyTr">
                            <td class="children" data-usename="${data.Bets[i].ele.userName}">${data.Bets[i].ele.userName}</td>`
                        if(team1data.toFixed(2) > 0){
                            html += `<td class="red"> -${team1data.toFixed(2)}</td>`
                        }else{
                            html += `<td class="green"> ${team1data.toFixed(2) * -1}</td>`
                        }
                        
                        if(team2data.toFixed(2) > 0){
                            html += `<td class="red">-${team2data.toFixed(2)}</td></tr>`
                        }else{
                            html += `<td class="green">${team2data.toFixed(2) * -1}</td></tr>`
                        }
                    }
                    html += `<tr class="totleCount">
                    <td>Total</td>`
                    if(sumOfTeamA.toFixed(2) > 0){
                        html += `<td class="red"> -${sumOfTeamA.toFixed(2)}</td>`
                    }else{
                        html += `<td class="green"> ${sumOfTeamA.toFixed(2) * -1}</td>`
                    }
                    
                    if(sumOfTeamB.toFixed(2) > 0){
                        html += `<td class="red">-${sumOfTeamB.toFixed(2)}</td></tr>`
                    }else{
                        html += `<td class="green">${sumOfTeamB.toFixed(2) * -1}</td></tr>`
                    }
                //     `<td>${sumOfTeamA.toFixed(2)}</td>
                //     <td>${sumOfTeamB.toFixed(2)}</td>
                // </tr>`
                    document.getElementById('match_odd').innerHTML = html
                }else{
                    if(data.newData == false){
                        $('.tabelBodyTr').remove()
                        if($('.headDetail').length ){
                            $('.headDetail').after(`<tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr>`)
                        }else{
                            $('tbody').html(`<tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr>`)

                        }
                    }else{
                        $('#match_odd').html(`<tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr>`)
                    }
                }
            })
