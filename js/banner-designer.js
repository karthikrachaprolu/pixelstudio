const bannerTitle =
    document.getElementById("bannerTitle");

const bannerDescription =
    document.getElementById("bannerDescription");

const buttonText =
    document.getElementById("buttonText");

const brandName =
    document.getElementById("brandName");

const backgroundColor =
    document.getElementById("backgroundColor");

const accentColor =
    document.getElementById("accentColor");

const textColor =
    document.getElementById("textColor");

const bannerPreview =
    document.getElementById("bannerPreview");

const previewTitle =
    document.getElementById("previewTitle");

const previewDescription =
    document.getElementById("previewDescription");

const previewButton =
    document.getElementById("previewButton");

const previewBrand =
    document.getElementById("previewBrand");

const generateBtn =
    document.getElementById("generateBtn");

const downloadBtn =
    document.getElementById("downloadBtn");


/* =========================
   UPDATE PREVIEW
========================= */

function updateBanner() {

    previewTitle.textContent =
        bannerTitle.value ||
        "Your Banner Title";

    previewDescription.textContent =
        bannerDescription.value ||
        "Your banner description goes here.";

    previewButton.textContent =
        buttonText.value ||
        "Get Started";

    previewBrand.textContent =
        brandName.value ||
        "Your Brand";

    bannerPreview.style.background =
        backgroundColor.value;

    previewTitle.style.color =
        textColor.value;

    previewDescription.style.color =
        textColor.value;

    previewBrand.style.color =
        accentColor.value;

    previewButton.style.background =
        accentColor.value;
}


/* =========================
   INPUT EVENTS
========================= */

bannerTitle.addEventListener(
    "input",
    updateBanner
);

bannerDescription.addEventListener(
    "input",
    updateBanner
);

buttonText.addEventListener(
    "input",
    updateBanner
);

brandName.addEventListener(
    "input",
    updateBanner
);

backgroundColor.addEventListener(
    "input",
    updateBanner
);

accentColor.addEventListener(
    "input",
    updateBanner
);

textColor.addEventListener(
    "input",
    updateBanner
);


/* =========================
   GENERATE BUTTON
========================= */

generateBtn.addEventListener(
    "click",
    function () {

        updateBanner();

        alert(
            "Your banner design has been generated successfully!"
        );

    }
);


/* =========================
   DOWNLOAD
========================= */

downloadBtn.addEventListener(
    "click",
    function () {

        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext("2d");

        canvas.width = 1200;
        canvas.height = 600;


        /* Background */

        ctx.fillStyle =
            backgroundColor.value;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* Brand */

        ctx.fillStyle =
            accentColor.value;

        ctx.font =
            "bold 28px Arial";

        ctx.fillText(
            brandName.value || "Your Brand",
            80,
            100
        );


        /* Title */

        ctx.fillStyle =
            textColor.value;

        ctx.font =
            "bold 58px Arial";

        ctx.fillText(
            bannerTitle.value ||
            "Your Banner",
            80,
            220
        );


        /* Description */

        ctx.font =
            "24px Arial";

        ctx.fillStyle =
            textColor.value;

        ctx.fillText(
            bannerDescription.value ||
            "Professional banner design",
            80,
            280
        );


        /* Button */

        ctx.fillStyle =
            accentColor.value;

        ctx.fillRect(
            80,
            350,
            180,
            55
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 20px Arial";

        ctx.fillText(
            buttonText.value ||
            "Get Started",
            105,
            385
        );


        /* Download */

        const link =
            document.createElement("a");

        link.download =
            "pixelstudio-banner.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

    }
);


/* Initial */

updateBanner();