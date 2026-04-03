'use strict';

/* ================================================================
   UmaShop — script.js
   ================================================================ */

const API_BASE = 'php/';

// ── Globals ──────────────────────────────────────────────────────
window.userToken = null;
window.userRole  = null;
window.userLogin = null;

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    requestProducts();

    // Envoi chat par touche Entrée
    document.getElementById('chat-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMessage();
    });

    // Envoi login par touche Entrée
    document.getElementById('password-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') login();
    });

    // Formulaire admin
    document.getElementById('form-add-product')?.addEventListener('submit', e => {
        e.preventDefault();
        addProduct();
    });
});

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Génère des étoiles HTML selon la note.
 * @param {number|null} rating
 */
function renderStars(rating) {
    if (!rating) return '<span style="font-size:.75rem;color:var(--text-3)">Non noté</span>';
    const r      = Math.round(parseFloat(rating));
    const filled = '★'.repeat(r);
    const empty  = '☆'.repeat(5 - r);
    const val    = parseFloat(rating).toFixed(1);
    return `<span class="stars">${filled}${empty}</span>`
         + `<span style="font-size:.72rem;color:var(--text-3);margin-left:.25rem">${val}</span>`;
}

/** Libellé de catégorie. */
function catLabel(cat) {
    return { plushies: 'Peluches', goodies: 'Accessoires', posters: 'Posters', figures: 'Figurines' }[cat] ?? cat;
}

/** Format prix FR. */
function fmtPrice(p) {
    return parseFloat(p).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
}

/** Format date courte. */
function fmtDate(d) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Catalogue ─────────────────────────────────────────────────────

function requestProducts(category = null) {
    let url = API_BASE + 'products.php';
    if (category) url += '?category=' + encodeURIComponent(category);

    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<div class="grid-loader"><div class="loader-ring"></div></div>';

    fetch(url)
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => displayProducts(data))
        .catch(() => {
            grid.innerHTML = `<div class="grid-empty">
                <div class="grid-empty-icon">⚠</div>
                <p>Impossible de charger le catalogue.</p>
            </div>`;
        });
}

function displayProducts(products) {
    const grid      = document.getElementById('product-grid');
    const countEl   = document.getElementById('product-count');
    grid.innerHTML  = '';

    if (countEl) {
        countEl.textContent = products.length
            ? `${products.length} référence${products.length > 1 ? 's' : ''}`
            : '';
    }

    if (!products || products.length === 0) {
        grid.innerHTML = `<div class="grid-empty">
            <div class="grid-empty-icon">◈</div>
            <p>Aucun produit dans cette catégorie.</p>
        </div>`;
        return;
    }

    products.forEach((p, i) => {
        const col = document.createElement('div');
        col.style.setProperty('--i', i);

        const adminHtml = window.userRole === 'admin' ? `
            <div class="pcard-admin-row">
                <button class="btn-adm-edit" onclick="event.stopPropagation(); openEditProduct(${p.id})">✏ Modifier</button>
                <button class="btn-adm-del"  onclick="event.stopPropagation(); confirmDelete(${p.id})">✕ Supprimer</button>
            </div>` : '';

        col.innerHTML = `
            <div class="pcard" onclick="loadProductDetail(${p.id})" style="--i:${i}">
                <div class="pcard-img-wrap">
                    <img src="${p.image}" alt="${p.name}" loading="lazy"
                         onerror="this.src='img/tachyon_idle.jpeg'">
                    <span class="pcard-cat-tag">${catLabel(p.category)}</span>
                </div>
                <div class="pcard-body">
                    <h3 class="pcard-title">${p.name}</h3>
                    <p class="pcard-desc">${p.description}</p>
                    <div class="pcard-footer">
                        <span class="pcard-price">${fmtPrice(p.price)}</span>
                        <span class="pcard-rating">${renderStars(p.average_rating)}</span>
                    </div>
                    ${adminHtml}
                    <button class="pcard-btn">Voir le détail →</button>
                </div>
            </div>`;
        grid.appendChild(col);
    });
}

// ── Filtre ────────────────────────────────────────────────────────

function setFilter(btn, category) {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    requestProducts(category || null);
}

function scrollToCatalogue() {
    document.getElementById('catalogue-anchor')?.scrollIntoView({ behavior: 'smooth' });
}

// ── Détail produit ────────────────────────────────────────────────

