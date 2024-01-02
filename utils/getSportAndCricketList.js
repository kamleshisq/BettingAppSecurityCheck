const fetch = require("node-fetch") ;


async function getSportDATA(){

    let fullUrl = "http://admin-api.dreamexch9.com/api/dream/cron/get-cricketdata";
    let fullUrl1 = "http://admin-api.dreamexch9.com/api/dream/cron/get-sportdata";
    let urls = [
        {
            url:fullUrl,
            name:'cricket'
        },
        {
            url:fullUrl1,
            name:'Sports'
        }
    ]
    let requests = urls.map(item => fetch(item.url, {
        method: 'GET'
    }).then(data => data.json()));
    let requests2 = urls.map(item => fetch(item.url, {
        method: 'GET'
    }).then(data => data.text()));
    let data
    try{
        data = await Promise.all(requests)

    }catch(err){
        // console.log(err, "ERROR")

        data = await Promise.all(requests2)
        console.log(data)
    }
    return data
}

module.exports = getSportDATA