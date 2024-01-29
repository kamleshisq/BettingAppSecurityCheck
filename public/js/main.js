
// 		$(document).ready(function(){
// 		  $('.my-slider1').slick({
// 			slidesToShow: 1,
// 			slidesToScroll: 1,
// 			arrows: true,
// 			dots: true,
// 			speed: 300,
// 			infinite: true,
// 			autoplaySpeed: 2000,
// 			autoplay: true,
// 			cssEase: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
// 			 cssEase: 'linear',
// 			responsive: [
// 		  {
// 			breakpoint: 991,
// 			settings: {
// 			  slidesToShow: 1	,
// 			}
// 		  },
// 		  {
// 			breakpoint: 767,
// 			settings: {
// 			  slidesToShow: 1,
// 			  arrows: false,
// 			dots: false,
// 			}
// 		  }
// 		]
// 		  });
// 		});
	  

//     $(document).ready(function(){
// 		  $('.my-slider').slick({
// 			slidesToShow: 2,
// 			slidesToScroll: 2,
// 			arrows: true,
// 			dots: true,
// 			speed: 300,
// 			infinite: true,
// 			autoplaySpeed: 2000,
// 			autoplay: true,
// 			cssEase: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
// 			 cssEase: 'linear',
// 			responsive: [
// 		  {
// 			breakpoint: 991,
// 			settings: {
// 			  slidesToShow: 1	,
// 			}
// 		  },
// 		  {
// 			breakpoint: 767,
// 			settings: {
// 			  slidesToShow: 1,
// 			  arrows: false,
// 			dots: false,
// 			}
// 		  }
// 		]
// 		  });
// 		});


// // first tab
//     function openCity(evt, cityName) {
//     var i, tabcontent, tablinks;
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//       tabcontent[i].style.display = "none";
//     }
//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//       tablinks[i].className = tablinks[i].className.replace(" active", "");
//     }
//     document.getElementById(cityName).style.display = "block";
//     evt.currentTarget.className += " active";
    
//   }
//   document.getElementById("defaultOpen").click();



 
// // second tab 
  

//       const tabs = document.querySelectorAll('[data-tab-value]')
//       const tabInfos = document.querySelectorAll('[data-tab-info]')

//       tabs.forEach(tab => {
//           tab.addEventListener('click', () => {
//               const target = document
//                   .querySelector(tab.dataset.tabValue);

//               tabInfos.forEach(tabInfo => {
//                   tabInfo.classList.remove('active')
//               })
//               target.classList.add('active');
//           })
//       })


// 	//   

// 	$(".box-video").click(function(){
// 		$('iframe',this)[0].src += "&amp;autoplay=1";
// 		$(this).addClass('open');
// 	  });


// 	  // Graph
// var ctx = document.getElementById("myChart");

// var myChart = new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ],
//     datasets: [
//       {
//         data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
//         lineTension: 0,
//         backgroundColor: "transparent",
//         borderColor: "#007bff",
//         borderWidth: 4,
//         pointBackgroundColor: "#007bff",
//       },
//     ],
//   },
//   options: {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: false,
//           },
//         },
//       ],
//     },
//     legend: {
//       display: false,
//     },
//   },
// });


document.addEventListener("DOMContentLoaded", function(event) {
	const showNavbar = (toggleId, navId, bodyId, headerId) =>{
		const toggle = document.getElementById(toggleId),
		nav = document.getElementById(navId),
		bodypd = document.getElementById(bodyId),
		headerpd = document.getElementById(headerId)
		
		// Validate that all variables exist
	if(toggle && nav && bodypd && headerpd){
			toggle.addEventListener('click', ()=>{
				// show navbar
				nav.classList.toggle('show')
				console.log('WORKING1321654654656')
				// change icon
	toggle.classList.toggle('bx-x')
	// add padding to body
	bodypd.classList.toggle('body-pd')
	// add padding to header
	headerpd.classList.toggle('body-pd')
	})
	}
	}
	
	showNavbar('header-toggle','nav-bar','body-pd','header')
	
	/*===== LINK ACTIVE =====*/
	// const linkColor = document.querySelectorAll('.nav_link')
	
	// function colorLink(){
	// if(linkColor){
	// linkColor.forEach(l=> l.classList.remove('active'))
	// this.classList.add('active')
	// }
	// }
	// linkColor.forEach(l=> l.addEventListener('click', colorLink))
	
	 // Your code to run since DOM is loaded and ready
	});