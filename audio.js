function scheduleTone(context, frequency, startTime, duration, type = 'square', gainValue = 0.08, detune = 0) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    gainNode.gain.value = gainValue;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue * 0.001), startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
}

function scheduleNoiseBurst(context, startTime, duration, gainValue) {
    const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < bufferSize; index += 1) {
        const falloff = 1 - index / bufferSize;
        data[index] = (Math.random() * 2 - 1) * falloff;
    }

    const source = context.createBufferSource();
    const bandPass = context.createBiquadFilter();
    const gainNode = context.createGain();

    source.buffer = buffer;
    bandPass.type = 'bandpass';
    bandPass.frequency.value = 2200;
    bandPass.Q.value = 0.9;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    source.connect(bandPass);
    bandPass.connect(gainNode);
    gainNode.connect(context.destination);

    source.start(startTime);
    source.stop(startTime + duration + 0.02);
}

function playPeacemakerShot(context, startTime, baseFrequency = 165) {
    scheduleTone(context, baseFrequency + 24, startTime, 0.028, 'square', 0.24, -10);
    scheduleTone(context, baseFrequency * 2.1, startTime + 0.001, 0.014, 'triangle', 0.12, 30);
    scheduleTone(context, baseFrequency * 0.36, startTime + 0.008, 0.072, 'sawtooth', 0.065, -16);
    scheduleTone(context, 92, startTime + 0.012, 0.055, 'square', 0.05, -24);
    scheduleTone(context, 58, startTime + 0.006, 0.06, 'triangle', 0.045, -12);
    scheduleNoiseBurst(context, startTime + 0.0004, 0.02, 0.18);
}

function schedulePluck(context, frequency, startTime, duration, gainValue, type = 'triangle', detune = 0) {
    scheduleTone(context, frequency, startTime, duration, type, gainValue, detune);
}

// Add to audio.js - Synthesized Western Whistle
function scheduleWhistle(context, frequency, startTime, duration, gainValue = 0.025) {
    const osc = context.createOscillator();
    const vibrato = context.createOscillator();
    const vibratoGain = context.createGain();
    const gainNode = context.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;

    // Vibrato effect for that iconic lonely whistling sound
    vibrato.frequency.value = 5.5;
    vibratoGain.gain.value = frequency * 0.02;

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(context.destination);

    vibrato.start(startTime);
    osc.start(startTime);
    vibrato.stop(startTime + duration + 0.02);
    osc.stop(startTime + duration + 0.02);
}

// Update scheduleWesternLoop in audio.js to add Whistle motifs & Baritone Twang
function scheduleWesternLoop(context, startTime) {
    const beat = 60 / 96;
    const bassNotes = [82.41, 98, 110, 98];

    for (let bar = 0; bar < 2; bar += 1) {
        const barStart = startTime + bar * 4 * beat;

        // Rhythmic Bass Plucks
        bassNotes.forEach((frequency, beatIndex) => {
            const noteStart = barStart + beatIndex * beat;
            schedulePluck(context, frequency, noteStart, beat * 0.9, 0.03, 'sine');
            schedulePluck(context, frequency * 2, noteStart + 0.006, beat * 0.18, 0.015, 'triangle');
        });

        // Whistle Theme Motif
        if (bar === 0) {
            scheduleWhistle(context, 659.25, barStart, beat * 1.5);        // E5
            scheduleWhistle(context, 783.99, barStart + beat * 1.5, beat); // G5
            scheduleWhistle(context, 880.00, barStart + beat * 2.5, beat * 1.2); // A5
        } else {
            scheduleWhistle(context, 783.99, barStart, beat * 1.5);        // G5
            scheduleWhistle(context, 659.25, barStart + beat * 1.5, beat); // E5
            scheduleWhistle(context, 587.33, barStart + beat * 2.5, beat * 1.5); // D5
        }

        // Low Baritone Guitar Twang (Low Sawtooth + Bend)
        scheduleTone(context, 146.83, barStart + beat * 3.5, beat * 0.55, 'sawtooth', 0.022, -12);
    }
}

// audio.js

