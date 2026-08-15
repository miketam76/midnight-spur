// render.js - Hogan's Alley NES Zapper Arcade Aesthetic

const nesPalette = {
    skyTop: '#000000',      // Pure black upper sky for iconic Zapper contrast
    skyMid: '#442800',      // Deep rust orange sunset band
    skyBottom: '#a84400',   // Vibrant orange horizon
    ground: '#e4a058',     // Warm NES dirt track
    groundDark: '#884400', // Deep dirt shadows
    woodDark: '#442800',   // Target board framing
    woodLight: '#a87038',  // Wood planking
    outline: '#000000',    // Bold 8-bit black outlines
};

function drawPixel(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
}

// 8-Bit Wooden Frame Countdown Bar
function drawTimerMeter(ctx, width, progress) {
    const meterWidth = Math.round(width * 0.58);
    const meterHeight = 16;
    const meterX = Math.round((width - meterWidth) / 2);
    const meterY = 18;
    const fillWidth = Math.round(meterWidth * progress);

    drawPixel(ctx, meterX - 6, meterY - 6, meterWidth + 12, meterHeight + 12, nesPalette.outline);
    drawPixel(ctx, meterX - 4, meterY - 4, meterWidth + 8, meterHeight + 8, nesPalette.woodDark);
    drawPixel(ctx, meterX, meterY, meterWidth, meterHeight, '#000000');

    if (fillWidth > 0) {
        drawPixel(ctx, meterX, meterY, fillWidth, meterHeight, '#fce0a0');
        drawPixel(ctx, meterX, meterY, fillWidth, 4, '#ffffff');
    }
}

// Draw Authentic Hogan's Alley Style Cowboy Sprite
function drawHogansCowboy(ctx, x, y, outfit, facingLeft, drawArmUp) {
    const dir = facingLeft ? -1 : 1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const accentColor = outfit.accent;
    const skinColor = '#fcb070';
    const gunColor = '#fcfcfc'; // High contrast white/grey for 8-bit guns
    const OL = nesPalette.outline;

    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    // Ground Shadow (Solid blocky NES shadow)
    drawPixel(ctx, -20, 70, 40, 6, 'rgba(0, 0, 0, 0.5)');

    // --- HAT (Wide NES Brim) ---
    drawPixel(ctx, -26, -22, 52, 6, OL);            // Brim Outline
    drawPixel(ctx, -24, -20, 48, 4, hatColor);       // Brim Fill
    drawPixel(ctx, -16, -36, 32, 16, OL);           // Crown Outline
    drawPixel(ctx, -14, -34, 28, 14, hatColor);      // Crown Fill
    drawPixel(ctx, -14, -24, 28, 4, accentColor);    // Vibrant Bandana/Hatband

    // --- HEAD & FACE ---
    drawPixel(ctx, -12, -16, 24, 22, OL);
    drawPixel(ctx, -10, -14, 20, 18, skinColor);

    // Hogan's Alley Expressive Features
    const eyeX = dir * 3;
    drawPixel(ctx, eyeX - 2, -10, 4, 6, OL);        // Large Expressive Eye
    drawPixel(ctx, eyeX - 1, -9, 2, 2, '#ffffff');  // Eye Specular Highlight
    drawPixel(ctx, eyeX - 6, -2, 12, 4, OL);         // Heavy Mustache / Jawline

    // --- TORSO & VEST ---
    drawPixel(ctx, -16, 6, 32, 34, OL);
    drawPixel(ctx, -14, 8, 28, 30, bodyColor);

    // Scarf / Neckwear
    drawPixel(ctx, -8, 6, 16, 8, accentColor);

    // Gun Belt & Large Buckle
    drawPixel(ctx, -16, 34, 32, 6, '#442800');
    drawPixel(ctx, -4, 34, 8, 6, '#fce0a0');        // Brass Buckle

    // --- LEGS & BOOTS ---
    drawPixel(ctx, -14, 40, 12, 28, OL);
    drawPixel(ctx, -12, 42, 8, 24, '#203864');       // Classic Blue Jeans
    drawPixel(ctx, 2, 40, 12, 28, OL);
    drawPixel(ctx, 4, 42, 8, 24, '#142444');

    // Heavy Boots
    drawPixel(ctx, -16, 62, 14, 8, OL);
    drawPixel(ctx, -14, 64, 10, 6, '#442800');
    drawPixel(ctx, 2, 62, 14, 8, OL);
    drawPixel(ctx, 4, 64, 10, 6, '#442800');

    // --- ARM & GUN POSES ---
    if (drawArmUp) {
        // Shooting Pose (Straight arm out with high-contrast Zapper-style revolver)
        drawPixel(ctx, dir * 12, 10, 20 * dir, 10, OL);
        drawPixel(ctx, dir * 14, 12, 16 * dir, 6, bodyColor);
        drawPixel(ctx, dir * 30, 12, 8 * dir, 6, skinColor);

        // Revolver Pistol
        drawPixel(ctx, dir * 36, 4, 18 * dir, 8, OL);
        drawPixel(ctx, dir * 38, 6, 14 * dir, 4, gunColor);  // Chrome Barrel
        drawPixel(ctx, dir * 32, 10, 6 * dir, 8, '#442800'); // Wooden Grip
    } else {
        // Idle Holster Pose (Hand resting low over gun belt)
        drawPixel(ctx, dir * 12, 12, 10 * dir, 20, OL);
        drawPixel(ctx, dir * 14, 14, 6 * dir, 16, bodyColor);
        drawPixel(ctx, dir * 12, 28, 8 * dir, 8, skinColor); // Hand hovering at hip
    }

    ctx.restore();
}

