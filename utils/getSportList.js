const fetch = require("node-fetch") 


async function getSportList(){
    let DATA
    var fullUrl = 'https://admin-api.dreamexch9.com/api/dream/cron/get-sportdata';
    fetch(fullUrl, {
        method: 'GET'
    })
    .then(res =>res.json())
    .then(result => {
        DATA = result
    })
    return DATA
}

module.exports = getSportList