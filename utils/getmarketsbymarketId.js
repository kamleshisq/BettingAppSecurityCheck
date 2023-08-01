const fetch = require("node-fetch")

async function getmarketdetails(array){
    let Data
    let body = JSON.stringify(array);
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
    }).catch(error => {
        console.error("Error occurred while parsing JSON:", error);
        return fetch(fullUrl);
    }).then(res => res.text())
    .then(result => {
      console.log(result); // Handle the response text from the second fetch
    });
    return Data
}

module.exports = getmarketdetails