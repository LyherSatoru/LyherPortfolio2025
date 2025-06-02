// Remove unnecessary require (not used in this file)
// const { act } = require("react");

$(function () {
  // Show "Go to Top" button when scrolling down or up, hide only at top
  $(window).on("scroll", function () {
    const scrollTop = $(this).scrollTop();
    const scrolled = scrollTop > 50;
    $(".navbar")
      .toggleClass("scrolled", scrolled)
      .toggleClass("transparent", !scrolled);

    if (scrollTop > 0) {
      // Show button when not at top
      $("#goTopBtn").fadeIn();
    } else {
      // Hide button at top
      $("#goTopBtn").fadeOut();
    }
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

  let currentMainCategory = "project";
  let currentSubCategory = "all";
  let allData = [];
  let visibleCount = 3; // Number of items to show initially and per click

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
      renderPortfolioItems(true);
    }).fail(() => {
      console.error("Failed to load portfolio.json");
    });
  }

  function renderPortfolioItems(reset = false) {
    if (reset) visibleCount = 3;
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
      $("#showMoreBtn").remove(); // Remove button if present
      $("#viewAllBtn").remove(); // Remove view all button if present
      return;
    }

    // Show only up to visibleCount items
    filtered.slice(0, visibleCount).forEach((item) => {
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
      <div class="col-12 col-md-6 col-lg-4 py-3 card-hover" data-aos="fade-up" data-aos-duration="1000">
        <div class="portfolio-item p-3 h-100">
          <img src="${item.image}" class="img-fluid rounded" alt="${item.title}">
          <h4 class="pt-2 text-light">${item.title}</h4>
          <p class="text-light">${item.description}</p>
          <div class="d-flex justify-content-between mt-auto">${demoLinkHtml}${detailLinkHtml}</div>
        </div>
      </div>
    `);
    });

    // Show or hide the "Show More" button
    if (filtered.length > visibleCount) {
      if ($("#showMoreBtn").length === 0) {
        $("#portfolioContainer").after(`
          <div class="text-center mt-3" id="portfolioButtonsContainer">
            <button id="showMoreBtn" class="btn btn-primary me-2">Show More</button>
            <a href="portfolio.html" id="viewAllBtn" class="btn btn-outline-light">View All</a>
          </div>
        `);
      }
    } else {
      $("#showMoreBtn").remove();
      // Add View All button if not present
      if ($("#viewAllBtn").length === 0) {
        $("#portfolioContainer").after(`
          <div class="text-center mt-3" id="portfolioButtonsContainer">
            <a href="portfolio.html" id="viewAllBtn" class="btn btn-outline-light">View All</a>
          </div>
        `);
      }
    }
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
      renderPortfolioItems(true);
    });

    // Subcategory Dropdown Change
    $("#subCategorySelect").on("change", function () {
      currentSubCategory = $(this).val();
      renderPortfolioItems(true);
    });

    // Show More button click
    $(document).on("click", "#showMoreBtn", function () {
      visibleCount += 3;
      renderPortfolioItems();
    });

    loadPortfolioData(); // initial load
  });

// ================== nav active ==================
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar-nav li a");

  window.addEventListener("scroll", () => {
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100; // adjust for your header height
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSectionId) {
        link.classList.add("active");
      }
    });
  });
});

// ==============
fetch("cards.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("contactCardsContainer");

    data.forEach((card) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-3 mb-4 d-flex"; // add d-flex for flexbox

      col.innerHTML = `
        <a href="${card.link}" class="nav-link w-100" target="_blank" style="height:100%;">
          <div class="card contact-card h-100 d-flex flex-column justify-content-between">
            <div class="card-body text-center d-flex flex-column align-items-center">
              <img src="${card.icon}" class="icon-img mb-3 mx-auto d-block" alt="${card.title}" data-shadow-color="${card.shadowColor || '#00f6ff'}">
              <h5 class="card-title text-gradient">${card.title}</h5>
              <p class="card-text text-light flex-grow-1">${card.text}</p>
            </div>
          </div>
        </a>
      `;

      container.appendChild(col);
    });

    // Apply glowing effect to images using shadowColor from data
    document.querySelectorAll('.contact-card img').forEach(img => {
      const shadowColor = img.getAttribute('data-shadow-color') || '#00f6ff';
      img.style.filter = `drop-shadow(0 4px 16px ${shadowColor})`;
    });
  })
  .catch((error) => console.error("Error loading cards.json:", error));
    
  });
