
   function checkScreenWidth() {
    var responsiveElements = document.querySelectorAll('.responsive');
    responsiveElements.forEach(function(element) {
      console.log("Working 4545545454545454")
      if (window.innerWidth < 767) {
      element.classList.add('new-class');
    } else {
      element.classList.remove('new-class');
    }
    })
  }
  checkScreenWidth();
  window.addEventListener('resize', checkScreenWidth);