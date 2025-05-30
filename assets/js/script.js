// Remove unnecessary require (not used in this file)
// const { act } = require("react");

$(function () {
  // Toggle navbar background on scroll
  $(window).on("scroll", function () {
    const scrolled = $(this).scrollTop() > 50;
    $(".navbar")
      .toggleClass("scrolled", scrolled)
      .toggleClass("transparent", !scrolled);
    $("#goTopBtn").fadeToggle(scrolled);
  });

  // Go to top button click handler
  $("#goTopBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

  // Text writing effect
  const texts = ["ong Lyher "];
  let textIndex = 0,
    charIndex = 0,
    isDeleting = false;
  const speed = 100,
    pause = 2000;

  function typeText() {
    const currentText = texts[textIndex];
    $("#typedText").text(currentText.substring(0, charIndex));

    if (!isDeleting && charIndex < currentText.length) {
      charIndex++;
      setTimeout(typeText, speed);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeText, speed / 2);
    } else {
      isDeleting = !isDeleting;
      if (isDeleting) {
        setTimeout(typeText, pause);
      } else {
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeText, speed);
      }
    }
  }
  typeText();
  let currentType = "Project";
  let currentCategory = "all";
  let portfolioData = [];

  let currentMainCategory = "project";
  let currentSubCategory = "all";
  let allData = [];

  function updateSubCategoryDropdown(data) {
    const subCategories = new Set();
    data.forEach((item) => {
      if (item.mainCategory === currentMainCategory) {
        subCategories.add(item.subCategory);
      }
    });

    const $dropdown = $("#subCategorySelect");
    $dropdown.empty().append('<option value="all">All</option>');

    subCategories.forEach((sub) => {
      $dropdown.append(`<option value="${sub}">${sub}</option>`);
    });
  }

  function loadPortfolioData() {
    $.getJSON("portfolio.json", function (data) {
      allData = data;
      updateSubCategoryDropdown(data);
      renderPortfolioItems();
    }).fail(() => {
      console.error("Failed to load portfolio.json");
    });
  }

  function renderPortfolioItems() {
    $("#portfolioContainer").empty();

    const filtered = allData.filter((item) => {
      return (
        item.mainCategory === currentMainCategory &&
        (currentSubCategory === "all" ||
          item.subCategory === currentSubCategory)
      );
    });

    if (filtered.length === 0) {
      $("#portfolioContainer").append(
        `<div class="col-12 text-center text-light">No items found.</div>`
      );
      return;
    }

    filtered.forEach((item) => {
      const demoLinkHtml = item.demoLink
        ? `<a href="${item.demoLink}" target="_blank" rel="noopener" class="card-of-portfolio-demo">
        Live Demo  <i class="bi bi-box-arrow-up-right ps-1"></i>
          </a>`
        : "";

      const detailLinkHtml = item.detailLink
        ? `<a href="${item.detailLink}" target="_blank" rel="noopener" class="card-of-portfolio-details">
         Details <i class="bi bi-info-circle ps-1"></i>
          </a>`
        : "";

      $("#portfolioContainer").append(`
      <div class="col-12 col-md-6 col-lg-4 py-3" data-aos="fade-up" data-aos-duration="1000">
        <div class="portfolio-item p-3 h-100">
          <img src="${item.image}" class="img-fluid rounded" alt="${item.title}">
          <h4 class="pt-2 text-light">${item.title}</h4>
          <p class="text-light">${item.description}</p>
          <div class="d-flex justify-content-between mt-auto">${demoLinkHtml}${detailLinkHtml}</div>
        </div>
      </div>
    `);
    });
  }

  // Event listeners
  $(document).ready(function () {
    // Main Category Click
    $("#mainCategoryButtons").on("click", ".main-btn", function () {
      $(".main-btn").removeClass("active");
      $(this).addClass("active");
      currentMainCategory = $(this).data("main");
      currentSubCategory = "all";
      updateSubCategoryDropdown(allData);
      renderPortfolioItems();
    });

    // Subcategory Dropdown Change
    $("#subCategorySelect").on("change", function () {
      currentSubCategory = $(this).val();
      renderPortfolioItems();
    });

    loadPortfolioData(); // initial load
  });
});
