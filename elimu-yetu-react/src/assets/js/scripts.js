console.log("JavaScript file is loaded!");

// Function to enable or disable scrolling based on the screen size
 function handleScreenResize() {
    const newMaterialsContainer = document.getElementById("new-materials");
    const mostDownloadedContainer = document.getElementById("most-downloaded");
    const screenWidth = window.innerWidth;


     // Debugging logs
     console.log('Screen width:', screenWidth);
     console.log('New Materials Container:', newMaterialsContainer);
     console.log('Most Downloaded Container:', mostDownloadedContainer);

    // If the screen width is <= 576px, enable scrolling
    if (screenWidth <= 576) {
      newMaterialsContainer.style.overflowX = "auto";
      mostDownloadedContainer.style.overflowX = "auto";
    } else {
      newMaterialsContainer.style.overflowX = "hidden";
      mostDownloadedContainer.style.overflowX = "hidden";
    }
  }

  // Listen to the window resize event and trigger the function
  window.addEventListener("resize", handleScreenResize);

  // Initial call to handle current screen size
  handleScreenResize();


//JQUERY CODE
(function ($) {
  "use strict";

  // Back to top button visibility control
  function checkScroll() {
      if ($(window).scrollTop() > 100) {
          $('.back-to-top').fadeIn('slow');
      } else {
          $('.back-to-top').fadeOut('slow');
      }
  }

  // Bind the scroll event to check button visibility
  $(window).on('scroll', checkScroll);

  // Back to top button click event
  $('.back-to-top').click(function () {
      // Animate the scroll to the top
      $('html, body').stop().animate({scrollTop: 0}, 1500, 'easeInOutExpo');

      // Temporarily unbind scroll during animation and rebind afterward
      $(window).off('scroll');
      $(window).on('scroll', checkScroll);
  });

})(jQuery);




