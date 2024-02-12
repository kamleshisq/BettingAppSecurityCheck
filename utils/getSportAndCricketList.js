const fetch = require("node-fetch") ;


async function getSportDATA(){

    let fullUrl = "http://127.0.0.1:8084/api/v1/getcricketdata";
    let fullUrl1 = "http://127.0.0.1:8084/api/v1/getsportdata";
    let urls = [
        {
            url:fullUrl,
            name:'cricket'
        },
        {
            url:fullUrl1,
            name:'Sports'
        }
    ]
    let requests = urls.map(item => fetch(item.url, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
          }
    }).then(data => data.json()).then(data => data.result));
    let requests2 = urls.map(item => fetch(item.url, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
          }
    }).then(data => data.text()));
    let data
    try{
        data = await Promise.all(requests)
        // console.log(data)

    }catch(err){
        // console.log(err, "ERROR")

        data = await Promise.all(requests2)
        // console.log(data)
    }
    return data
}

module.exports = getSportDATA