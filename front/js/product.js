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
    };
    if (areFormDataValid(productToAdd) === false){
      return;
    }
    addProductToLocalStorage(productToAdd);

    document.location.href = 'cart.html';
  });
  // Other events ...
}

function areFormDataValid(productToAdd) {
  if (productToAdd.color === '') {
      alert('Select a valid color');
      return false;
  }

  if (productToAdd.quantity <= 0) {
      alert('Select a valid quantity');
      return false;
  }
  return true;
}

function getProductToLocalStorage(productToAdd) {
  // get list products from local storage 
  const productsFromLocalStorage = localStorage.getItem('products') 

  // if the list exists push the new product to the list
  if (productToAdd == null){
    return[]
  }
   // else create the list with the products 
  else {
    return JSON.parse(productsFromLocalStorage)
  }
}

function addProductToLocalStorage(productToAdd) {
  
  let productFromLocalStorage = getProductToLocalStorage(productToAdd);
  let productKeyToLocalStorage = findProductKeyToLocalStorage(productToAdd, productFromLocalStorage);

  if (productKeyToLocalStorage === null) {
    productFromLocalStorage.push(productToAdd);
  } else {
    productFromLocalStorage[productKeyToLocalStorage].quantity += productToAdd.quantity;
  }

  localStorage.setItem('products', JSON.stringify(productFromLocalStorage));
}

function findProductKeyToLocalStorage(productToAdd, products) {
  let productKeyFound = null;

  products.forEach(function (kanap, key) {
    if (kanap.id === productToAdd.id && kanap.color === productToAdd.color) {
      productKeyFound = key;
    }
  });
  return productKeyFound;
}