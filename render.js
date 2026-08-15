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

// High-Detail 16-Bit Town Scenery (Saloon, Sheriff, Bank, General Store, Hotel)
function renderHogansBackground(ctx, width, height, tension, progress) {
    const skySplit = Math.floor(height * 0.52);

    // Banded 16-Bit Dusk Sky
    drawPixel(ctx, 0, 0, width, skySplit * 0.30, '#0a0d1a');
    drawPixel(ctx, 0, skySplit * 0.30, width, skySplit * 0.25, '#2c1820');
    drawPixel(ctx, 0, skySplit * 0.55, width, skySplit * 0.22, '#642818');
    drawPixel(ctx, 0, skySplit * 0.77, width, skySplit * 0.23, '#a84c10');

    // Distant Desert Mesas
    const mesaY = skySplit - 68;
    drawPixel(ctx, 20, mesaY + 16, 120, 48, '#381610');
    drawPixel(ctx, width - 200, mesaY + 22, 140, 42, '#381610');

    const groundY = skySplit - 6;

    // --- 1. SALOON (Far Left) ---
    const saloonX = 4;
    const saloonW = 160;
    const saloonH = 146;
    const saloonY = groundY - saloonH + 10;

    drawPixel(ctx, saloonX, saloonY, saloonW, saloonH, nesPalette.outline);
    drawPixel(ctx, saloonX + 2, saloonY + 2, saloonW - 4, saloonH - 4, '#7c2814');

    for (let row = saloonY + 4; row < groundY + 6; row += 8) {
        drawPixel(ctx, saloonX + 4, row, saloonW - 8, 1, '#581c0e');
    }

    // Cornice & Sign
    drawPixel(ctx, saloonX + 10, saloonY - 14, saloonW - 20, 14, nesPalette.outline);
    drawPixel(ctx, saloonX + 12, saloonY - 12, saloonW - 24, 10, '#44140a');

    const sSignX = saloonX + 15;
    const sSignY = saloonY + 8;
    const sSignW = 130;
    const sSignH = 20;
    drawPixel(ctx, sSignX - 2, sSignY - 2, sSignW + 4, sSignH + 4, nesPalette.outline);
    drawPixel(ctx, sSignX, sSignY, sSignW, sSignH, '#2a1408');
    drawPixel(ctx, sSignX + 2, sSignY + 2, sSignW - 4, sSignH - 4, '#d89c58');
    drawPixel(ctx, sSignX + 4, sSignY + 4, sSignW - 8, sSignH - 8, '#3a1a0c');

    ctx.fillStyle = '#fce0a0';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("SALOON", sSignX + sSignW / 2, sSignY + 14);

    // Saloon Windows & Doors
    [saloonX + 14, saloonX + 112].forEach((winX) => {
        drawPixel(ctx, winX - 2, saloonY + 36, 32, 26, nesPalette.outline);
        drawPixel(ctx, winX, saloonY + 38, 28, 22, '#100c14');
        drawPixel(ctx, winX + 2, saloonY + 40, 6, 18, '#a82c18');
        drawPixel(ctx, winX + 20, saloonY + 40, 6, 18, '#a82c18');
    });

    drawPixel(ctx, saloonX - 2, saloonY + 76, saloonW + 4, 8, nesPalette.outline);
    drawPixel(ctx, saloonX, saloonY + 78, saloonW, 4, '#582410');
    drawPixel(ctx, saloonX + 6, saloonY + 84, 6, 52, nesPalette.outline);
    drawPixel(ctx, saloonX + 148, saloonY + 84, 6, 52, nesPalette.outline);

    const sDoorX = saloonX + 60;
    const sDoorY = saloonY + 86;
    drawPixel(ctx, sDoorX - 4, sDoorY - 4, 40, 48, nesPalette.outline);
    drawPixel(ctx, sDoorX, sDoorY + 6, 15, 28, '#884414');
    drawPixel(ctx, sDoorX + 17, sDoorY + 6, 15, 28, '#884414');

    // --- 2. SHERIFF'S OFFICE & JAIL (Left-Center) ---
    const sheriffX = 170;
    const sheriffW = 145;
    const sheriffH = 110;
    const sheriffY = groundY - sheriffH + 8;

    drawPixel(ctx, sheriffX, sheriffY, sheriffW, sheriffH, nesPalette.outline);
    drawPixel(ctx, sheriffX + 2, sheriffY + 2, sheriffW - 4, sheriffH - 4, '#5c3822');

    for (let row = sheriffY + 4; row < groundY + 6; row += 7) {
        drawPixel(ctx, sheriffX + 2, row, sheriffW - 4, 1, '#3a2012');
    }

    drawPixel(ctx, sheriffX - 2, sheriffY - 8, sheriffW + 4, 8, nesPalette.outline);
    drawPixel(ctx, sheriffX, sheriffY - 6, sheriffW, 6, '#3a2012');

    const shSignX = sheriffX + 10;
    const shSignY = sheriffY + 6;
    const shSignW = 125;
    const shSignH = 16;
    drawPixel(ctx, shSignX - 2, shSignY - 2, shSignW + 4, shSignH + 4, nesPalette.outline);
    drawPixel(ctx, shSignX, shSignY, shSignW, shSignH, '#201408');
    drawPixel(ctx, shSignX + 2, shSignY + 2, shSignW - 4, shSignH - 4, '#a87848');

    // Sheriff Star
    const starX = shSignX + 10;
    const starY = shSignY + 8;
    drawPixel(ctx, starX - 3, starY - 3, 6, 6, '#fce0a0');

    ctx.fillStyle = '#000000';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText("SHERIFF", shSignX + 68, shSignY + 12);

    // Barred Jail Window
    const jailWinX = sheriffX + 12;
    const jailWinY = sheriffY + 30;
    drawPixel(ctx, jailWinX - 2, jailWinY - 2, 30, 26, nesPalette.outline);
    drawPixel(ctx, jailWinX, jailWinY, 26, 22, '#181014');
    drawPixel(ctx, jailWinX + 6, jailWinY + 8, 3, 3, '#fcb070');
    drawPixel(ctx, jailWinX + 16, jailWinY + 8, 3, 3, '#fcb070');
    drawPixel(ctx, jailWinX + 6, jailWinY, 2, 22, '#888888');
    drawPixel(ctx, jailWinX + 14, jailWinY, 2, 22, '#888888');
    drawPixel(ctx, jailWinX + 22, jailWinY, 2, 22, '#888888');

    // Office Window & Door
    const offWinX = sheriffX + 102;
    const offWinY = sheriffY + 30;
    drawPixel(ctx, offWinX - 2, offWinY - 2, 30, 26, nesPalette.outline);
    drawPixel(ctx, offWinX, offWinY, 26, 22, '#181014');
    drawPixel(ctx, offWinX + 2, offWinY + 2, 5, 18, '#4878a8');
    drawPixel(ctx, offWinX + 19, offWinY + 2, 5, 18, '#4878a8');

    const shDoorX = sheriffX + 54;
    const shDoorY = sheriffY + 40;
    drawPixel(ctx, shDoorX - 2, shDoorY - 2, 34, 58, nesPalette.outline);
    drawPixel(ctx, shDoorX, shDoorY, 30, 56, '#3a1e0c');
    drawPixel(ctx, shDoorX + 22, shDoorY + 26, 4, 4, '#fce0a0');

    // --- 3. THE BANK (Center - Sturdy Stone Masonry) ---
    const bankX = 320;
    const bankW = 150;
    const bankH = 135;
    const bankY = groundY - bankH + 8;

    // Stone Grey Facade
    drawPixel(ctx, bankX, bankY, bankW, bankH, nesPalette.outline);
    drawPixel(ctx, bankX + 2, bankY + 2, bankW - 4, bankH - 4, '#7c8088');

    // Stone Masonry Grid Blocks
    for (let r = bankY + 6; r < groundY + 6; r += 12) {
        drawPixel(ctx, bankX + 2, r, bankW - 4, 1, '#50545c');
    }
    for (let c = bankX + 18; c < bankX + bankW; c += 28) {
        drawPixel(ctx, c, bankY + 2, 1, bankH - 4, '#50545c');
    }

    // Classical Stone Pediment Roof
    drawPixel(ctx, bankX - 4, bankY - 14, bankW + 8, 14, nesPalette.outline);
    drawPixel(ctx, bankX - 2, bankY - 12, bankW + 4, 10, '#585c64');

    // "BANK" Signboard
    const bSignX = bankX + 20;
    const bSignY = bankY + 8;
    const bSignW = 110;
    const bSignH = 18;
    drawPixel(ctx, bSignX - 2, bSignY - 2, bSignW + 4, bSignH + 4, nesPalette.outline);
    drawPixel(ctx, bSignX, bSignY, bSignW, bSignH, '#1c2024');
    drawPixel(ctx, bSignX + 2, bSignY + 2, bSignW - 4, bSignH - 4, '#fce0a0');

    ctx.fillStyle = '#1c2024';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText("BANK", bSignX + bSignW / 2, bSignY + 13);

    // Stone Pillars & Barred Windows
    drawPixel(ctx, bankX + 8, bankY + 32, 28, 30, nesPalette.outline);
    drawPixel(ctx, bankX + 10, bankY + 34, 24, 26, '#181c20');
    drawPixel(ctx, bankX + 16, bankY + 34, 2, 26, '#888888');
    drawPixel(ctx, bankX + 24, bankY + 34, 2, 26, '#888888');

    drawPixel(ctx, bankX + 114, bankY + 32, 28, 30, nesPalette.outline);
    drawPixel(ctx, bankX + 116, bankY + 34, 24, 26, '#181c20');
    drawPixel(ctx, bankX + 122, bankY + 34, 2, 26, '#888888');
    drawPixel(ctx, bankX + 130, bankY + 34, 2, 26, '#888888');

    // Heavy Double Bank Doors
    const bDoorX = bankX + 54;
    const bDoorY = bankY + 48;
    drawPixel(ctx, bDoorX - 2, bDoorY - 2, 42, 64, nesPalette.outline);
    drawPixel(ctx, bDoorX, bDoorY, 38, 62, '#282c34');
    drawPixel(ctx, bDoorX + 17, bDoorY, 4, 62, '#181c20');
    drawPixel(ctx, bDoorX + 12, bDoorY + 28, 3, 6, '#fce0a0');
    drawPixel(ctx, bDoorX + 23, bDoorY + 28, 3, 6, '#fce0a0');

    // --- 4. GENERAL STORE (Right-Center with Canvas Awning) ---
    const storeX = 476;
    const storeW = 155;
    const storeH = 120;
    const storeY = groundY - storeH + 8;

    drawPixel(ctx, storeX, storeY, storeW, storeH, nesPalette.outline);
    drawPixel(ctx, storeX + 2, storeY + 2, storeW - 4, storeH - 4, '#8a5c36');

    for (let row = storeY + 4; row < groundY + 6; row += 6) {
        drawPixel(ctx, storeX + 2, row, storeW - 4, 1, '#5e3e24');
    }

    // "GENERAL STORE" Signboard
    const gsSignX = storeX + 10;
    const gsSignY = storeY + 6;
    const gsSignW = 135;
    const gsSignH = 16;
    drawPixel(ctx, gsSignX - 2, gsSignY - 2, gsSignW + 4, gsSignH + 4, nesPalette.outline);
    drawPixel(ctx, gsSignX, gsSignY, gsSignW, gsSignH, '#201408');
    drawPixel(ctx, gsSignX + 2, gsSignY + 2, gsSignW - 4, gsSignH - 4, '#e4d0a0');

    ctx.fillStyle = '#201408';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText("GENERAL STORE", gsSignX + gsSignW / 2, gsSignY + 12);

    // Striped Red & White Canvas Awning
    const awnY = storeY + 26;
    drawPixel(ctx, storeX - 4, awnY - 2, storeW + 8, 16, nesPalette.outline);
    for (let stripe = storeX - 2; stripe < storeX + storeW + 4; stripe += 12) {
        drawPixel(ctx, stripe, awnY, 6, 12, '#a82c18'); // Red Stripe
        drawPixel(ctx, stripe + 6, awnY, 6, 12, '#fcfcfc'); // White Stripe
    }

    // Display Windows & Porch Crates
    drawPixel(ctx, storeX + 12, storeY + 48, 38, 30, nesPalette.outline);
    drawPixel(ctx, storeX + 14, storeY + 50, 34, 26, '#181014');
    drawPixel(ctx, storeX + 105, storeY + 48, 38, 30, nesPalette.outline);
    drawPixel(ctx, storeX + 107, storeY + 50, 34, 26, '#181014');

    // Store Entrance
    const gsDoorX = storeX + 58;
    const gsDoorY = storeY + 48;
    drawPixel(ctx, gsDoorX - 2, gsDoorY - 2, 38, 56, nesPalette.outline);
    drawPixel(ctx, gsDoorX, gsDoorY, 34, 54, '#442814');

    // Wooden Barrels outside store
    drawPixel(ctx, storeX + 8, groundY - 20, 14, 18, nesPalette.outline);
    drawPixel(ctx, storeX + 10, groundY - 18, 10, 14, '#6c4424');
    drawPixel(ctx, storeX + 8, groundY - 14, 14, 2, '#201008');

    // --- 5. HOTEL (Far Right - 2-Story Clapboard) ---
    const hotelX = width - 176;
    const hotelW = 170;
    const hotelH = 154;
    const hotelY = groundY - hotelH + 10;

    drawPixel(ctx, hotelX, hotelY, hotelW, hotelH, nesPalette.outline);
    drawPixel(ctx, hotelX + 2, hotelY + 2, hotelW - 4, hotelH - 4, '#a87848');

    for (let row = hotelY + 4; row < groundY + 6; row += 6) {
        drawPixel(ctx, hotelX + 2, row, hotelW - 4, 1, '#78502c');
    }

    drawPixel(ctx, hotelX - 4, hotelY - 12, hotelW + 8, 12, nesPalette.outline);
    drawPixel(ctx, hotelX - 2, hotelY - 10, hotelW + 4, 8, '#582410');

    const hSignX = hotelX + 18;
    const hSignY = hotelY + 8;
    const hSignW = 134;
    const hSignH = 20;
    drawPixel(ctx, hSignX - 2, hSignY - 2, hSignW + 4, hSignH + 4, nesPalette.outline);
    drawPixel(ctx, hSignX, hSignY, hSignW, hSignH, '#381808');
    drawPixel(ctx, hSignX + 2, hSignY + 2, hSignW - 4, hSignH - 4, '#e4d0a0');

    ctx.fillStyle = '#201008';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText("HOTEL", hSignX + hSignW / 2, hSignY + 14);

    // Hotel Upper Windows & Balcony
    [hotelX + 12, hotelX + 68, hotelX + 124].forEach((winX) => {
        drawPixel(ctx, winX - 2, hotelY + 36, 30, 26, nesPalette.outline);
        drawPixel(ctx, winX, hotelY + 38, 26, 22, '#181014');
        drawPixel(ctx, winX + 2, hotelY + 40, 5, 18, '#4878a8');
        drawPixel(ctx, winX + 19, hotelY + 40, 5, 18, '#4878a8');
    });

    drawPixel(ctx, hotelX - 4, hotelY + 74, hotelW + 8, 6, nesPalette.outline);
    drawPixel(ctx, hotelX - 2, hotelY + 76, hotelW + 4, 3, '#d89c58');
    for (let post = hotelX; post < hotelX + hotelW; post += 12) {
        drawPixel(ctx, post, hotelY + 66, 2, 8, '#381808');
    }

    drawPixel(ctx, hotelX + 64, hotelY + 88, 42, 50, nesPalette.outline);
    drawPixel(ctx, hotelX + 66, hotelY + 90, 38, 48, '#482010');

    // --- 6. HITCHING POST & HORSE (Front of Sheriff / Bank) ---
    drawPixel(ctx, 240, groundY - 14, 90, 24, nesPalette.outline);
    drawPixel(ctx, 242, groundY - 12, 86, 4, '#88481c');
    drawPixel(ctx, 246, groundY - 8, 6, 18, '#582c0e');
    drawPixel(ctx, 320, groundY - 8, 6, 18, '#582c0e');

    const horseX = 258;
    const horseY = groundY - 38;

    drawPixel(ctx, horseX, horseY, 48, 32, nesPalette.outline);
    drawPixel(ctx, horseX + 2, horseY + 2, 44, 28, '#582810');
    drawPixel(ctx, horseX + 8, horseY + 6, 30, 16, '#703418');

    drawPixel(ctx, horseX + 36, horseY - 14, 14, 26, nesPalette.outline);
    drawPixel(ctx, horseX + 38, horseY - 12, 10, 22, '#582810');
    drawPixel(ctx, horseX + 44, horseY - 18, 12, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 46, horseY - 16, 8, 10, '#441c08');
    drawPixel(ctx, horseX + 48, horseY - 14, 2, 2, '#ffffff');
    drawPixel(ctx, horseX + 40, horseY - 20, 4, 6, '#582810');

    drawPixel(ctx, horseX + 34, horseY - 14, 4, 18, '#180804');
    drawPixel(ctx, horseX - 4, horseY + 4, 6, 24, '#180804');
    drawPixel(ctx, horseX + 44, horseY - 12, 2, 12, '#fce0a0');

    drawPixel(ctx, horseX + 16, horseY - 2, 18, 14, '#2c1408');
    drawPixel(ctx, horseX + 18, horseY + 12, 2, 12, '#fce0a0');
    drawPixel(ctx, horseX + 16, horseY + 24, 6, 2, '#ffffff');

    drawPixel(ctx, horseX + 4, horseY + 30, 6, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 6, horseY + 30, 4, 12, '#441c08');
    drawPixel(ctx, horseX + 4, horseY + 40, 6, 4, '#0c0604');

    drawPixel(ctx, horseX + 34, horseY + 30, 6, 14, nesPalette.outline);
    drawPixel(ctx, horseX + 36, horseY + 30, 4, 12, '#441c08');
    drawPixel(ctx, horseX + 34, horseY + 40, 6, 4, '#0c0604');

    // --- 7. BOARDWALK & ROAD TRACKS ---
    drawPixel(ctx, 0, groundY - 2, width, 6, nesPalette.outline);
    drawPixel(ctx, 0, groundY, width, 3, '#a87848');

    drawPixel(ctx, 0, groundY + 3, width, height - (groundY + 3), '#b87034');
    drawPixel(ctx, 0, groundY + 24, width, 6, '#884c1c');
    drawPixel(ctx, 0, groundY + 54, width, 10, '#6c3810');
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