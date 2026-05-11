# Communications Web CIR2 · ISEN Ouest · Projet Final

Boutique en Ligne Simplifiée

## 👥 Équipe

| Rôle                 | Membre                | Responsabilités                             |
| -------------------- | --------------------- | ------------------------------------------- |
| 🔧 Backend           | Valentin TANG-PATUREL | PHP, BDD, API REST, OAuth2                  |
| 🎨 Frontend          | Gabriel PANIEZ        | HTML, CSS, JS, AJAX, WebSocket              |
| 🔀 Intégration & Git | Alexandre BLOT        | Git, branches, conflits, tests bout en bout |

Le but de ce projet est de créer un site web ecommerce fonctionnelle avec le web. Les Administrateurs gèrent le catalogue de produits. Les clients consultent, notent et commentent. Un **chat WebSocket** assure le support en temps réel.

## 📅 Avancement par séance

### ✅ S1 — Initialisation du projet

> Git · HTML · MySQL · Structure

- [ok] Tables `users` (avec champ rôle), `products`, `reviews`
- [ok] `constantes.php` et `dbConnect()`
- [ok] Données de test : 1 admin, 2 clients, 6 produits, 4 avis
- [ok] Page HTML catalogue en grille Bootstrap
- [ok] Dépôt Git créé et partagé, structure de dossiers conforme
- [ok] Catégories documentées dans ce README

---

### ✅ S2 — Chargement dynamique du catalogue

> AJAX · JSON · PHP

- [ok] `requestProducts()` avec `fetch`
- [ok] `displayProducts(data)` en grille Bootstrap
- [ok] Filtre par catégorie via un menu
- [ok] Clic sur un produit charge le détail et les avis
- [ok] Note moyenne calculée côté PHP avec `AVG`
- [ok] JSON valide avec prix formaté et note moyenne

---

### ✅ S3 — API REST complète

> REST · PHP · GET POST PUT DELETE

- [ok] `dbAddProduct`, `dbModifyProduct`, `dbDeleteProduct`
- [ok] `dbAddReview`, `dbModifyReview`, `dbDeleteReview`
- [ok] Vérification du rôle sur les routes admin
- [ok] Routeur avec 10 routes et codes HTTP corrects
- [ok] Formulaire d'ajout produit visible admin uniquement
- [ok] Formulaire d'avis client avec note (1 à 5)
- [ok] Tag Git : `v3-rest`

---

### ✅ S4 — Chat support en temps réel

> WebSocket · JavaScript · Serveur Python

- [ok] `js/chat.js` avec WebSocket
- [ok] Messages affichés avec login et heure
- [ok] Distinction visuelle admin (badge) et client
- [ok] Envoi par bouton et touche Entrée
- [ok] Test deux onglets (un admin, un client)
- [ok] Tag Git : `v4-websocket`

---

### 🔄 S5 — Authentification OAuth2 avec rôles

> OAuth2 · Tokens · Rôles · PHP · JavaScript

- [ ] Formulaire de connexion
- [ ] Token et rôle stockés en variables globales
- [ ] Header `Bearer` sur toutes les requêtes protégées
- [ ] Interface différente selon le rôle (admin / client)
- [ ] Route `POST /login/` retournant token ET rôle
- [ ] Retour `401` si token invalide ou rôle insuffisant
- [ ] Test parcours admin : ajout, modification, suppression produit
- [ ] Test parcours client : avis uniquement
- [ ] Token et rôle non exposés dans le HTML
- [ ] Tag Git : `v5-oauth2`
