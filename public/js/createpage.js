import axios from "axios";

export const createPage = async(data)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/pages/createPage',
            data
        });
        if(res.data.status === 'success'){
            alert('Page created successfully!!!!');
            // $(".popup_body").removeClass("popup_body_show");

            window.setTimeout(()=>{
                location.assign('/admin/pageManager')
            }, 200)
        }

    }catch(err){
        console.log(err)
    setTimeout(alert(err.response.data.message), 1500)
    }
}