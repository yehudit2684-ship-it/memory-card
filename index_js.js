// משתנים גלובליים
let currentPlayer = "";

function loginPlayer() {
    const playerName = document.getElementById("playerNameInput").value.trim();
    if (playerName === "") {
        alert("אנא הכנס שם שחקן");
        return false;
    }

    // בדיקת אותיות בעברית בלבד ולפחות שתיים
    const hebrewRegex = /^[\u0590-\u05FF]{2,}$/;
    if (!hebrewRegex.test(playerName)) {
        alert("השם חייב להכיל לפחות שתי אותיות בעברית בלבד");
        return false;
    }

    currentPlayer = playerName;
    document.getElementById("currentPlayerName").textContent = playerName;
    document.getElementById("playerInfo").style.display = "flex";
    document.getElementById("loginOverlay").style.display = "none";

    // שמירת שם השחקן ב-sessionStorage
    sessionStorage.setItem("playerName", currentPlayer);

    return false;
}

// פונקציות התחברות
function showLoginScreen() {
    document.getElementById("loginOverlay").style.display = "flex";
    document.getElementById("playerNameInput").value = "";
    document.getElementById("playerNameInput").focus();
    document.getElementById("playerInfo").style.display = "none";
}

function startGame() {
    if (!currentPlayer) {
        alert("אנא היכנס עם שם שחקן קודם");
        return;
    }

    const selectedCategory = document.getElementById("category").value;
    const selectedLevel = document.getElementById("level").value;

    if (selectedCategory === "" || selectedLevel === "") {
        alert("נא לבחור קטגוריה ורמת קושי!");
        return;
    }

    localStorage.setItem("category", selectedCategory);
    localStorage.setItem("difficulty", selectedLevel);

    // מעבר לדף המשחק
    window.location.href = "game.html";
}

document.getElementById("startGameBtn").addEventListener("click", startGame);

document.querySelector(".game-controls").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        startGame();
    }
});

window.onload = function () {
    const savedPlayerName = sessionStorage.getItem("playerName");

    if (savedPlayerName) {
        currentPlayer = savedPlayerName;
        document.getElementById("currentPlayerName").textContent = savedPlayerName;
        document.getElementById("playerInfo").style.display = "flex";
        document.getElementById("loginOverlay").style.display = "none";
    } else {
        showLoginScreen();
    }
};


