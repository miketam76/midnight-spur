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

// High-Detail 16-Bit Town Scenery (Saloon, Hotel, Signs & Boardwalks)
function renderHogansBackground(ctx, width, height, tension, progress) {
    const skySplit = Math.floor(height * 0.52);

    // Banded 16-Bit Dusk Sky with Warm Horizon Glow
    drawPixel(ctx, 0, 0, width, skySplit * 0.30, '#0a0d1a');
    drawPixel(ctx, 0, skySplit * 0.30, width, skySplit * 0.25, '#2c1820');
    drawPixel(ctx, 0, skySplit * 0.55, width, skySplit * 0.22, '#642818');
    drawPixel(ctx, 0, skySplit * 0.77, width, skySplit * 0.23, '#a84c10');

    // Distant Desert Mesa Silhouettes
    const mesaY = skySplit - 68;
    drawPixel(ctx, 60, mesaY + 16, 140, 48, '#381610');
    drawPixel(ctx, 90, mesaY, 80, 16, '#381610');
    drawPixel(ctx, width - 260, mesaY + 22, 160, 42, '#381610');
    drawPixel(ctx, width - 220, mesaY + 8, 90, 14, '#381610');

    const groundY = skySplit - 6;

    // --- 1. TWO-STORY BRICK & WOOD SALOON (Left Building) ---
    const saloonX = 8;
    const saloonW = 196;
    const saloonH = 152;
    const saloonY = groundY - saloonH + 10;

    // Main Brickwork Facade & Mortar Details
    drawPixel(ctx, saloonX, saloonY, saloonW, saloonH, nesPalette.outline);
    drawPixel(ctx, saloonX + 2, saloonY + 2, saloonW - 4, saloonH - 4, '#7c2814');

    // Horizontal Brick Mortar Lines
    for (let row = saloonY + 4; row < groundY + 6; row += 8) {
        drawPixel(ctx, saloonX + 4, row, saloonW - 8, 1, '#581c0e');
    }

    // False-Front Stepped Cornice / Roof Parapet
    drawPixel(ctx, saloonX + 16, saloonY - 18, saloonW - 32, 18, nesPalette.outline);
    drawPixel(ctx, saloonX + 18, saloonY - 16, saloonW - 36, 14, '#44140a');
    drawPixel(ctx, saloonX + 40, saloonY - 26, saloonW - 80, 8, nesPalette.outline);
    drawPixel(ctx, saloonX + 42, saloonY - 24, saloonW - 84, 6, '#581c0e');

    // "SALOON" Signboard Frame & Gold Lettering
    const sSignX = saloonX + 26;
    const sSignY = saloonY + 10;
    const sSignW = 144;
    const sSignH = 22;
    drawPixel(ctx, sSignX - 2, sSignY - 2, sSignW + 4, sSignH + 4, nesPalette.outline);
    drawPixel(ctx, sSignX, sSignY, sSignW, sSignH, '#2a1408');
    drawPixel(ctx, sSignX + 2, sSignY + 2, sSignW - 4, sSignH - 4, '#d89c58');
    drawPixel(ctx, sSignX + 4, sSignY + 4, sSignW - 8, sSignH - 8, '#3a1a0c');

    // 16-Bit Pixel-Drawn "SALOON" Text
    ctx.fillStyle = '#fce0a0';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("SALOON", sSignX + sSignW / 2, sSignY + 16);

    // Upper Floor Windows (Panes + Curtains)
    [saloonX + 24, saloonX + 136].forEach((winX) => {
        drawPixel(ctx, winX - 2, saloonY + 42, 36, 32, nesPalette.outline);
        drawPixel(ctx, winX, saloonY + 44, 32, 28, '#100c14');
        drawPixel(ctx, winX + 2, saloonY + 46, 8, 24, '#a82c18'); // Red Curtain
        drawPixel(ctx, winX + 22, saloonY + 46, 8, 24, '#a82c18');
        drawPixel(ctx, winX + 15, saloonY + 44, 2, 28, '#44140a'); // Window Mullion
        drawPixel(ctx, winX, saloonY + 58, 32, 2, '#44140a');
    });

    // Lower Floor Porch Roof & Support Pillars
    drawPixel(ctx, saloonX - 4, saloonY + 84, saloonW + 8, 8, nesPalette.outline);
    drawPixel(ctx, saloonX - 2, saloonY + 86, saloonW + 4, 4, '#582410');
    drawPixel(ctx, saloonX + 8, saloonY + 92, 6, 48, nesPalette.outline);
    drawPixel(ctx, saloonX + 10, saloonY + 92, 4, 48, '#a87038');
    drawPixel(ctx, saloonX + 180, saloonY + 92, 6, 48, nesPalette.outline);
    drawPixel(ctx, saloonX + 182, saloonY + 92, 4, 48, '#a87038');

    // Batwing Swinging Doors
    const doorX = saloonX + 78;
    const doorY = saloonY + 94;
    drawPixel(ctx, doorX - 4, doorY - 4, 44, 46, nesPalette.outline);
    drawPixel(ctx, doorX - 2, doorY - 2, 40, 44, '#100804');
    drawPixel(ctx, doorX, doorY + 6, 18, 28, '#884414'); // Left Flap
    drawPixel(ctx, doorX + 20, doorY + 6, 18, 28, '#884414'); // Right Flap
    drawPixel(ctx, doorX + 2, doorY + 12, 14, 2, '#502808'); // Slats
    drawPixel(ctx, doorX + 2, doorY + 20, 14, 2, '#502808');
    drawPixel(ctx, doorX + 22, doorY + 12, 14, 2, '#502808');
    drawPixel(ctx, doorX + 22, doorY + 20, 14, 2, '#502808');

    // --- 2. TWO-STORY CLAPBOARD HOTEL (Right Building) ---
    const hotelX = width - 216;
    const hotelW = 208;
    const hotelH = 160;
    const hotelY = groundY - hotelH + 10;

    // Clapboard Siding Facade
    drawPixel(ctx, hotelX, hotelY, hotelW, hotelH, nesPalette.outline);
    drawPixel(ctx, hotelX + 2, hotelY + 2, hotelW - 4, hotelH - 4, '#a87848');

    // Horizontal Wooden Siding Planks
    for (let row = hotelY + 4; row < groundY + 6; row += 6) {
        drawPixel(ctx, hotelX + 2, row, hotelW - 4, 1, '#78502c');
    }

    // Hotel Top Cornice Header
    drawPixel(ctx, hotelX - 4, hotelY - 14, hotelW + 8, 14, nesPalette.outline);
    drawPixel(ctx, hotelX - 2, hotelY - 12, hotelW + 4, 10, '#582410');

    // "HOTEL" Signboard Frame & Dark Lettering
    const hSignX = hotelX + 34;
    const hSignY = hotelY + 10;
    const hSignW = 140;
    const hSignH = 22;
    drawPixel(ctx, hSignX - 2, hSignY - 2, hSignW + 4, hSignH + 4, nesPalette.outline);
    drawPixel(ctx, hSignX, hSignY, hSignW, hSignH, '#381808');
    drawPixel(ctx, hSignX + 2, hSignY + 2, hSignW - 4, hSignH - 4, '#e4d0a0');

    // 16-Bit Pixel-Drawn "HOTEL" Text
    ctx.fillStyle = '#201008';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("HOTEL", hSignX + hSignW / 2, hSignY + 16);

    // Upper Floor Windows (3 Sets)
    [hotelX + 18, hotelX + 86, hotelX + 154].forEach((winX) => {
        drawPixel(ctx, winX - 2, hotelY + 40, 36, 30, nesPalette.outline);
        drawPixel(ctx, winX, hotelY + 42, 32, 26, '#181014');
        drawPixel(ctx, winX + 2, hotelY + 44, 6, 22, '#4878a8'); // Blue Curtains
        drawPixel(ctx, winX + 24, hotelY + 44, 6, 22, '#4878a8');
        drawPixel(ctx, winX + 15, hotelY + 42, 2, 26, '#583018');
        drawPixel(ctx, winX, hotelY + 54, 32, 2, '#583018');
    });

    // Second Floor Balcony Railing & Deck
    drawPixel(ctx, hotelX - 6, hotelY + 80, hotelW + 12, 6, nesPalette.outline);
    drawPixel(ctx, hotelX - 4, hotelY + 82, hotelW + 8, 3, '#d89c58'); // Balcony Floor
    for (let post = hotelX; post < hotelX + hotelW; post += 12) {
        drawPixel(ctx, post, hotelY + 70, 2, 10, '#381808'); // Spindles
    }
    drawPixel(ctx, hotelX - 4, hotelY + 68, hotelW + 8, 3, '#381808'); // Handrail

    // Lower Floor Hotel Entrance & Windows
    drawPixel(ctx, hotelX + 22, hotelY + 98, 36, 36, nesPalette.outline);
    drawPixel(ctx, hotelX + 24, hotelY + 100, 32, 32, '#181014');
    drawPixel(ctx, hotelX + 148, hotelY + 98, 36, 36, nesPalette.outline);
    drawPixel(ctx, hotelX + 150, hotelY + 100, 32, 32, '#181014');

    // Double Glass Entrance Doors
    drawPixel(ctx, hotelX + 82, hotelY + 94, 44, 46, nesPalette.outline);
    drawPixel(ctx, hotelX + 84, hotelY + 96, 40, 44, '#482010');
    drawPixel(ctx, hotelX + 88, hotelY + 100, 14, 24, '#181014');
    drawPixel(ctx, hotelX + 106, hotelY + 100, 14, 24, '#181014');

    // --- 3. TOWNSFOLK SPECTATORS (Window Observers) ---
    // Woman with Bun in Saloon Upper Window
    drawPixel(ctx, saloonX + 34, saloonY + 50, 12, 12, '#fcb070');
    drawPixel(ctx, saloonX + 32, saloonY + 46, 16, 6, '#381408'); // Hair Bun
    drawPixel(ctx, saloonX + 36, saloonY + 54, 2, 2, '#000000'); // Eye

    // Sheriff Peeking from Hotel Upper Window
    drawPixel(ctx, hotelX + 96, hotelY + 50, 12, 12, '#fcb070');
    drawPixel(ctx, hotelX + 92, hotelY + 46, 20, 4, '#181008'); // Black Stetson Hat
    drawPixel(ctx, hotelX + 96, hotelY + 42, 12, 6, '#181008');
    drawPixel(ctx, hotelX + 98, hotelY + 56, 8, 2, '#381408');  // Mustache

    // --- 4. WOODEN HITCHING POST RAIL & DETAILED HORSE ---
    drawPixel(ctx, 214, groundY - 16, 116, 24, nesPalette.outline);
    drawPixel(ctx, 216, groundY - 14, 112, 4, '#88481c');
    drawPixel(ctx, 222, groundY - 10, 6, 20, '#582c0e');
    drawPixel(ctx, 318, groundY - 10, 6, 20, '#582c0e');

    // High-Detail 16-Bit Horse
    const horseX = 244;
    const horseY = groundY - 38;

    // Musculature & Torso
    drawPixel(ctx, horseX, horseY, 48, 32, nesPalette.outline);
    drawPixel(ctx, horseX + 2, horseY + 2, 44, 28, '#582810');
    drawPixel(ctx, horseX + 8, horseY + 6, 30, 16, '#703418'); // Highlight

    // Neck & Head
    drawPixel(ctx, horseX + 36, horseY - 14, 14, 26, nesPalette.outline);
    drawPixel(ctx, horseX + 38, horseY - 12, 10, 22, '#582810');
    drawPixel(ctx, horseX + 44, horseY - 18, 12, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 46, horseY - 16, 8, 10, '#441c08');
    drawPixel(ctx, horseX + 48, horseY - 14, 2, 2, '#ffffff'); // Eye Glint
    drawPixel(ctx, horseX + 40, horseY - 20, 4, 6, '#582810'); // Ears

    // Mane, Bridle & Tail
    drawPixel(ctx, horseX + 34, horseY - 14, 4, 18, '#180804'); // Dark Mane
    drawPixel(ctx, horseX - 4, horseY + 4, 6, 24, '#180804');   // Flowing Tail
    drawPixel(ctx, horseX + 44, horseY - 12, 2, 12, '#fce0a0'); // Bridle Strap

    // Saddle & Stirrup
    drawPixel(ctx, horseX + 16, horseY - 2, 18, 14, '#2c1408'); // Dark Leather Saddle
    drawPixel(ctx, horseX + 18, horseY + 12, 2, 12, '#fce0a0'); // Stirrup Strap
    drawPixel(ctx, horseX + 16, horseY + 24, 6, 2, '#ffffff');  // Iron Stirrup

    // Legs & Hooves
    drawPixel(ctx, horseX + 4, horseY + 30, 6, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 6, horseY + 30, 4, 12, '#441c08');
    drawPixel(ctx, horseX + 4, horseY + 40, 6, 4, '#0c0604'); // Hoof

    drawPixel(ctx, horseX + 34, horseY + 30, 6, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 36, horseY + 30, 4, 12, '#441c08');
    drawPixel(ctx, horseX + 34, horseY + 40, 6, 4, '#0c0604');

    // --- 5. WOODEN BOARDWALK & MAIN DIRT STREET ---
    // Sidewalk Wooden Boardwalk Planking
    drawPixel(ctx, 0, groundY - 2, width, 6, nesPalette.outline);
    drawPixel(ctx, 0, groundY, width, 3, '#a87848');

    // Main Dirt Street with Deep Cart Wheel Ruts
    drawPixel(ctx, 0, groundY + 3, width, height - (groundY + 3), '#b87034');
    drawPixel(ctx, 0, groundY + 24, width, 6, '#884c1c');  // Upper Wagon Track
    drawPixel(ctx, 0, groundY + 54, width, 10, '#6c3810'); // Lower Deep Shadow Track
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