function loadProductDetail(productId) {
    const detailEl = document.getElementById('detail-content');
    detailEl.innerHTML = '<div class="grid-loader" style="height:200px"><div class="loader-ring"></div></div>';
    detailEl.className = '';

    fetch(`${API_BASE}product.php?id=${productId}`)
        .then(r => r.json())
        .then(p => renderDetail(p));

    document.getElementById('product-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDetail(p) {
    const el = document.getElementById('detail-content');
    el.className = 'detail-wrap';

    const reviewFormHtml = window.userRole === 'client' ? `
        <div class="review-form">
            <p class="review-form-title">Publier un avis</p>
            <div class="review-form-grid">
                <select class="field-input" id="review-rating">
                    <option value="">Note…</option>
                    <option value="5">★★★★★ — Excellent</option>
                    <option value="4">★★★★☆ — Bien</option>
                    <option value="3">★★★☆☆ — Correct</option>
                    <option value="2">★★☆☆☆ — Décevant</option>
                    <option value="1">★☆☆☆☆ — Mauvais</option>
                </select>
                <textarea class="field-input" id="review-comment" rows="2" placeholder="Votre commentaire…"></textarea>
                <button class="btn-cta-primary" onclick="submitReview(${p.id})" style="width:auto;align-self:start">Publier l'avis</button>
            </div>
        </div>` : '';

    el.innerHTML = `
        <div class="detail-header">
            <div>
                <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);margin-bottom:.3rem">${catLabel(p.category)}</div>
                <h3 class="detail-header-title">${p.name}</h3>
            </div>
            <button class="detail-header-back" onclick="document.getElementById('detail-content').innerHTML='<div class=detail-placeholder><div class=detail-placeholder-inner><span class=detail-placeholder-icon>◈</span><p>Sélectionnez un produit pour en voir le détail.</p></div></div>'">
                ← Retour
            </button>
        </div>

        <div class="detail-body">
            <div>
                <img class="detail-img" src="${p.image}" alt="${p.name}"
                     onerror="this.src='img/tachyon_idle.jpeg'">
            </div>
            <div>
                <div class="detail-price">${fmtPrice(p.price)}</div>
                <p class="detail-desc">${p.description}</p>
                <div class="detail-pills">
                    <span class="detail-pill gold">${catLabel(p.category)}</span>
                    <span class="detail-pill">Stock : ${p.stock}</span>
                    ${p.dimensions ? `<span class="detail-pill">📐 ${p.dimensions}</span>` : ''}
                    ${p.average_rating ? `<span class="detail-pill gold">${renderStars(p.average_rating)}</span>` : ''}
                </div>
                <div id="reviews-section"><p style="color:var(--text-3);font-size:.82rem">Chargement des avis…</p></div>
                ${reviewFormHtml}
            </div>
        </div>`;

    loadReviews(p.id);
}

// ── Avis ──────────────────────────────────────────────────────────

function loadReviews(productId) {
    fetch(`${API_BASE}reviews.php?id=${productId}`)
        .then(r => r.json())
        .then(reviews => renderReviews(reviews, productId));
}

function renderReviews(reviews, productId) {
    const sec = document.getElementById('reviews-section');
    if (!sec) return;

    if (!reviews || reviews.length === 0) {
        sec.innerHTML = `<p class="reviews-heading">Avis clients</p>
            <p style="color:var(--text-3);font-size:.82rem">Aucun avis pour ce produit.</p>`;
        return;
    }

    const html = reviews.map(r => `
        <div class="review-card">
            <div class="review-card-top">
                <span class="review-author">${r.userLogin}</span>
                <div>${renderStars(r.rating)}</div>
                <span class="review-date">${fmtDate(r.created_at)}</span>
            </div>
            <p class="review-text">${r.comment}</p>
        </div>`).join('');

    sec.innerHTML = `<p class="reviews-heading">Avis clients (${reviews.length})</p>${html}`;
}

function submitReview(productId) {
    const rating  = document.getElementById('review-rating')?.value;
    const comment = document.getElementById('review-comment')?.value?.trim();
    if (!rating || !comment) { alert('Merci de renseigner une note et un commentaire.'); return; }

    fetch(`${API_BASE}reviews.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.userToken || ''}`
        },
        body: JSON.stringify({ productId, rating, comment })
    })
    .then(r => r.json())
    .then(() => {
        document.getElementById('review-comment').value = '';
        document.getElementById('review-rating').value  = '';
        loadReviews(productId);
    });
}

// ── Authentification ──────────────────────────────────────────────

function toggleLoginPanel() {
    const panel   = document.getElementById('login-panel');
    const overlay = document.getElementById('login-overlay');
    const isOpen  = panel.classList.contains('open');

    if (isOpen) {
        panel.classList.remove('open');
        overlay.classList.add('d-none');
        panel.setAttribute('aria-hidden', 'true');
    } else {
        panel.classList.add('open');
        overlay.classList.remove('d-none');
        panel.setAttribute('aria-hidden', 'false');
        document.getElementById('login-input')?.focus();
    }
}

