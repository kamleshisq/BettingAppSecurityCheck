import axios from "axios";
export const getIframe = async(data) => {
    let body = {
        "ipv4":`${data.ipv4}`,
        "channel":`${data.id}`
    };
    try{
        const res = await axios({
            method: 'POST',
            url: 'https://api2.dbm9.com/api/tv-stream',
            data:body,
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json' ,
                "Origin":"http://ollscores.com",
                "Referer":"http://ollscores.com"},
        });
        // if(res.data.status === 'success'){
        //     alert('data update successfully!!!!');
        //     $(".popup_body").removeClass("popup_body_show");
        //     // window.setTimeout(()=>{
        //     //     location.assign('/userManagement')
        //     // }, 100)
        //     return res.data.user;
        // }
        console.log(res)
    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}
        