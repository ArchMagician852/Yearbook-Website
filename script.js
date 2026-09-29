document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       EXISTING OPTICAL MEDIA MINIGAME
       ========================================================= */

    const minigame = document.getElementById("minigame");
    const gameArea = document.getElementById("game-area");
    const scoreDisplay = document.getElementById("score");
    const closeButton = document.getElementById("close-game");
    const mobileButton = document.getElementById("mobile-game-button");

    let score = 0;

    function openGame() {
        minigame.style.display = "flex";
        score = 0;
        updateScore();
        spawnDisc();
    }

    function closeGame() {
        minigame.style.display = "none";
        gameArea.innerHTML = "";
    }

    function updateScore() {
        scoreDisplay.textContent = score;
    }

    function spawnDisc() {
        gameArea.innerHTML = "";

        const disc = document.createElement("img");

        disc.src = "Images/Disc1.png";
        disc.classList.add("disc");

        const maxX = Math.max(0, gameArea.clientWidth - 50);
        const maxY = Math.max(0, gameArea.clientHeight - 50);

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        disc.style.left = `${x}px`;
        disc.style.top = `${y}px`;

        disc.addEventListener("click", () => {
            score++;
            updateScore();
            spawnDisc();
        });

        gameArea.appendChild(disc);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeGame);
    }

    if (mobileButton) {
        mobileButton.addEventListener("click", openGame);
    }


    /* =========================================================
       SOURCES EASTER EGG
       ========================================================= */

    // -------------------------
    // SETTINGS
    // -------------------------

    const SOURCE_CODE = "Password";
    const REQUIRED_TAPS = 8;

    let opticalMediaTaps = 0;
    let tapResetTimer = null;
    let crumbleStarted = false;


    // -------------------------
    // FIND OPTICAL MEDIA BANNER
    // -------------------------

    const opticalBanner = document.getElementById("optical-media-banner");


    // -------------------------
    // MOBILE: 8 TAPS
    // -------------------------

    if (opticalBanner) {

        opticalBanner.addEventListener("click", () => {

            // Don't allow the Easter egg to trigger twice
            if (crumbleStarted) return;

            opticalMediaTaps++;

            // Reset the counter if the user waits too long
            clearTimeout(tapResetTimer);

            tapResetTimer = setTimeout(() => {
                opticalMediaTaps = 0;
            }, 2000);


            // Eight taps!
            if (opticalMediaTaps >= REQUIRED_TAPS) {

                clearTimeout(tapResetTimer);

                showToast("Okay, you found it.");

                setTimeout(() => {
                    triggerCrumble();
                }, 900);
            }
        });
    }


    // -------------------------
    // DESKTOP: CTRL + ALT + S
    // -------------------------

    document.addEventListener("keydown", (event) => {

        // Existing minigame shortcut
        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "p"
        ) {
            openGame();
        }


        // Escape closes the minigame
        if (event.key === "Escape") {
            closeGame();
        }


        // Sources Easter egg shortcut
        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "s"
        ) {

            // Don't open it twice
            if (crumbleStarted) return;

            event.preventDefault();

            openSourcePrompt();
        }
    });


    /* =========================================================
       SOURCE ACCESS PROMPT
       ========================================================= */

    function openSourcePrompt() {

        // Don't create multiple prompts
        if (document.getElementById("source-prompt")) {
            return;
        }

        const prompt = document.createElement("div");

        prompt.id = "source-prompt";

        prompt.innerHTML = `
            <div class="source-prompt-box">

                <button id="source-prompt-close">×</button>

                <h2>HIDDEN ACCESS</h2>

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


        const input = document.getElementById("source-code-input");
        const submit = document.getElementById("source-submit");
        const close = document.getElementById("source-prompt-close");
        const error = document.getElementById("source-error");


        // Automatically put cursor in box
        input.focus();


        // Submit button
        submit.addEventListener("click", checkSourceCode);


        // Press Enter instead
        input.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                checkSourceCode();
            }

            if (event.key === "Escape") {
                prompt.remove();
            }
        });


        // Close button
        close.addEventListener("click", () => {
            prompt.remove();
        });


        function checkSourceCode() {

            if (input.value === SOURCE_CODE) {

                // Correct!
                prompt.remove();

                showToast("Access granted.");

                setTimeout(() => {
                    triggerCrumble();
                }, 700);

            } else {

                error.textContent = "ACCESS DENIED.";

                input.value = "";
                input.focus();

                // Remove the error after a moment
                setTimeout(() => {
                    error.textContent = "";
                }, 1500);
            }
        }
    }


    /* =========================================================
       TOAST MESSAGE
       ========================================================= */

    function showToast(message) {

        // Remove an existing toast
        const existingToast = document.getElementById("source-toast");

        if (existingToast) {
            existingToast.remove();
        }


        const toast = document.createElement("div");

        toast.id = "source-toast";
        toast.textContent = message;

        document.body.appendChild(toast);


        // Force the browser to recognize the element
        requestAnimationFrame(() => {
            toast.classList.add("show");
        });


        // Hide toast
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


        // Add the animation class
        document.body.classList.add("crumbling");


        // Give the animation time to play
        setTimeout(() => {

            window.location.href = "sources.html";

        }, 2800);
    }

});