export function createAudioSystem() {
    let context = null;
    let muted = false;
    let musicTimer = null;
    let musicLoopEnd = 0;
    let musicEnabled = false;
    let musicMuted = false;
    let musicRestartTimer = null;

    // Track active music nodes for hard cancellation
    let activeMusicNodes = [];
    let musicGain = null;

    function ensureContext() {
        if (muted) {
            return null;
        }

        if (!context) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                return null;
            }

            context = new AudioContext();
            musicGain = context.createGain();
            musicGain.connect(context.destination);
        }

        if (context.state === 'suspended') {
            void context.resume();
        }

        return context;
    }

    // Helper to register scheduled music oscillators so they can be hard-killed
    function registerMusicNode(node) {
        activeMusicNodes.push(node);
        node.onended = () => {
            activeMusicNodes = activeMusicNodes.filter((n) => n !== node);
        };
    }

    function clearMusicTimer() {
        if (musicTimer) {
            window.clearInterval(musicTimer);
            musicTimer = null;
        }
    }

    function clearMusicRestartTimer() {
        if (musicRestartTimer) {
            window.clearTimeout(musicRestartTimer);
            musicRestartTimer = null;
        }
    }

    function stopMusic() {
        musicEnabled = false;
        musicLoopEnd = 0;
        clearMusicTimer();
        clearMusicRestartTimer();

        // 1. Instantly stop and disconnect all scheduled music oscillators
        activeMusicNodes.forEach((node) => {
            try {
                node.stop(0);
                node.disconnect();
            } catch (err) {
                // Ignore if node already stopped naturally
            }
        });
        activeMusicNodes = [];

        // 2. Mute music gain immediately to prevent lingering tails
        if (musicGain && context) {
            musicGain.gain.cancelScheduledValues(context.currentTime);
            musicGain.gain.setValueAtTime(0, context.currentTime);
        }
    }

    function scheduleMusic() {
        if (!context || muted || !musicEnabled) {
            return;
        }

        const now = context.currentTime;
        const lookahead = 2.5;

        // Ensure music gain is open when music is actively playing
        if (musicGain) {
            musicGain.gain.cancelScheduledValues(now);
            musicGain.gain.setValueAtTime(1, now);
        }

        if (musicLoopEnd === 0 || now + lookahead >= musicLoopEnd) {
            const nextStart = musicLoopEnd === 0 ? now + 0.05 : musicLoopEnd;

            // Pass musicGain and node tracking into loop scheduler
            scheduleWesternLoopTracked(context, nextStart, musicGain, registerMusicNode);
            musicLoopEnd = nextStart + (60 / 96) * 8;
        }
    }

    // ... Keep rest of your sound effects methods (playDraw, playVictory, etc.) ...

    return {
        unlock() {
            ensureContext();
        },
        startMusic() {
            stopMusic(); // Always kill previous instance before starting new one
            const audioContext = ensureContext();
            if (!audioContext || muted || musicMuted) {
                return;
            }

            musicEnabled = true;
            musicLoopEnd = 0;
            scheduleMusic();
            musicTimer = window.setInterval(scheduleMusic, 1000);
        },
        stopMusic() {
            stopMusic();
        },
        setMuted(value) {
            muted = Boolean(value);

            if (!context) {
                return muted;
            }

            if (muted && context.state === 'running') {
                void context.suspend();
            }

            if (!muted && context.state === 'suspended') {
                void context.resume();
            }

            if (muted) {
                stopMusic();
            } else if (musicEnabled) {
                scheduleMusic();
                clearMusicTimer();
                musicTimer = window.setInterval(scheduleMusic, 1000);
            }

            return muted;
        },
        toggleMute() {
            return this.setMuted(!muted);
        },
        isMuted() {
            return muted;
        },
        playSignal() {
            if (muted) return;
            const audioContext = ensureContext();
            if (!audioContext) return;
            const now = audioContext.currentTime;
            scheduleTone(audioContext, 392, now, 0.08, 'triangle', 0.05);
            scheduleTone(audioContext, 523.25, now + 0.08, 0.09, 'triangle', 0.05);
        },
        playDraw() {
            if (muted) return;
            const audioContext = ensureContext();
            if (!audioContext) return;
            const now = audioContext.currentTime;
            playPeacemakerShot(audioContext, now, 196);
        },
        playHit() {
            if (muted) return;
            const audioContext = ensureContext();
            if (!audioContext) return;
            const now = audioContext.currentTime;
            playPeacemakerShot(audioContext, now, 170);
            scheduleTone(audioContext, 82, now + 0.02, 0.09, 'square', 0.03, -22);
        },
        playVictory() {
            if (muted) return;
            const audioContext = ensureContext();
            if (!audioContext) return;
            const now = audioContext.currentTime;
            scheduleTone(audioContext, 523.25, now, 0.08, 'triangle', 0.06);
            scheduleTone(audioContext, 659.25, now + 0.1, 0.08, 'triangle', 0.06);
            scheduleTone(audioContext, 783.99, now + 0.2, 0.12, 'triangle', 0.06);
        },
        playLoss() {
            if (muted) return;
            const audioContext = ensureContext();
            if (!audioContext) return;
            const now = audioContext.currentTime;
            playPeacemakerShot(audioContext, now, 158);
            scheduleTone(audioContext, 106, now + 0.025, 0.14, 'square', 0.035, -16);
        },
    };
}

// Tracked Tone Scheduler that routes through musicGain and registers with activeMusicNodes
function scheduleTrackedTone(context, frequency, startTime, duration, type, gainValue, destinationGain, registerNode) {
    const osc = context.createOscillator();
    const gainNode = context.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    gainNode.gain.value = gainValue;

    osc.connect(gainNode);
    gainNode.connect(destinationGain);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue * 0.001), startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);

    registerNode(osc);
}

function scheduleWesternLoopTracked(context, startTime, musicGain, registerNode) {
    const beat = 60 / 96;
    const bassNotes = [82.41, 98, 110, 98];

    for (let bar = 0; bar < 2; bar += 1) {
        const barStart = startTime + bar * 4 * beat;

        bassNotes.forEach((frequency, beatIndex) => {
            const noteStart = barStart + beatIndex * beat;
            scheduleTrackedTone(context, frequency, noteStart, beat * 0.9, 'sine', 0.03, musicGain, registerNode);
            scheduleTrackedTone(context, frequency * 2, noteStart + 0.006, beat * 0.18, 'triangle', 0.015, musicGain, registerNode);
        });
    }
}