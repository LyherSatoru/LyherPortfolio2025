$(function () {
    // Toggle navbar background on scroll
    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 50) {
        $(".navbar").removeClass("transparent").addClass("scrolled");
        $("#goTopBtn").fadeIn();
      } else {
        $(".navbar").removeClass("scrolled").addClass("transparent");
        $("#goTopBtn").fadeOut();
      }
    });
  
    // Go to top button click handler
    $("#goTopBtn").click(function () {
      $("html, body").animate({ scrollTop: 0 }, "slow");
    });
  });
  