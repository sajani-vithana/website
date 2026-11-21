/* Sajani Vithana — site interactions */
document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= Research vision wheel ================= */
const THRUSTS = [
    {
        id: 'reliability', name: 'AI Reliability', lines: ['AI', 'Reliability'], icon: '', faIcon: 'fa-diagram-project',
        color: '--c-rel', soft: '--c-rel-soft',
        q: 'Reliable systems built from unreliable models',
        items: ['Mathematical representations of model error types', 'Optimal circuits of LLMs under a cost budget'],
        tools: ['signal processing', 'coding theory', 'reinforcement learning'],
    },
    {
        id: 'accountability', name: 'AI Accountability', lines: ['AI', 'Accountability'], icon: '', faIcon: 'fa-fingerprint',
        color: '--c-acc', soft: '--c-acc-soft',
        q: 'Provenance for AI content, and defenses against covert agents',
        groups: {
            'Provenance': ['LLM watermarks'],
            'Potential threats': ['Covert agent-to-agent communication'],
        },
        tools: ['information theory', 'coding theory', 'optimal transport'],
    },
    {
        id: 'privacy', name: 'Data Privacy', lines: ['Data', 'Privacy'], icon: '', faIcon: 'fa-lock',
        color: '--c-priv', soft: '--c-priv-soft',
        q: 'Privacy-preserving AI training and inference',
        groups: {
            'Training': ['Private synthetic data generation', 'Private federated learning'],
            'Inference': ['Private retrieval-augmented generation', 'Private information retrieval'],
        },
        tools: ['information theory', 'coding theory', 'differential privacy'],
    },
    {
        id: 'evaluation', name: 'AI Evaluation', lines: ['AI', 'Evaluation'], icon: '', faIcon: 'fa-magnifying-glass-chart',
        color: '--c-eval', soft: '--c-eval-soft',
        q: 'Evaluation beyond static benchmarks',
        items: ['Detecting behavior shifts after model updates', 'Exploration beyond static benchmarks', 'Continual certification of model releases'],
        tools: ['active learning', 'multi-armed bandits', 'Bayesian optimization'],
    },
    {
        id: 'responsible', name: 'Socially Responsible AI', lines: ['Socially', 'Responsible', 'AI'], icon: '', faIcon: 'fa-people-group',
        color: '--c-resp', soft: '--c-resp-soft',
        q: 'Socially responsible generative AI',
        items: ['Understanding representational harms in generative AI', 'Multi-group proportional representation'],
        tools: ['statistics', 'optimization', 'social sciences'],
    },
];

const SVG_NS = 'http://www.w3.org/2000/svg';
const CX = 320, CY = 320, RI = 116, RO = 222;

