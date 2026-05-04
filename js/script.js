'use strict';

/* ================================================================
   UmaShop — script.js
   ================================================================ */

const API_BASE = 'php/';
let isEditing = false;
let editId = null;

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
    const infoDisplay = document.getElementById('product-info-display');

    // On s'assure d'afficher le conteneur principal
    el.classList.remove('d-none');
    el.className = 'detail-wrap';
    
    // On cache la version "Bootstrap" si elle est présente pour éviter les doublons
    if (infoDisplay) infoDisplay.classList.add('d-none');

    // Construction des badges (pills)
    const dimensionsHtml = p.dimensions ? `<span class="detail-pill">📐 ${p.dimensions}</span>` : '';
    const stockHtml = `<span class="detail-pill ${p.stock > 0 ? 'gold' : ''}">Stock : ${p.stock}</span>`;
    const ratingHtml = `<span class="detail-pill gold">${renderStars(p.average_rating)}</span>`;

    // Le formulaire d'avis (uniquement si connecté)
    const reviewFormHtml = window.userToken ? `
        <div class="review-form mt-4">
            <p class="review-form-title">Publier un avis</p>
            <div class="review-form-grid">
                <select class="field-input" id="review-rating">
                    <option value="5">★★★★★ — Excellent</option>
                    <option value="4">★★★★☆ — Bien</option>
                    <option value="3">★★★☆☆ — Correct</option>
                    <option value="2">★★☆☆☆ — Décevant</option>
                    <option value="1">★☆☆☆☆ — Mauvais</option>
                </select>
                <textarea class="field-input" id="review-comment" rows="2" placeholder="Votre commentaire…"></textarea>
                <button class="btn-cta-primary" onclick="submitReview(${p.id})">Publier l'avis</button>
            </div>
        </div>` : `<p class="text-muted small mt-4 italic">Connectez-vous pour laisser un avis.</p>`;

    el.innerHTML = `
        <div class="detail-header">
            <div>
                <div style="font-size:.72rem;text-transform:uppercase;color:var(--text-3);">${catLabel(p.category)}</div>
                <h3 class="detail-header-title">${p.name}</h3>
            </div>
            <button class="detail-header-back" onclick="location.reload()">← Retour</button>
        </div>

        <div class="detail-body">
            <div class="detail-img-container">
                <img class="detail-img" src="${p.image}" onerror="this.src='img/tachyon_idle.jpeg'">
            </div>
            <div class="detail-info">
                <div class="detail-price">${fmtPrice(p.price)}</div>
                <p class="detail-desc">${p.description}</p>
                <div class="detail-pills">
                    ${stockHtml}
                    ${dimensionsHtml}
                    ${ratingHtml}
                </div>
                
                <hr class="border-secondary my-4" style="opacity:0.1">
                
                <div id="reviews-section">
                    <p style="color:var(--text-3);font-size:.82rem">Chargement des avis...</p>
                </div>

                ${reviewFormHtml}
            </div>
        </div>`;

    // On lance le chargement des avis dans le conteneur qu'on vient de créer
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
                         <p style="color:var(--text-3);font-size:.82rem;font-style:italic">Aucun avis pour le moment.</p>`;
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
        loadReviews(productId); // Rafraîchit la liste des avis
        requestProducts(); // Optionnel : rafraîchit le catalogue pour la note moyenne
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

    const chip = document.getElementById('user-chip');
    if (chip) {
        chip.classList.remove('d-none');
        document.getElementById('chip-avatar').textContent = loginVal[0].toUpperCase();
        document.getElementById('chip-name').textContent   = loginVal;
        document.getElementById('chip-role').textContent   = role;
    }


    document.getElementById('btn-open-login')?.classList.add('d-none');

    if (role === 'admin') {
        document.getElementById('admin-form')?.classList.remove('d-none');
    }

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
        image:       document.getElementById('product-image')?.value?.trim(), // Ajouté
    };
    
    if (!body.name || !body.price || !body.category) return;

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_BASE}products.php?id=${editId}` : `${API_BASE}products.php`;
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.userToken || ''}`
        },
        body: JSON.stringify(body)
    })
    .then(r => r.json())
    .then(() => {
        document.getElementById('form-add-product')?.reset();
        cancelEdit(); 
<<<<<<< HEAD
        requestProducts(); 
=======
        requestProducts(); // Rafraîchissement automatique
>>>>>>> 57a77b10a9caefe7d1e82c7c5cc1a3bae7a56837
    });
}

function confirmDelete(productId) {
    if (!confirm('Supprimer définitivement ce produit ?')) return;
    fetch(`${API_BASE}products.php?id=${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.userToken || ''}` }
    }).then(() => requestProducts());
}


// ── Chat WebSocket ────────────────────────────────────────────────

function openEditProduct(productId) {
    isEditing = true;
    editId = productId;

    document.getElementById('btn-cancel-edit')?.classList.remove('d-none');
    const btn = document.getElementById('admin-submit-btn');
    if (btn) btn.textContent = "Mettre à jour le produit";

    fetch(`${API_BASE}product.php?id=${productId}`)
        .then(r => r.json())
        .then(p => {
            document.getElementById('product-name').value = p.name;
            document.getElementById('product-desc').value = p.description;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-category').value = p.category;
            document.getElementById('product-stock').value = p.stock;
            document.getElementById('product-image').value = p.image; // Ajouté
            
            document.getElementById('admin-form').scrollIntoView({ behavior: 'smooth' });
        });
}

<<<<<<< HEAD
=======
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

function openEditProduct(productId) {
    isEditing = true;
    editId = productId;

    // Afficher le bouton annuler
    document.getElementById('btn-cancel-edit')?.classList.remove('d-none');
    const btn = document.getElementById('admin-submit-btn');
    if (btn) btn.textContent = "Mettre à jour le produit";

    fetch(`${API_BASE}product.php?id=${productId}`)
        .then(r => r.json())
        .then(p => {
            document.getElementById('product-name').value = p.name;
            document.getElementById('product-desc').value = p.description;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-category').value = p.category;
            document.getElementById('product-stock').value = p.stock;
            document.getElementById('product-image').value = p.image; // Ajouté
            
            document.getElementById('admin-form').scrollIntoView({ behavior: 'smooth' });
        });
}

>>>>>>> 57a77b10a9caefe7d1e82c7c5cc1a3bae7a56837
function cancelEdit() {
    isEditing = false;
    editId = null;
    document.getElementById('form-add-product')?.reset();
    document.getElementById('btn-cancel-edit')?.classList.add('d-none');
    const btn = document.getElementById('admin-submit-btn');
    if (btn) btn.textContent = "Enregistrer le produit";
}