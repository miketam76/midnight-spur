const palette = {
    skyTop: '#6b7ea8',
    skyMid: '#31456a',
    skyBottom: '#11182b',
    ground: '#57432f',
    groundDark: '#2d241b',
    trail: '#d7a65f',
    shadow: 'rgba(0, 0, 0, 0.4)',
};

function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function drawShadow(ctx, x, y, width, height, alpha = 0.4) {
    drawRect(ctx, x, y, width, height, `rgba(0, 0, 0, ${alpha})`);
}

function drawDustPuff(ctx, x, y, scale, alpha) {
    const size = Math.max(2, Math.round(scale));
    const puffColor = `rgba(231, 195, 125, ${alpha})`;
    drawRect(ctx, x - size * 2, y, size * 2, size, puffColor);
    drawRect(ctx, x - size, y - size, size * 2, size, puffColor);
    drawRect(ctx, x + size, y + 1, size * 2, size, puffColor);
    drawRect(ctx, x - size * 3, y + 1, size, size, puffColor);
}

function drawStandingCowboy(ctx, x, y, outfit, facingLeft, drawArmUp) {
    const dir = facingLeft ? -1 : 1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const accentColor = outfit.accent;
    const skinColor = '#d29a67';
    const gunColor = '#161826';
    const shadowOffset = facingLeft ? 2 : -2;

    drawShadow(ctx, x - 28, y + 78, 56, 9);
    drawRect(ctx, x - 16, y + 54, 32, 6, '#241b17');
    drawRect(ctx, x - 12, y + 14, 24, 20, skinColor);
    drawRect(ctx, x - 20, y - 13, 40, 14, hatColor);
    drawRect(ctx, x - 26, y - 1, 52, 9, hatColor);
    drawRect(ctx, x - 12, y - 9, 24, 7, '#1d2333');
    drawRect(ctx, x - 10, y + 16, 20, 5, '#6f4630');
    drawRect(ctx, x - 18, y + 22, 36, 30, bodyColor);
    drawRect(ctx, x - 19, y + 24, 6, 28, '#20334d');
    drawRect(ctx, x + 13, y + 24, 6, 28, '#1a2740');
    drawRect(ctx, x - 23, y + 25, 9, 25, bodyColor);
    drawRect(ctx, x + 14, y + 25, 9, 25, bodyColor);
    drawRect(ctx, x - 16, y + 26, 32, 24, 'rgba(255, 255, 255, 0.03)');
    drawRect(ctx, x - 14, y + 30, 28, 6, accentColor);
    drawRect(ctx, x - 11, y + 36, 22, 4, '#f0d9af');
    drawRect(ctx, x - 6, y + 20, 12, 5, skinColor);
    drawRect(ctx, x - 4, y + 37, 8, 6, '#3a2a1d');
    drawRect(ctx, x - 14, y + 53, 12, 27, '#2b2118');
    drawRect(ctx, x + 2, y + 53, 12, 27, '#1f1712');
    drawRect(ctx, x - 16, y + 53, 16, 5, '#5d4630');
    drawRect(ctx, x + 1, y + 53, 16, 5, '#5d4630');
    drawRect(ctx, x - 17, y + 26, 5, 16, '#6b4b36');
    drawRect(ctx, x + 13, y + 26, 5, 16, '#6b4b36');
    drawRect(ctx, x - 10, y + 24, 20, 4, '#cfb07a');
    drawRect(ctx, x - 5, y + 26, 10, 5, '#7c5233');
    drawRect(ctx, x - 6, y + 49, 12, 5, '#2e2320');
    drawRect(ctx, x - 18 + shadowOffset, y + 20, 2, 7, '#7e5a3b');
    drawRect(ctx, x - 7, y + 48, 4, 4, '#d7c6a8');
    drawRect(ctx, x + 10, y + 48, 4, 4, '#d7c6a8');

    if (drawArmUp) {
        drawRect(ctx, x + dir * 18, y + 18, 12 * dir, 8, bodyColor);
        drawRect(ctx, x + dir * 28, y + 8, 10 * dir, 8, skinColor);
        drawRect(ctx, x + dir * 34, y + 0, 14 * dir, 8, gunColor);
        drawRect(ctx, x + dir * 34, y + 6, 4 * dir, 4, accentColor);
    } else {
        drawRect(ctx, x + dir * 18, y + 28, 14 * dir, 8, bodyColor);
        drawRect(ctx, x + dir * 30, y + 28, 8 * dir, 8, skinColor);
        drawRect(ctx, x + dir * 28, y + 33, 12 * dir, 4, gunColor);
    }

    drawRect(ctx, x + dir * 14, y + 58, 16 * dir, 8, accentColor);
    drawRect(ctx, x + dir * 14, y + 66, 14 * dir, 6, '#443126');
}

