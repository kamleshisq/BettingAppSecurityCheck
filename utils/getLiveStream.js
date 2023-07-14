const fetch = require('node-fetch');

async function getLiveStream(id, ipv4){
    let DATA
    // console.log(id)
    let body = {
            "ipv4":`${ipv4}`,
            "channel":`${id}`
        };
    var fullUrl = `https://score-session.dbm9.com/api/tv-stream-2`;
    await fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'accept': 'application/json' },
        body:JSON.stringify(body)
    })
    .then(res =>res.json())
    .then(result => {
        DATA = result
    })
    return DATA
}

module.exports = getLiveStream