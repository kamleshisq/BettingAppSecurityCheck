const fetch = require("node-fetch") ;


async function getSportDATA(){

    let fullUrl = "https://admin-api.dreamexch9.com/api/dream/cron/get-cricketdata";
    let fullUrl1 = "https://admin-api.dreamexch9.com/api/dream/cron/get-sportdata";
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
    }).then(data => data.text()));
    const data = await Promise.all(requests)
    console.log(data)
    return data
}

module.exports = getSportDATA