function drawFallenCowboy(ctx, x, y, outfit, facingLeft, progress) {
    const dir = facingLeft ? -1 : 1;
    const fallDir = facingLeft ? 1 : -1;
    const bodyColor = outfit.body;
    const hatColor = outfit.hat;
    const accentColor = outfit.accent;
    const skinColor = '#d29a67';
    const gunColor = '#161826';
    const collapse = Math.max(0, Math.min(1, progress));
    const slide = collapse * 42;
    const bodyY = y + collapse * 26;
    const bodyX = x + slide * fallDir;
    const puffAlpha = Math.max(0, 1 - collapse * 2.6);
    const hatDropY = bodyY - 28 + collapse * 42;
    const hatDropX = bodyX + fallDir * (collapse > 0.2 ? 18 : 10);

    drawShadow(ctx, bodyX - 36, bodyY + 42, 72, 10, 0.28 + collapse * 0.18);

    if (collapse < 0.45) {
        drawDustPuff(ctx, bodyX + fallDir * 20, bodyY + 34, 5 + collapse * 5, puffAlpha * 0.55);
        drawDustPuff(ctx, bodyX - fallDir * 10, bodyY + 38, 4 + collapse * 4, puffAlpha * 0.35);
    }

    drawRect(ctx, bodyX - 22, bodyY + 6, 44, 10, bodyColor);
    drawRect(ctx, bodyX - 24, bodyY + 14, 48, 10, bodyColor);
    drawRect(ctx, bodyX - 20, bodyY + 22, 40, 8, accentColor);
    drawRect(ctx, bodyX - 16, bodyY + 28, 32, 8, skinColor);
    drawRect(ctx, bodyX - 30, bodyY + 20, 60, 10, '#2c2117');
    drawRect(ctx, bodyX - 34, bodyY + 28, 68, 10, '#1f1813');
    drawRect(ctx, bodyX - 28, bodyY + 36, 56, 8, '#5a412d');
    drawRect(ctx, bodyX - 30, bodyY + 10, 12, 24, bodyColor);
    drawRect(ctx, bodyX + 18, bodyY + 8, 12, 24, bodyColor);
    drawRect(ctx, bodyX - 18, bodyY + 44, 14, 6, '#2e231c');
    drawRect(ctx, bodyX + 4, bodyY + 44, 14, 6, '#2e231c');
    drawRect(ctx, bodyX + fallDir * 24, bodyY + 12, 22 * fallDir, 8, gunColor);
    drawRect(ctx, bodyX + fallDir * 32, bodyY + 10, 10 * fallDir, 8, skinColor);
    drawRect(ctx, bodyX - 10, bodyY + 34, 20, 4, '#cfb07a');
    drawRect(ctx, bodyX - 6, bodyY + 36, 12, 4, '#7c5233');

    if (collapse < 0.18) {
        drawRect(ctx, bodyX - 16, bodyY - 24, 32, 12, hatColor);
        drawRect(ctx, bodyX - 20, bodyY - 12, 40, 10, hatColor);
        drawRect(ctx, bodyX - 12, bodyY - 28, 24, 7, '#1d2333');
    } else {
        drawRect(ctx, hatDropX - 16, hatDropY - 16, 28, 10, hatColor);
        drawRect(ctx, hatDropX - 18, hatDropY - 6, 32, 8, hatColor);
        drawRect(ctx, hatDropX - 10, hatDropY - 20, 20, 6, '#1d2333');
        drawRect(ctx, hatDropX + fallDir * 10, hatDropY + 1, 6 * fallDir, 4, accentColor);
    }

    if (collapse > 0.25) {
        drawRect(ctx, bodyX + fallDir * 24, bodyY - 10, 8 * fallDir, 6, gunColor);
    }

    if (collapse > 0.55) {
        drawDustPuff(ctx, bodyX + fallDir * 16, bodyY + 40, 3 + collapse * 3, 0.28);
    }
}

