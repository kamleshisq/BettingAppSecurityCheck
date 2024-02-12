const fetch = require("node-fetch") 


async function getSportList(){
    let DATA
    var fullUrl = 'http://127.0.0.1:8084/api/v1/getsportdata';
    await fetch(fullUrl, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
        }
    })
    .then(res => res.json())
    .then(result => {
        DATA = result
        // console.log(result)
    })
    return DATA
}

module.exports = getSportList