// Downed Sprite Animation (Hogan's Alley Style Fall)
function drawHogansFallenCowboy(ctx, x, y, outfit, facingLeft, progress) {
    const dir = facingLeft ? -1 : 1;
    const fallDir = facingLeft ? 1 : -1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const skinColor = '#fcb070';
    const gunColor = '#fcfcfc';
    const OL = nesPalette.outline;

    const fall = Math.min(1, Math.max(0, progress));

    ctx.save();

    let bodyX = x;
    let bodyY = y;

    if (fall < 0.3) {
        const t = fall / 0.3;
        bodyX = x + t * 8 * fallDir;
        bodyY = y - t * 4;
    } else if (fall < 0.7) {
        const t = (fall - 0.3) / 0.4;
        bodyX = x + 8 * fallDir + t * 14 * fallDir;
        bodyY = y - 4 + t * 24;
    } else {
        bodyX = x + 22 * fallDir;
        bodyY = y + 20;
    }

    // Shadow
    drawPixel(ctx, bodyX - 24, y + 68, 48, 6, 'rgba(0, 0, 0, 0.5)');

    // Flying Hat Arc
    const hatX = x + fall * 36 * fallDir;
    const hatY = y - 20 - Math.sin(fall * Math.PI) * 24 + fall * 86;
    drawPixel(ctx, hatX - 12, hatY, 24, 8, OL);
    drawPixel(ctx, hatX - 10, hatY + 2, 20, 4, hatColor);

    // Flying Revolver
    const gunX = x + fall * 30 * fallDir;
    const gunY = y + 36 + fall * 32;
    drawPixel(ctx, gunX, gunY, 12 * dir, 6, OL);
    drawPixel(ctx, gunX + 2 * dir, gunY + 2, 8 * dir, 2, gunColor);

    ctx.translate(Math.floor(bodyX), Math.floor(bodyY));

    if (fall < 0.3) {
        // Recoil Pose
        drawPixel(ctx, -16, 8, 32, 32, OL);
        drawPixel(ctx, -14, 10, 28, 28, bodyColor);
        drawPixel(ctx, -12, -14, 24, 22, OL);
        drawPixel(ctx, -10, -12, 20, 18, skinColor);
    } else if (fall < 0.7) {
        // Knee Buckle
        drawPixel(ctx, -20, 16, 40, 28, OL);
        drawPixel(ctx, -18, 18, 36, 24, bodyColor);
        drawPixel(ctx, -14, 6, 20, 20, OL);
        drawPixel(ctx, -12, 8, 16, 16, skinColor);
    } else {
        // Full Downed Profile Sprite
        const headX = fallDir * 18;

        // Boots & Legs
        drawPixel(ctx, -headX - 8, 42, 16, 10, OL);
        drawPixel(ctx, -headX - 6, 44, 12, 6, '#442800');
        drawPixel(ctx, -headX + 2, 38, 22, 12, OL);
        drawPixel(ctx, -headX + 4, 40, 18, 8, '#203864');

        // Torso
        drawPixel(ctx, -16, 26, 32, 20, OL);
        drawPixel(ctx, -14, 28, 28, 16, bodyColor);

        // Head resting on dirt
        drawPixel(ctx, headX - 10, 20, 18, 18, OL);
        drawPixel(ctx, headX - 8, 22, 14, 14, skinColor);
        drawPixel(ctx, headX - 6, 28, 10, 4, OL); // Mustache line
    }

    ctx.restore();
}

