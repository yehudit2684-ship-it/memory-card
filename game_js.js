const flipSound = new Audio("sounds/flip.mp3");
const correctSound = new Audio("sounds/correct.mp3")
const wrongSound = new Audio("sounds/error.mp3");
function playFlipSound() {
    flipSound.currentTime = 0;
    flipSound.play();
}

function playMatchSound() {
    correctSound.currentTime = 0;
    correctSound.play();
}

function playWrongSound() {
    wrongSound.currentTime = 0;
    wrongSound.play();
}


let currentDifficulty = "";
let currentCategory = "";
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timeLeft = 60;
let gameTimer = null;
let gameStarted = false;
let currentPlayer = "";
let allPlayersScores = {};

const difficulties = {
    easy: { pairs: 6, time: 60, grid: "grid-3x2" },
    medium: { pairs: 8, time: 80, grid: "grid-4x2" },
    hard: { pairs: 10, time: 100, grid: "grid-5x2" },
};

const emojiSets = {
    fruits: ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🍍", "🥝", "🍑", "🍋", "🍊", "🥭"],
    vehicles: ["🚗", "🚕", "🚌", "🚓", "🚑", "🚒", "🚜", "🚛", "🚲", "🛵", "✈️", "🚀"],
    emoji: ["😀", "😂", "😊", "😍", "😎", "🤓", "😡", "😭", "😴", "🥳", "🤯", "😇"],
    food: ["🍔", "🍟", "🌭", "🍕", "🍝", "🥗", "🌮", "🍣", "🍩", "🍪", "🍫", "🥨"],
};

// טעינת השיאים מ-localStorage
function loadScores() {
    const savedScores = localStorage.getItem('allPlayersScores');
    if (savedScores) {
        allPlayersScores = JSON.parse(savedScores);
    } else {
        allPlayersScores = {};
    }
}

// שמירת השיאים ב-localStorage
function saveScores() {
    localStorage.setItem('allPlayersScores', JSON.stringify(allPlayersScores));
}

// פונקציות תצוגת השיאים
function showPersonalScores() {
    document.getElementById("personalScoresBtn").classList.add("active");
    document.getElementById("allScoresBtn").classList.remove("active");
    document.getElementById("scoresTitle").textContent = "השיאים שלי:";

    const scoresDisplay = document.getElementById("scoresDisplay");
    scoresDisplay.innerHTML = "";

    if (!currentPlayer || !allPlayersScores[currentPlayer]) {
        scoresDisplay.innerHTML = '<div class="score-row"><span>אין נתונים</span></div>';
        return;
    }

    const difficultyNames = {
        easy: "קל",
        medium: "בינוני",
        hard: "קשה",
    };

    ["easy", "medium", "hard"].forEach((difficulty) => {
        const score = allPlayersScores[currentPlayer][difficulty];

        const row = document.createElement("div");
        row.className = "score-row";

        if (score) {
            row.innerHTML = `
                <span>${difficultyNames[difficulty]}:</span>
                <span>${score.moves} מהלכים, ${score.time} שניות</span>
            `;
        } else {
            row.innerHTML = `
                <span>${difficultyNames[difficulty]}:</span>
                <span>אין נתונים</span>
            `;
        }

        scoresDisplay.appendChild(row);
    });
}

function showAllScores() {
    document.getElementById("personalScoresBtn").classList.remove("active");
    document.getElementById("allScoresBtn").classList.add("active");
    document.getElementById("scoresTitle").textContent = "כל השיאים:";

    const scoresDisplay = document.getElementById("scoresDisplay");
    scoresDisplay.innerHTML = "";

    const difficultyNames = {
        easy: "קל",
        medium: "בינוני",
        hard: "קשה",
    };

    ["easy", "medium", "hard"].forEach((difficulty) => {
        const difficultyScores = [];

        Object.keys(allPlayersScores).forEach((playerName) => {
            if (allPlayersScores[playerName][difficulty]) {
                difficultyScores.push({
                    name: playerName,
                    moves: allPlayersScores[playerName][difficulty].moves,
                    time: allPlayersScores[playerName][difficulty].time,
                });
            }
        });

        difficultyScores.sort((a, b) => {
            if (a.moves !== b.moves) return a.moves - b.moves;
            return a.time - b.time;
        });

        const difficultyTitle = document.createElement("div");
        difficultyTitle.innerHTML = `<h4 style="color: #8B4513; margin: 15px 0 10px 0;">${difficultyNames[difficulty]}</h4>`;
        scoresDisplay.appendChild(difficultyTitle);

        if (difficultyScores.length === 0) {
            const noScores = document.createElement("div");
            noScores.className = "score-row";
            noScores.innerHTML = "<span>אין נתונים</span>";
            scoresDisplay.appendChild(noScores);
        } else {
            const rows = difficultyScores.slice(0, 3).map((score, index) => {
                const row = document.createElement("div");
                row.className = "score-row";

                let medalIcon = "";
                if (index === 0) medalIcon = "🥇";
                else if (index === 1) medalIcon = "🥈";
                else if (index === 2) medalIcon = "🥉";

                row.innerHTML = `
                    <div class="player-name">
                        <span>${score.name}</span>
                        <span class="rank-medal">${medalIcon}</span>
                    </div>
                    <span>${score.moves} מהלכים, ${score.time} שניות</span>
                `;

                if (index < 3) {
                    row.classList.add("medal");
                }

                return row;
            });

            rows.forEach((row) => scoresDisplay.appendChild(row));
        }
    });
}

