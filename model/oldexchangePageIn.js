exports.getExchangePageIn = catchAsync(async(req, res, next) => {
    let ip = req.ip
    let ipv4
    if (ip.indexOf('::ffff:') === 0) {
        // Extract the IPv4 portion from the IPv6 address
        ipv4 = ip.split('::ffff:')[1];
    }else{
        ipv4 = ip
    }
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    let match = cricket.find(item => item.eventData.eventId == req.query.id);
    if(match === undefined){
        let data1liveCricket = sportData[1].gameList.map(item => item.eventList.find(item1 => item1.eventData.eventId == req.query.id))
        match = data1liveCricket.find(item => item != undefined)
    }
    if(match == undefined){
        res.status(404).json({
            status:"Success",
            message:"This match is no more live"
        })
    }
    const liveStream = await liveStreameData(match.eventData.channelId, ipv4)
    const src_regex = /src='([^']+)'/;
    let match1
    let src
    if(liveStream.data){

        match1 = liveStream.data.match(src_regex);
        if (match1) {
            src = match1[1];
        } else {
            console.log("No 'src' attribute found in the iframe tag.");
        }
        // console.log(src, 123)
    }
    // console.log(match.marketList.goals)
    // let session = match.marketList.session.filter(item => {
        //     let date = new Date(item.updated_on);
        //     return date < Date.now() - 1000 * 60 * 60;
        // });
        // let SportLimits = betLimit.find(item => item.type === "Sport")
        // let min 
        // let max 
        // if (SportLimits.min_stake >= 1000) {
        //     min = (SportLimits.min_stake / 1000) + 'K';
        // } else {
        //     min = SportLimits.min_stake.toString();
        // }
        // if (SportLimits.max_stake >= 1000) {
        //     max = (SportLimits.max_stake / 1000) + 'K';
        //   } else {
        //     max = SportLimits.max_stake.toString();
        // }
        // console.log(SportLimits, min , max)
        let userLog
        let stakeLabledata
        let userMultimarkets
        let betsOnthisMatch = []
        let rules = await gamrRuleModel.find()
        if(req.currentUser){
            userLog = await loginLogs.find({user_id:req.currentUser._id})
            userMultimarkets = await multimarkets.findOne({userId:req.currentUser._id})
            stakeLabledata = await stakeLable.findOne({userId:req.currentUser._id})
            if(stakeLabledata === null){
                stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
            }
            betsOnthisMatch = await betModel.find({userId:req.currentUser._id, match:match.eventData.name, status: 'OPEN'})
        }else{
            stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
        }
        let filtertinMatch = {}
        let sportName = ''
        if(match.eventData.sportId === 1){
            filtertinMatch = {
                type : {
                    $in :['Home', "Football", 'Football/matchOdds', match.eventData.league, match.eventData.name]
                }
            }

            sportName = 'Football'
        }else if (match.eventData.sportId === 2){
            filtertinMatch = {
                type : {
                    $in :['Home', "Tennis", 'Tennis/matchOdds', match.eventData.league, match.eventData.name]
                }
            }
            sportName = 'Tennis'
        }else if(match.eventData.sportId === 4){
            filtertinMatch = {
                type : {
                    $in :['Home', "Cricket", 'Cricket/matchOdds', "Cricket/bookMaker", 'Cricket/fency', match.eventData.league, match.eventData.name]
                }
            }
            sportName = 'Cricket'
        }

        const betLimit = await betLimitModel.aggregate([
            {
                $match:filtertinMatch
            }
        ])
        let maxByMatch = 0
        let minByMatch = 10000000000000
        for (let index = 0; index < betLimit.length; index++) {
            if (
                betLimit[index].type === 'Home' ||
                betLimit[index].type === sportName ||
                betLimit[index].type === match.eventData.league ||
                betLimit[index].type === match.eventData.name
              ) {
                if(minByMatch > betLimit[index].min_stake){
                    minByMatch = betLimit[index].min_stake
                }

                if(maxByMatch < betLimit[index].max_stake){
                    maxByMatch = betLimit[index].max_stake
                }
            }
        }
        let MATCHODDS = betLimit.find(item => item.type == `${sportName}/matchOdds`)
        let FENCY = betLimit.find(item => item.type == `${sportName}/fency`)
        let BOOKMAKER = betLimit.find(item => item.type == `${sportName}/bookMaker`)

        let minBookMaker = minByMatch
        let maxBookMaker = maxByMatch
        let minMatchOdds = minByMatch
        let maxMatchOdds = maxByMatch
        let minFancy = minByMatch
        let maxFancy = maxByMatch
        if(MATCHODDS){
            if(minMatchOdds > MATCHODDS.min_stake){
                minMatchOdds = MATCHODDS.min_stake
            }

            if(maxMatchOdds < MATCHODDS.max_stake){
                maxMatchOdds = MATCHODDS.max_stake
            }
        }

        if(FENCY){
            if(minFancy > FENCY.min_stake){
                minFancy = FENCY.min_stake
            }

            if(maxFancy < FENCY.max_stake){
                maxFancy = FENCY.max_stake
            }
        }

        if(BOOKMAKER){
            if(minBookMaker > BOOKMAKER.min_stake){
                minBookMaker = BOOKMAKER.min_stake
            }

            if(maxBookMaker < BOOKMAKER.max_stake){
                maxBookMaker = BOOKMAKER.max_stake
            }
        }


        const betLimitMarekt = await betLimitMatchWisemodel.findOne({matchTitle:match.eventData.name})
        
        res.status(200).render("./userSideEjs/userMatchDetails/main",{
            user: req.currentUser,
            verticalMenus,
            check:"ExchangeIn",
            match,
            liveStream,
            userLog,
            notifications:req.notifications,
            stakeLabledata,
            betsOnthisMatch,
            rules,
            src,
            userMultimarkets,
            betLimitMarekt,
            minMatchOdds,
            maxMatchOdds,
            minFancy,
            maxFancy,
            minBookMaker,
            maxBookMaker
    })
});