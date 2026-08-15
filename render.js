// render.js - High-Density 16-Bit Arcade Renderer (Sunset Riders / Wild Guns Style)

const snesPalette = {
    skyTop: '#080c18',
    skyUpper: '#181224',
    skyMid: '#381622',
    skyWarm: '#782618',
    skyHorizon: '#c85c14',
    skyGlow: '#f4a034',
    mesaDark: '#281014',
    mesaLight: '#4a1e18',
    boardwalk: '#b07844',
    boardwalkPlank: '#8c582c',
    boardwalkShadow: '#5c3418',
    streetDirt: '#b87438',
    streetRut: '#7a421c',
    streetDeep: '#50280c',
    outline: '#000000',
};

function drawPixel(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
}

// 16-Bit Timer Bar with Brass Studs and Gradient Fill
function drawTimerMeter(ctx, width, progress) {
    const meterWidth = Math.round(width * 0.56);
    const meterHeight = 14;
    const meterX = Math.round((width - meterWidth) / 2);
    const meterY = 16;
    const fillWidth = Math.round(meterWidth * progress);

    // Carved Walnut Bezel
    drawPixel(ctx, meterX - 5, meterY - 5, meterWidth + 10, meterHeight + 10, snesPalette.outline);
    drawPixel(ctx, meterX - 4, meterY - 4, meterWidth + 8, meterHeight + 8, '#2a1408');
    drawPixel(ctx, meterX - 2, meterY - 2, meterWidth + 4, meterHeight + 4, '#582c12');
    drawPixel(ctx, meterX, meterY, meterWidth, meterHeight, '#100806');

    // Brass Inlay Studs
    drawPixel(ctx, meterX - 3, meterY + 4, 2, 2, '#fce0a0');
    drawPixel(ctx, meterX + meterWidth + 1, meterY + 4, 2, 2, '#fce0a0');

    // Liquid/Energy Fill Meter
    if (fillWidth > 0) {
        drawPixel(ctx, meterX, meterY, fillWidth, 3, '#fff4cc');
        drawPixel(ctx, meterX, meterY + 3, fillWidth, 5, '#e8aa34');
        drawPixel(ctx, meterX, meterY + 8, fillWidth, 4, '#b86c14');
        drawPixel(ctx, meterX, meterY + 12, fillWidth, 2, '#6c3808');
    }
}

