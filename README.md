# Communications Web CIR2 · ISEN Ouest · Projet Final

Boutique en Ligne Simplifiée

## Équipe

| Rôle              | Membre                | Responsabilités                             |
| ----------------- | --------------------- | ------------------------------------------- |
| Backend           | Valentin TANG-PATUREL | PHP, BDD, API REST, OAuth2                  |
| Frontend          | Gabriel PAGNIEZ       | HTML, CSS, JS, AJAX, WebSocket              |
| Intégration & Git | Alexandre BLOT        | Git, branches, conflits, tests bout en bout |

## But du projet

Le but de ce projet est de créer un site web ecommerce fonctionnel. Les administrateurs gèrent le catalogue de produits. Les clients consultent, notent et commentent les produits. Un chat WebSocket assure le support en temps réel.

---

# Technologies utilisées

* HTML5
* CSS3
* JavaScript
* AJAX / Fetch API
* PHP
* MySQL
* WebSocket
* Bootstrap 5

---

# Fonctionnalités principales

## Catalogue

* Affichage dynamique des produits
* Filtrage par catégorie
* Détail produit dynamique
* Affichage des notes moyennes
* Affichage des avis clients

## Gestion des produits

* Ajout de produit (admin)
* Modification de produit (admin)
* Suppression de produit (admin)
* Gestion des catégories
* Gestion des images existantes

## Gestion des avis

* Ajout d'avis (client)
* Modification de ses propres avis
* Suppression de ses propres avis
* Notes de 1 à 5
* Calcul automatique de la moyenne

## Authentification

* Connexion utilisateur
* Génération de token
* Authentification Bearer
* Gestion des rôles admin / client
* Protection des routes sensibles

## Chat temps réel

* WebSocket en temps réel
* Distinction admin / client
* Horodatage des messages
* Envoi via bouton ou touche Entrée

---

# Comptes de démonstration

| Type   | Login   | Mot de passe |
| ------ | ------- | ------------ |
| Admin  | admin   | admin        |
| Client | client1 | client1      |
| Client | client2 | client2      |

---

# Structure du projet

```text
README.md
sql/sql.sql

css/
└── style.css

js/
├── script.js
└── chat.js

php/
├── auth.php
├── constants.php
├── db.php
├── login.php
├── product.php
├── products.php
└── reviews.php

img/
├── img.svg
├── tachyon_idle.jpeg
├── plush_tachyon.jsp
├── figure/
├── goodies/
├── plushie/
└── poster/

index.html
```

---

# Base de données

## Tables

### users

Gestion des utilisateurs et rôles.

| Champ    | Type                |
| -------- | ------------------- |
| id       | INT                 |
| login    | VARCHAR             |
| password | VARCHAR             |
| token    | VARCHAR             |
| role     | ENUM(admin, client) |

### products

Catalogue des produits.

| Champ       | Type    |
| ----------- | ------- |
| id          | INT     |
| name        | VARCHAR |
| description | TEXT    |
| price       | DECIMAL |
| category    | VARCHAR |
| stock       | INT     |
| image       | VARCHAR |
| dimensions  | VARCHAR |
| userLogin   | VARCHAR |

### reviews

Avis clients.

| Champ      | Type      |
| ---------- | --------- |
| id         | INT       |
| productId  | INT       |
| userLogin  | VARCHAR   |
| rating     | INT       |
| comment    | TEXT      |
| created_at | TIMESTAMP |

---

# API REST

## Produits

| Méthode | Route                    | Description          |
| ------- | ------------------------ | -------------------- |
| GET     | `/php/products.php`      | Liste des produits   |
| GET     | `/php/product.php?id=N`  | Détail produit       |
| POST    | `/php/products.php`      | Ajouter un produit   |
| PUT     | `/php/products.php?id=N` | Modifier un produit  |
| DELETE  | `/php/products.php?id=N` | Supprimer un produit |

## Avis

| Méthode | Route                   | Description                 |
| ------- | ----------------------- | --------------------------- |
| GET     | `/php/reviews.php?id=N` | Liste des avis d’un produit |
| POST    | `/php/reviews.php`      | Ajouter un avis             |
| PUT     | `/php/reviews.php?id=N` | Modifier son avis           |
| DELETE  | `/php/reviews.php?id=N` | Supprimer son avis          |

## Authentification

| Méthode | Route            | Description           |
| ------- | ---------------- | --------------------- |
| POST    | `/php/login.php` | Connexion utilisateur |

---

# Avancement par séance

## S1 — Initialisation du projet

> Git · HTML · MySQL · Structure

* [ok] Tables `users`, `products`, `reviews`
* [ok] `constants.php` et `dbConnect()`
* [ok] Données de test
* [ok] Structure du projet
* [ok] Dépôt Git partagé
* [ok] Catalogue HTML initial

---

## S2 — Chargement dynamique du catalogue

> AJAX · JSON · PHP

* [ok] Chargement dynamique avec `fetch`
* [ok] Catalogue dynamique
* [ok] Filtrage par catégorie
* [ok] Détail produit AJAX
* [ok] Notes moyennes avec `AVG`
* [ok] Affichage dynamique des avis

---

## S3 — API REST complète

> REST · PHP · CRUD

* [ok] CRUD produits
* [ok] CRUD avis
* [ok] Vérification des rôles
* [ok] Codes HTTP cohérents
* [ok] Protection des routes sensibles
* [ok] Formulaire admin
* [ok] Gestion des avis clients

---

## S4 — Chat support en temps réel

> WebSocket · JavaScript

* [ok] Chat WebSocket
* [ok] Messages temps réel
* [ok] Horodatage
* [ok] Distinction admin/client
* [ok] Envoi par Entrée

---

## S5 — Authentification OAuth2 simplifiée

> Tokens · Authentification · Rôles

* [ok] Formulaire de connexion
* [ok] Génération de token
* [ok] Header Bearer
* [ok] Gestion des rôles
* [ok] Interface conditionnelle
* [ok] Vérification backend des permissions
* [ok] Restrictions admin/client

---

# Sécurité implémentée

* Vérification des tokens
* Vérification des rôles
* Protection des routes REST
* Vérification du propriétaire des avis
* Validation des IDs
* Requêtes préparées PDO
* Nettoyage HTML avec `strip_tags`
* Gestion des erreurs HTTP

---

# Lancement du projet

## Base de données

Importer :

```sql
sql/sql.sql
```

## Configuration PHP

Configurer :

```php
php/constants.php
```

## Serveur WebSocket

Lancer le serveur WebSocket Python sur :

```text
127.0.0.1:12345
```

## Démarrage

Ouvrir :

```text
index.html
```
