
// document.addEventListener("DOMContentLoaded", function(event) {
// 	const showNavbar = (toggleId, navId, bodyId, headerId) =>{
// 		const toggle = document.getElementById(toggleId),
// 		nav = document.getElementById(navId),
// 		bodypd = document.getElementById(bodyId),
// 		headerpd = document.getElementById(headerId)
		
// 		// Validate that all variables exist
// 	if(toggle && nav && bodypd && headerpd){
// 			toggle.addEventListener('click', ()=>{
// 				// show navbar
// 				try{
// 					nav.classList.toggle('show')
// 								// change icon
// 					toggle.classList.toggle('bx-x')
// 					// add padding to body
// 					bodypd.classList.toggle('body-pd')
// 					// add padding to header
// 					headerpd.classList.toggle('body-pd')
// 				}catch(err){
// 					console.log(err)
// 				}
// 	})
// 	}
// 	}
	
// 	showNavbar('header-toggle','nav-bar','body-pd','header')
// 	});






$(document).ready(function() {
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
      const toggle = $(`#${toggleId}`);
      const nav = $(`#${navId}`);
      const bodypd = $(`#${bodyId}`);
      const headerpd = $(`#${headerId}`);

      // Validate that all variables exist
      if (toggle.length && nav.length && bodypd.length && headerpd.length) {
        toggle.on('click', () => {
			console.log('WORKIGNNNNNNNNNNNNNNNNNNNNNNNN')
          // show navbar
          try {
            nav.toggleClass('show');
            // change icon
            toggle.toggleClass('bx-x');
            // add padding to body
            bodypd.toggleClass('body-pd');
            // add padding to header
            headerpd.toggleClass('body-pd');
          } catch (err) {
            console.log(err);
          }
        });
      }
    };

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
  });