// Wild West Town Background (Rescaled Architecture)
function renderHogansBackground(ctx, width, height, tension, progress) {
    const skySplit = Math.floor(height * 0.52);

    // Stark 8-Bit Sky Banding
    drawPixel(ctx, 0, 0, width, skySplit * 0.35, nesPalette.skyTop);
    drawPixel(ctx, 0, skySplit * 0.35, width, skySplit * 0.3, nesPalette.skyMid);
    drawPixel(ctx, 0, skySplit * 0.65, width, skySplit * 0.35, nesPalette.skyBottom);

    const groundY = skySplit - 8;

    // --- 1. TWO-STORY SALOON (Left Building) ---
    const saloonX = 10;
    const saloonW = 190;
    const saloonH = 140;
    const saloonY = groundY - saloonH + 10;

    // Main Brick Structure
    drawPixel(ctx, saloonX, saloonY, saloonW, saloonH, nesPalette.outline);
    drawPixel(ctx, saloonX + 4, saloonY + 4, saloonW - 8, saloonH - 8, '#882800');

    // Ornamental Roof Parapet
    drawPixel(ctx, saloonX + 20, saloonY - 16, saloonW - 40, 16, nesPalette.outline);
    drawPixel(ctx, saloonX + 24, saloonY - 12, saloonW - 48, 12, nesPalette.woodDark);

    // Saloon Main Signboard
    drawPixel(ctx, saloonX + 25, saloonY + 12, 140, 20, nesPalette.outline);
    drawPixel(ctx, saloonX + 28, saloonY + 14, 134, 16, nesPalette.woodLight);

    // Upper Floor Windows
    drawPixel(ctx, saloonX + 25, saloonY + 42, 32, 28, nesPalette.outline);
    drawPixel(ctx, saloonX + 133, saloonY + 42, 32, 28, nesPalette.outline);

    // Lower Floor Batwing Doors & Porch Pillars
    drawPixel(ctx, saloonX + 75, saloonY + 84, 40, 48, nesPalette.outline);
    drawPixel(ctx, saloonX + 78, saloonY + 92, 34, 30, nesPalette.woodDark);
    drawPixel(ctx, saloonX + 10, saloonY + 80, 8, 52, nesPalette.outline);
    drawPixel(ctx, saloonX + 172, saloonY + 80, 8, 52, nesPalette.outline);

    // --- 2. HOTEL & SHERIFF OFFICE (Right Building) ---
    const hotelX = width - 210;
    const hotelW = 200;
    const hotelH = 150;
    const hotelY = groundY - hotelH + 10;

    // Wooden Siding Building
    drawPixel(ctx, hotelX, hotelY, hotelW, hotelH, nesPalette.outline);
    drawPixel(ctx, hotelX + 4, hotelY + 4, hotelW - 8, hotelH - 8, nesPalette.woodLight);

    // Hotel Signboard Top
    drawPixel(ctx, hotelX + 30, hotelY + 10, 140, 18, nesPalette.outline);
    drawPixel(ctx, hotelX + 34, hotelY + 12, 132, 14, nesPalette.woodDark);

    // Upper Floor Windows
    drawPixel(ctx, hotelX + 20, hotelY + 38, 30, 32, nesPalette.outline);
    drawPixel(ctx, hotelX + 85, hotelY + 38, 30, 32, nesPalette.outline);
    drawPixel(ctx, hotelX + 150, hotelY + 38, 30, 32, nesPalette.outline);

    // Hotel Balcony Trim
    drawPixel(ctx, hotelX + 10, hotelY + 78, 180, 8, nesPalette.outline);
    drawPixel(ctx, hotelX + 12, hotelY + 80, 176, 4, nesPalette.woodDark);

    // Lower Floor Windows
    drawPixel(ctx, hotelX + 30, hotelY + 96, 32, 36, nesPalette.outline);
    drawPixel(ctx, hotelX + 138, hotelY + 96, 32, 36, nesPalette.outline);

    // --- 3. TOWNSFOLK SPECTATORS ---
    // Peeking from Saloon Upper Window
    drawPixel(ctx, saloonX + 35, saloonY + 48, 12, 12, '#fce0a0');
    drawPixel(ctx, saloonX + 33, saloonY + 44, 16, 6, nesPalette.outline);

    // Standing in Hotel Window
    drawPixel(ctx, hotelX + 92, hotelY + 44, 16, 16, nesPalette.outline);
    drawPixel(ctx, hotelX + 94, hotelY + 46, 12, 12, '#fce0a0');

    // --- 4. HITCHING POSTS & HORSE ---
    // Wooden Rail Between Buildings
    drawPixel(ctx, 215, groundY - 14, 110, 24, nesPalette.outline);
    drawPixel(ctx, 217, groundY - 12, 106, 4, nesPalette.woodDark);
    drawPixel(ctx, 225, groundY - 8, 6, 18, nesPalette.woodDark);
    drawPixel(ctx, 305, groundY - 8, 6, 18, nesPalette.woodDark);

    // 8-Bit Horse Tied to Rail
    const horseX = 245;
    const horseY = groundY - 32;
    drawPixel(ctx, horseX, horseY, 42, 28, nesPalette.outline);
    drawPixel(ctx, horseX + 2, horseY + 2, 38, 24, '#502814');
    drawPixel(ctx, horseX + 32, horseY - 8, 12, 20, nesPalette.outline);
    drawPixel(ctx, horseX + 34, horseY - 6, 8, 16, '#502814');
    drawPixel(ctx, horseX + 4, horseY + 26, 6, 12, nesPalette.outline);
    drawPixel(ctx, horseX + 28, horseY + 26, 6, 12, nesPalette.outline);

    // --- 5. GROUND DIRT & TRACK ---
    drawPixel(ctx, 0, groundY, width, height - groundY, nesPalette.ground);
    drawPixel(ctx, 0, groundY + 42, width, 14, nesPalette.groundDark);
}