// 16-Bit Cowboy Sprite (High density with facial detail, vest seams, denim shading, & holster gear)
function drawHogansCowboy(ctx, x, y, outfit, facingLeft, drawArmUp) {
    const dir = facingLeft ? -1 : 1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const accentColor = outfit.accent;
    const skinBase = '#fcb070';
    const skinShadow = '#c86e38';
    const skinHighlight = '#ffcca0';
    const OL = snesPalette.outline;

    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    // Ground Shadow (Layered contact shadow)
    drawPixel(ctx, -24, 70, 48, 6, 'rgba(0, 0, 0, 0.45)');
    drawPixel(ctx, -18, 71, 36, 4, 'rgba(0, 0, 0, 0.35)');

    // --- HAT (Curved 16-bit Brim with Dual Pinch Crown) ---
    // Brim Outer Outline & Trim
    drawPixel(ctx, -30, -22, 60, 4, OL);
    drawPixel(ctx, -28, -20, 56, 3, hatColor);
    drawPixel(ctx, -26, -19, 52, 1, '#ffeedd'); // Brim edge specular glint
    drawPixel(ctx, -32, -25, 3, 4, OL);        // Curved upward left tip
    drawPixel(ctx, 29, -25, 3, 4, OL);         // Curved upward right tip

    // Crown Body & Side Creases
    drawPixel(ctx, -16, -40, 32, 20, OL);
    drawPixel(ctx, -14, -38, 28, 18, hatColor);
    drawPixel(ctx, -6, -40, 12, 4, OL);        // Crown top valley
    drawPixel(ctx, -4, -38, 8, 3, '#1a1018');  // Deep shadow in crease
    drawPixel(ctx, -14, -34, 4, 12, 'rgba(0, 0, 0, 0.25)'); // Side shadow

    // Patterned Bandana Hatband
    drawPixel(ctx, -14, -24, 28, 4, accentColor);
    drawPixel(ctx, -14, -22, 28, 1, '#ffffff'); // Silk highlight weave
    drawPixel(ctx, -14, -21, 28, 1, OL);

    // --- HEAD, HAIR & FACIAL FEATURES ---
    drawPixel(ctx, -12, -17, 24, 23, OL);
    drawPixel(ctx, -10, -15, 20, 19, skinBase);
    drawPixel(ctx, -10, -3, 20, 5, skinShadow); // Jaw and chin ambient shadow

    // Hair / Sideburns
    drawPixel(ctx, -dir * 11, -15, 4, 12, '#381c0c');

    // Expressive Eyes (Brows, sclera, iris, pupil glint)
    const eyeX = dir * 4;
    drawPixel(ctx, eyeX - 5, -13, 9, 2, OL);            // Forehead brow line
    drawPixel(ctx, eyeX - 5, -10, 8, 4, '#ffffff');      // Eye white
    drawPixel(ctx, eyeX - 3, -10, 5, 4, OL);             // Iris ring
    drawPixel(ctx, eyeX - 2, -10, 2, 2, '#3880d8');      // Blue pupil
    drawPixel(ctx, eyeX - 1, -10, 1, 1, '#ffffff');      // Specular glint

    // Nose & Handlebar Mustache
    drawPixel(ctx, eyeX - 1, -6, 3, 2, skinShadow);     // Nose bridge
    drawPixel(ctx, eyeX - 9, -4, 18, 4, '#381c0c');     // Thick mustache body
    drawPixel(ctx, eyeX - 11, -2, 3, 3, '#381c0c');     // Curled left tip
    drawPixel(ctx, eyeX + 8, -2, 3, 3, '#381c0c');      // Curled right tip

    // Silk Bandana / Scarf
    drawPixel(ctx, -8, 6, 16, 8, accentColor);
    drawPixel(ctx, -4, 9, 8, 8, accentColor);
    drawPixel(ctx, -2, 11, 4, 6, '#ffffff');            // Scarf highlight
    drawPixel(ctx, -8, 6, 16, 1, 'rgba(0, 0, 0, 0.3)');

    // --- VEST & SHIRT (Multi-tone shading) ---
    drawPixel(ctx, -16, 6, 32, 34, OL);
    drawPixel(ctx, -14, 8, 28, 30, bodyColor);

    // Shirt Placket & Buttons
    drawPixel(ctx, -2, 10, 4, 24, '#f8f4ec');
    drawPixel(ctx, -1, 14, 2, 2, '#381c0c');
    drawPixel(ctx, -1, 20, 2, 2, '#381c0c');
    drawPixel(ctx, -1, 26, 2, 2, '#381c0c');

    // Vest Creases & Edge Shading
    drawPixel(ctx, -14, 8, 3, 30, 'rgba(0, 0, 0, 0.25)');
    drawPixel(ctx, 11, 8, 3, 30, 'rgba(0, 0, 0, 0.25)');
    drawPixel(ctx, -10, 28, 6, 4, 'rgba(0, 0, 0, 0.2)'); // Vest pocket left
    drawPixel(ctx, 4, 28, 6, 4, 'rgba(0, 0, 0, 0.2)');  // Vest pocket right

    // Gun Belt, Brass Cartridges, & Buckle
    drawPixel(ctx, -16, 34, 32, 6, '#381808');
    drawPixel(ctx, -16, 34, 32, 1, '#582810');          // Belt highlight
    drawPixel(ctx, -11, 36, 2, 3, '#fce0a0');           // Bullet 1
    drawPixel(ctx, -7, 36, 2, 3, '#fce0a0');            // Bullet 2
    drawPixel(ctx, 5, 36, 2, 3, '#fce0a0');             // Bullet 3
    drawPixel(ctx, 9, 36, 2, 3, '#fce0a0');             // Bullet 4
    drawPixel(ctx, -4, 33, 8, 7, '#fce0a0');            // Buckle outer
    drawPixel(ctx, -2, 35, 4, 3, '#381808');            // Buckle prong

    // --- LEGS & BLUE JEANS ---
    drawPixel(ctx, -14, 40, 12, 28, OL);
    drawPixel(ctx, -12, 42, 8, 24, '#1c345c');          // Denim base
    drawPixel(ctx, -11, 43, 4, 20, '#30548c');          // Denim thigh highlight
    drawPixel(ctx, 2, 40, 12, 28, OL);
    drawPixel(ctx, 4, 42, 8, 24, '#10223e');

    // Leather Boots & Spurs
    drawPixel(ctx, -16, 62, 14, 8, OL);
    drawPixel(ctx, -14, 64, 10, 6, '#381808');
    drawPixel(ctx, -14, 64, 10, 2, '#582810');          // Boot toe shine
    drawPixel(ctx, 2, 62, 14, 8, OL);
    drawPixel(ctx, 4, 64, 10, 6, '#381808');
    drawPixel(ctx, 4, 64, 10, 2, '#582810');

    // Boot Spurs
    drawPixel(ctx, -dir * 17, 64, 4, 4, '#fce0a0');
    drawPixel(ctx, -dir * 19, 65, 2, 2, '#ffffff');

    // --- ARMS & REVOLVER ---
    if (drawArmUp) {
        // Extended Arm
        drawPixel(ctx, dir * 12, 10, 22 * dir, 10, OL);
        drawPixel(ctx, dir * 14, 12, 18 * dir, 6, bodyColor);
        drawPixel(ctx, dir * 14, 12, 18 * dir, 2, '#ffeedd'); // Sleeve highlight
        drawPixel(ctx, dir * 32, 11, 8 * dir, 7, skinBase);

        // Peacemaker Revolver
        drawPixel(ctx, dir * 38, 4, 22 * dir, 9, OL);
        drawPixel(ctx, dir * 40, 6, 18 * dir, 3, '#d0d0d8');  // Barrel steel
        drawPixel(ctx, dir * 40, 5, 16 * dir, 1, '#ffffff');  // Chrome specular line
        drawPixel(ctx, dir * 58, 4, 2 * dir, 2, OL);         // Front iron sight
        drawPixel(ctx, dir * 38, 7, 7 * dir, 5, '#5c5c68');  // Revolver cylinder
        drawPixel(ctx, dir * 33, 10, 7 * dir, 8, '#582410'); // Walnut grip
        drawPixel(ctx, dir * 34, 3, 2 * dir, 4, OL);         // Cocked hammer
    } else {
        // Holstered Arm
        drawPixel(ctx, dir * 12, 12, 10 * dir, 22, OL);
        drawPixel(ctx, dir * 14, 14, 6 * dir, 18, bodyColor);
        drawPixel(ctx, dir * 13, 30, 8 * dir, 8, skinBase);  // Hand on holster
        drawPixel(ctx, dir * 17, 36, 7 * dir, 12, '#281008'); // Leather holster
        drawPixel(ctx, dir * 18, 38, 5 * dir, 2, '#fce0a0'); // Holster brass stud
    }

    ctx.restore();
}

