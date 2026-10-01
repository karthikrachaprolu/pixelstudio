/* =====================================================
   PIXELSTUDIO — LOGO DESIGNER
   Live preview + PNG download
===================================================== */

(() => {
    const $ = (id) => document.getElementById(id);

    const el = {
        brandName: $('brandName'),
        tagline: $('tagline'),
        symbol: $('symbol'),
        layout: $('layout'),
        font: $('font'),
        brandColor: $('brandColor'),
        accentColor: $('accentColor'),
        container: $('logoContainer'),
        preview: $('logoPreview'),
        logoSymbol: $('logoSymbol'),
        previewName: $('previewName'),
        previewTagline: $('previewTagline'),
        lightName: $('lightName'),
        darkName: $('darkName'),
        iconLogo: $('iconLogo'),
        status: $('previewStatus'),
        download: $('downloadLogo'),
        bgButtons: document.querySelectorAll('.background-btn'),
        miniSymbols: document.querySelectorAll('.mini-symbol')
    };

    let background = 'light';

    /* ---------- Symbols (pure SVG, no fonts needed) ---------- */

    function symbolSVG(type, main, second, size) {
        const dim = size ? ` width="${size}" height="${size}"` : '';
        let shapes = '';

        if (type === 'circle') {
            shapes =
                `<circle cx="50" cy="50" r="38" fill="none" stroke="${main}" stroke-width="14"/>` +
                `<circle cx="50" cy="50" r="15" fill="${second}"/>`;
        } else if (type === 'hex') {
            shapes =
                `<polygon points="50,6 88.1,28 88.1,72 50,94 11.9,72 11.9,28" fill="${main}"/>` +
                `<polygon points="50,28 69.1,39 69.1,61 50,72 30.9,61 30.9,39" fill="${second}"/>`;
        } else if (type === 'spark') {
            shapes =
                `<path transform="translate(0,12) scale(0.84)" fill="${main}" d="M50 4C54 34 66 46 96 50C66 54 54 66 50 96C46 66 34 54 4 50C34 46 46 34 50 4Z"/>` +
                `<path fill="${second}" d="M80 4C81.5 13 85 16.5 94 18C85 19.5 81.5 23 80 32C78.5 23 75 19.5 66 18C75 16.5 78.5 13 80 4Z"/>`;
        } else {
            // pixel grid (3 x 3)
            const pattern = [
                [main, main, second],
                [main, second, main],
                [second, main, main]
            ];
            pattern.forEach((row, r) => {
                row.forEach((color, c) => {
                    shapes += `<rect x="${4 + c * 32}" y="${4 + r * 32}" width="28" height="28" rx="6" fill="${color}"/>`;
                });
            });
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"${dim} aria-hidden="true">${shapes}</svg>`;
    }

    /* ---------- Current settings ---------- */

    function settings() {
        return {
            name: el.brandName.value.trim() || 'Your Brand',
            tagline: el.tagline.value.trim(),
            symbol: el.symbol.value,
            layout: el.layout.value,
            font: el.font.value,
            main: el.brandColor.value,
            accent: el.accentColor.value
        };
    }

    /* ---------- Render preview ---------- */

    function render() {
        const s = settings();
        const fontStack = `"${s.font}", sans-serif`;

        el.container.className = `logo-container layout-${s.layout}`;
        el.preview.className = `logo-preview bg-${background}`;
        el.preview.style.fontFamily = fontStack;

        el.logoSymbol.innerHTML = symbolSVG(s.symbol, s.main, s.accent);
        el.previewName.textContent = s.name;
        el.previewTagline.textContent = s.tagline;

        // version cards
        el.lightName.textContent = s.name;
        el.darkName.textContent = s.name;
        el.lightName.style.fontFamily = fontStack;
        el.darkName.style.fontFamily = fontStack;
        el.miniSymbols.forEach((m) => { m.innerHTML = symbolSVG(s.symbol, s.main, s.accent); });

        // icon version: white symbol on brand color
        el.iconLogo.style.background = s.main;
        el.iconLogo.innerHTML = symbolSVG(s.symbol, '#FFFFFF', 'rgba(255,255,255,0.55)');

        const labels = { light: 'Light Version', dark: 'Dark Version', transparent: 'Transparent Version' };
        el.status.textContent = labels[background];
    }

    /* ---------- Download PNG ---------- */

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async function downloadLogo() {
        const s = settings();
        const btn = el.download;
        btn.disabled = true;

        try {
            // make sure the chosen font is ready before drawing text
            await Promise.all([
                document.fonts.load(`700 100px "${s.font}"`),
                document.fonts.load(`400 40px "${s.font}"`)
            ]);

            const SYM = 260, PAD = 140, GAP = 70, NAME = 130, TAG = 46;
            const showSymbol = s.layout !== 'wordmark';
            const showText = s.layout !== 'symbol';
            const hasTag = showText && s.tagline;

            const measure = document.createElement('canvas').getContext('2d');
            measure.font = `700 ${NAME}px "${s.font}"`;
            const nameW = showText ? measure.measureText(s.name).width : 0;
            measure.font = `400 ${TAG}px "${s.font}"`;
            const tagW = hasTag ? measure.measureText(s.tagline).width : 0;

            const textW = Math.max(nameW, tagW);
            const textH = showText ? NAME * 1.05 + (hasTag ? TAG + 18 : 0) : 0;

            let contentW, contentH;
            if (s.layout === 'horizontal') {
                contentW = SYM + GAP + textW;
                contentH = Math.max(SYM, textH);
            } else if (s.layout === 'vertical') {
                contentW = Math.max(SYM, textW);
                contentH = SYM + GAP * 0.6 + textH;
            } else if (s.layout === 'symbol') {
                contentW = SYM;
                contentH = SYM;
            } else {
                contentW = textW;
                contentH = textH;
            }

            const canvas = document.createElement('canvas');
            canvas.width = Math.round(contentW + PAD * 2);
            canvas.height = Math.round(contentH + PAD * 2);
            const ctx = canvas.getContext('2d');

            // background
            const dark = background === 'dark';
            if (background !== 'transparent') {
                ctx.fillStyle = dark ? '#0F0F0F' : '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            const ink = dark ? '#FFFFFF' : '#141414';

            // positions
            let symX = 0, symY = 0, textX = 0, textY = 0, align = 'left';
            if (s.layout === 'horizontal') {
                symX = PAD;
                symY = PAD + (contentH - SYM) / 2;
                textX = PAD + SYM + GAP;
                textY = PAD + (contentH - textH) / 2;
            } else if (s.layout === 'vertical') {
                align = 'center';
                symX = PAD + (contentW - SYM) / 2;
                symY = PAD;
                textX = PAD + contentW / 2;
                textY = PAD + SYM + GAP * 0.6;
            } else if (s.layout === 'symbol') {
                symX = PAD; symY = PAD;
            } else {
                textX = PAD; textY = PAD;
            }

            // symbol
            if (showSymbol) {
                const svg = symbolSVG(s.symbol, s.main, s.accent, SYM);
                const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
                ctx.drawImage(img, symX, symY, SYM, SYM);
            }

            // text
            if (showText) {
                ctx.textBaseline = 'top';
                ctx.textAlign = align;
                ctx.fillStyle = ink;
                ctx.font = `700 ${NAME}px "${s.font}"`;
                ctx.fillText(s.name, textX, textY);

                if (hasTag) {
                    ctx.globalAlpha = 0.6;
                    ctx.font = `400 ${TAG}px "${s.font}"`;
                    ctx.fillText(s.tagline, textX, textY + NAME * 1.05 + 18);
                    ctx.globalAlpha = 1;
                }
            }

            const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
            const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'logo';
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${slug}-logo.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (err) {
            console.error('Logo export failed:', err);
            alert('Sorry, the logo could not be exported. Please try again.');
        } finally {
            btn.disabled = false;
        }
    }

    /* ---------- Events ---------- */

    ['brandName', 'tagline', 'symbol', 'layout', 'font', 'brandColor', 'accentColor'].forEach((id) => {
        el[id].addEventListener('input', render);
        el[id].addEventListener('change', render);
    });

    el.bgButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            el.bgButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            background = btn.dataset.background;
            render();
        });
    });

    el.download.addEventListener('click', downloadLogo);

    /* ---------- Theme toggle + mobile menu ---------- */

    const themeToggle = $('themeToggle');
    const menuToggle = $('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    function applyTheme(light) {
        document.body.classList.toggle('light-mode', light);
        if (themeToggle) themeToggle.textContent = light ? '☾' : '☀';
    }

    let savedLight = false;
    try { savedLight = localStorage.getItem('theme') === 'light'; } catch (e) { /* ignore */ }
    applyTheme(savedLight);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const light = !document.body.classList.contains('light-mode');
            applyTheme(light);
            try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) { /* ignore */ }
        });
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    }

    // re-render once web fonts finish loading
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);

    render();
})();
