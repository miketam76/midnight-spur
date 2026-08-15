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

// High-Detail (2x Pixel Grid) Cowboy Sprite
function drawHogansCowboy(ctx, x, y, outfit, facingLeft, drawArmUp) {
    const dir = facingLeft ? -1 : 1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const accentColor = outfit.accent;
    const skinColor = '#fcb070';
    const skinShadow = '#c47038';
    const gunMetal = '#e0e0e0';
    const gunHighlight = '#ffffff';
    const OL = nesPalette.outline;

    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    // Ground Shadow
    drawPixel(ctx, -22, 70, 44, 6, 'rgba(0, 0, 0, 0.45)');

    // --- HAT (Curved 2x Brim + Creased Crown) ---
    // Brim Outline & Fill
    drawPixel(ctx, -28, -22, 56, 4, OL);
    drawPixel(ctx, -26, -20, 52, 4, hatColor);
    drawPixel(ctx, -28, -24, 4, 4, OL); // Curved brim ends
    drawPixel(ctx, 24, -24, 4, 4, OL);

    // Crown Outline & Top Crease
    drawPixel(ctx, -16, -38, 32, 18, OL);
    drawPixel(ctx, -14, -36, 28, 16, hatColor);
    drawPixel(ctx, -6, -38, 12, 4, OL); // Crown pinch crease
    drawPixel(ctx, -4, -36, 8, 2, '#201828');

    // Patterned Hatband
    drawPixel(ctx, -14, -24, 28, 4, accentColor);
    drawPixel(ctx, -14, -22, 28, 2, OL);

    // --- HEAD, HAIR & FACIAL FEATURES (2x Detail) ---
    drawPixel(ctx, -12, -16, 24, 22, OL);
    drawPixel(ctx, -10, -14, 20, 18, skinColor);
    drawPixel(ctx, -10, -2, 20, 4, skinShadow); // Neck/Jaw shadow

    // Sideburns
    drawPixel(ctx, -dir * 10, -14, 4, 10, '#442800');

    // Eyes with Pupils & Brows
    const eyeX = dir * 4;
    drawPixel(ctx, eyeX - 4, -12, 8, 2, OL);        // Eyebrow
    drawPixel(ctx, eyeX - 4, -9, 8, 4, '#ffffff');  // Eye white
    drawPixel(ctx, eyeX - 2, -9, 4, 4, OL);         // Pupil
    drawPixel(ctx, eyeX - 1, -9, 2, 2, '#4890e0');  // Blue Iris glint

    // Nose & Handlebar Mustache
    drawPixel(ctx, eyeX, -5, 4, 2, skinShadow);     // Nose bridge
    drawPixel(ctx, eyeX - 8, -3, 16, 4, '#442800'); // Mustache base
    drawPixel(ctx, eyeX - 10, -1, 4, 4, '#442800'); // Curled tips
    drawPixel(ctx, eyeX + 6, -1, 4, 4, '#442800');

    // Silk Bandana / Scarf with Knot
    drawPixel(ctx, -8, 6, 16, 8, accentColor);
    drawPixel(ctx, -4, 8, 8, 8, accentColor);       // Hanging knot
    drawPixel(ctx, -2, 10, 4, 6, '#ffffff');        // Highlight

    // --- VEST, SHIRT & DETAILS ---
    drawPixel(ctx, -16, 6, 32, 34, OL);
    drawPixel(ctx, -14, 8, 28, 30, bodyColor);

    // Shirt Collar & Button Line
    drawPixel(ctx, -2, 10, 4, 24, '#ffffff');       // White under-shirt
    drawPixel(ctx, -1, 14, 2, 2, '#442800');        // Buttons
    drawPixel(ctx, -1, 20, 2, 2, '#442800');
    drawPixel(ctx, -1, 26, 2, 2, '#442800');

    // Vest Seams / Shadow
    drawPixel(ctx, -14, 8, 4, 30, 'rgba(0, 0, 0, 0.2)');
    drawPixel(ctx, 10, 8, 4, 30, 'rgba(0, 0, 0, 0.2)');

    // Gun Belt, Bullets & Buckle
    drawPixel(ctx, -16, 34, 32, 6, '#442800');
    drawPixel(ctx, -10, 36, 3, 2, '#fce0a0');       // Ammo loops
    drawPixel(ctx, -6, 36, 3, 2, '#fce0a0');
    drawPixel(ctx, 4, 36, 3, 2, '#fce0a0');
    drawPixel(ctx, 8, 36, 3, 2, '#fce0a0');
    drawPixel(ctx, -3, 34, 6, 6, '#fce0a0');        // Buckle outer
    drawPixel(ctx, -1, 36, 2, 2, '#442800');        // Buckle inner

    // --- LEGS, JEANS & BOOT SPURS ---
    drawPixel(ctx, -14, 40, 12, 28, OL);
    drawPixel(ctx, -12, 42, 8, 24, '#203864');
    drawPixel(ctx, -10, 44, 4, 18, '#305088');      // Denim highlight
    drawPixel(ctx, 2, 40, 12, 28, OL);
    drawPixel(ctx, 4, 42, 8, 24, '#142444');

    // Boots with Heel Spurs
    drawPixel(ctx, -16, 62, 14, 8, OL);
    drawPixel(ctx, -14, 64, 10, 6, '#442800');
    drawPixel(ctx, 2, 62, 14, 8, OL);
    drawPixel(ctx, 4, 64, 10, 6, '#442800');

    // Golden Boot Spurs
    drawPixel(ctx, -dir * 16, 64, 4, 4, '#fce0a0');
    drawPixel(ctx, -dir * 18, 65, 2, 2, '#fce0a0');

    // --- ARMS & WEAPON (Detailed Peacemaker Revolver) ---
    if (drawArmUp) {
        // Extended Shooting Arm
        drawPixel(ctx, dir * 12, 10, 20 * dir, 10, OL);
        drawPixel(ctx, dir * 14, 12, 16 * dir, 6, bodyColor);
        drawPixel(ctx, dir * 30, 12, 8 * dir, 6, skinColor);

        // Revolver (Cylinder, Barrel, Hammer, Sight)
        drawPixel(ctx, dir * 36, 4, 20 * dir, 8, OL);
        drawPixel(ctx, dir * 38, 6, 16 * dir, 3, gunMetal);     // Barrel
        drawPixel(ctx, dir * 38, 5, 14 * dir, 1, gunHighlight); // Barrel Reflection
        drawPixel(ctx, dir * 54, 4, 2 * dir, 2, OL);            // Front Sight
        drawPixel(ctx, dir * 36, 7, 6 * dir, 4, '#606060');     // Cylinder
        drawPixel(ctx, dir * 32, 10, 6 * dir, 8, '#502814');    // Wood grip
        drawPixel(ctx, dir * 32, 4, 2 * dir, 4, OL);            // Cocked Hammer
    } else {
        // Holstered Idle Arm
        drawPixel(ctx, dir * 12, 12, 10 * dir, 22, OL);
        drawPixel(ctx, dir * 14, 14, 6 * dir, 18, bodyColor);
        drawPixel(ctx, dir * 12, 30, 8 * dir, 8, skinColor);    // Hand resting on grip
        drawPixel(ctx, dir * 16, 36, 6 * dir, 10, '#381808');   // Leather holster
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

    // High-Detail 8-Bit Horse tied to hitching post
    const horseX = 240;
    const horseY = groundY - 36;

    // Body & Musculature
    drawPixel(ctx, horseX, horseY, 46, 30, nesPalette.outline);
    drawPixel(ctx, horseX + 2, horseY + 2, 42, 26, '#603018');
    drawPixel(ctx, horseX + 8, horseY + 6, 28, 14, '#783c20'); // Flank highlight

    // Neck & Head
    drawPixel(ctx, horseX + 34, horseY - 12, 14, 24, nesPalette.outline);
    drawPixel(ctx, horseX + 36, horseY - 10, 10, 20, '#603018');
    drawPixel(ctx, horseX + 42, horseY - 16, 10, 12, nesPalette.outline); // Muzzle
    drawPixel(ctx, horseX + 44, horseY - 14, 8, 10, '#502814');
    drawPixel(ctx, horseX + 46, horseY - 12, 2, 2, '#ffffff');           // Eye glint
    drawPixel(ctx, horseX + 38, horseY - 18, 4, 6, '#603018');            // Ears

    // Dark Mane & Tail
    drawPixel(ctx, horseX + 32, horseY - 12, 4, 16, '#201008'); // Mane
    drawPixel(ctx, horseX - 4, horseY + 4, 6, 22, '#201008');   // Tail

    // Leather Saddle & Stirrups
    drawPixel(ctx, horseX + 14, horseY - 2, 16, 12, '#381808'); // Saddle
    drawPixel(ctx, horseX + 16, horseY + 10, 2, 12, '#fce0a0'); // Stirrup leather
    drawPixel(ctx, horseX + 14, horseY + 22, 6, 2, '#fce0a0');  // Stirrup iron

    // Legs & Hooves
    drawPixel(ctx, horseX + 4, horseY + 28, 6, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 6, horseY + 28, 4, 12, '#502814');
    drawPixel(ctx, horseX + 4, horseY + 38, 6, 4, '#100804'); // Hoof

    drawPixel(ctx, horseX + 32, horseY + 28, 6, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 34, horseY + 28, 4, 12, '#502814');
    drawPixel(ctx, horseX + 32, horseY + 38, 6, 4, '#100804');

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