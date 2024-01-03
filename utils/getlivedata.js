const fetch = require("node-fetch") ;



async function getSportDATA(){

    var fullUrl = 'https://fbot.1cricket.co/api/Admin/getmarkets';
    let result = await fetch(fullUrl, {
        method: 'GET'
    })
    let jsonresult = await result.json()
    let finalresult = JSON.parse(jsonresult)

    return finalresult
}

module.exports = getSportDATA