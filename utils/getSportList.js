const fetch = require("node-fetch") 
const fullUrl = "https://admin-api.dreamexch9.com/api/dream/cron/get-sportdata"


async function getSportList(){
    let data
    fetch(fullUrl, {
        method: 'GET'
    })
    .then(res =>res.json())
    .then(result => {
        data=result
    })
    console.log(data, 1)
    return data
}

module.exports = getSportList