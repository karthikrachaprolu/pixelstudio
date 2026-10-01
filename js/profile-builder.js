const profileName = document.getElementById("profileName");
const username = document.getElementById("username");
const bio = document.getElementById("bio");
const category = document.getElementById("category");
const website = document.getElementById("website");

const profileColor = document.getElementById("profileColor");
const colorValue = document.getElementById("colorValue");

const profileImage = document.getElementById("profileImage");

const previewName = document.getElementById("previewName");
const previewUsername = document.getElementById("previewUsername");
const previewBio = document.getElementById("previewBio");
const previewCategory = document.getElementById("previewCategory");
const previewWebsite = document.getElementById("previewWebsite");

const profileTop = document.getElementById("profileTop");
const avatar = document.getElementById("avatar");

const buildBtn = document.getElementById("buildBtn");
const successMessage = document.getElementById("successMessage");

const downloadBtn = document.getElementById("downloadBtn");


// ----------------------------------
// LIVE PROFILE UPDATE
// ----------------------------------

function updateProfile() {

    previewName.textContent =
        profileName.value || "Your Name";


    previewUsername.textContent =
        username.value || "@username";


    previewCategory.textContent =
        category.value;


    previewBio.textContent =
        bio.value || "Write your profile bio";


    previewWebsite.textContent =
        website.value || "www.example.com";


    // PROFILE COLOR

    const color = profileColor.value;

    profileTop.style.background = color;

    previewCategory.style.color = color;

    previewWebsite.style.color = color;

    followButton.style.borderColor = color;

    followButton.style.color = color;


    colorValue.textContent =
        color.toUpperCase();


    // AVATAR LETTER

    const name = profileName.value.trim();

    if (name) {

        avatar.textContent =
            name.charAt(0).toUpperCase();

    } else {

        avatar.textContent = "P";

    }

}


// ----------------------------------
// INPUT EVENTS
// ----------------------------------

profileName.addEventListener(
    "input",
    updateProfile
);

username.addEventListener(
    "input",
    updateProfile
);

bio.addEventListener(
    "input",
    updateProfile
);

category.addEventListener(
    "change",
    updateProfile
);

website.addEventListener(
    "input",
    updateProfile
);

profileColor.addEventListener(
    "input",
    updateProfile
);


// ----------------------------------
// PROFILE IMAGE
// ----------------------------------

profileImage.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            avatar.innerHTML =
                `<img src="${event.target.result}" alt="Profile Image">`;

        };

        reader.readAsDataURL(file);

    }
);


// ----------------------------------
// BUILD PROFILE
// ----------------------------------

buildBtn.addEventListener(
    "click",
    function () {

        updateProfile();

        successMessage.classList.add("show");

        buildBtn.textContent =
            "Profile Built ✓";

        setTimeout(function () {

            successMessage.classList.remove("show");

            buildBtn.textContent =
                "Build Profile →";

        }, 3000);

    }
);


// ----------------------------------
// FOLLOW BUTTON
// ----------------------------------

const followButton =
    document.querySelector(".follow-btn");


// ----------------------------------
// DOWNLOAD PROFILE CARD
// ----------------------------------

downloadBtn.addEventListener(
    "click",
    function () {

        const profileData = {

            name: profileName.value,

            username: username.value,

            bio: bio.value,

            category: category.value,

            website: website.value,

            color: profileColor.value

        };


        const data =
            JSON.stringify(
                profileData,
                null,
                4
            );


        const blob =
            new Blob(
                [data],
                {
                    type: "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "pixelstudio-profile.json";


        link.click();


        URL.revokeObjectURL(url);

    }
);


// ----------------------------------
// INITIAL LOAD
// ----------------------------------

updateProfile();