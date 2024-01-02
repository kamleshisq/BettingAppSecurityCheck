const fetch = require('node-fetch');

async function getLiveStream(id, ipv4){
    let DATA
    // console.log(id)
    let body = {
            "ipv4":`172.105.58.243`,
            "channel":`${id}`
        };
    var fullUrl = `http://api2.dbm9.com/api/tv-stream`;
    await fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'accept': 'application/json' ,
            "Origin":"https://app.ollscores.com/",
            "Referer":"https://app.ollscores.com/"},
        body:JSON.stringify(body)
    })
    .then(res =>res.json())
    .then(result => {
        DATA = result
    })
    // console.log(DATA, "===> DATA")
    return DATA
}

module.exports = getLiveStream