import { createAudioSystem } from './audio.js';
import { createRenderer } from './render.js';
import { loadBestWins, saveBestWins } from './storage.js';

const phases = {
    menu: 'menu',
    wanted: 'wanted',
    countdown: 'countdown',
    duel: 'duel',
    roundWin: 'roundWin',
    gameOver: 'gameOver',
};

// Expanded 8-Outlaw Roster for game.js
const outlawRoster = [
    {
        name: "SNAKE-EYE SAM",
        bounty: "$250",
        delayMs: 390, // Generous reaction window for warmup
        outfit: { hat: '#6e2f35', body: '#7a3d30', accent: '#e2d19d' }
    },
    {
        name: "RUSTLER RICK",
        bounty: "$400",
        delayMs: 350,
        outfit: { hat: '#443018', body: '#8c5828', accent: '#306844' }
    },
    {
        name: "CALAMITY KATE",
        bounty: "$750",
        delayMs: 310,
        outfit: { hat: '#101522', body: '#704d2c', accent: '#cf5e4d' }
    },
    {
        name: "ONE-EYE PETE",
        bounty: "$1,200",
        delayMs: 275,
        outfit: { hat: '#243654', body: '#4d6580', accent: '#79a67d' }
    },
    {
        name: "BANDIT BILL",
        bounty: "$1,800",
        delayMs: 245,
        outfit: { hat: '#181014', body: '#5c2420', accent: '#fce0a0' }
    },
    {
        name: "SHADOW SETH",
        bounty: "$2,500",
        delayMs: 220,
        outfit: { hat: '#14141c', body: '#2a3444', accent: '#a84c10' }
    },
    {
        name: "DEADEYE DAN",
        bounty: "$5,000",
        delayMs: 195, // Sub-200ms quick-draw
        outfit: { hat: '#000000', body: '#242424', accent: '#d7a65f' }
    },
    {
        name: "EL DIABLO",
        bounty: "$10,000",
        delayMs: 175, // Boss-tier lightning speed
        outfit: { hat: '#3c0a0a', body: '#140404', accent: '#e02814' }
    }
];

// In game.js
function getOutlawForRound(round) {
    const index = (round - 1) % outlawRoster.length;
    const base = outlawRoster[index];

    // Each full pass through the roster shaves 15ms off reaction times
    const loop = Math.floor((round - 1) / outlawRoster.length);
    const speedBoost = loop * 15;

    return {
        ...base,
        // Floor at 110ms so human players still have a fighting chance
        currentDelay: Math.max(110, base.delayMs - speedBoost)
    };
}

function createPlayerOutfit() {
    return {
        hat: '#101522',
        body: '#2f4368',
        accent: '#d7a65f',
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
        playerOutfit: createPlayerOutfit(),
        opponentOutfit: outlawRoster[0].outfit,
        currentOutlaw: outlawRoster[0],
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
        dom.gameScreen.hidden = screenName !== phases.wanted && screenName !== phases.countdown && screenName !== phases.duel && screenName !== phases.roundWin;
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

        if (type === 'beginDuelCountdown') {
            beginDuelCountdown();
        } else if (type === 'endGame') {
            endGame(payload.reason);
        } else if (type === 'advanceRound') {
            advanceRound();
        } else if (type === 'startRound') {
            startRound();
        }
    }

    function updateDifficulty() {
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
        audio.stopMusic();

        state.currentOutlaw = getOutlawForRound(state.round);
        state.opponentOutfit = state.currentOutlaw.outfit;
        state.playerOutfit = createPlayerOutfit();

        state.phase = phases.wanted;
        state.isPaused = false;
        resetDeathStates();
        clearPendingTransition();
        showScreen(phases.wanted);
        syncHud();
        syncControls();
        setStatus(`WANTED: ${state.currentOutlaw.name} - ${state.currentOutlaw.bounty}`);

        scheduleTransition('beginDuelCountdown', 1800);
    }

    function beginDuelCountdown() {
        audio.startMusic();
        state.phase = phases.countdown;
        state.playerReady = true;
        state.playerHasDrawn = false;
        state.opponentReady = false;
        state.opponentHasDrawn = false;
        state.flash = 0;
        state.countdownStart = performance.now();
        state.duelStartedAt = 0;
        state.duelResolutionAt = 0;
        state.phaseLabel = 'WAIT FOR IT';
        updateDifficulty();
        showScreen(phases.countdown);
        setStatus(`Face off against ${state.currentOutlaw.name}! Keep your hand steady.`);
        syncControls();
        audio.playSignal();
    }

    function endGame(reason) {
        audio.stopMusic();
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
                : `${state.currentOutlaw.name} fired before your hand reached the holster.`;
        setStatus(reason === 'win' ? 'Winner.' : 'Game over.');
        syncControls();
        audio[reason === 'win' ? 'playVictory' : 'playLoss']();
    }

    function advanceRound() {
        audio.stopMusic();
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
        audio.stopMusic();
        state.playerHasDrawn = true;
        state.phaseLabel = 'TOO EARLY';
        state.playerDeathProgress = 0.035;
        state.opponentDeathProgress = 0;
        state.lastHitSide = 'player';
        setStatus('You drew too soon and got clipped.');
        state.flash = 1;
        state.screenShake = 1;
        audio.playHit();
        scheduleTransition('endGame', 800, { reason: 'loss' });
    }

    function resolveVictory() {
        audio.stopMusic();
        state.playerHasDrawn = true;
        state.opponentHasDrawn = true;
        state.phaseLabel = 'BANG';
        state.opponentDeathProgress = 0.035;
        state.playerDeathProgress = 0;
        state.lastHitSide = 'opponent';
        setStatus('Clean draw. Move to the next showdown.');
        state.flash = 0.8;
        state.screenShake = 0.8;
        audio.playDraw();
        scheduleTransition('advanceRound', 900);
    }

    function resolveLoss() {
        audio.stopMusic();
        state.opponentHasDrawn = true;
        state.phaseLabel = 'HIT';
        state.playerDeathProgress = 0.035;
        state.opponentDeathProgress = 0;
        state.lastHitSide = 'player';
        setStatus(`${state.currentOutlaw.name} fired first.`);
        state.flash = 1;
        state.screenShake = 1;
        audio.playHit();
        scheduleTransition('endGame', 800, { reason: 'loss' });
    }

    function togglePause() {
        if (!isActivePhase() && state.phase !== phases.roundWin) {
            return state.isPaused;
        }

        if (!state.isPaused) {
            state.isPaused = true;
            state.pauseStartedAt = performance.now();
            state.phaseLabel = 'PAUSED';
            audio.stopMusic();
            setPausedStatus();
            syncControls();
            return state.isPaused;
        }

        resumeAfterPause(performance.now());
        audio.startMusic();
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

            const opponentDelay = state.currentOutlaw.currentDelay;
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
        audio.stopMusic();
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