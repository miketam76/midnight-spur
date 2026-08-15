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

// Expanded 12-Outlaw Roster for game.js
const outlawRoster = [
    // 1. Warmup / Tutorial Tier
    {
        name: "SNAKE-EYE SAM",
        bounty: "$250",
        delayMs: 400,
        outfit: { hat: '#6e2f35', body: '#7a3d30', accent: '#e2d19d' }
    },
    {
        name: "RUSTLER RICK",
        bounty: "$450",
        delayMs: 370,
        outfit: { hat: '#443018', body: '#8c5828', accent: '#306844' }
    },

    // 2. Mid-Tier Desperados (Nods to classic Spaghetti Western figures)
    {
        name: "TUCO THE RAT", // Nod to Tuco / The Ugly
        bounty: "$750",
        delayMs: 340,
        outfit: { hat: '#9a7848', body: '#b08450', accent: '#e05840' }
    },
    {
        name: "EL INDIO", // Nod to Gian Maria Volonté's leader in For a Few Dollars More
        bounty: "$1,200",
        delayMs: 310,
        outfit: { hat: '#2c1810', body: '#582418', accent: '#d4a040' }
    },
    {
        name: "WILD GROGGY", // Nod to Groggy (Indio's top lieutenant / Luigi Pistilli)
        bounty: "$1,800",
        delayMs: 285,
        outfit: { hat: '#1c2430', body: '#3c4c64', accent: '#8c9ca8' }
    },
    {
        name: "CAVANAUGH", // Nod to Red Cavanaugh from For a Few Dollars More
        bounty: "$2,500",
        delayMs: 260,
        outfit: { hat: '#482014', body: '#703824', accent: '#e8d4a0' }
    },

    // 3. High-Tier Gunslingers
    {
        name: "CUCHILLO", // Nod to The Big Gundown / Tomas Milian
        bounty: "$3,500",
        delayMs: 240,
        outfit: { hat: '#5c4838', body: '#846044', accent: '#408868' }
    },
    {
        name: "BARON SAXON", // Nod to the Saxon Gang in Death Rides a Horse
        bounty: "$5,000",
        delayMs: 220,
        outfit: { hat: '#10141a', body: '#242a38', accent: '#c83428' }
    },
    {
        name: "PATRIARCH ADAM", // Nod to the corrupt Saxon patriarch
        bounty: "$7,500",
        delayMs: 205,
        outfit: { hat: '#382014', body: '#503020', accent: '#fce088' }
    },

    // 4. Boss & Sub-Boss Tier
    {
        name: "STENGEL", // Nod to Stengel from Sabata
        bounty: "$10,000",
        delayMs: 190,
        outfit: { hat: '#1c1c24', body: '#343444', accent: '#9070a8' }
    },
    {
        name: "PATRIARCA", // Nod to The Grand Duel
        bounty: "$15,000",
        delayMs: 175,
        outfit: { hat: '#0a0a0e', body: '#1a1820', accent: '#c02018' }
    },
    {
        name: "THE MAN IN BLACK", // Ultimate Boss Showdown ("Sentenza" / Angel Eyes archetype)
        bounty: "$25,000",
        delayMs: 160, // True frame-perfect quick draw
        outfit: { hat: '#000000', body: '#101014', accent: '#e0a020' }
    },

    // 5. Elite Desperado Tier
    {
        name: "MONCO THE HAWK", // Nod to the lone drifter archetype
        bounty: "$30,000",
        delayMs: 155,
        outfit: { hat: '#3c3226', body: '#5c4e3c', accent: '#709080' }
    },
    {
        name: "SNAKE O'HARA", // Nod to Bad Man's River
        bounty: "$40,000",
        delayMs: 150,
        outfit: { hat: '#1c1814', body: '#4a2818', accent: '#d87040' }
    },
    {
        name: "ROSCOE THE PREACHER", // Nod to Father John / Lewis in God's Gun
        bounty: "$50,000",
        delayMs: 145,
        outfit: { hat: '#101014', body: '#1c1c24', accent: '#e8e8f0' }
    },
    {
        name: "GRIFFIN THE BUTCHER", // Nod to Griffin / Captain Apache rivals
        bounty: "$65,000",
        delayMs: 140,
        outfit: { hat: '#341c18', body: '#602820', accent: '#f4c060' }
    },
    {
        name: "MAJOR APONTE", // Nod to Return of Sabata / corrupt garrison commanders
        bounty: "$80,000",
        delayMs: 135,
        outfit: { hat: '#142034', body: '#203454', accent: '#d4b038' }
    },
    {
        name: "THE DEVIL'S APPRENTICE", // Ultimate Mythic Duel (Frame-perfect boss)
        bounty: "$100,000",
        delayMs: 130, // Extremely fast ~8-frame window
        outfit: { hat: '#08080c', body: '#141418', accent: '#c81818' }
    },
    // Final Grand Champion Boss (The Ultimate High-Noon Showdown)
    {
        name: "THE MAN WITH NO NAME",
        bounty: "$250,000",
        delayMs: 125, // True razor-edge ~7.5 frame boss reaction speed
        isBlondie: true, // Flag for custom Eastwood sprite rendering
        outfit: { hat: '#443020', body: '#3c4e32', accent: '#f4f0e0' }
    }
];

// Function in game.js
function getOutlawForRound(round) {
    const index = (round - 1) % outlawRoster.length;
    const base = outlawRoster[index];

    // Each full 12-bounty loop shaves 10ms off the draw window
    const loop = Math.floor((round - 1) / outlawRoster.length);
    const speedBoost = loop * 10;

    return {
        ...base,
        // Floor at 110ms so it remains humanly beatable on keyboard/touch
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

function updateTumbleweed(state, width = 640, height = 400) {
    const tw = state.tumbleweed;
    if (!tw) return;

    if (!tw.active) {
        tw.timer--;
        if (tw.timer <= 0) {
            tw.active = true;
            tw.x = -30;
            // Spawns along the lower dirt street
            tw.y = Math.floor(height * 0.76) + Math.random() * 16;
            tw.vx = 1.4 + Math.random() * 1.0;
            tw.rotation = 0;
            tw.bouncePhase = 0;
        }
    } else {
        tw.x += tw.vx;
        tw.rotation += 0.08;
        tw.bouncePhase += 0.06;

        // Small parabolic bounce while rolling
        tw.currentY = tw.y - Math.abs(Math.sin(tw.bouncePhase) * 7);

        // Reset once it rolls completely off the right edge
        if (tw.x > width + 40) {
            tw.active = false;
            tw.timer = 180 + Math.floor(Math.random() * 240); // 3-7 second delay before next roll
        }
    }
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
        tumbleweed: {
            x: -40,
            y: 320,
            currentY: 320,
            vx: 1.8,
            rotation: 0,
            bouncePhase: 0,
            active: false,
            timer: 60 // Starts rolling soon after launch
        },
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

        updateTumbleweed(state, canvas.width, canvas.height);

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