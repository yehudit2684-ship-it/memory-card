#  Memory Game 

A browser-based memory (concentration) card game with player profiles,
selectable themes and difficulty levels, and a persistent local
leaderboard - built entirely with vanilla HTML, CSS, and JavaScript,
with no frameworks, build tools, or backend.

##  Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)

## ✨ Features

- **Player login** - the player enters a name (validated to be at
  least two Hebrew letters) before playing; the name is remembered
  for the session via `sessionStorage`.
- **4 selectable themes**, each with its own emoji set: Emoji,
  Fruits, Vehicles, and Food.
- **3 difficulty levels**, each changing the board size, number of
  pairs, and time limit:

  | Difficulty | Pairs | Grid | Time limit |
  |---|---|---|---|
  | Easy  | 6 | 3×2 | 60s |
  | Medium  | 8 | 4×2 | 80s |
  | Hard  | 10 | 5×2 | 100s |

- **Live game stats** - move counter, countdown timer, and matched
  pairs, all updated in real time as you play.
- **Sound effects** for flipping a card, a correct match, and a wrong
  match.
- **Persistent leaderboard**, stored in `localStorage`, with two
  views:
  - *My Scores* - the current player's personal best (moves + time)
    per difficulty level.
  - *All Scores* - a top-3 leaderboard per difficulty across every
    player who has played on that browser, with 🥇🥈🥉 medals, ranked
    by fewest moves and then by time.
- Full **RTL (right-to-left)** layout for Hebrew.

## 📸 Screenshots

<img width="1910" height="900" alt="צילום מסך 2026-08-06 162856" src="https://github.com/user-attachments/assets/208f35eb-98fd-4e5e-969b-c6ede2f3fd9c" />
<br><br>
<img width="1904" height="914" alt="צילום מסך 2026-08-09 194713" src="https://github.com/user-attachments/assets/891338a9-57b5-4124-b244-0d136d8bdfba" />
<br><br>
<img width="1860" height="895" alt="צילום מסך 2026-08-09 182210" src="https://github.com/user-attachments/assets/d535a528-1173-4815-8daa-d2849c2dcf4f" />

##  Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure (login screen, home screen, game board) |
| **CSS3** | Styling, responsive card grid, RTL layout |
| **Vanilla JavaScript (ES6)** | All game logic - no frameworks or libraries |
| **HTML5 Audio API** | Sound effects on flip / match / mismatch |
| **`localStorage`** | Persists the leaderboard across sessions |
| **`sessionStorage`** | Keeps the current player logged in for the browser tab's session |

## 📁 Project Structure

```
memory-game/
├── index.html          # Login + home screen (theme & difficulty pickers)
├── index_js.js          # Login validation, theme/difficulty selection, routing
├── index_style.css      # Home screen styling
├── game.html            # Game board screen
├── game_js.js            # Core game logic: cards, matching, timer, scores
├── game_style.css       # Game board styling
├── sounds/
│   ├── flip.mp3
│   ├── correct.mp3
│   └── error.mp3
└── backgroun/            # Background images
    ├── b7.png
    └── b8.png
```

##  How It Works

1. On `index.html`, the player logs in with a Hebrew name, then picks
   a theme and a difficulty level. Both choices are saved to
   `localStorage`, and the player is redirected to `game.html`.
2. `game.html` reads the saved theme and difficulty, builds a shuffled
   deck (each emoji appearing exactly twice), and renders it as a
   card grid sized to the chosen difficulty.
3. Clicking a card flips it and plays a sound. Once two cards are
   flipped, they're compared after a short delay:
   - **Match** → both cards lock in place, a success sound plays, and
     the matched-pairs counter increases.
   - **No match** → both cards flip back down, and an error sound
     plays.
4. The countdown timer starts on the very first flip. If all pairs
   are matched before time runs out, the game is won and the score
   (moves + time elapsed) is saved to the leaderboard - but only if
   it beats the player's previous best for that difficulty. If the
   timer reaches zero first, the board locks and the player can
   restart.

## 🚀 Getting Started

This is a fully static site - no build step, server, or dependencies
required.

```bash
git clone <repo-url>
cd memory-game
open index.html   # or double-click the file
```

Or serve it locally for a smoother experience:

```bash
npx serve .
```
