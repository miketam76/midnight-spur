# Midnight Spur

Midnight Spur is a browser-based western duel game where you face off against a fast-drawing outlaw. The goal is simple: wait for the right moment, then draw at the perfect instant to win the round before your opponent does.

## Gameplay

- Start a round from the main menu.
- A countdown begins and the outlaw becomes more aggressive as rounds progress.
- Press the Draw button (or tap/click/press Space or Enter) at the right moment.
- Draw too early and you lose the round.
- Draw at the right time and you win the duel, then move on to the next outlaw.

## Features

- Fast-paced one-button timing gameplay
- Responsive game UI for desktop, tablet, and mobile screens
- Dramatic death animations with dust, screen shake, and a hat-drop effect
- Sharper gunshot-style sound effects and a looping western music theme
- Persistent best-win tracking using local browser storage
- Pause, mute, and quit controls during play

## Controls

- Draw: Click, tap, or press Space/Enter
- Pause: Pause button or P key
- Mute: Mute button or M key
- Quit: Quit button from the game screen

## Project Structure

- index.html — app shell, HUD, buttons, and canvas
- styles.css — responsive layout and screen styling
- src/main.js — bootstrapping and input wiring
- src/game.js — round flow, timing logic, pause handling, and win/loss states
- src/render.js — canvas rendering, duel scene, and animation effects
- src/audio.js — sound effects and background music
- src/storage.js — best-win persistence via local storage

## Running Locally

No build step is required. You can run the game from a simple local web server so the browser can load the ES modules correctly.

Example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/ in your browser.

## Notes

The game is intentionally lightweight and uses plain HTML, CSS, and JavaScript. The current version emphasizes cinematic presentation, readable feedback, and polished timing-based action.
