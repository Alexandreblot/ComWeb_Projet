'use strict';

const API_BASE = 'php/';


function requestProducts(category = null) {
    let url = API_BASE + 'products.php';

    if (category) {
        url += '?category=' + category;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => displayProducts(data));
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