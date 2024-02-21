import axios from "axios";
import { toggleadminSide } from "./adminSideCustomPopup";
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
        console.log(res, "VVVVVVV")
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
    setTimeout(toggleadminSide(err.response.data.message,false), 1500)
    }
}
        