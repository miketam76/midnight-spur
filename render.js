// render.js - Authentic 8-Bit Arcade Renderer

// Classic NES-inspired color palette
const palette = {
    skyTop: '#3c5c88',
    skyMid: '#845c40',
    skyBottom: '#c4784c',
    mesaDark: '#502814',
    mesaLight: '#783818',
    ground: '#a05828',
    groundDark: '#683018',
    trail: '#d89c58',
    outline: '#0f0b10', // Dark sprite outline
};

function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
}

// Draw authentic 8-bit detailed pixel-art Cowboy
function draw8BitCowboy(ctx, x, y, outfit, facingLeft, drawArmUp) {
    const dir = facingLeft ? -1 : 1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const accentColor = outfit.accent;
    const skinColor = '#fcb070';
    const skinShadow = '#c47038';
    const gunColor = '#e0e0e0';
    const OL = palette.outline;

    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    // Ground Shadow
    drawRect(ctx, -18, 72, 36, 6, 'rgba(15, 11, 16, 0.4)');

    // --- HAT ---
    drawRect(ctx, -22, -18, 44, 4, OL); // Hat Brim Outline
    drawRect(ctx, -20, -16, 40, 4, hatColor);
    drawRect(ctx, -14, -30, 28, 14, OL); // Crown Outline
    drawRect(ctx, -12, -28, 24, 12, hatColor);
    drawRect(ctx, -12, -20, 24, 4, accentColor); // Hatband

    // --- HEAD / FACE ---
    drawRect(ctx, -10, -14, 20, 20, OL);
    drawRect(ctx, -8, -12, 16, 16, skinColor);

    // Eyes & Mustache (Facial detail)
    const eyeX = dir * 2;
    drawRect(ctx, eyeX - 2, -8, 4, 4, OL); // Eyes
    drawRect(ctx, eyeX - 6, -2, 12, 4, '#502814'); // Mustache

    // Bandana / Neckwear
    drawRect(ctx, -8, 6, 16, 6, accentColor);
    drawRect(ctx, -10, 8, 20, 2, OL);

    // --- TORSO & PONCHO / VEST ---
    drawRect(ctx, -14, 12, 28, 30, OL);
    drawRect(ctx, -12, 14, 24, 26, bodyColor);

    // Vest detail / Buttons
    drawRect(ctx, -2, 16, 4, 22, '#201828');
    drawRect(ctx, dir * 4, 18, 2, 2, '#fcb070'); // Brass button
    drawRect(ctx, dir * 4, 26, 2, 2, '#fcb070');

    // Gun Belt & Holster
    drawRect(ctx, -14, 38, 28, 6, '#502814'); // Belt
    drawRect(ctx, -2, 38, 6, 6, '#e0e0e0'); // Buckle
    drawRect(ctx, dir * 10 - 4, 42, 8, 12, '#381808'); // Holster

    // --- LEGS & BOOTS ---
    drawRect(ctx, -12, 44, 10, 24, OL); // Left Leg OL
    drawRect(ctx, -10, 44, 6, 22, '#283858'); // Jeans
    drawRect(ctx, 2, 44, 10, 24, OL);  // Right Leg OL
    drawRect(ctx, 4, 44, 6, 22, '#182840');

    // Cowboy Boots
    drawRect(ctx, -12, 64, 10, 8, '#381808');
    drawRect(ctx, 2, 64, 10, 8, '#281000');

    // --- ARM & GUN ANIMATION ---
    if (drawArmUp) {
        // Arm Extended (Shooting Pose)
        drawRect(ctx, dir * 10, 10, 18 * dir, 10, OL);
        drawRect(ctx, dir * 12, 12, 14 * dir, 6, bodyColor);
        drawRect(ctx, dir * 26, 12, 8 * dir, 6, skinColor); // Hand

        // Revolver Pistol Sprite
        drawRect(ctx, dir * 32, 4, 16 * dir, 6, OL);
        drawRect(ctx, dir * 34, 6, 12 * dir, 4, gunColor); // Barrel
        drawRect(ctx, dir * 28, 10, 6 * dir, 8, '#502814'); // Handle
    } else {
        // Arm Idle at Holster
        drawRect(ctx, dir * 10, 16, 8 * dir, 18, OL);
        drawRect(ctx, dir * 11, 18, 6 * dir, 14, bodyColor);
        drawRect(ctx, dir * 10, 32, 6 * dir, 6, skinColor);
    }

    ctx.restore();
}

// 8-Bit Defeated Cowboy Pose
function draw8BitFallenCowboy(ctx, x, y, outfit, facingLeft, progress) {
    const dir = facingLeft ? -1 : 1;
    const collapse = Math.min(1, Math.max(0, progress));
    const fallY = y + collapse * 20;

    ctx.save();
    ctx.translate(Math.floor(x + collapse * 20 * dir), Math.floor(fallY));

    // Ground Shadow
    drawRect(ctx, -26, 40, 52, 6, 'rgba(15, 11, 16, 0.5)');

    // Fallen Body (Horizontal 8-bit layout)
    drawRect(ctx, -28, 20, 56, 18, palette.outline);
    drawRect(ctx, -26, 22, 52, 14, outfit.body);

    // Dropped Hat on Ground
    drawRect(ctx, -dir * 32, 26, 20, 10, palette.outline);
    drawRect(ctx, -dir * 30, 28, 16, 6, outfit.hat);

    // Dropped Gun
    drawRect(ctx, dir * 28, 30, 12 * dir, 4, '#e0e0e0');

    ctx.restore();
}