// 16-Bit Fallen Cowboy Sprite
function drawHogansFallenCowboy(ctx, x, y, outfit, facingLeft, progress) {
    const dir = facingLeft ? -1 : 1;
    const fallDir = facingLeft ? 1 : -1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const skinColor = '#fcb070';
    const gunColor = '#e0e0e8';
    const OL = snesPalette.outline;

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
    drawPixel(ctx, bodyX - 26, y + 68, 52, 6, 'rgba(0, 0, 0, 0.45)');

    // Flying Hat Arc
    const hatX = x + fall * 36 * fallDir;
    const hatY = y - 20 - Math.sin(fall * Math.PI) * 24 + fall * 86;
    drawPixel(ctx, hatX - 14, hatY, 28, 8, OL);
    drawPixel(ctx, hatX - 12, hatY + 2, 24, 4, hatColor);
    drawPixel(ctx, hatX - 10, hatY + 1, 20, 1, '#ffffff');

    // Dropped Revolver
    const gunX = x + fall * 30 * fallDir;
    const gunY = y + 36 + fall * 32;
    drawPixel(ctx, gunX, gunY, 14 * dir, 6, OL);
    drawPixel(ctx, gunX + 2 * dir, gunY + 2, 10 * dir, 2, gunColor);

    ctx.translate(Math.floor(bodyX), Math.floor(bodyY));

    if (fall < 0.3) {
        drawPixel(ctx, -16, 8, 32, 32, OL);
        drawPixel(ctx, -14, 10, 28, 28, bodyColor);
        drawPixel(ctx, -12, -14, 24, 22, OL);
        drawPixel(ctx, -10, -12, 20, 18, skinColor);
    } else if (fall < 0.7) {
        drawPixel(ctx, -20, 16, 40, 28, OL);
        drawPixel(ctx, -18, 18, 36, 24, bodyColor);
        drawPixel(ctx, -14, 6, 20, 20, OL);
        drawPixel(ctx, -12, 8, 16, 16, skinColor);
    } else {
        const headX = fallDir * 18;
        // Boots & Legs on side
        drawPixel(ctx, -headX - 8, 42, 16, 10, OL);
        drawPixel(ctx, -headX - 6, 44, 12, 6, '#381808');
        drawPixel(ctx, -headX + 2, 38, 22, 12, OL);
        drawPixel(ctx, -headX + 4, 40, 18, 8, '#1c345c');

        // Torso on side
        drawPixel(ctx, -16, 26, 32, 20, OL);
        drawPixel(ctx, -14, 28, 28, 16, bodyColor);
        drawPixel(ctx, -14, 28, 28, 2, 'rgba(0,0,0,0.25)');

        // Head on dirt
        drawPixel(ctx, headX - 10, 20, 18, 18, OL);
        drawPixel(ctx, headX - 8, 22, 14, 14, skinColor);
        drawPixel(ctx, headX - 6, 28, 10, 4, '#381c0c');
    }

    ctx.restore();
}

