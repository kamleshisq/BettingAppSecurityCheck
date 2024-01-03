const fetch = require("node-fetch") ;



async function getSportDATA(id){

    var fullUrl = `https://fbot.1cricket.co/api/Admin/getmarketsbysid/?sid=${id}`;
    let result = await fetch(fullUrl, {
        method: 'GET'
    })
    let jsonresult = await result.json()
    let finalresult = JSON.parse(jsonresult)

    return finalresult
}

module.exports = getSportDATA