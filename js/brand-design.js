/* =========================================
   PIXELSTUDIO - BRAND DESIGN
========================================= */

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");


/* =========================================
   THEME TOGGLE
========================================= */

const savedTheme = localStorage.getItem("pixelstudio-theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☾";
} else {
    themeToggle.textContent = "☀";
}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");

    themeToggle.textContent = isLight ? "☾" : "☀";

    localStorage.setItem(
        "pixelstudio-theme",
        isLight ? "light" : "dark"
    );

});


/* =========================================
   MOBILE MENU
========================================= */

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("open");

});


/* Close menu after clicking */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

    });

});


/* =========================================
   REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(
    ".feature-card, .process-card, .showcase-card, .variation-box"
);

const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition =
        "opacity .6s ease, transform .6s ease";

    revealObserver.observe(element);

});