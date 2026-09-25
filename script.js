document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       OPTICAL MEDIA MINIGAME
       ========================================================= */

    const minigame = document.getElementById("minigame");
    const gameArea = document.getElementById("game-area");
    const scoreDisplay = document.getElementById("score");
    const closeButton = document.getElementById("close-game");
    const mobileButton = document.getElementById("mobile-game-button");

    let score = 0;
    let discTimer = null;


    // -------------------------
    // OPEN GAME
    // -------------------------

    function openGame() {

        if (!minigame || !gameArea) return;

        minigame.style.display = "flex";

        score = 0;
        updateScore();

        gameArea.innerHTML = "";

        spawnDisc();
    }


    // -------------------------
    // CLOSE GAME
    // -------------------------

    function closeGame() {

        if (!minigame || !gameArea) return;

        minigame.style.display = "none";

        gameArea.innerHTML = "";

        if (discTimer) {
            clearTimeout(discTimer);
            discTimer = null;
        }
    }


    // -------------------------
    // UPDATE SCORE
    // -------------------------

    function updateScore() {

        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }
    }


    // -------------------------
    // SPAWN DISC
    // -------------------------

    function spawnDisc() {

        if (!gameArea) return;

        gameArea.innerHTML = "";

        if (discTimer) {
            clearTimeout(discTimer);
            discTimer = null;
        }

        const disc = document.createElement("img");

        disc.src = "Images/Disc1.png";
        disc.classList.add("disc");

        const discSize = 50;

        const maxX = Math.max(
            0,
            gameArea.clientWidth - discSize
        );

        const maxY = Math.max(
            0,
            gameArea.clientHeight - discSize
        );

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        disc.style.left = `${x}px`;
        disc.style.top = `${y}px`;


        // CLICK DISC

        disc.addEventListener("click", () => {

            score++;

            updateScore();

            disc.remove();

            if (discTimer) {
                clearTimeout(discTimer);
                discTimer = null;
            }

            spawnDisc();
        });


        gameArea.appendChild(disc);


        // DESPAWN AFTER 3 SECONDS

        discTimer = setTimeout(() => {

            if (disc.parentElement === gameArea) {

                disc.remove();

                spawnDisc();
            }

        }, 3000);
    }


    // -------------------------
    // GAME BUTTONS
    // -------------------------

    if (closeButton) {
        closeButton.addEventListener("click", closeGame);
    }

    if (mobileButton) {
        mobileButton.addEventListener("click", openGame);
    }


    /* =========================================================
       SOURCES EASTER EGG
       ========================================================= */

    const SOURCE_CODE = "sources";
    const REQUIRED_TAPS = 8;

    let opticalMediaTaps = 0;
    let tapResetTimer = null;
    let crumbleStarted = false;


    // -------------------------
    // OPTICAL MEDIA BANNER
    // -------------------------

    const opticalBanner =
        document.getElementById("optical-media-banner");


    // -------------------------
    // MOBILE: 8 TAPS
    // -------------------------

    if (opticalBanner) {

        opticalBanner.addEventListener("click", () => {

            if (crumbleStarted) return;

            opticalMediaTaps++;

            clearTimeout(tapResetTimer);

            tapResetTimer = setTimeout(() => {

                opticalMediaTaps = 0;

            }, 2000);


            if (opticalMediaTaps >= REQUIRED_TAPS) {

                clearTimeout(tapResetTimer);

                showToast("Okay, you found it.");

                setTimeout(() => {

                    triggerCrumble();

                }, 900);
            }

        });
    }


    /* =========================================================
       KEYBOARD SHORTCUTS
       ========================================================= */

    document.addEventListener("keydown", (event) => {


        // -------------------------
        // CTRL + ALT + P
        // OPEN MINIGAME
        // -------------------------

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "p"
        ) {

            event.preventDefault();

            openGame();
        }


        // -------------------------
        // ESC
        // CLOSE MINIGAME
        // -------------------------

        if (event.key === "Escape") {

            closeGame();
        }


        // -------------------------
        // CTRL + ALT + S
        // SOURCES
        // -------------------------

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

            openSourcePrompt();
        }

    });


    /* =========================================================
       SOURCE ACCESS PROMPT
       ========================================================= */

    function openSourcePrompt() {

        if (document.getElementById("source-prompt")) {
            return;
        }


        const prompt = document.createElement("div");

        prompt.id = "source-prompt";


        prompt.innerHTML = `
            <div class="source-prompt-box">

                <button id="source-prompt-close">×</button>

                <h2>SOURCE ACCESS</h2>

                <p>Enter the access phrase:</p>

                <input
                    type="password"
                    id="source-code-input"
                    autocomplete="off"
                    spellcheck="false"
                >

                <button id="source-submit">
                    ENTER
                </button>

                <p id="source-error"></p>

            </div>
        `;


        document.body.appendChild(prompt);


        const input =
            document.getElementById("source-code-input");

        const submit =
            document.getElementById("source-submit");

        const close =
            document.getElementById("source-prompt-close");

        const error =
            document.getElementById("source-error");


        // Focus input

        if (input) {
            input.focus();
        }


        // ENTER BUTTON

        if (submit) {

            submit.addEventListener(
                "click",
                checkSourceCode
            );
        }


        // KEYBOARD INSIDE PASSWORD BOX

        if (input) {

            input.addEventListener("keydown", (event) => {

                if (event.key === "Enter") {

                    checkSourceCode();
                }

                if (event.key === "Escape") {

                    prompt.remove();
                }

            });
        }


        // CLOSE BUTTON

        if (close) {

            close.addEventListener("click", () => {

                prompt.remove();

            });
        }


        // -------------------------
        // CHECK PASSWORD
        // -------------------------

        function checkSourceCode() {

            if (!input) return;


            if (input.value.toLowerCase() === SOURCE_CODE) {

                prompt.remove();

                showToast("Access granted.");

                setTimeout(() => {

                    triggerCrumble();

                }, 700);

            } else {

                if (error) {
                    error.textContent = "ACCESS DENIED.";
                }

                input.value = "";

                input.focus();


                setTimeout(() => {

                    if (error) {
                        error.textContent = "";
                    }

                }, 1500);
            }
        }
    }


    /* =========================================================
       TOAST
       ========================================================= */

    function showToast(message) {

        const existingToast =
            document.getElementById("source-toast");

        if (existingToast) {
            existingToast.remove();
        }


        const toast = document.createElement("div");

        toast.id = "source-toast";
        toast.textContent = message;

        document.body.appendChild(toast);


        requestAnimationFrame(() => {

            toast.classList.add("show");

        });


        setTimeout(() => {

            toast.classList.remove("show");


            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 1800);
    }


    /* =========================================================
       CRUMBLE EFFECT
       ========================================================= */

    function triggerCrumble() {

        if (crumbleStarted) return;

        crumbleStarted = true;


        document.body.classList.add("crumbling");


        setTimeout(() => {

            window.location.href = "sources.html";

        }, 2800);
    }

});