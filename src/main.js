import { createGame } from './game.js';

const dom = {
    menuScreen: document.getElementById('menuScreen'),
    gameScreen: document.getElementById('gameScreen'),
    resultScreen: document.getElementById('resultScreen'),
    startButton: document.getElementById('startButton'),
    scoresButton: document.getElementById('scoresButton'),
    playAgainButton: document.getElementById('playAgainButton'),
    backToMenuButton: document.getElementById('backToMenuButton'),
    drawButton: document.getElementById('drawButton'),
    canvas: document.getElementById('gameCanvas'),
    statusText: document.getElementById('statusText'),
    roundValue: document.getElementById('roundValue'),
    winsValue: document.getElementById('winsValue'),
    bestValue: document.getElementById('bestValue'),
    bestWins: document.getElementById('bestWins'),
    finalWins: document.getElementById('finalWins'),
    finalBest: document.getElementById('finalBest'),
    resultBadge: document.getElementById('resultBadge'),
    resultTitle: document.getElementById('resultTitle'),
    resultMessage: document.getElementById('resultMessage'),
    pauseButton: document.getElementById('pauseButton'),
    muteButton: document.getElementById('muteButton'),
    exitButton: document.getElementById('exitButton'),
};

const game = createGame(dom);

game.boot();

function scrollToGame() {
    document.querySelector('.screen--game')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

dom.startButton.addEventListener('click', () => {
    game.startRound();
    scrollToGame();
});

dom.drawButton.addEventListener('click', () => {
    game.onDraw();
});

dom.pauseButton.addEventListener('click', () => {
    const isPaused = game.togglePause();
    dom.pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    dom.drawButton.disabled = isPaused;
});

dom.muteButton.addEventListener('click', () => {
    const isMuted = game.toggleMute();
    dom.muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
});

dom.playAgainButton.addEventListener('click', () => {
    game.startRound();
    scrollToGame();
});

dom.backToMenuButton?.addEventListener('click', () => {
    game.startMenu(); // Automatically calls audio.stopMusic()
});

dom.scoresButton.addEventListener('click', () => {
    dom.resultBadge.textContent = 'High Scores';
    dom.resultTitle.textContent = 'Best Wins';
    dom.resultMessage.textContent = `Your best local streak is ${dom.bestWins.textContent}.`;
    dom.finalWins.textContent = dom.bestWins.textContent;
    dom.finalBest.textContent = dom.bestWins.textContent;
    dom.menuScreen.hidden = true;
    dom.gameScreen.hidden = true;
    dom.resultScreen.hidden = false;
});

window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyP') {
        event.preventDefault();
        const isPaused = game.togglePause();
        dom.pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
        dom.drawButton.disabled = isPaused;
        return;
    }

    if (event.code === 'KeyM') {
        event.preventDefault();
        const isMuted = game.toggleMute();
        dom.muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
        return;
    }

    if (event.code === 'Space' || event.code === 'Enter') {
        // Prevent accidental draws if game is currently paused
        if (game.isPaused()) {
            return;
        }

        event.preventDefault();
        game.onDraw();
    }
});

// Future addition in main.js
dom.exitButton?.addEventListener('click', () => {
    game.startMenu(); // Calls audio.stopMusic() automatically
});