function el(tag, attrs = {}, parent) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (parent) parent.appendChild(node);
    return node;
}
function polar(r, deg) {
    const a = deg * Math.PI / 180;
    return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
}
function arcPath(r, a0, a1, ccw = false) {
    const [x0, y0] = polar(r, ccw ? a1 : a0);
    const [x1, y1] = polar(r, ccw ? a0 : a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 ${ccw ? 0 : 1} ${x1} ${y1}`;
}
function wedgePath(a0, a1) {
    const [ox0, oy0] = polar(RO, a0), [ox1, oy1] = polar(RO, a1);
    const [ix1, iy1] = polar(RI, a1), [ix0, iy0] = polar(RI, a0);
    return `M ${ox0} ${oy0} A ${RO} ${RO} 0 0 1 ${ox1} ${oy1} L ${ix1} ${iy1} A ${RI} ${RI} 0 0 0 ${ix0} ${iy0} Z`;
}

function buildWheel() {
    const svg = document.getElementById('vision-wheel');
    const panel = document.getElementById('vision-panel');
    if (!svg || !panel) return;
    svg.setAttribute('viewBox', '90 90 460 460');

    const defs = el('defs', {}, svg);

    const css = getComputedStyle(document.documentElement);
    const sectors = [];
    const step = 360 / THRUSTS.length, pad = 1.4;

    THRUSTS.forEach((t, i) => {
        const mid = i * step;
        const a0 = mid - step / 2 + pad, a1 = mid + step / 2 - pad;
        const color = `var(${t.color})`;
        const g = el('g', { class: 'sector', tabindex: 0, role: 'button', 'aria-label': `${t.name}: jump to research` }, svg);
        g.dataset.index = i;

        // soft gradient wedge
        const gid = `grad-${t.id}`;
        const [gx0, gy0] = polar(RI, mid), [gx1, gy1] = polar(RO, mid);
        const grad = el('linearGradient', { id: gid, gradientUnits: 'userSpaceOnUse', x1: gx0, y1: gy0, x2: gx1, y2: gy1 }, defs);
        el('stop', { offset: '0%', 'stop-color': css.getPropertyValue(t.color).trim(), 'stop-opacity': '0.82' }, grad);
        el('stop', { offset: '100%', 'stop-color': css.getPropertyValue(t.color).trim(), 'stop-opacity': '1' }, grad);
        el('path', { class: 'wedge', d: wedgePath(a0, a1), fill: `url(#${gid})` }, g);

        // icon + label
        const [lx, ly] = polar((RI + RO) / 2, mid);
        const shift = (t.lines.length - 2) * 9;
        const icon = el('text', { class: 'sector-icon', x: lx, y: ly - 14 - shift, 'text-anchor': 'middle' }, g);
        icon.textContent = t.icon;
        t.lines.forEach((line, j) => {
            const tx = el('text', { class: 'sector-label', x: lx, y: ly + 12 - shift + j * 17, 'text-anchor': 'middle' }, g);
            tx.textContent = line;
        });


        sectors.push({ g, mid, t });
    });

    // hub
    const hubG = el('g', {}, svg);
    el('circle', { class: 'hub-ring', cx: CX, cy: CY, r: 104 }, hubG);
    el('circle', { class: 'hub', cx: CX, cy: CY, r: 98 }, hubG);
    ['Reliable &', 'Trustworthy AI'].forEach((s, j) => {
        const tx = el('text', { class: 'hub-text', x: CX, y: CY - 22 + j * 25, 'text-anchor': 'middle' }, hubG);
        tx.textContent = s;
    });
    el('line', { class: 'hub-rule', x1: CX - 36, x2: CX + 36, y1: CY + 16, y2: CY + 16 }, hubG);
    ['from an information-', 'theoretic perspective'].forEach((s, j) => {
        const tx = el('text', { class: 'hub-core', x: CX, y: CY + 36 + j * 15, 'text-anchor': 'middle' }, hubG);
        tx.textContent = s;
    });

    // ---- interaction ----
    let active = -1, cycleTimer = null, userTook = false, lastPointer = 'mouse';

    function renderPanel(t) {
        const list = t.groups
            ? Object.entries(t.groups).map(([gname, its]) =>
                `<li class="group">${gname}</li>` + its.map(x => `<li>${x}</li>`).join('')).join('')
            : t.items.map(x => `<li>${x}</li>`).join('');
        panel.style.setProperty('--pc', `var(${t.color})`);
        panel.style.setProperty('--pcs', `var(${t.soft})`);
        panel.innerHTML = `
            <div class="vp-fade">
                <h3><i class="fas ${t.faIcon}"></i> ${t.name}</h3>
                <p class="vp-q">${t.q}</p>
                <ul>${list}</ul>
                <div class="vp-foot">
                    <a class="vp-go" href="#thrust-${t.id}">Explore <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`;
    }

    function activate(i) {
        if (i === active) return;
        active = i;
        svg.classList.add('has-active');
        sectors.forEach((s, j) => {
            const on = j === i;
            s.g.classList.toggle('active', on);
            if (on) {
                const a = s.mid * Math.PI / 180;
                s.g.style.transform = `translate(${10 * Math.sin(a)}px, ${-10 * Math.cos(a)}px)`;
            } else {
                s.g.style.transform = '';
            }
        });
        renderPanel(THRUSTS[i]);
    }

    function stopCycle() { userTook = true; clearInterval(cycleTimer); }

    sectors.forEach(({ g, t }, i) => {
        g.addEventListener('pointerdown', e => { lastPointer = e.pointerType; });
        g.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { stopCycle(); activate(i); } });
        g.addEventListener('focus', () => { stopCycle(); activate(i); });
        g.addEventListener('click', () => {
            // on touch: first tap shows details, second tap navigates
            if (lastPointer !== 'mouse' && active !== i) { stopCycle(); activate(i); return; }
            document.getElementById(`thrust-${t.id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        g.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById(`thrust-${t.id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        });
    });

    function lockPanelHeight() {
        panel.style.minHeight = '';
        let max = 0;
        THRUSTS.forEach(t => { renderPanel(t); max = Math.max(max, panel.offsetHeight); });
        panel.style.minHeight = max + 'px';
        renderPanel(THRUSTS[active < 0 ? 0 : active]);
    }
    lockPanelHeight();
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(lockPanelHeight, 150); });
    activate(0);
}

/* ================= Nav ================= */
function nav() {
    const header = document.getElementById('nav');
    const toggle = header.querySelector('.nav-toggle');
    const links = [...header.querySelectorAll('nav a')];

    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => {
        const open = header.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
    });
    links.forEach(a => a.addEventListener('click', () => header.classList.remove('open')));

    const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
}

/* ================= Reveal on scroll ================= */
function reveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(i => obs.observe(i));
}

/* ================= Publication filters ================= */
function pubFilters() {
    const chips = document.querySelectorAll('.chip');
    const pubs = document.querySelectorAll('.pub');
    chips.forEach(chip => chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.toggle('active', c === chip));
        const f = chip.dataset.filter;
        pubs.forEach(p => p.classList.toggle('hidden', f !== 'all' && p.dataset.t !== f));
        document.querySelectorAll('.pub-group').forEach(h => {
            const list = h.nextElementSibling;
            const any = list && list.querySelector('.pub:not(.hidden)');
            h.classList.toggle('empty', !any);
        });
    }));
}

document.addEventListener('DOMContentLoaded', () => {
    nav();
    reveal();
    pubFilters();
    // wait for Font Awesome so icon glyphs inside the SVG render
    (document.fonts ? document.fonts.load('900 16px "Font Awesome 6 Free"') : Promise.resolve())
        .catch(() => {}).finally(buildWheel);
});
