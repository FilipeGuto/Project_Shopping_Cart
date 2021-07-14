const containerFather = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveLocalStorage() {
  const productCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('shopCart', productCart);
}

function addEventBtnCart() {
  const btnCart = document.querySelector('.empty-cart');
  btnCart.addEventListener('click', () => {
    containerFather.innerHTML = '';
  });
}

function cartItemClickListener(event) {
  event.target.remove();
}

// Ajuda Eduardo Prando e Manoel na 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const productCart = (event) => {
  const evento = event.target;
  const ids = getSkuFromProductItem(evento.parentNode);
  fetch(`https://api.mercadolibre.com/items/${ids}`)
    .then((response) => response.json())
    .then((object) => containerFather.appendChild(createCartItemElement(object)))
    .then(saveLocalStorage);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', productCart);

  return section;
}

const textLoading = document.createElement('h2');

function createLoading() {
  const father = document.querySelector('.items');
  textLoading.className = 'loading';
  textLoading.innerText = 'Loading';
  father.appendChild(textLoading);
}

function removeLoading() {
  textLoading.remove();
}

function createListProducts() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoading();
  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((items) => {
        const objetos = {
          sku: items.id,
          name: items.title,
          salePrice: items.price,
          image: items.thumbnail,
        };
        const father = document.querySelector('.items');
        father.appendChild(createProductItemElement(objetos));
      });
      removeLoading();
    })
    .catch((error) => error);
}

function getLocalStorage() {
  const productValue = localStorage.getItem('shopCart');
    containerFather.innerHTML = productValue;
}

window.onload = () => {
  createListProducts();
  addEventBtnCart();
  getLocalStorage();
};
