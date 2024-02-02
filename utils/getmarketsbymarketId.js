const fetch = require("node-fetch")

async function getmarketdetails(array){
    let Data
    let marketids = array;
    try{

        var fullUrl = 'http://127.0.0.1:8883/api/v1/getmarketdata';
        await fetch(fullUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
            },
            body:JSON.stringify({marketids}) 
        })
        .then(res =>res.json())
        .then(result => {

            Data = result.result
        })
    }catch(err){
        console.log(err, "fetchERROr")
        var fullUrl = 'http://127.0.0.1:8883/api/v1/getmarketdata';
        await fetch(fullUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
            },
            body:JSON.stringify({marketids}) 
        })
        .then(res =>res.text())
        .then(result => {
           console.log(result)
        })
    }
    return Data
}

module.exports = getmarketdetails