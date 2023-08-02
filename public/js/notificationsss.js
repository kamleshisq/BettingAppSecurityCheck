export const notificationsss = async(data) => {
    document.getElementById("popup-1").classList.toggle("active");
    document.getElementById('redPopUP').innerText  = data
    setTimeout(function(){document.getElementById("popup-1").classList.toggle("active")}, 2000);
}