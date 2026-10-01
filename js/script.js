/* =========================================================
   PIXELSTUDIO
   Main JavaScript
========================================================= */


/* =========================================================
   01. HERO SLIDER
========================================================= */

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".slider-dot");

const nextButton = document.getElementById("nextSlide");
const prevButton = document.getElementById("prevSlide");

let currentSlide = 0;
let autoSlide;


/* Show Selected Slide */

function showSlide(index) {

    if (!slides.length) return;

    /* Keep index inside range */

    if (index >= slides.length) {
        currentSlide = 0;
    }

    if (index < 0) {
        currentSlide = slides.length - 1;
    }

    /* Remove active state */

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });


    /* Add active state */

    slides[currentSlide].classList.add("active");

    if (dots[currentSlide]) {
        dots[currentSlide].classList.add("active");
    }

}


/* Next Slide */

function nextSlide() {

    currentSlide++;

    showSlide(currentSlide);

    restartAutoSlide();

}


/* Previous Slide */

function previousSlide() {

    currentSlide--;

    showSlide(currentSlide);

    restartAutoSlide();

}


/* Next Button */

if (nextButton) {

    nextButton.addEventListener("click", nextSlide);

}


/* Previous Button */

if (prevButton) {

    prevButton.addEventListener("click", previousSlide);

}


/* Slider Dots */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentSlide = index;

        showSlide(currentSlide);

        restartAutoSlide();

    });

});


/* =========================================================
   AUTO SLIDER
========================================================= */

function startAutoSlide() {

    autoSlide = setInterval(() => {

        currentSlide++;

        showSlide(currentSlide);

    }, 5000);

}


function restartAutoSlide() {

    clearInterval(autoSlide);

    startAutoSlide();

}


/* Start Slider */

if (slides.length > 0) {

    showSlide(currentSlide);

    startAutoSlide();

}


/* =========================================================
   02. DARK / LIGHT MODE
========================================================= */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");


/* Apply Saved Theme */

const savedTheme = localStorage.getItem("pixelstudio-theme");


if (savedTheme === "light") {

    document.body.classList.add("light-mode");

    if (themeIcon) {
        themeIcon.textContent = "☾";
    }

} else {

    document.body.classList.remove("light-mode");

    if (themeIcon) {
        themeIcon.textContent = "☀";
    }

}


/* Toggle Theme */

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");


        const isLightMode =
            document.body.classList.contains("light-mode");


        if (isLightMode) {

            localStorage.setItem(
                "pixelstudio-theme",
                "light"
            );

            if (themeIcon) {
                themeIcon.textContent = "☾";
            }

        } else {

            localStorage.setItem(
                "pixelstudio-theme",
                "dark"
            );

            if (themeIcon) {
                themeIcon.textContent = "☀";
            }

        }

    });

}


/* =========================================================
   03. MOBILE NAVIGATION
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");


if (menuToggle && navbar) {

    menuToggle.addEventListener("click", () => {

        navbar.classList.toggle("open");

    });


    /* Close Menu When Link Is Clicked */

    const navLinks =
        navbar.querySelectorAll(".nav-link");


    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navbar.classList.remove("open");

        });

    });

}


/* =========================================================
   04. CLOSE MOBILE MENU OUTSIDE
========================================================= */

document.addEventListener("click", (event) => {

    if (!navbar || !menuToggle) return;


    const clickedInsideNavbar =
        navbar.contains(event.target);

    const clickedMenuButton =
        menuToggle.contains(event.target);


    if (
        !clickedInsideNavbar &&
        !clickedMenuButton
    ) {

        navbar.classList.remove("open");

    }

});


/* =========================================================
   05. HEADER SCROLL EFFECT
========================================================= */

const header = document.getElementById("header");


window.addEventListener("scroll", () => {

    if (!header) return;


    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =========================================================
   06. ACTIVE NAVIGATION
========================================================= */

const currentPage =
    window.location.pathname.split("/").pop();


const navigationLinks =
    document.querySelectorAll(".nav-link");


navigationLinks.forEach((link) => {

    const linkPage =
        link.getAttribute("href");


    if (
        linkPage === currentPage ||
        (
            currentPage === "" &&
            linkPage === "index.html"
        )
    ) {

        link.classList.add("active");

    }

});


/* =========================================================
   07. SMOOTH SCROLL
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach((anchor) => {

    anchor.addEventListener("click", function (event) {

        const targetId =
            this.getAttribute("href");


        if (targetId === "#") return;


        const target =
            document.querySelector(targetId);


        if (target) {

            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =========================================================
   08. PAUSE SLIDER WHEN MOUSE IS OVER HERO
========================================================= */

const hero =
    document.querySelector(".hero");


if (hero) {

    hero.addEventListener("mouseenter", () => {

        clearInterval(autoSlide);

    });


    hero.addEventListener("mouseleave", () => {

        startAutoSlide();

    });

}


/* =========================================================
   09. KEYBOARD SLIDER CONTROLS
========================================================= */

document.addEventListener("keydown", (event) => {

    if (!slides.length) return;


    if (event.key === "ArrowRight") {

        nextSlide();

    }


    if (event.key === "ArrowLeft") {

        previousSlide();

    }

});


/* =========================================================
   10. VISIBILITY OPTIMIZATION
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            clearInterval(autoSlide);

        } else {

            startAutoSlide();

        }

    }
);


/* =========================================================
   PIXELSTUDIO INITIALIZED
========================================================= */

console.log(
    "PixelStudio website initialized successfully."
);