function drawTimerMeter(ctx, width, progress) {
    const meterWidth = Math.round(width * 0.58);
    const meterHeight = 16;
    const meterX = Math.round((width - meterWidth) / 2);
    const meterY = 18;
    const fillWidth = Math.round(meterWidth * progress);

    // 8-Bit Outer Wooden Frame
    drawRect(ctx, meterX - 6, meterY - 6, meterWidth + 12, meterHeight + 12, palette.outline);
    drawRect(ctx, meterX - 4, meterY - 4, meterWidth + 8, meterHeight + 8, '#502814');

    // Meter Inner Groove
    drawRect(ctx, meterX, meterY, meterWidth, meterHeight, '#180f08');

    // Active Countdown Bar Fill
    if (fillWidth > 0) {
        drawRect(ctx, meterX, meterY, fillWidth, meterHeight, '#d89c58');
        drawRect(ctx, meterX, meterY, fillWidth, 4, '#fce0a0'); // Highlight top edge
    }
}

export function createRenderer(canvas) {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Crisp pixelated rendering setting
    context.imageSmoothingEnabled = false;

    function renderBackground(tension, progress) {
        const skySplit = Math.floor(height * 0.52);

        // Banded 8-Bit Sunset Sky (No smooth gradients)
        drawRect(context, 0, 0, width, skySplit * 0.35, palette.skyTop);
        drawRect(context, 0, skySplit * 0.35, width, skySplit * 0.35, palette.skyMid);
        drawRect(context, 0, skySplit * 0.70, width, skySplit * 0.30, palette.skyBottom);

        // 8-Bit Distant Mountain Mesas
        const mesaY = skySplit - 48;
        drawRect(context, 40, mesaY + 12, 120, 36, palette.mesaDark);
        drawRect(context, 60, mesaY, 80, 12, palette.mesaDark);
        drawRect(context, 480, mesaY + 18, 180, 30, palette.mesaDark);
        drawRect(context, 510, mesaY + 6, 120, 12, palette.mesaDark);

        // Saloon & Fence Pixel Silhouettes
        drawRect(context, 260, skySplit - 32, 90, 32, '#201008'); // Building
        drawRect(context, 280, skySplit - 44, 50, 12, '#201008'); // Signboard
        drawRect(context, 0, skySplit - 12, width, 12, '#381808');  // Fence line

        // Ground Dirt Terrain
        drawRect(context, 0, skySplit, width, height - skySplit, palette.ground);
        drawRect(context, 0, skySplit + 40, width, 12, palette.groundDark);

        // Animated Rolling Tumbleweed (8-bit detail)
        const tumbleX = (progress * 800) % (width + 60) - 30;
        const tumbleY = skySplit + 60;
        drawRect(context, tumbleX, tumbleY, 12, 12, '#805020');
        drawRect(context, tumbleX + 2, tumbleY + 2, 8, 8, '#d89c58');
    }

    return {
        render(state) {
            const shake = state.screenShake || 0;
            const shakeX = shake > 0 ? (Math.random() - 0.5) * shake * 6 : 0;
            const shakeY = shake > 0 ? (Math.random() - 0.5) * shake * 4 : 0;

            context.save();
            context.translate(Math.floor(shakeX), Math.floor(shakeY));

            // Render Scenery
            renderBackground(state.tension, state.progress);

            // RENDER THE COUNTDOWN BAR HERE
            drawTimerMeter(context, width, state.countdownProgress);

            const playerX = width * 0.26;
            const opponentX = width * 0.74;
            const cowboyY = height * 0.42;

            // Draw Player & Opponent
            if (state.playerDeathProgress > 0) {
                draw8BitFallenCowboy(context, playerX, cowboyY, state.playerOutfit, false, state.playerDeathProgress);
            } else {
                draw8BitCowboy(context, playerX, cowboyY, state.playerOutfit, false, state.playerReady || state.playerHasDrawn);
            }

            if (state.opponentDeathProgress > 0) {
                draw8BitFallenCowboy(context, opponentX, cowboyY, state.opponentOutfit, true, state.opponentDeathProgress);
            } else {
                draw8BitCowboy(context, opponentX, cowboyY, state.opponentOutfit, true, state.opponentHasDrawn || state.opponentReady);
            }

            // Draw Phase Text ("DRAW!", "PAUSED", etc.)
            context.fillStyle = '#f1e8cf';
            context.font = '28px "Press Start 2P", monospace';
            context.textAlign = 'center';
            context.fillText(state.phaseLabel, width / 2, height - 44);

            // Screen Flash on Shot
            if (state.flash) {
                context.fillStyle = `rgba(255, 255, 255, ${state.flash})`;
                context.fillRect(0, 0, width, height);
            }

            context.restore();
        },
    };
}
