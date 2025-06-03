// Get the button
const goTopBtn = document.getElementById("goTopBtn");

// Function to show/hide button based on scroll position
function toggleGoTopButton() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goTopBtn.style.display = "flex"; // Changed to flex to match the CSS
    } else {
        goTopBtn.style.display = "none";
    }
}

// Function to scroll to top smoothly
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Add event listeners
if (goTopBtn) {
    // Scroll event listener
    window.addEventListener('scroll', toggleGoTopButton);
    
    // Click event listener
    goTopBtn.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleGoTopButton();
} 