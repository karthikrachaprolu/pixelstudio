/* =========================================
   PIXELSTUDIO
   MARKETING MATERIALS
========================================= */


/* =========================
   THEME TOGGLE
========================= */

const themeToggle =
    document.getElementById("themeToggle");

let lightMode = false;

try {
    lightMode =
        localStorage.getItem("marketingTheme") === "light";
} catch (error) {
    lightMode = false;
}


function applyTheme(light) {

    document.body.classList.toggle(
        "light-mode",
        light
    );

    if (themeToggle) {
        themeToggle.textContent =
            light ? "☾" : "☀";
    }
}


applyTheme(lightMode);


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            lightMode =
                !document.body.classList.contains(
                    "light-mode"
                );

            applyTheme(lightMode);

            try {

                localStorage.setItem(
                    "marketingTheme",
                    lightMode ? "light" : "dark"
                );

            } catch (error) {

                // Ignore storage errors

            }

        }
    );

}


/* =========================
   TOAST
========================= */

const toast =
    document.getElementById("toast");

let toastTimer;


function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(
        () => {

            toast.classList.remove("show");

        },
        2200
    );

}


/* =========================
   MATERIAL BUTTONS
========================= */

const materialButtons =
    document.querySelectorAll(
        ".material-btn"
    );


materialButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const material =
                button.dataset.material;

            showToast(
                `${material} selected`
            );

        }
    );

});


/* =========================
   SCROLL REVEAL
========================= */

const revealItems =
    document.querySelectorAll(
        ".material-card, .system-card, .process-card"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealItems.forEach(item => {

    item.style.opacity = "0";

    item.style.transform =
        "translateY(25px)";

    item.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(item);

});