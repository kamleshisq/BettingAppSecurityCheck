const fetch = require('node-fetch');

async function getLiveStream(id, ipv4){
    let DATA
    console.log(ipv4)
    let body = {
            "ipv4":`${ipv4}`,
            "channel":`${id}`
        };
    var fullUrl = `https://api2.dbm9.com/api/tv-stream`;
    await fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'accept': 'application/json' ,
            "Origin":"http://ollscores.com",
            "Referer":"http://ollscores.com"},
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