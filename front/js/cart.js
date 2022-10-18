fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((kanapsFromAPI) => {
    displayProducts(kanapsFromAPI);
  });

const cart = [];

function retrieveProductsFromLocalStorage() {
  const kanapsJSON = localStorage.getItem('products');
  return JSON.parse(kanapsJSON);
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
        price: kanapFromAPI.price,
      };
    }
  });
  if (kanap === null) {
    throw 'Data is corrupted';
  }
  return kanap;
}

function displayProducts(kanapsFromAPI) {
  const kanapsFromLocalStorage = retrieveProductsFromLocalStorage();
  kanapsFromLocalStorage.forEach(function (kanapFromLocalStorage) {
    const kanap = retrieveKanap(kanapFromLocalStorage, kanapsFromAPI);
    const article = makeArticle(kanap);
    const div = makeImage(kanap);
    article.appendChild(div);
    const cardProductContent = makeCardContent(kanap);
    article.appendChild(cardProductContent);
    displayArticle(article);
    updatePriceAndQuantity(kanap);
    displayTotalQuantityAndPrice(kanap);
  });
}

function displayArticle(article) {
  document.querySelector('#cart__items').appendChild(article);
}

function makeArticle(kanap) {
  const article = document.createElement('article');
  article.classList.add('cart__item');
  article.dataset.id = kanap.id;
  article.dataset.color = kanap.color;
  return article;
}

function makeImage(kanap) {
  const div = document.createElement('div');
  div.classList.add('cart__item__img');

  const image = document.createElement('img');
  image.src = kanap.imageUrl;
  image.alt = kanap.altTxt;
  div.appendChild(image);
  return div;
}

function makeCardContent(kanap) {
  const cardItemContent = document.createElement('div');
  cardItemContent.classList.add('cart__item__content');

  const description = makeDescription(kanap);
  const settings = makeSettings(kanap);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}

function makeDescription(kanap) {
  const description = document.createElement('div');
  description.classList.add('cart__item__content__description');

  const h2 = document.createElement('h2');
  h2.textContent = kanap.name;
  const p = document.createElement('p');
  p.textContent = kanap.color;
  const p2 = document.createElement('p');
  p2.textContent = kanap.price + ' €';

  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}

function makeSettings(kanap) {
  const settings = document.createElement('div');
  settings.classList.add('cart__item__content__settings');

  addQuantityToSettings(settings, kanap);
  deleteEvent(settings);
  return settings;
}

function addQuantityToSettings(settings, kanap) {
  const quantity = document.createElement('div');
  quantity.classList.add('cart__item__content__settings__quantity');
  const p = document.createElement('p');
  p.textContent = 'Qté : ';
  quantity.appendChild(p);
  const input = document.createElement('input');
  input.type = 'number';
  input.classList.add('itemQuantity');
  input.name = 'itemQuantity';
  input.min = '1';
  input.max = '100';
  input.value = kanap.quantity;
  input.addEventListener('input', () => updatePriceAndQuantity(kanap));

  quantity.appendChild(input);
  settings.appendChild(quantity);
}

function deleteEvent(settings) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__delete');
  div.addEventListener('click', function (e) {
    const btn = e.target;
    const article = btn.closest('.cart__item');
    let productsFromLocalStorage = retrieveProductsFromLocalStorage();
    const keyToDelete = findKanapKeyInLocalStorage(
      productsFromLocalStorage,
      article.dataset.color,
      article.dataset.id
    );
    deleteKanapInLocalStorage(productsFromLocalStorage, keyToDelete);
    article.remove();
  });

  const p = document.createElement('p');
  p.textContent = 'Supprimer';
  div.appendChild(p);
  settings.appendChild(div);
}

function deleteKanapInLocalStorage(productsFromLocalStorage, keyToDelete) {
  productsFromLocalStorage.splice(keyToDelete, 1);
  localStorage.setItem('products', JSON.stringify(productsFromLocalStorage));
}

