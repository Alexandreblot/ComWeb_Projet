'use strict';

function requestProducts(category = null) {
    let url = '/backend/products.php';

    if (category) {
        url += '?category=' + category;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => displayProducts(data));
}

function displayProducts(products) {
    console.log(products); // pour test S2
}


