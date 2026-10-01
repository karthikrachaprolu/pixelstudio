/* =====================================================
   PIXELSTUDIO — COLOUR SYSTEM GENERATOR
===================================================== */

(() => {
    const $ = (id) => document.getElementById(id);
    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

    /* ---------- Colour maths ---------- */

    function hexToRgb(hex) {
        let h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map((c) => c + c).join('');
        const n = parseInt(h, 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }

    function rgbToHex({ r, g, b }) {
        return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function rgbToHsl({ r, g, b }) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        const d = max - min;
        let h = 0, s = 0;
        if (d) {
            s = d / (1 - Math.abs(2 * l - 1));
            if (max === r) h = ((g - b) / d) % 6;
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h *= 60;
            if (h < 0) h += 360;
        }
        return { h, s: s * 100, l: l * 100 };
    }

    function hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const k = (n) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 };
    }

    const hsl = (h, s, l) => rgbToHex(hslToRgb(((h % 360) + 360) % 360, clamp(s, 0, 100), clamp(l, 0, 100)));

    function rgbToCmyk({ r, g, b }) {
        const r1 = r / 255, g1 = g / 255, b1 = b / 255;
        const k = 1 - Math.max(r1, g1, b1);
        if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
        return {
            c: Math.round(((1 - r1 - k) / (1 - k)) * 100),
            m: Math.round(((1 - g1 - k) / (1 - k)) * 100),
            y: Math.round(((1 - b1 - k) / (1 - k)) * 100),
            k: Math.round(k * 100)
        };
    }

    function luminance(hex) {
        const { r, g, b } = hexToRgb(hex);
        const f = (v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    }

    function contrast(a, b) {
        const la = luminance(a), lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    }

    const DARK_INK = '#0F0F0F';
    const onColor = (hex) => (contrast(hex, '#FFFFFF') >= contrast(hex, DARK_INK) ? '#FFFFFF' : DARK_INK);

    // lighten a colour until it reaches the contrast target on a background
    function ensureContrast(hex, bg, target) {
        const { h, s, l } = rgbToHsl(hexToRgb(hex));
        let light = l, out = hex;
        while (contrast(out, bg) < target && light < 92) {
            light += 3;
            out = hsl(h, s, light);
        }
        return out;
    }

    /* ---------- Palette generation ---------- */

    function build(primary, harmony, tinted) {
        const { h, s, l } = rgbToHsl(hexToRgb(primary));
        const secS = clamp(s * 0.85, 35, 80);
        const secL = clamp(l, 38, 62);

        const offsets = {
            analogous: [30, -30],
            complementary: [180, 180],
            triadic: [120, 240],
            split: [150, 210]
        }[harmony];

        const secondary = hsl(h + offsets[0], secS, secL);
        const secondaryAlt = harmony === 'complementary'
            ? hsl(h + 180, secS, clamp(secL + 20, 40, 78))
            : hsl(h + offsets[1], secS, secL);

        const accentHue = harmony === 'complementary' ? h + 30 : h + 180;
        const accent = hsl(accentHue, clamp(s, 70, 95), 55);

        const ns = tinted ? 10 : 0;

        return {
            groups: [
                { title: 'Primary Colours', items: [
                    { key: 'primary', name: 'Primary', hex: primary },
                    { key: 'primary-dark', name: 'Primary Dark', hex: hsl(h, s, l - 14) }
                ] },
                { title: 'Secondary Colours', items: [
                    { key: 'secondary', name: 'Secondary', hex: secondary },
                    { key: 'secondary-alt', name: 'Secondary Alt', hex: secondaryAlt }
                ] },
                { title: 'Accent Colour', items: [
                    { key: 'accent', name: 'Accent', hex: accent }
                ] },
                { title: 'Neutral Colours', items: [
                    { key: 'ink', name: 'Ink', hex: hsl(h, ns, 7) },
                    { key: 'slate', name: 'Slate', hex: hsl(h, ns, 22) },
                    { key: 'gray', name: 'Gray', hex: hsl(h, ns * 0.6, 50) },
                    { key: 'mist', name: 'Mist', hex: hsl(h, ns, 90) },
                    { key: 'paper', name: 'Paper', hex: hsl(h, ns, 97) }
                ] }
            ],
            hue: h,
            neutralSat: ns
        };
    }

    /* ---------- State ---------- */

    const el = {
        brandName: $('brandName'),
        primaryColor: $('primaryColor'),
        primaryHex: $('primaryHex'),
        harmony: $('harmony'),
        neutrals: $('neutrals'),
        groups: $('paletteGroups'),
        variations: $('variations'),
        proportion: $('proportion'),
        rules: $('rules'),
        contrast: $('contrast'),
        status: $('previewStatus'),
        toast: $('toast')
    };

    let palette = null;
    const flat = () => palette.groups.flatMap((g) => g.items);
    const get = (key) => flat().find((c) => c.key === key).hex;

    const HARMONY_LABELS = {
        analogous: 'Analogous',
        complementary: 'Complementary',
        triadic: 'Triadic',
        split: 'Split complementary'
    };

    /* ---------- Render ---------- */

    function codesFor(hex) {
        const rgb = hexToRgb(hex);
        const hs = rgbToHsl(rgb);
        const cm = rgbToCmyk(rgb);
        return [
            ['HEX', hex],
            ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
            ['HSL', `hsl(${Math.round(hs.h)}, ${Math.round(hs.s)}%, ${Math.round(hs.l)}%)`],
            ['CMYK', `cmyk(${cm.c}%, ${cm.m}%, ${cm.y}%, ${cm.k}%)`]
        ];
    }

    function renderSwatches() {
        el.groups.innerHTML = palette.groups.map((g) => `
            <h3 class="group-title">${g.title}</h3>
            <div class="swatch-grid">
                ${g.items.map((c) => `
                    <article class="swatch">
                        <div class="swatch-color" style="background:${c.hex};color:${onColor(c.hex)}">${c.name}</div>
                        <div class="swatch-codes">
                            ${codesFor(c.hex).map(([label, value]) =>
                                `<button type="button" data-copy="${value}" title="Click to copy"><span>${label}</span><code>${value}</code></button>`
                            ).join('')}
                        </div>
                    </article>`).join('')}
            </div>`).join('');
    }

    function renderVariations() {
        const hue = palette.hue, ns = palette.neutralSat;
        const primary = get('primary'), accent = get('accent');

        const modes = [
            {
                label: 'Light mode',
                bg: get('paper'), surface: '#FFFFFF', text: get('ink'), muted: get('slate'),
                p: primary, a: accent,
                border: get('mist')
            },
            (() => {
                const bg = get('ink');
                return {
                    label: 'Dark mode',
                    bg, surface: hsl(hue, ns, 13), text: get('paper'), muted: hsl(hue, ns * 0.6, 68),
                    p: ensureContrast(primary, bg, 4.5), a: ensureContrast(accent, bg, 4.5),
                    border: hsl(hue, ns, 20)
                };
            })()
        ];

        el.variations.innerHTML = modes.map((m) => `
            <div class="var-card" style="background:${m.bg};color:${m.text};border-color:${m.border}">
                <small style="color:${m.muted}">${m.label}</small>
                <h4>Ideas that feel on brand.</h4>
                <p style="color:${m.muted}">Body copy uses the neutral text colour so it stays easy to read.</p>
                <div class="var-row">
                    <span class="var-btn" style="background:${m.p};color:${onColor(m.p)}">Primary action</span>
                    <span class="var-chip" style="color:${m.a};border-color:${m.a}">Accent tag</span>
                </div>
                <div class="var-surface" style="background:${m.surface};border:1px solid ${m.border}">Surface card on the ${m.label.split(' ')[0].toLowerCase()} background</div>
            </div>`).join('');
    }

    function badge(ratio) {
        if (ratio >= 7) return '<span class="badge pass">AAA</span>';
        if (ratio >= 4.5) return '<span class="badge pass">AA</span>';
        if (ratio >= 3) return '<span class="badge large">AA Large only</span>';
        return '<span class="badge fail">Fail</span>';
    }

    function renderUsage() {
        const neutral = get('paper'), ink = get('ink');
        const primary = get('primary'), accent = get('accent'), secondary = get('secondary');

        el.proportion.innerHTML = `
            <div style="flex:60;background:${neutral};color:${ink}">Neutrals 60%</div>
            <div style="flex:30;background:${primary};color:${onColor(primary)}">Primary + Secondary 30%</div>
            <div style="flex:10;background:${accent};color:${onColor(accent)}">Accent 10%</div>`;

        const onPrimary = onColor(primary);
        const primaryOnPaper = contrast(primary, neutral);

        const rules = [
            '<strong>Neutrals (about 60%)</strong> cover backgrounds, surfaces and body text.',
            '<strong>Primary and secondary (about 30%)</strong> belong to headings, buttons and key sections.',
            '<strong>Accent (about 10%)</strong> is kept for calls-to-action, highlights and alerts.',
            `<strong>Button labels</strong> on Primary should be ${onPrimary === '#FFFFFF' ? 'white' : 'Ink (dark)'}.`
        ];
        if (primaryOnPaper < 4.5) {
            rules.push('<strong>Small text:</strong> Primary is too light for small text on light backgrounds. Use Primary Dark for links and captions.');
        }
        el.rules.innerHTML = rules.map((r) => `<li>${r}</li>`).join('');

        const rows = [
            ['Body text', ink, neutral, 'Ink on Paper'],
            ['Button label', onPrimary, primary, 'Label on Primary'],
            ['Links on light', primary, neutral, 'Primary on Paper'],
            ['Highlights on dark', accent, ink, 'Accent on Ink']
        ];
        el.contrast.innerHTML = rows.map(([, fg, bg, label]) => {
            const r = contrast(fg, bg);
            return `<div class="contrast-row">
                <div class="aa" style="background:${bg};color:${fg}">Aa</div>
                <div>${label}</div>
                <span class="ratio">${r.toFixed(2)} : 1</span>
                ${badge(r)}
            </div>`;
        }).join('');
    }

    function render() {
        palette = build(el.primaryColor.value.toUpperCase(), el.harmony.value, el.neutrals.value === 'tinted');
        el.status.textContent = `${HARMONY_LABELS[el.harmony.value]} harmony`;
        renderSwatches();
        renderVariations();
        renderUsage();
    }

    /* ---------- Toast + copy ---------- */

    let toastTimer;
    function toast(msg) {
        el.toast.textContent = msg;
        el.toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1600);
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (e) {
            const t = document.createElement('textarea');
            t.value = text;
            t.style.position = 'fixed';
            t.style.opacity = '0';
            document.body.appendChild(t);
            t.select();
            document.execCommand('copy');
            t.remove();
        }
        toast(`Copied ${text}`);
    }

    function cssVariables() {
        const name = el.brandName.value.trim() || 'Brand';
        const lines = flat().map((c) => `  --${c.key}: ${c.hex};`);
        return `/* ${name} colour system */\n:root {\n${lines.join('\n')}\n}`;
    }

    /* ---------- Download PNG ---------- */

    async function downloadPalette() {
        await Promise.all([
            document.fonts.load('700 56px "Space Grotesk"'),
            document.fonts.load('600 26px "Inter"'),
            document.fonts.load('400 24px "Inter"')
        ]);

        const PAD = 80, SW = 260, SH = 200, GAP = 30;
        const W = 1600;
        const rowH = 50 + SH + 80 + 30;
        const H = PAD + 100 + palette.groups.length * rowH + PAD - 30;

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, W, H);
        ctx.textBaseline = 'top';

        const name = el.brandName.value.trim() || 'Brand';
        ctx.fillStyle = '#141414';
        ctx.font = '700 56px "Space Grotesk", sans-serif';
        ctx.fillText(`${name} — Colour System`, PAD, PAD);

        let y = PAD + 100;
        palette.groups.forEach((g) => {
            ctx.fillStyle = '#5E5E5E';
            ctx.font = '600 26px "Inter", sans-serif';
            ctx.fillText(g.title, PAD, y);

            g.items.forEach((c, i) => {
                const x = PAD + i * (SW + GAP);
                ctx.fillStyle = c.hex;
                ctx.beginPath();
                ctx.roundRect(x, y + 50, SW, SH, 20);
                ctx.fill();
                if (contrast(c.hex, '#FFFFFF') < 1.3) {
                    ctx.strokeStyle = '#DDDDDD';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                ctx.fillStyle = '#141414';
                ctx.font = '600 26px "Inter", sans-serif';
                ctx.fillText(c.name, x, y + 50 + SH + 14);
                ctx.fillStyle = '#5E5E5E';
                ctx.font = '400 24px "Inter", sans-serif';
                ctx.fillText(c.hex, x, y + 50 + SH + 46);
            });
            y += rowH;
        });

        canvas.toBlob((blob) => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brand';
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${slug}-colour-system.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
    }

    /* ---------- Events ---------- */

    el.primaryColor.addEventListener('input', () => {
        el.primaryHex.value = el.primaryColor.value.toUpperCase();
        render();
    });

    el.primaryHex.addEventListener('input', () => {
        let v = el.primaryHex.value.trim();
        if (!v.startsWith('#')) v = '#' + v;
        if (/^#[0-9a-f]{6}$/i.test(v)) {
            el.primaryColor.value = v.toLowerCase();
            render();
        }
    });

    el.primaryHex.addEventListener('blur', () => {
        el.primaryHex.value = el.primaryColor.value.toUpperCase();
    });

    el.harmony.addEventListener('change', render);
    el.neutrals.addEventListener('change', render);

    $('randomBtn').addEventListener('click', () => {
        const hex = hsl(Math.random() * 360, 60 + Math.random() * 30, 42 + Math.random() * 16);
        el.primaryColor.value = hex.toLowerCase();
        el.primaryHex.value = hex;
        render();
    });

    $('copyCss').addEventListener('click', async () => {
        await copyText(cssVariables());
        toast('CSS variables copied');
    });

    $('downloadPalette').addEventListener('click', downloadPalette);

    el.groups.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-copy]');
        if (btn) copyText(btn.dataset.copy);
    });

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

    render();
})();
