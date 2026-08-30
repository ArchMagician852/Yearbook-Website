document.addEventListener("DOMContentLoaded", () => {

    const minigame = document.getElementById("minigame");
    const gameArea = document.getElementById("game-area");
    const scoreDisplay = document.getElementById("score");
    const closeButton = document.getElementById("close-game");
    const mobileButton = document.getElementById("mobile-game-button");

    let score = 0;
    let discTimer = null;


    // =========================
    // OPEN THE MINIGAME
    // =========================

    function openGame() {

        minigame.style.display = "flex";

        score = 0;
        updateScore();

        gameArea.innerHTML = "";

        spawnDisc();
    }


    // =========================
    // CLOSE THE MINIGAME
    // =========================

    function closeGame() {

        minigame.style.display = "none";

        gameArea.innerHTML = "";

        // Cancel any active despawn timer
        if (discTimer) {
            clearTimeout(discTimer);
            discTimer = null;
        }
    }


    // =========================
    // UPDATE SCORE
    // =========================

    function updateScore() {

        scoreDisplay.textContent = score;
    }


    // =========================
    // CREATE A NEW DISC
    // =========================

    function spawnDisc() {

        // Clear previous disc
        gameArea.innerHTML = "";

        // Cancel previous timer
        if (discTimer) {
            clearTimeout(discTimer);
            discTimer = null;
        }

        const disc = document.createElement("img");

        disc.src = "Images/Disc1.png";

        disc.classList.add("disc");


        // =========================
        // RANDOM POSITION
        // =========================

        const discSize = 50;

        const maxX = Math.max(0, gameArea.clientWidth - discSize);
        const maxY = Math.max(0, gameArea.clientHeight - discSize);

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        disc.style.left = `${x}px`;
        disc.style.top = `${y}px`;


        // =========================
        // WHEN DISC IS CLICKED
        // =========================

        disc.addEventListener("click", () => {

            // Increase score
            score++;

            updateScore();

            // Remove the clicked disc
            disc.remove();

            // Cancel its despawn timer
            if (discTimer) {
                clearTimeout(discTimer);
                discTimer = null;
            }

            // Spawn another disc
            spawnDisc();
        });


        // Add disc to game
        gameArea.appendChild(disc);


        // =========================
        // DESPAWN AFTER 3 SECONDS
        // =========================

        discTimer = setTimeout(() => {

            // Only remove it if it still exists
            if (disc.parentElement === gameArea) {

                disc.remove();

                // Spawn another disc
                spawnDisc();
            }

        }, 3000);
    }


    // =========================
    // CLOSE BUTTON
    // =========================

    if (closeButton) {

        closeButton.addEventListener("click", closeGame);
    }


    // =========================
    // MOBILE GAME BUTTON
    // =========================

    if (mobileButton) {

        mobileButton.addEventListener("click", openGame);
    }


    // =========================
    // CTRL + ALT + P
    // =========================

    document.addEventListener("keydown", (event) => {

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "p"
        ) {

            openGame();
        }


        // ESC closes the game
        if (event.key === "Escape") {

            closeGame();
        }
    });

});