const fetch = require("node-fetch") ;



async function getSportDATA(data){
    console.log(data)
    var fullUrl = `https://fbot.1cricket.co/api/Admin/getmarketdetails`;
    let result = await fetch(fullUrl, {
        method: 'POST',
        headers:{
            "Accept":"application/json",
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({"mid":data})
    })
    let jsonresult = await result.json()
    console.log(jsonresult)

    return jsonresult
}

module.exports = getSportDATA