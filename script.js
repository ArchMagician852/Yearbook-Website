document.addEventListener("DOMContentLoaded", () => {

    const minigame = document.getElementById("minigame");
    const gameArea = document.getElementById("game-area");
    const scoreDisplay = document.getElementById("score");
    const closeButton = document.getElementById("close-game");
    const mobileButton = document.getElementById("mobile-game-button");

    let score = 0;

    // Open the minigame
    function openGame() {
        minigame.style.display = "flex";
        score = 0;
        updateScore();
        spawnDisc();
    }

    // Close the minigame
    function closeGame() {
        minigame.style.display = "none";
        gameArea.innerHTML = "";
    }

    // Update score
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // Create a new disc
    function spawnDisc() {

        // Remove any existing disc
        gameArea.innerHTML = "";

        const disc = document.createElement("img");

        disc.src = "Images/Disc1.png";
        disc.classList.add("disc");

        // Random position
        const maxX = gameArea.clientWidth - 50;
        const maxY = gameArea.clientHeight - 50;

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        disc.style.left = `${x}px`;
        disc.style.top = `${y}px`;

        // When disc is clicked
        disc.addEventListener("click", () => {

            score++;
            updateScore();

            spawnDisc();
        });

        gameArea.appendChild(disc);
    }

    // Close button
    if (closeButton) {
        closeButton.addEventListener("click", closeGame);
    }

    // Mobile game button
    if (mobileButton) {
        mobileButton.addEventListener("click", openGame);
    }

    // CTRL + ALT + P
    document.addEventListener("keydown", (event) => {

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "p"
        ) {
            openGame();
        }

        // ESC also closes the game
        if (event.key === "Escape") {
            closeGame();
        }
    });

});