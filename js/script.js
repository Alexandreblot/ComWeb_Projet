'use strict';

const API_BASE = 'php/';

document.addEventListener('DOMContentLoaded', () => {
    requestProducts();
});

function requestProducts(category = null) {
    let url = API_BASE + 'products.php';

    if (category) {
        url += '?category=' + category;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => displayProducts(data));
}

function loadProductDetail(productId) {
    fetch(`php/product.php?id=${productId}`)
        .then(res => res.json())
        .then(product => {
            document.getElementById('detail-content').textContent = product.name;
            
            const imgEl = document.getElementById('detail-img');    //à ajouter dans le html (n'existe pas)
            imgEl.src = product.image; 
            imgEl.onerror = () => imgEl.src = 'img/tachyon_idle.jpeg';

            displayReviews(productId);
        });
}

function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; 

    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4'; 

        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    
                    <img src="${product.image}" class="card-img-top" alt="${product.name}"onerror="this.src='img/tachyon_idle.jpeg'">
                    
                    <p class="card-text text-truncate">${product.description}</p>
                    <p class="fw-bold">${product.price} €</p>
                    
                    <button class="btn btn-sm btn-outline-primary" onclick="loadProductDetail(${product.id})">
                        Voir détails
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}


function displayReviews(productId) {
    requestReviews(productId); //temporaire
}


function requestProduct(id) {
    fetch(API_BASE + 'product.php?id=' + id)
        .then(res => res.json())
        .then(data => console.log(data));
}

function requestReviews(id) {
    fetch(API_BASE + 'reviews.php?id=' + id)
        .then(res => res.json())
        .then(data => console.log(data));
}