function displayTotalQuantityAndPrice(kanap) {
  const itemQuantity = document.getElementsByClassName('itemQuantity');
  let myLength = itemQuantity.length,
    totalQuantity = 0;

  for (let i = 0; i < myLength; i++) {
    totalQuantity += itemQuantity[i].valueAsNumber;
  }

  totalPrice = 0;

  for (let i = 0; i < myLength; i++) {
    totalPrice += kanap.price * itemQuantity[i].valueAsNumber;
  }

  let productTotalQuantityAndPrice = document.getElementById('totalPrice');
  productTotalQuantityAndPrice.innerHTML = totalPrice;
}

function updatePriceAndQuantity(kanap) {
  const itemQuantity = document.getElementsByClassName('itemQuantity');
  let myLength = itemQuantity.length,
    itemToUpdate = 0;

  for (let i = 0; i < myLength; i++) {
    itemToUpdate += itemQuantity[i].valueAsNumber;
  }

  totalPrice = 0;

  for (let i = 0; i < myLength; i++) {
    totalPrice += itemQuantity[i].valueAsNumber * kanap.price;
  }

  let updatePriceAndQuantity = document.getElementById('totalPrice');
  let productUpdatePriceAndQuantity = document.getElementById('totalQuantity');
  updatePriceAndQuantity.innerHTML = totalPrice;
  productUpdatePriceAndQuantity.textContent = itemToUpdate;
}

const schemas = {
  letters: {
    regex: /^[A-Za-zÀ-ÿ-' ]{3,}$/g,
    message: 'Minimum 3 caractères, lettres uniquement',
  },
  lettersDigits: {
    regex: /^[0-9A-Za-zÀ-ÿ-', ]{3,}$/g,
    message: 'Minimum 3 caractères, chiffres et lettres uniquement',
  },
  email: {
    regex:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: 'Adresse email non valide',
  },
};

// Validate an input and display message if error
const validateInput = (e, schema) => {
  const inputElem = e.target;
  const inputErrorElem = inputElem.nextElementSibling;
  const inputValue = inputElem.value.trim();

  let isValid = false;
  let errorMessage = schema.message;

  if (inputValue && inputValue.match(schema.regex)) {
    isValid = true;
    errorMessage = '';
  }

  inputElem.valid = isValid;
  inputErrorElem.textContent = errorMessage;
};

const getOrderData = () => {
  const kanap = cart.map((i) => i._id);
  const contact = {
    firstName: firstNameInputElem.value.trim(),
    lastName: lastNameInputElem.value.trim(),
    address: addressInputElem.value.trim(),
    city: cityInputElem.value.trim(),
    email: emailInputElem.value.trim(),
  };
  return { kanap, contact };
};

const sendOrder = async () => {
  try {
    const order = getOrderData();

    if (order.kanap.length)
      throw Error('Attention, votre panier doit contenir au moins 1 article');

    const { orderId } = await fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: order,
    });

    localStorage.removeItem('kanap');
    window.location.replace(`confirmation.html?order=${orderId}`);
  } catch (e) {
    alert(e.message);
  }
};

const handleorderFormElem = (e) => {
  e.preventDefault();

  const inputElems = Array.from(
    e.target.querySelectorAll('input:not([type=submit])')
  );
  const hasErrors = inputElems.map((i) => i.valid).includes(false);

  if (hasErrors) return;

  sendOrder();
};

const orderFormElem = document.querySelector('.cart__order__form');
const firstNameInputElem = document.querySelector('#firstName');
const lastNameInputElem = document.querySelector('#lastName');
const addressInputElem = document.querySelector('#address');
const cityInputElem = document.querySelector('#city');
const emailInputElem = document.querySelector('#email');

orderFormElem.addEventListener('submit', handleorderFormElem);
firstNameInputElem.addEventListener('input', (e) =>
  validateInput(e, schemas.letters)
);
lastNameInputElem.addEventListener('input', (e) =>
  validateInput(e, schemas.letters)
);
addressInputElem.addEventListener('input', (e) =>
  validateInput(e, schemas.lettersDigits)
);
cityInputElem.addEventListener('input', (e) =>
  validateInput(e, schemas.letters)
);
emailInputElem.addEventListener('input', (e) =>
  validateInput(e, schemas.email)
);