export function createRenderer(canvas) {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Add heat distortion or dramatic sky overlay in render.js
    function background(progress, tension) {
        const skySplit = Math.floor(height * 0.55);
        const gradient = context.createLinearGradient(0, 0, 0, height);

        // Shift sky to intense golden dusk as tension reaches max
        const skyTop = tension > 0.8 ? '#8c5034' : palette.skyTop;
        const skyMid = tension > 0.8 ? '#522b22' : palette.skyMid;

        gradient.addColorStop(0, skyTop);
        gradient.addColorStop(0.55, skyMid);
        gradient.addColorStop(1, palette.skyBottom);
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        // Dynamic Horizon Sunlight Glow
        const horizonGlow = context.createLinearGradient(0, skySplit - 50, 0, skySplit + 30);
        horizonGlow.addColorStop(0, 'rgba(255, 180, 80, 0)');
        horizonGlow.addColorStop(0.5, `rgba(255, 160, 60, ${0.25 + tension * 0.25})`);
        horizonGlow.addColorStop(1, 'rgba(255, 180, 80, 0)');
        context.fillStyle = horizonGlow;
        context.fillRect(0, skySplit - 50, width, 100);

        // Ground rendering
        drawRect(context, 0, skySplit, width, height - skySplit, palette.ground);
        drawRect(context, 0, skySplit + 58, width, 10, palette.groundDark);
    }

    function drawTimerMeter(progress) {
        const meterWidth = Math.round(width * 0.64);
        const meterHeight = 18;
        const meterX = Math.round((width - meterWidth) / 2);
        const meterY = 22;

        drawRect(context, meterX - 4, meterY - 4, meterWidth + 8, meterHeight + 8, 'rgba(0, 0, 0, 0.35)');
        drawRect(context, meterX, meterY, meterWidth, meterHeight, 'rgba(255, 255, 255, 0.12)');
        drawRect(context, meterX, meterY, meterWidth * progress, meterHeight, '#d7a65f');
    }

    return {
        render(state) {
            const shake = state.screenShake || 0;
            const shakeX = shake > 0 ? (Math.random() - 0.5) * shake * 8 : 0;
            const shakeY = shake > 0 ? (Math.random() - 0.5) * shake * 5 : 0;

            context.save();
            context.translate(shakeX, shakeY);

            background(state.progress, state.tension);
            drawTimerMeter(state.countdownProgress);

            const playerPose = state.playerReady || state.playerHasDrawn;
            const opponentPose = state.opponentHasDrawn || state.opponentReady;
            const playerX = width * 0.28;
            const opponentX = width * 0.72;
            const cowboyY = height * 0.44;
            const playerFallen = state.playerDeathProgress > 0;
            const opponentFallen = state.opponentDeathProgress > 0;

            if (playerFallen) {
                drawFallenCowboy(context, playerX, cowboyY, state.playerOutfit, false, state.playerDeathProgress);
            } else {
                drawStandingCowboy(context, playerX, cowboyY, state.playerOutfit, false, playerPose);
            }

            if (opponentFallen) {
                drawFallenCowboy(context, opponentX, cowboyY, state.opponentOutfit, true, state.opponentDeathProgress);
            } else {
                drawStandingCowboy(context, opponentX, cowboyY, state.opponentOutfit, true, opponentPose);
            }

            context.fillStyle = 'rgba(15, 9, 6, 0.5)';
            context.fillRect(0, 0, width, height);

            context.fillStyle = '#f1e8cf';
            context.font = '32px "Press Start 2P", monospace';
            context.textAlign = 'center';
            context.fillText(state.phaseLabel, width / 2, height - 56);

            if (state.flash) {
                context.fillStyle = `rgba(255, 255, 255, ${state.flash})`;
                context.fillRect(0, 0, width, height);
            }

            context.restore();
        },
    };
}