// 16-Bit Town Scenery (Detailed brickwork, clapboards, signs, awnings, horse, & boardwalk)
function renderHogansBackground(ctx, width, height, tension, progress) {
    const skySplit = Math.floor(height * 0.52);

    // Multi-Tone 16-Bit Sunset Sky Gradient
    drawPixel(ctx, 0, 0, width, skySplit * 0.25, snesPalette.skyTop);
    drawPixel(ctx, 0, skySplit * 0.25, width, skySplit * 0.20, snesPalette.skyUpper);
    drawPixel(ctx, 0, skySplit * 0.45, width, skySplit * 0.18, snesPalette.skyMid);
    drawPixel(ctx, 0, skySplit * 0.63, width, skySplit * 0.17, snesPalette.skyWarm);
    drawPixel(ctx, 0, skySplit * 0.80, width, skySplit * 0.12, snesPalette.skyHorizon);
    drawPixel(ctx, 0, skySplit * 0.92, width, skySplit * 0.08, snesPalette.skyGlow);

    // Distant Desert Mesas
    const mesaY = skySplit - 68;
    drawPixel(ctx, 20, mesaY + 16, 120, 48, snesPalette.mesaDark);
    drawPixel(ctx, 35, mesaY + 6, 90, 14, snesPalette.mesaLight);
    drawPixel(ctx, width - 210, mesaY + 22, 150, 42, snesPalette.mesaDark);
    drawPixel(ctx, width - 180, mesaY + 8, 90, 16, snesPalette.mesaLight);

    const groundY = skySplit - 6;

    // --- 1. SALOON (Far Left - 2-Story Brick) ---
    const saloonX = 4;
    const saloonW = 160;
    const saloonH = 146;
    const saloonY = groundY - saloonH + 10;

    drawPixel(ctx, saloonX, saloonY, saloonW, saloonH, snesPalette.outline);
    drawPixel(ctx, saloonX + 2, saloonY + 2, saloonW - 4, saloonH - 4, '#7c2814');

    // 16-Bit Brick Courses
    for (let row = saloonY + 4; row < groundY + 6; row += 6) {
        drawPixel(ctx, saloonX + 4, row, saloonW - 8, 1, '#4e1408');
        drawPixel(ctx, saloonX + 4, row + 1, saloonW - 8, 1, '#943820');
    }

    // Parapet Cornice
    drawPixel(ctx, saloonX + 10, saloonY - 14, saloonW - 20, 14, snesPalette.outline);
    drawPixel(ctx, saloonX + 12, saloonY - 12, saloonW - 24, 10, '#44140a');
    drawPixel(ctx, saloonX + 12, saloonY - 12, saloonW - 24, 2, '#943820');

    // Signboard
    const sSignX = saloonX + 15;
    const sSignY = saloonY + 8;
    const sSignW = 130;
    const sSignH = 20;
    drawPixel(ctx, sSignX - 2, sSignY - 2, sSignW + 4, sSignH + 4, snesPalette.outline);
    drawPixel(ctx, sSignX, sSignY, sSignW, sSignH, '#2a1408');
    drawPixel(ctx, sSignX + 2, sSignY + 2, sSignW - 4, sSignH - 4, '#d89c58');
    drawPixel(ctx, sSignX + 4, sSignY + 4, sSignW - 8, sSignH - 8, '#3a1a0c');

    ctx.fillStyle = '#fce0a0';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("SALOON", sSignX + sSignW / 2, sSignY + 14);

    // Windows & Curtains
    [saloonX + 14, saloonX + 112].forEach((winX) => {
        drawPixel(ctx, winX - 2, saloonY + 36, 32, 26, snesPalette.outline);
        drawPixel(ctx, winX, saloonY + 38, 28, 22, '#100c14');
        drawPixel(ctx, winX + 2, saloonY + 40, 6, 18, '#a82c18');
        drawPixel(ctx, winX + 20, saloonY + 40, 6, 18, '#a82c18');
        drawPixel(ctx, winX + 13, saloonY + 38, 2, 22, '#4e1408');
    });

    // Porch & Batwing Doors
    drawPixel(ctx, saloonX - 2, saloonY + 76, saloonW + 4, 8, snesPalette.outline);
    drawPixel(ctx, saloonX, saloonY + 78, saloonW, 4, '#582410');
    drawPixel(ctx, saloonX + 6, saloonY + 84, 6, 52, snesPalette.outline);
    drawPixel(ctx, saloonX + 148, saloonY + 84, 6, 52, snesPalette.outline);

    const sDoorX = saloonX + 60;
    const sDoorY = saloonY + 86;
    drawPixel(ctx, sDoorX - 4, sDoorY - 4, 40, 48, snesPalette.outline);
    drawPixel(ctx, sDoorX, sDoorY + 6, 15, 28, '#884414');
    drawPixel(ctx, sDoorX + 17, sDoorY + 6, 15, 28, '#884414');

    // --- 2. SHERIFF'S OFFICE & JAIL (Left-Center - Dark Timber) ---
    const sheriffX = 170;
    const sheriffW = 145;
    const sheriffH = 110;
    const sheriffY = groundY - sheriffH + 8;

    drawPixel(ctx, sheriffX, sheriffY, sheriffW, sheriffH, snesPalette.outline);
    drawPixel(ctx, sheriffX + 2, sheriffY + 2, sheriffW - 4, sheriffH - 4, '#5c3822');

    for (let row = sheriffY + 4; row < groundY + 6; row += 6) {
        drawPixel(ctx, sheriffX + 2, row, sheriffW - 4, 1, '#3a2012');
        drawPixel(ctx, sheriffX + 2, row + 1, sheriffW - 4, 1, '#78482c');
    }

    drawPixel(ctx, sheriffX - 2, sheriffY - 8, sheriffW + 4, 8, snesPalette.outline);
    drawPixel(ctx, sheriffX, sheriffY - 6, sheriffW, 6, '#3a2012');

    const shSignX = sheriffX + 10;
    const shSignY = sheriffY + 6;
    const shSignW = 125;
    const shSignH = 16;
    drawPixel(ctx, shSignX - 2, shSignY - 2, shSignW + 4, shSignH + 4, snesPalette.outline);
    drawPixel(ctx, shSignX, shSignY, shSignW, shSignH, '#201408');
    drawPixel(ctx, shSignX + 2, shSignY + 2, shSignW - 4, shSignH - 4, '#a87848');

    // Gold Star Badge
    const starX = shSignX + 10;
    const starY = shSignY + 8;
    drawPixel(ctx, starX - 3, starY - 3, 6, 6, '#fce0a0');

    ctx.fillStyle = '#000000';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText("SHERIFF", shSignX + 68, shSignY + 12);

    // Barred Jail Cell Window
    const jailWinX = sheriffX + 12;
    const jailWinY = sheriffY + 30;
    drawPixel(ctx, jailWinX - 2, jailWinY - 2, 30, 26, snesPalette.outline);
    drawPixel(ctx, jailWinX, jailWinY, 26, 22, '#181014');
    drawPixel(ctx, jailWinX + 6, jailWinY + 8, 3, 3, '#fcb070');
    drawPixel(ctx, jailWinX + 16, jailWinY + 8, 3, 3, '#fcb070');
    drawPixel(ctx, jailWinX + 6, jailWinY, 2, 22, '#888888');
    drawPixel(ctx, jailWinX + 14, jailWinY, 2, 22, '#888888');
    drawPixel(ctx, jailWinX + 22, jailWinY, 2, 22, '#888888');

    // Office Window & Sturdy Door
    const offWinX = sheriffX + 102;
    const offWinY = sheriffY + 30;
    drawPixel(ctx, offWinX - 2, offWinY - 2, 30, 26, snesPalette.outline);
    drawPixel(ctx, offWinX, offWinY, 26, 22, '#181014');
    drawPixel(ctx, offWinX + 2, offWinY + 2, 5, 18, '#4878a8');
    drawPixel(ctx, offWinX + 19, offWinY + 2, 5, 18, '#4878a8');

    const shDoorX = sheriffX + 54;
    const shDoorY = sheriffY + 40;
    drawPixel(ctx, shDoorX - 2, shDoorY - 2, 34, 58, snesPalette.outline);
    drawPixel(ctx, shDoorX, shDoorY, 30, 56, '#3a1e0c');
    drawPixel(ctx, shDoorX + 22, shDoorY + 26, 4, 4, '#fce0a0');

    // --- 3. THE BANK (Center - Stone Masonry) ---
    const bankX = 320;
    const bankW = 150;
    const bankH = 135;
    const bankY = groundY - bankH + 8;

    drawPixel(ctx, bankX, bankY, bankW, bankH, snesPalette.outline);
    drawPixel(ctx, bankX + 2, bankY + 2, bankW - 4, bankH - 4, '#7c8088');

    // Ashlar Stone Blocks
    for (let r = bankY + 6; r < groundY + 6; r += 10) {
        drawPixel(ctx, bankX + 2, r, bankW - 4, 1, '#4e525a');
        drawPixel(ctx, bankX + 2, r + 1, bankW - 4, 1, '#9ea2aa');
    }
    for (let c = bankX + 18; c < bankX + bankW; c += 28) {
        drawPixel(ctx, c, bankY + 2, 1, bankH - 4, '#4e525a');
    }

    drawPixel(ctx, bankX - 4, bankY - 14, bankW + 8, 14, snesPalette.outline);
    drawPixel(ctx, bankX - 2, bankY - 12, bankW + 4, 10, '#585c64');

    const bSignX = bankX + 20;
    const bSignY = bankY + 8;
    const bSignW = 110;
    const bSignH = 18;
    drawPixel(ctx, bSignX - 2, bSignY - 2, bSignW + 4, bSignH + 4, snesPalette.outline);
    drawPixel(ctx, bSignX, bSignY, bSignW, bSignH, '#1c2024');
    drawPixel(ctx, bSignX + 2, bSignY + 2, bSignW - 4, bSignH - 4, '#fce0a0');

    ctx.fillStyle = '#1c2024';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText("BANK", bSignX + bSignW / 2, bSignY + 13);

    // Bank Barred Windows & Iron Doors
    drawPixel(ctx, bankX + 8, bankY + 32, 28, 30, snesPalette.outline);
    drawPixel(ctx, bankX + 10, bankY + 34, 24, 26, '#181c20');
    drawPixel(ctx, bankX + 16, bankY + 34, 2, 26, '#888888');
    drawPixel(ctx, bankX + 24, bankY + 34, 2, 26, '#888888');

    drawPixel(ctx, bankX + 114, bankY + 32, 28, 30, snesPalette.outline);
    drawPixel(ctx, bankX + 116, bankY + 34, 24, 26, '#181c20');
    drawPixel(ctx, bankX + 122, bankY + 34, 2, 26, '#888888');
    drawPixel(ctx, bankX + 130, bankY + 34, 2, 26, '#888888');

    const bDoorX = bankX + 54;
    const bDoorY = bankY + 48;
    drawPixel(ctx, bDoorX - 2, bDoorY - 2, 42, 64, snesPalette.outline);
    drawPixel(ctx, bDoorX, bDoorY, 38, 62, '#282c34');
    drawPixel(ctx, bDoorX + 17, bDoorY, 4, 62, '#181c20');
    drawPixel(ctx, bDoorX + 12, bDoorY + 28, 3, 6, '#fce0a0');
    drawPixel(ctx, bDoorX + 23, bDoorY + 28, 3, 6, '#fce0a0');

    // --- 4. GENERAL STORE (Right-Center - Striped Awning & Crates) ---
    const storeX = 476;
    const storeW = 155;
    const storeH = 120;
    const storeY = groundY - storeH + 8;

    drawPixel(ctx, storeX, storeY, storeW, storeH, snesPalette.outline);
    drawPixel(ctx, storeX + 2, storeY + 2, storeW - 4, storeH - 4, '#8a5c36');

    for (let row = storeY + 4; row < groundY + 6; row += 5) {
        drawPixel(ctx, storeX + 2, row, storeW - 4, 1, '#5e3e24');
    }

    const gsSignX = storeX + 10;
    const gsSignY = storeY + 6;
    const gsSignW = 135;
    const gsSignH = 16;
    drawPixel(ctx, gsSignX - 2, gsSignY - 2, gsSignW + 4, gsSignH + 4, snesPalette.outline);
    drawPixel(ctx, gsSignX, gsSignY, gsSignW, gsSignH, '#201408');
    drawPixel(ctx, gsSignX + 2, gsSignY + 2, gsSignW - 4, shSignH - 4, '#e4d0a0');

    ctx.fillStyle = '#201408';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText("GENERAL STORE", gsSignX + gsSignW / 2, gsSignY + 12);

    // Striped Awning
    const awnY = storeY + 26;
    drawPixel(ctx, storeX - 4, awnY - 2, storeW + 8, 16, snesPalette.outline);
    for (let stripe = storeX - 2; stripe < storeX + storeW + 4; stripe += 12) {
        drawPixel(ctx, stripe, awnY, 6, 12, '#a82c18');
        drawPixel(ctx, stripe, awnY, 6, 2, '#d8442c');
        drawPixel(ctx, stripe + 6, awnY, 6, 12, '#fcfcfc');
        drawPixel(ctx, stripe + 6, awnY, 6, 2, '#ffffff');
    }

    // Windows, Store Door, and Wooden Barrels
    drawPixel(ctx, storeX + 12, storeY + 48, 38, 30, snesPalette.outline);
    drawPixel(ctx, storeX + 14, storeY + 50, 34, 26, '#181014');
    drawPixel(ctx, storeX + 105, storeY + 48, 38, 30, snesPalette.outline);
    drawPixel(ctx, storeX + 107, storeY + 50, 34, 26, '#181014');

    const gsDoorX = storeX + 58;
    const gsDoorY = storeY + 48;
    drawPixel(ctx, gsDoorX - 2, gsDoorY - 2, 38, 56, snesPalette.outline);
    drawPixel(ctx, gsDoorX, gsDoorY, 34, 54, '#442814');

    drawPixel(ctx, storeX + 8, groundY - 20, 14, 18, snesPalette.outline);
    drawPixel(ctx, storeX + 10, groundY - 18, 10, 14, '#6c4424');
    drawPixel(ctx, storeX + 8, groundY - 14, 14, 2, '#201008');

    // --- 5. HOTEL (Far Right - 2-Story Clapboard) ---
    const hotelX = width - 176;
    const hotelW = 170;
    const hotelH = 154;
    const hotelY = groundY - hotelH + 10;

    drawPixel(ctx, hotelX, hotelY, hotelW, hotelH, snesPalette.outline);
    drawPixel(ctx, hotelX + 2, hotelY + 2, hotelW - 4, hotelH - 4, '#a87848');

    for (let row = hotelY + 4; row < groundY + 6; row += 5) {
        drawPixel(ctx, hotelX + 2, row, hotelW - 4, 1, '#78502c');
        drawPixel(ctx, hotelX + 2, row + 1, hotelW - 4, 1, '#c49058');
    }

    drawPixel(ctx, hotelX - 4, hotelY - 12, hotelW + 8, 12, snesPalette.outline);
    drawPixel(ctx, hotelX - 2, hotelY - 10, hotelW + 4, 8, '#582410');

    const hSignX = hotelX + 18;
    const hSignY = hotelY + 8;
    const hSignW = 134;
    const hSignH = 20;
    drawPixel(ctx, hSignX - 2, hSignY - 2, hSignW + 4, hSignH + 4, snesPalette.outline);
    drawPixel(ctx, hSignX, hSignY, hSignW, hSignH, '#381808');
    drawPixel(ctx, hSignX + 2, hSignY + 2, hSignW - 4, hSignH - 4, '#e4d0a0');

    ctx.fillStyle = '#201008';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText("HOTEL", hSignX + hSignW / 2, hSignY + 14);

    // Balcony Railing & Entrance
    [hotelX + 12, hotelX + 68, hotelX + 124].forEach((winX) => {
        drawPixel(ctx, winX - 2, hotelY + 36, 30, 26, snesPalette.outline);
        drawPixel(ctx, winX, hotelY + 38, 26, 22, '#181014');
        drawPixel(ctx, winX + 2, hotelY + 40, 5, 18, '#4878a8');
        drawPixel(ctx, winX + 19, hotelY + 40, 5, 18, '#4878a8');
    });

    drawPixel(ctx, hotelX - 4, hotelY + 74, hotelW + 8, 6, snesPalette.outline);
    drawPixel(ctx, hotelX - 2, hotelY + 76, hotelW + 4, 3, '#d89c58');
    for (let post = hotelX; post < hotelX + hotelW; post += 10) {
        drawPixel(ctx, post, hotelY + 66, 2, 8, '#381808');
    }

    drawPixel(ctx, hotelX + 64, hotelY + 88, 42, 50, snesPalette.outline);
    drawPixel(ctx, hotelX + 66, hotelY + 90, 38, 48, '#482010');

    // --- 6. HITCHING POST & 16-BIT HORSE (Front of Bank / Sheriff) ---
    drawPixel(ctx, 240, groundY - 14, 90, 24, snesPalette.outline);
    drawPixel(ctx, 242, groundY - 12, 86, 4, '#88481c');
    drawPixel(ctx, 246, groundY - 8, 6, 18, '#582c0e');
    drawPixel(ctx, 320, groundY - 8, 6, 18, '#582c0e');

    // 16-Bit Horse Sprite
    const horseX = 258;
    const horseY = groundY - 38;

    drawPixel(ctx, horseX, horseY, 48, 32, snesPalette.outline);
    drawPixel(ctx, horseX + 2, horseY + 2, 44, 28, '#582810');
    drawPixel(ctx, horseX + 6, horseY + 4, 32, 14, '#7a381c'); // Muscle highlight

    drawPixel(ctx, horseX + 36, horseY - 14, 14, 26, snesPalette.outline);
    drawPixel(ctx, horseX + 38, horseY - 12, 10, 22, '#582810');
    drawPixel(ctx, horseX + 44, horseY - 18, 12, 14, snesPalette.outline);
    drawPixel(ctx, horseX + 46, horseY - 16, 8, 10, '#441c08');
    drawPixel(ctx, horseX + 48, horseY - 14, 2, 2, '#ffffff'); // Eye glint
    drawPixel(ctx, horseX + 40, horseY - 20, 4, 6, '#582810');

    drawPixel(ctx, horseX + 34, horseY - 14, 4, 18, '#180804'); // Dark mane
    drawPixel(ctx, horseX - 4, horseY + 4, 6, 24, '#180804');   // Tail
    drawPixel(ctx, horseX + 44, horseY - 12, 2, 12, '#fce0a0'); // Bridle

    drawPixel(ctx, horseX + 16, horseY - 2, 18, 14, '#2c1408'); // Saddle
    drawPixel(ctx, horseX + 18, horseY + 12, 2, 12, '#fce0a0'); // Stirrup strap
    drawPixel(ctx, horseX + 16, horseY + 24, 6, 2, '#ffffff');  // Steel stirrup

    drawPixel(ctx, horseX + 4, horseY + 30, 6, 14, snesPalette.outline);
    drawPixel(ctx, horseX + 6, horseY + 30, 4, 12, '#441c08');
    drawPixel(ctx, horseX + 4, horseY + 40, 6, 4, '#0c0604'); // Hoof

    drawPixel(ctx, horseX + 34, horseY + 30, 6, 14, snesPalette.outline);
    drawPixel(ctx, horseX + 36, horseY + 30, 4, 12, '#441c08');
    drawPixel(ctx, horseX + 34, horseY + 40, 6, 4, '#0c0604');

    // --- 7. BOARDWALK & STREET RUTS ---
    drawPixel(ctx, 0, groundY - 2, width, 6, snesPalette.outline);
    drawPixel(ctx, 0, groundY, width, 3, snesPalette.boardwalk);
    drawPixel(ctx, 0, groundY + 1, width, 1, snesPalette.boardwalkPlank);

    drawPixel(ctx, 0, groundY + 3, width, height - (groundY + 3), snesPalette.streetDirt);
    drawPixel(ctx, 0, groundY + 24, width, 6, snesPalette.streetRut);
    drawPixel(ctx, 0, groundY + 54, width, 10, snesPalette.streetDeep);
}

