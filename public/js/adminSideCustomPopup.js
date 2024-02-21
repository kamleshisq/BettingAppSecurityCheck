import toggleadminSide from "./adminSideCustomPopup";
export function toggleadminSide(message, status ){
        //console.log(message, status)
            var text = message;
            if(status){
                $("#success").fadeIn(500);
                $("#success").html("<div class='popup-content'><button class='close-popup'>X</button><p>"+text+"</p> </div>");
                $("#success .close-popup").click(function() {
                $(".alert-popup").fadeOut(500);
            });
            }
            else{
                $("#error").fadeIn(500);
                $("#error").html("<div class='popup-content'><button class='close-popup'>X</button><p>"+text+"</p> </div>");
                $("#error .close-popup").click(function() {
                $(".alert-popup").fadeOut(500);
            });
            }
            setTimeout(function () {
                $(".alert-popup").fadeOut(500);
            }, 1500);
    }