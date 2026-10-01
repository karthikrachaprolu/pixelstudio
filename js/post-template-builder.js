const brandName =
    document.getElementById("brandName");

const postTitle =
    document.getElementById("postTitle");

const postDescription =
    document.getElementById("postDescription");

const ctaText =
    document.getElementById("ctaText");

const templateStyle =
    document.getElementById("templateStyle");

const backgroundColor =
    document.getElementById("backgroundColor");

const accentColor =
    document.getElementById("accentColor");

const postImage =
    document.getElementById("postImage");


const postPreview =
    document.getElementById("postPreview");

const previewBrand =
    document.getElementById("previewBrand");

const previewTitle =
    document.getElementById("previewTitle");

const previewDescription =
    document.getElementById("previewDescription");

const previewCTA =
    document.getElementById("previewCTA");

const postImageArea =
    document.getElementById("postImageArea");

const buildBtn =
    document.getElementById("buildBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const successMessage =
    document.getElementById("successMessage");

const backgroundValue =
    document.getElementById("backgroundValue");

const accentValue =
    document.getElementById("accentValue");


/* =========================
   UPDATE PREVIEW
========================= */

function updatePreview() {

    previewBrand.textContent =
        brandName.value || "Your Brand";


    previewTitle.textContent =
        postTitle.value || "Your Post Title";


    previewDescription.textContent =
        postDescription.value ||
        "Your post description";


    previewCTA.textContent =
        ctaText.value || "Learn More";


    /* COLORS */

    postPreview.style.background =
        backgroundColor.value;

    previewBrand.style.color =
        accentColor.value;

    previewCTA.style.background =
        accentColor.value;


    backgroundValue.textContent =
        backgroundColor.value.toUpperCase();


    accentValue.textContent =
        accentColor.value.toUpperCase();


    /* TEMPLATE STYLE */

    applyTemplateStyle();

}


/* =========================
   TEMPLATE STYLES
========================= */

function applyTemplateStyle() {

    const style =
        templateStyle.value;


    if (style === "modern") {

        previewTitle.style.fontWeight = "700";

        previewTitle.style.letterSpacing = "0";

        postImageArea.style.height = "250px";

    }


    if (style === "minimal") {

        previewTitle.style.fontWeight = "400";

        previewTitle.style.letterSpacing = "1px";

        postImageArea.style.height = "220px";

    }


    if (style === "bold") {

        previewTitle.style.fontWeight = "900";

        previewTitle.style.letterSpacing = "-1px";

        postImageArea.style.height = "280px";

    }


    if (style === "creative") {

        previewTitle.style.fontWeight = "800";

        previewTitle.style.letterSpacing = "2px";

        postImageArea.style.height = "260px";

    }

}


/* =========================
   LIVE INPUT
========================= */

brandName.addEventListener(
    "input",
    updatePreview
);

postTitle.addEventListener(
    "input",
    updatePreview
);

postDescription.addEventListener(
    "input",
    updatePreview
);

ctaText.addEventListener(
    "input",
    updatePreview
);

templateStyle.addEventListener(
    "change",
    updatePreview
);

backgroundColor.addEventListener(
    "input",
    updatePreview
);

accentColor.addEventListener(
    "input",
    updatePreview
);


/* =========================
   IMAGE UPLOAD
========================= */

postImage.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                postImageArea.innerHTML = "";

                const image =
                    document.createElement("img");

                image.src =
                    event.target.result;

                image.alt =
                    "Post Image";

                postImageArea.appendChild(image);

            };


        reader.readAsDataURL(file);

    }
);


/* =========================
   BUILD POST
========================= */

buildBtn.addEventListener(
    "click",
    function () {

        updatePreview();

        successMessage.classList.add("show");

        buildBtn.textContent =
            "Post Template Built ✓";


        postPreview.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        setTimeout(
            function () {

                successMessage.classList.remove(
                    "show"
                );

                buildBtn.textContent =
                    "Build Post Template →";

            },
            3000
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


        canvas.width = 1080;
        canvas.height = 1080;


        /* BACKGROUND */

        ctx.fillStyle =
            backgroundColor.value;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* BRAND */

        ctx.fillStyle =
            accentColor.value;

        ctx.font =
            "bold 32px Arial";

        ctx.fillText(
            brandName.value || "Your Brand",
            70,
            80
        );


        /* TITLE */

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 70px Arial";

        const title =
            postTitle.value ||
            "Your Post Title";

        ctx.fillText(
            title,
            70,
            700
        );


        /* DESCRIPTION */

        ctx.font =
            "28px Arial";

        ctx.fillStyle =
            "#cccccc";

        ctx.fillText(
            postDescription.value ||
            "Your post description",
            70,
            770
        );


        /* CTA */

        ctx.fillStyle =
            accentColor.value;

        ctx.fillRect(
            70,
            830,
            190,
            60
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 20px Arial";

        ctx.fillText(
            ctaText.value ||
            "Learn More",
            100,
            868
        );


        /* DOWNLOAD */

        const link =
            document.createElement("a");

        link.download =
            "pixelstudio-post-template.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

    }
);


/* INITIAL */

updatePreview();