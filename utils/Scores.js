const fetch = require('node-fetch');

async function getScore(id){
    let DATA
    var fullUrl = `https://score-session.dbm9.com/api/get-live-score?event_id=${id}`;
    await fetch(fullUrl, {
        method: 'GET'
    })
    .then(res =>res.json())
    .then(result => {
        DATA = result
    })
    return DATA
}

module.exports = getScore