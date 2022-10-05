fetch('http://localhost:3000/api/products/' + getProductIdFromUrl())
  .then((res) => res.json())
  .then((kanap) => {
    displayProduct(kanap);
    handleEvents(kanap);
  });

function getProductIdFromUrl() {
  const url = new URL(document.location);
  return url.searchParams.get('id');
}

function displayProduct(kanap) {
  console.log('kanap', kanap);

  document.querySelector('#title').innerHTML = kanap.name;
  document.querySelector('#price').innerHTML = kanap.price;
  document.querySelector('#description').innerHTML = kanap.description;

  const image = document.createElement('img');
  image.src = kanap.imageUrl;
  image.alt = kanap.altTxt;
  document.querySelector('.item__img').appendChild(image);

  const colorElement = document.getElementById('colors');
  kanap.colors.forEach(function (color) {
    colorElement.innerHTML += `<option value="${color}">${color}</option>`;
  });
}

function handleEvents(kanap) {
  // Event : Add product to cart
  document.querySelector('#addToCart').addEventListener('click', (e) => {
    const productToAdd = {
      id: kanap._id,
      color: document.querySelector('#colors').value,
      quantity: parseInt(document.querySelector('#quantity').value),
      price: kanap.price
    };
    addProductToLocalStorage(productToAdd);
  });
  // Other events ...
}

function addProductToLocalStorage(productToAdd) {
  // get list products from local storage 
  const productsFromLocalStorage = localStorage.getItem('products') 

  // if the list exists push the new product to the list
  let productsToAdd

  if (productsFromLocalStorage){
    productsToAdd = JSON.parse(productsFromLocalStorage)
    console.log(productsFromLocalStorage)
    productsToAdd.push(productToAdd)
  }

  // else create the list with the products 

  else {
    productsToAdd = [productToAdd]
  }

  localStorage.setItem('products', JSON.stringify(productsToAdd));
  window.location.href = 'cart.html';
}