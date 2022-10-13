fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((kanaps) => {
        displayProducts(kanaps);
        handleEvents();
    });

function handleEvents() {
    deleteEvent();
    updateQuantityEvent();
}

function deleteEvent() {
    const deleteButtons = document.querySelectorAll('.deleteItem');
    deleteButtons.forEach(function (deleteButton) {
        deleteButton.addEventListener('click', function (e) {
            const btn = e.target;
            const article = btn.closest('.cart__item');
            let productsFromLocalStorage = retrieveProductsFromLocalStorage();
            const keyToDelete = findKanapKeyInLocalStorage(productsFromLocalStorage, article.dataset.color, article.dataset.id);
            deleteKanapInLocalStorage(productsFromLocalStorage, keyToDelete);
            article.remove();
        });
    });
}

function updateQuantityEvent() {

}

function deleteKanapInLocalStorage(productsFromLocalStorage, keyToDelete) {
    productsFromLocalStorage.splice(keyToDelete, 1);
    localStorage.setItem('products', JSON.stringify(productsFromLocalStorage));
}

function findKanapKeyInLocalStorage(productsFromLocalStorage, color, id) {
    let key = null;
    productsFromLocalStorage.forEach(function (productFromLocalStorage, i) {
        if (productFromLocalStorage.id === id && productFromLocalStorage.color === color) {
            key = i;
        }
    });
    return key;
}

function displayProducts (kanapsFromAPI) {
    const section = document.querySelector('#cart__items');
    const articlePrototype = document.querySelector('.cart__item');

    const kanapsFromLocalStorage = retrieveProductsFromLocalStorage();
    kanapsFromLocalStorage.forEach(function (kanapFromLocalStorage) {
        const kanap = retrieveKanap(kanapFromLocalStorage, kanapsFromAPI);
        let article = articlePrototype.cloneNode(true);
        article.removeAttribute('style');

        article.dataset.id = kanap.id;
        article.dataset.color = kanap.color;
        var image = article.querySelector('.cart__item__img img')
        image.src = kanap.imageUrl;
        image.alt = kanap.altTxt;
        article.querySelector('h2').textContent = kanap.name;
        article.querySelector('.color').textContent = kanap.color;
        article.querySelector('.price').textContent = kanap.price + ' €';
        article.querySelector('.itemQuantity').value = kanap.quantity;

        section.appendChild(article);
    });
}

function retrieveKanap(kanapFromLocalStorage, kanapsFromAPI) {
    let kanap = null;
    kanapsFromAPI.forEach(function (kanapFromAPI) {
        if (kanapFromAPI._id === kanapFromLocalStorage.id) {
            kanap = {
                id: kanapFromAPI._id,
                color: kanapFromLocalStorage.color,
                quantity: kanapFromLocalStorage.quantity,
                imageUrl: kanapFromAPI.imageUrl,
                altTxt: kanapFromAPI.altTxt,
                description: kanapFromAPI.description,
                name: kanapFromAPI.name,
                price: kanapFromAPI.price
            }
        }
    });
    if (kanap === null) {
        throw "Data is corrupted";
    }
    return kanap;
}

function retrieveProductsFromLocalStorage() {
    const kanapsJSON = localStorage.getItem('products');
    return JSON.parse(kanapsJSON);
}