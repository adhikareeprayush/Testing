document.addEventListener("DOMContentLoaded", function () {
  const minRange = document.getElementById("minRange");
  const maxRange = document.getElementById("maxRange");
  const minInput = document.getElementById("minInput");
  const maxInput = document.getElementById("maxInput");
  const sliderRange = document.getElementById("sliderRange");

  function updateSlider() {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);

    // Ensure min doesn't exceed max and vice versa
    if (minVal > maxVal) {
      [minRange.value, maxRange.value] = [maxRange.value, minRange.value];
      minVal = parseInt(minRange.value);
      maxVal = parseInt(maxRange.value);
    }

    // Update input field values
    minInput.value = minVal;
    maxInput.value = maxVal;

    // Calculate the percentage for the green range
    const minPercent = (minVal / 1000) * 100;
    const maxPercent = (maxVal / 1000) * 100;

    // Update slider range to show only the green active area
    sliderRange.style.left = minPercent + "%";
    sliderRange.style.width = maxPercent - minPercent + "%";
  }

  function updateFromInput() {
    let minVal = parseInt(minInput.value) || 0;
    let maxVal = parseInt(maxInput.value) || 1000;

    // Ensure valid ranges
    if (minVal < 0) minVal = 0;
    if (maxVal > 1000) maxVal = 1000;
    if (minVal > maxVal) minVal = maxVal;

    // Update sliders
    minRange.value = minVal;
    maxRange.value = maxVal;

    updateSlider();
  }

  minRange.addEventListener("input", updateSlider);
  maxRange.addEventListener("input", updateSlider);
  minInput.addEventListener("input", updateFromInput);
  maxInput.addEventListener("input", updateFromInput);

  // Initialize on page load
  updateSlider();

  // Hamburger Menu Toggle
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });

  // Close menu when a link is clicked
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !hamburger.contains(event.target) &&
      !mobileMenu.contains(event.target)
    ) {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
    }
  });

  // Filter Sidebar Toggle (Mobile)
  const filterToggleMobile = document.getElementById("filterToggleMobile");
  const filterCloseMobile = document.getElementById("filterCloseMobile");
  const filterSidebar = document.getElementById("filterSidebar");

  // Open filter sidebar
  filterToggleMobile.addEventListener("click", function () {
    filterSidebar.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close filter sidebar
  filterCloseMobile.addEventListener("click", function () {
    filterSidebar.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Close filter when clicking outside (on mobile)
  document.addEventListener("click", function (event) {
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) {
      if (
        !filterSidebar.contains(event.target) &&
        !filterToggleMobile.contains(event.target)
      ) {
        filterSidebar.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    }
  });

  // Handle window resize to reset filter state on desktop
  window.addEventListener("resize", function () {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      filterSidebar.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Route product cards to individual product page
  const productCards = document.querySelectorAll(".grid .group");
  productCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Prevent navigation if cart button was clicked
      if (e.target.closest("button")) {
        e.stopPropagation();
        return;
      }
      // Navigate to product individual page
      window.location.href = "product_individual.html";
    });
  });
});