const updateDisplay = (elementId, value) => {
    document.getElementById(elementId).textContent = value;
};

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

function startGame(difficulty, category) {
    currentDifficulty = difficulty;
    currentCategory = category;
    const config = difficulties[difficulty];

    matchedPairs = 0;
    moves = 0;
    timeLeft = config.time;
    gameStarted = false;
    flippedCards = [];

    const selectedSet = emojiSets[category];
    const selectedEmojis = selectedSet.slice(0, config.pairs);
    gameCards = shuffleArray([...selectedEmojis, ...selectedEmojis]);

    updateDisplay("moves", moves);
    updateDisplay("timer", timeLeft);
    updateDisplay("matches", matchedPairs);
    updateDisplay("totalPairs", config.pairs);

    createGameBoard(config.grid);
    document.getElementById("gameMessage").style.display = "none";
}

function createGameBoard(gridClass) {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";
    board.className = `game-board ${gridClass}`;

    gameCards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.textContent = " ";
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });
}

function flipCard(event) {
    const card = event.target;
    const index = parseInt(card.dataset.index);

    if (
        flippedCards.length === 2 ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    card.classList.add("flipped");
    card.textContent = card.dataset.emoji;
    playFlipSound();
//    flipSound.play();

    flippedCards.push(index);

    if (flippedCards.length === 2) {
        moves++;
        updateDisplay("moves", moves);

        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const [index1, index2] = flippedCards;
    const card1 = document.querySelector(`[data-index="${index1}"]`);
    const card2 = document.querySelector(`[data-index="${index2}"]`);

    if (gameCards[index1] === gameCards[index2]) {
        playMatchSound();
    //    correctSound.play();
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedPairs++;
        updateDisplay("matches", matchedPairs);

        if (matchedPairs === difficulties[currentDifficulty].pairs) {
            gameWon();
        }
    } else {
        playWrongSound();
        // wrongSound.play();
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.textContent = " ";
        card2.textContent = " ";
    }

    flippedCards = [];
}

function startTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        updateDisplay("timer", timeLeft);

        if (timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function gameWon() {
    clearInterval(gameTimer);
    const timeUsed = difficulties[currentDifficulty].time - timeLeft;
    const message = document.getElementById("gameMessage");
    message.textContent = `כל הכבוד!  סיימת ב-${moves} מהלכים ו-${timeUsed} שניות!`;
    message.className = "message";
    message.style.display = "block";

    // שמירת שיא
    saveScore(currentPlayer, currentDifficulty, moves, timeUsed);
    // עדכון תצוגת השיאים
    showPersonalScores();
}

function gameOver() {
    clearInterval(gameTimer);
    const message = document.getElementById("gameMessage");
    message.textContent = "הזמן נגמר! ⏰ נסה שוב";
    message.className = "message game-over";
    message.style.display = "block";

    document.querySelectorAll(".card").forEach((card) => {
        card.style.pointerEvents = "none";
    });
}

function restartGame() {
    clearInterval(gameTimer);
    startGame(currentDifficulty, currentCategory);
}

function goHome() {
    clearInterval(gameTimer);
    // שמירת נתוני השחקן הנוכחי כדי שלא יצטרך להתחבר מחדש
    localStorage.setItem("playerName", currentPlayer);
    // מחיקת קטגוריה וקושי כדי לאפשר בחירה חדשה
    localStorage.removeItem("category");
    localStorage.removeItem("difficulty");
    window.location.href = "index.html";
}

function saveScore(playerName, difficulty, moves, time) {
    if (!playerName) return;

    if (!allPlayersScores[playerName]) {
        allPlayersScores[playerName] = {};
    }

    const prevScore = allPlayersScores[playerName][difficulty];

    // שמירת שיא רק אם חדש טוב יותר (פחות מהלכים או פחות זמן)
    if (
        !prevScore ||
        moves < prevScore.moves ||
        (moves === prevScore.moves && time < prevScore.time)
    ) {
        allPlayersScores[playerName][difficulty] = { moves, time };
        saveScores();
    }
}

window.onload = function () {
    const difficulty = localStorage.getItem("difficulty");
    const category = localStorage.getItem("category");
    const playerName = sessionStorage.getItem("playerName"); // ← שינוי כאן

    if (!playerName) {
        alert("אנא היכנס עם שם שחקן בעמוד הראשי");
        window.location.href = "index.html";
        return;
    }

    if (!difficulty || !difficulties[difficulty] || !category || !emojiSets[category]) {
        alert("אנא בחר קטגוריה וקושי מהעמוד הראשי");
        window.location.href = "index.html";
        return;
    }

    currentPlayer = playerName;
    document.getElementById("currentPlayerName").textContent = playerName;

    loadScores();
    showPersonalScores();
    startGame(difficulty, category);
};

function goHome() {
    clearInterval(gameTimer);
    // אין צורך לשמור את שם השחקן – הוא כבר ב-sessionStorage
    localStorage.removeItem("category");
    localStorage.removeItem("difficulty");
    window.location.href = "index.html";
}
