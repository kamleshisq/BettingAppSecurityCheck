const fetch = require("node-fetch")

async function getmarketdetails(array){
    let Data
    let body = JSON.stringify(array);
    try{

        var fullUrl = 'https://oddsserver.dbm9.com/dream/get_odds';
        await fetch(fullUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body:body 
        })
        .then(res =>res.json())
        .then(result => {
            Data = result
        })
    }catch(err){
        console.log(err, "fetchERROr")
        var fullUrl = 'https://oddsserver.dbm9.com/dream/get_odds';
        await fetch(fullUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body:body 
        })
        .then(res =>res.text())
        .then(result => {
           console.log(result)
        })
    }
    return Data
}

module.exports = getmarketdetails