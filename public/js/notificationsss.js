export const notificationsss = async(data) => {
    
    if(data.status === "success"){
        document.getElementById("popup-1").classList.toggle("active");
        document.getElementById('redPopUP').innerText  = data.message
        // setTimeout(function(){document.getElementById("popup-1").classList.toggle("active")}, 5000);
    }else{
        document.getElementById("popup-2").classList.toggle("active");
        document.getElementById('redPopUP2').innerText  = data.message
        // setTimeout(function(){document.getElementById("popup-2").classList.toggle("active")}, 5000);
    }
}