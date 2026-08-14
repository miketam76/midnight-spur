import { createAudioSystem } from './audio.js';
import { createRenderer } from './render.js';
import { loadBestWins, saveBestWins } from './storage.js';

const phases = {
    menu: 'menu',
    countdown: 'countdown',
    duel: 'duel',
    roundWin: 'roundWin',
    gameOver: 'gameOver',
};

const outfitPool = {
    hats: ['#101522', '#243654', '#5c432c', '#6e2f35'],
    bodies: ['#2f4368', '#5f7347', '#7a3d30', '#704d2c', '#4d6580'],
    accents: ['#d7a65f', '#cf5e4d', '#79a67d', '#e2d19d'],
};

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function createOutfit(isPlayer = false) {
    if (isPlayer) {
        return {
            hat: '#101522',
            body: '#2f4368',
            accent: '#d7a65f',
        };
    }

    return {
        hat: pick(outfitPool.hats),
        body: pick(outfitPool.bodies),
        accent: pick(outfitPool.accents),
    };
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function createGame(dom) {
    const canvas = dom.canvas;
    const renderer = createRenderer(canvas);
    const audio = createAudioSystem();

    const state = {
        phase: phases.menu,
        isPaused: false,
        round: 1,
        wins: 0,
        bestWins: loadBestWins(),
        playerReady: false,
        playerHasDrawn: false,
        opponentReady: false,
        opponentHasDrawn: false,
        countdownStart: 0,
        countdownDuration: 0,
        drawTime: 0,
        animationFrame: 0,
        countdownFrame: 0,
        flash: 0,
        duelStartedAt: 0,
        duelResolutionAt: 0,
        phaseLabel: 'Press start to begin.',
        tension: 0,
        progress: 0,
        countdownProgress: 0,
        playerOutfit: createOutfit(true),
        opponentOutfit: createOutfit(false),
        playerDeathProgress: 0,
        opponentDeathProgress: 0,
        lastHitSide: null,
        screenShake: 0,
        baseStatus: 'Choose Start Game to face the outlaw.',
        pendingTransition: null,
        pendingTransitionAt: 0,
        pauseStartedAt: 0,
    };

    function isActivePhase() {
        return state.phase === phases.countdown || state.phase === phases.duel || state.phase === phases.roundWin;
    }

    function syncHud() {
        dom.roundValue.textContent = String(state.round);
        dom.winsValue.textContent = String(state.wins);
        dom.bestValue.textContent = String(state.bestWins);
        dom.bestWins.textContent = String(state.bestWins);
    }

    function syncControls() {
        if (!dom.pauseButton || !dom.muteButton) {
            return;
        }

        dom.pauseButton.textContent = state.isPaused ? 'Resume' : 'Pause';
        dom.pauseButton.disabled = !isActivePhase();
        dom.pauseButton.setAttribute('aria-pressed', String(state.isPaused));
        dom.drawButton.disabled = state.isPaused || !(state.phase === phases.countdown || state.phase === phases.duel);
        dom.muteButton.textContent = audio.isMuted() ? 'Unmute' : 'Mute';
        dom.muteButton.setAttribute('aria-pressed', String(audio.isMuted()));

        if (dom.exitButton) {
            dom.exitButton.disabled = false;
        }
    }

    function showScreen(screenName) {
        dom.menuScreen.hidden = screenName !== phases.menu;
        dom.gameScreen.hidden = screenName !== phases.countdown && screenName !== phases.duel && screenName !== phases.roundWin;
        dom.resultScreen.hidden = screenName !== phases.gameOver;
        dom.menuScreen.classList.toggle('is-active', screenName === phases.menu);
        syncControls();
    }

    function setStatus(message) {
        state.baseStatus = message;
        dom.statusText.textContent = message;
    }

    function setPausedStatus() {
        dom.statusText.textContent = 'Paused. Tap Resume to continue.';
    }

    function clearPendingTransition() {
        state.pendingTransition = null;
        state.pendingTransitionAt = 0;
    }

    function resetDeathStates() {
        state.playerDeathProgress = 0;
        state.opponentDeathProgress = 0;
        state.lastHitSide = null;
        state.screenShake = 0;
    }

    function scheduleTransition(type, delayMs, payload = {}) {
        state.pendingTransition = { type, payload };
        state.pendingTransitionAt = performance.now() + delayMs;
    }

    function runPendingTransition() {
        if (!state.pendingTransition) {
            return;
        }

        const { type, payload } = state.pendingTransition;
        clearPendingTransition();

        if (type === 'endGame') {
            endGame(payload.reason);
        } else if (type === 'advanceRound') {
            advanceRound();
        } else if (type === 'startRound') {
            startRound();
        }
    }

    function updateDifficulty() {
        // Base randomized delay between 2.5s and 5.5s
        const minDelay = Math.max(1.5, 3.0 - state.round * 0.15);
        const maxDelay = Math.max(2.5, 5.5 - state.round * 0.2);

        state.countdownDuration = minDelay + Math.random() * (maxDelay - minDelay);
        state.drawTime = state.countdownStart + state.countdownDuration * 1000;
    }

    function resumeAfterPause(now) {
        const pausedDuration = now - state.pauseStartedAt;
        state.countdownStart += pausedDuration;
        state.drawTime += pausedDuration;
        state.duelStartedAt += pausedDuration;

        if (state.pendingTransitionAt) {
            state.pendingTransitionAt += pausedDuration;
        }

        state.isPaused = false;
        state.pauseStartedAt = 0;
        dom.statusText.textContent = state.baseStatus;
        syncControls();
    }

    function startRound() {
        audio.unlock();
        audio.stopMusic();  // Reset any previous playing loop
        audio.startMusic(); // Start loop for active countdown/duel
        state.phase = phases.countdown;
        state.isPaused = false;
        resetDeathStates();
        state.playerReady = true;
        state.playerHasDrawn = false;
        state.opponentReady = false;
        state.opponentHasDrawn = false;
        state.flash = 0;
        state.countdownStart = performance.now();
        state.duelStartedAt = 0;
        state.duelResolutionAt = 0;
        clearPendingTransition();
        state.phaseLabel = 'WAIT FOR IT';
        state.playerOutfit = createOutfit(true);
        state.opponentOutfit = createOutfit(false);
        updateDifficulty();
        showScreen(phases.countdown);
        setStatus('Keep your hand steady. The outlaw will move first.');
        syncHud();
        syncControls();
        audio.playSignal();
    }

    function endGame(reason) {
        audio.stopMusic(); // Stop music immediately on game over
        state.phase = phases.gameOver;
        state.isPaused = false;
        clearPendingTransition();
        state.bestWins = saveBestWins(state.wins);
        syncHud();
        showScreen(phases.gameOver);

        dom.finalWins.textContent = String(state.wins);
        dom.finalBest.textContent = String(state.bestWins);
        dom.resultBadge.textContent = reason === 'win' ? 'Victory' : 'Game Over';
        dom.resultTitle.textContent = reason === 'win' ? 'You Cleared the Town' : 'The Outlaw Won';
        dom.resultMessage.textContent =
            reason === 'win'
                ? 'You drew faster than the last gunslinger in the county.'
                : 'The opponent fired before your hand reached the holster.';
        setStatus(reason === 'win' ? 'Winner.' : 'Game over.');
        syncControls();
        audio[reason === 'win' ? 'playVictory' : 'playLoss']();
    }

    function advanceRound() {
        audio.stopMusic(); // HARD KILL lingering track notes instantly
        state.phase = phases.roundWin;
        clearPendingTransition();
        state.wins += 1;
        state.round += 1;
        state.bestWins = saveBestWins(state.wins);
        syncHud();
        setStatus('Round clear. The next outlaw is quicker.');
        state.flash = 1;
        syncControls();
        audio.playVictory();

        scheduleTransition('startRound', 1100);
    }

    function resolveEarlyDraw() {
        audio.stopMusic(); // STOP MUSIC IMMEDIATELY ON EARLY DRAW LOSS
        state.playerHasDrawn = true;
        state.phaseLabel = 'TOO EARLY';
        state.playerDeathProgress = 0.18;
        state.opponentDeathProgress = 0;
        state.lastHitSide = 'player';
        setStatus('You drew too soon and got clipped.');
        state.flash = 1;
        state.screenShake = 1;
        audio.playHit();
        scheduleTransition('endGame', 450, { reason: 'loss' });
    }

    function resolveVictory() {
        audio.stopMusic(); // STOP MUSIC IMMEDIATELY WHEN PLAYER WINS ROUND
        state.playerHasDrawn = true;
        state.opponentHasDrawn = true;
        state.phaseLabel = 'BANG';
        state.opponentDeathProgress = 0.18;
        state.playerDeathProgress = 0;
        state.lastHitSide = 'opponent';
        setStatus('Clean draw. Move to the next showdown.');
        state.flash = 0.8;
        state.screenShake = 0.8;
        audio.playDraw();
        scheduleTransition('advanceRound', 500);
    }

    function resolveLoss() {
        audio.stopMusic(); // STOP MUSIC IMMEDIATELY WHEN PLAYER DIES
        state.opponentHasDrawn = true;
        state.phaseLabel = 'HIT';
        state.playerDeathProgress = 0.18;
        state.opponentDeathProgress = 0;
        state.lastHitSide = 'player';
        setStatus('The outlaw fired first.');
        state.flash = 1;
        state.screenShake = 1;
        audio.playHit();
        scheduleTransition('endGame', 420, { reason: 'loss' });
    }

    function togglePause() {
        if (!isActivePhase() && state.phase !== phases.roundWin) {
            return state.isPaused;
        }

        if (!state.isPaused) {
            state.isPaused = true;
            state.pauseStartedAt = performance.now();
            state.phaseLabel = 'PAUSED';
            audio.stopMusic(); // STOP MUSIC ON PAUSE
            setPausedStatus();
            syncControls();
            return state.isPaused;
        }

        resumeAfterPause(performance.now());
        audio.startMusic(); // RESUME MUSIC ON UNPAUSE
        if (state.phase === phases.countdown) {
            state.phaseLabel = 'WAIT FOR IT';
        }
        return state.isPaused;
    }

    function toggleMute() {
        audio.toggleMute();
        syncControls();
        return audio.isMuted();
    }

    function onDraw() {
        audio.unlock();

        if (state.isPaused) {
            return;
        }

        if (state.phase === phases.menu) {
            startRound();
            return;
        }

        if (state.phase !== phases.countdown && state.phase !== phases.duel) {
            return;
        }

        if (state.phase === phases.countdown && performance.now() < state.drawTime) {
            resolveEarlyDraw();
            return;
        }

        if (state.phase === phases.duel) {
            resolveVictory();
        }
    }

    function tick(now) {
        if (state.isPaused) {
            state.flash = Math.max(0, state.flash - 0.02);
            state.screenShake = Math.max(0, state.screenShake - 0.04);
            renderer.render(state);
            state.animationFrame = window.requestAnimationFrame(tick);
            return;
        }

        // Change + 0.09 to + 0.035 for a smoother, gradual fall (~0.8 seconds total)
        if (state.playerDeathProgress > 0 && state.playerDeathProgress < 1) {
            state.playerDeathProgress = clamp(state.playerDeathProgress + 0.035, 0, 1);
        }

        if (state.opponentDeathProgress > 0 && state.opponentDeathProgress < 1) {
            state.opponentDeathProgress = clamp(state.opponentDeathProgress + 0.035, 0, 1);
        }

        state.screenShake = Math.max(0, state.screenShake - 0.08);

        if (state.pendingTransition && now >= state.pendingTransitionAt) {
            runPendingTransition();
        }

        const elapsed = now - state.countdownStart;
        const timeUntilDraw = state.drawTime - now;

        if (state.phase === phases.countdown) {
            state.tension = clamp(elapsed / (state.countdownDuration * 1000), 0, 1);
            state.progress = state.tension;
            state.countdownProgress = clamp(1 - state.tension, 0, 1);
            state.phaseLabel = timeUntilDraw > 0 ? `DRAW IN ${Math.max(0, Math.ceil(timeUntilDraw / 1000))}` : 'DRAW';

            if (timeUntilDraw <= 0) {
                state.phase = phases.duel;
                state.duelStartedAt = now;
                state.playerReady = true;
                state.opponentReady = true;
                state.phaseLabel = 'DRAW!';
                setStatus('Now!');
                audio.playSignal();
                syncControls();
            }
        } else if (state.phase === phases.duel) {
            const duelElapsed = now - state.duelStartedAt;
            state.tension = 1;
            state.progress = 1;
            state.countdownProgress = 0;
            state.phaseLabel = duelElapsed < 350 ? 'DRAW!' : 'WHO IS FASTER?';

            const opponentDelay = Math.max(130, 410 - state.round * 18);
            if (!state.opponentHasDrawn && duelElapsed >= opponentDelay) {
                resolveLoss();
            }
        } else if (state.phase === phases.roundWin) {
            state.progress = 1;
            state.countdownProgress = 0;
            state.phaseLabel = 'NEXT ROUND';
        }

        state.flash = Math.max(0, state.flash - 0.02);
        renderer.render(state);
        state.animationFrame = window.requestAnimationFrame(tick);
    }

    function startMenu() {
        audio.stopMusic(); // NO MUSIC ON MAIN MENU OR ON EXIT TO MENU
        state.phase = phases.menu;
        state.isPaused = false;
        state.round = 1;
        state.wins = 0;
        state.flash = 0;
        state.phaseLabel = 'Press start to begin.';
        state.tension = 0;
        state.progress = 0;
        state.countdownProgress = 0;
        resetDeathStates();
        clearPendingTransition();
        showScreen(phases.menu);
        syncHud();
        syncControls();
        renderer.render(state);
        setStatus('Choose Start Game to face the outlaw.');
    }

    function boot() {
        syncHud();
        showScreen(phases.menu);
        syncControls();
        renderer.render(state);
        state.animationFrame = window.requestAnimationFrame(tick);
    }

    return {
        boot,
        startMenu,
        startRound,
        onDraw,
        togglePause,
        toggleMute,
        getPhase() {
            return state.phase;
        },
        isPaused() {
            return state.isPaused;
        },
        isMuted() {
            return audio.isMuted();
        },
    };
}