// Render 8-Bit Wanted Poster Screen
function drawWantedPoster(ctx, width, height, outlaw) {
    const cardW = 320;
    const cardH = 340;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    // Darkened Background Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, width, height);

    // Parchment Poster Frame
    drawPixel(ctx, cardX - 6, cardY - 6, cardW + 12, cardH + 12, nesPalette.outline);
    drawPixel(ctx, cardX, cardY, cardW, cardH, '#e4a058');
    drawPixel(ctx, cardX + 8, cardY + 8, cardW - 16, cardH - 16, '#c4784c');

    // Text Header
    ctx.fillStyle = '#000000';
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("WANTED", width / 2, cardY + 50);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText("DEAD OR ALIVE", width / 2, cardY + 75);

    // Mugshot Box & Outlaw Sprite Rendering
    const mugX = width / 2;
    const mugY = cardY + 160;
    drawPixel(ctx, mugX - 45, mugY - 55, 90, 90, nesPalette.outline);
    drawPixel(ctx, mugX - 40, mugY - 50, 80, 80, '#884400');

    // Render Outlaw Portrait
    drawHogansCowboy(ctx, mugX, mugY - 10, outlaw.outfit, true, false);

    // Name & Bounty Details
    ctx.fillStyle = '#000000';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText(outlaw.name, width / 2, cardY + 250);

    ctx.fillStyle = '#882800';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillText(`REWARD ${outlaw.bounty}`, width / 2, cardY + 290);
}

export function createRenderer(canvas) {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    context.imageSmoothingEnabled = false;

    return {
        render(state) {
            const shake = state.screenShake || 0;
            const shakeX = shake > 0 ? (Math.random() - 0.5) * shake * 6 : 0;
            const shakeY = shake > 0 ? (Math.random() - 0.5) * shake * 4 : 0;

            context.save();
            context.translate(Math.floor(shakeX), Math.floor(shakeY));

            if (state.phase === 'wanted') {
                renderHogansBackground(context, width, height, 0, 0);
                drawWantedPoster(context, width, height, state.currentOutlaw);
                context.restore();
                return;
            }

            renderHogansBackground(context, width, height, state.tension, state.progress);
            drawTimerMeter(context, width, state.countdownProgress);

            const playerX = width * 0.26;
            const opponentX = width * 0.74;
            const cowboyY = height * 0.40;

            // Player Render (Arm ONLY goes up if playerHasDrawn is true)
            if (state.playerDeathProgress > 0) {
                drawHogansFallenCowboy(context, playerX, cowboyY, state.playerOutfit, false, state.playerDeathProgress);
            } else {
                drawHogansCowboy(context, playerX, cowboyY, state.playerOutfit, false, state.playerHasDrawn);
            }

            // Opponent Render (Arm ONLY goes up if opponentHasDrawn is true)
            if (state.opponentDeathProgress > 0) {
                drawHogansFallenCowboy(context, opponentX, cowboyY, state.opponentOutfit, true, state.opponentDeathProgress);
            } else {
                drawHogansCowboy(context, opponentX, cowboyY, state.opponentOutfit, true, state.opponentHasDrawn);
            }

            // Phase Text Overlay
            context.fillStyle = '#fce0a0';
            context.font = '28px "Press Start 2P", monospace';
            context.textAlign = 'center';
            context.fillText(state.phaseLabel, width / 2, height - 44);

            // Screen Flash - disabled for now
            // if (state.flash) {
            //     context.fillStyle = `rgba(255, 255, 255, ${state.flash})`;
            //     context.fillRect(0, 0, width, height);
            // }

            context.restore();
        },
    };
}