// 16-Bit Wanted Poster (Parchment frame & mugshot)
function drawWantedPoster(ctx, width, height, outlaw) {
    const cardW = 320;
    const cardH = 340;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, width, height);

    drawPixel(ctx, cardX - 6, cardY - 6, cardW + 12, cardH + 12, snesPalette.outline);
    drawPixel(ctx, cardX, cardY, cardW, cardH, '#e4a058');
    drawPixel(ctx, cardX + 8, cardY + 8, cardW - 16, cardH - 16, '#c4784c');

    ctx.fillStyle = '#000000';
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("WANTED", width / 2, cardY + 50);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText("DEAD OR ALIVE", width / 2, cardY + 75);

    const mugX = width / 2;
    const mugY = cardY + 160;
    drawPixel(ctx, mugX - 45, mugY - 55, 90, 90, snesPalette.outline);
    drawPixel(ctx, mugX - 40, mugY - 50, 80, 80, '#884400');

    drawHogansCowboy(ctx, mugX, mugY - 10, outlaw.outfit, true, false);

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

            // Player Render
            if (state.playerDeathProgress > 0) {
                drawHogansFallenCowboy(context, playerX, cowboyY, state.playerOutfit, false, state.playerDeathProgress);
            } else {
                drawHogansCowboy(context, playerX, cowboyY, state.playerOutfit, false, state.playerHasDrawn);
            }

            // Opponent Render
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

            context.restore();
        },
    };
}