function login() {
    const loginVal = document.getElementById('login-input')?.value?.trim();
    const passVal  = document.getElementById('password-input')?.value;
    const errorEl  = document.getElementById('login-error');
    if (errorEl) errorEl.classList.add('d-none');

    if (!loginVal || !passVal) { return; }

    fetch(`${API_BASE}login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginVal, password: passVal })
    })
    .then(r => r.json())
    .then(data => {
        if (data.token) {
            window.userToken = data.token;
            window.userRole  = data.role;
            window.userLogin = loginVal;
            onLoginSuccess(loginVal, data.role);
        } else {
            if (errorEl) errorEl.classList.remove('d-none');
        }
    })
    .catch(() => { if (errorEl) errorEl.classList.remove('d-none'); });
}

function onLoginSuccess(loginVal, role) {
    toggleLoginPanel();

    // Chip utilisateur
    const chip = document.getElementById('user-chip');
    if (chip) {
        chip.classList.remove('d-none');
        document.getElementById('chip-avatar').textContent = loginVal[0].toUpperCase();
        document.getElementById('chip-name').textContent   = loginVal;
        document.getElementById('chip-role').textContent   = role;
    }

    // Masquer le bouton connexion
    document.getElementById('btn-open-login')?.classList.add('d-none');

    // Formulaire admin
    if (role === 'admin') {
        document.getElementById('admin-form')?.classList.remove('d-none');
    }

    // Recharger le catalogue
    requestProducts();
}

function logout() {
    window.userToken = null;
    window.userRole  = null;
    window.userLogin = null;

    document.getElementById('user-chip')?.classList.add('d-none');
    document.getElementById('btn-open-login')?.classList.remove('d-none');
    document.getElementById('admin-form')?.classList.add('d-none');
    document.getElementById('login-input').value    = '';
    document.getElementById('password-input').value = '';
    document.getElementById('login-error')?.classList.add('d-none');

    requestProducts();
}

// ── Admin — Produits ──────────────────────────────────────────────

function addProduct() {
    const body = {
        name:        document.getElementById('product-name')?.value?.trim(),
        description: document.getElementById('product-desc')?.value?.trim(),
        price:       document.getElementById('product-price')?.value,
        category:    document.getElementById('product-category')?.value,
        stock:       document.getElementById('product-stock')?.value,
    };
    if (!body.name || !body.price || !body.category) return;

    fetch(`${API_BASE}products.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.userToken || ''}`
        },
        body: JSON.stringify(body)
    })
    .then(r => r.json())
    .then(() => {
        document.getElementById('form-add-product')?.reset();
        requestProducts();
    });
}

function confirmDelete(productId) {
    if (!confirm('Supprimer définitivement ce produit ?')) return;
    fetch(`${API_BASE}products.php?id=${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.userToken || ''}` }
    }).then(() => requestProducts());
}

function openEditProduct(productId) {
    // À implémenter : préremplir le formulaire admin et passer en mode PUT
    console.log('Edit product', productId);
}

// ── Chat WebSocket ────────────────────────────────────────────────

let ws = null;

function connectWebSocket(ip, port = 12345) {
    try {
        ws = new WebSocket(`ws://${ip}:${port}`);

        ws.addEventListener('open', () => setWsStatus(true));
        ws.addEventListener('close', () => setWsStatus(false));
        ws.addEventListener('message', e => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.login !== window.userLogin) {
                    appendBubble(msg.login, msg.message, msg.role === 'admin' ? 'admin' : 'client');
                }
            } catch { /* ignore */ }
        });
    } catch(err) {
        console.warn('WebSocket connection failed', err);
    }
}

function setWsStatus(online) {
    const dot   = document.querySelector('.ws-dot');
    const badge = document.getElementById('ws-indicator');
    if (!dot || !badge) return;
    if (online) {
        dot.classList.remove('offline');
        badge.innerHTML = '<span class="ws-dot"></span>En ligne';
    } else {
        badge.innerHTML = '<span class="ws-dot offline"></span>Hors ligne';
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text  = input?.value?.trim();
    if (!text) return;

    appendBubble(window.userLogin || 'Vous', text, 'self');

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            login:   window.userLogin || 'Visiteur',
            message: text,
            role:    window.userRole  || 'client'
        }));
    }

    input.value = '';
}

function appendBubble(login, text, type) {
    const box     = document.getElementById('chat-box');
    const welcome = box?.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const time  = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const badge = type === 'admin'
        ? ` <span class="admin-badge-tag">ADMIN</span>`
        : '';

    const cls = type === 'self'  ? 'from-self'
              : type === 'admin' ? 'from-admin'
              :                    'from-client';

    const div = document.createElement('div');
    div.className = `chat-bubble ${cls}`;
    div.innerHTML = `<div class="chat-bubble-meta">${login}${badge} · ${time}</div>${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}