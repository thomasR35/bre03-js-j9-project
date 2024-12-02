let url = "https://dummyjson.com/products?limit=12";
let isFavFiltered = false;
let sessionFavorites = [];
const galery = document.querySelector(".grid-container");
let loadedProducts;
const favButton = document.querySelector(".fav-button");

async function getProduces() {
  console.log("loading produces");
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function getLocalStorageFavourite() {
  if (localStorage.getItem("favourites")) {
    return JSON.parse(localStorage.getItem("favourites"));
  }
  return [];
}

function syncLocalStorageFavourite() {
  localStorage.setItem("favourites", JSON.stringify(sessionFavorites));
}

function addToFavourite(productId) {
  sessionFavorites.push(productId);
  syncLocalStorageFavourite();
}

function removeFromFavourites(productId) {
  sessionFavorites = sessionFavorites.filter((currId) => productId !== currId);
  syncLocalStorageFavourite();
}

function isInfavourites(productId) {
  return sessionFavorites.some((currId) => productId === currId);
}

function toggleFavourite(productId) {
  if (isInfavourites(productId)) {
    removeFromFavourites(productId);
  } else {
    addToFavourite(productId);
  }
  console.log(sessionFavorites);
}

function createFavouriteButton(productId) {
  const button = document.createElement("button");
  button.classList.add("favorite");
  const i = document.createElement("i");
  let fav = isInfavourites(productId);
  const classes = fav
    ? ["fa-solid", "fa-heart", "rose"]
    : ["fa-regular", "fa-heart", "rose"];

  i.classList.add(...classes);

  button.addEventListener("click", () => {
    toggleFavourite(productId);

    i.classList.toggle("fa-solid");
    i.classList.toggle("fa-regular");
    refreshWithFilters();
  });

  button.append(i);

  return button;
}

function createElement(tag, className, textContent = undefined) {
  const element = document.createElement(tag);
  element.classList.add(className);
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function createArticle(product) {
  const article = createElement("article", "grid-item");

  //-------------top-------------
  const top = createElement("figure", "item-image");
  const img = createElement("img", "img");
  img.src = product.images[0];

  top.append(img);
  //-----------------------------
  //-------------bot--------------
  const bot = createElement("div", "item-info");
  //title
  const h3 = createElement("h3", "product-title", product.title);

  //category-fav
  const categoryFavDiv = createElement("div", "category-line");
  const span = createElement("span", "category", product.category);
  categoryFavDiv.append(span, createFavouriteButton(product.id));

  //priceButton
  const priceButtonDiv = createElement("div", "price-button-container");
  priceButtonDiv.append(
    createElement("p", "price", product.price),
    createElement("button", "add-to-basket", "Ajouter au panier")
  );

  bot.append(h3, categoryFavDiv, priceButtonDiv);
  //-------------------------------------------

  article.append(top, bot);

  return article;
}

const handleFilterClick = () => {
  isFavFiltered = !isFavFiltered;
  refreshWithFilters();
};

function render() {
  sessionFavorites = getLocalStorageFavourite();
  console.log(sessionFavorites);
  getProduces().then((data) => {
    loadedProducts = data.products;
    loadedProducts.forEach((product) => {
      galery.append(createArticle(product));
    });
  });
}

function clear() {
  while (galery.firstChild) {
    galery.firstChild.remove();
  }
}

function refreshWithFilters() {
  clear();
  if (sessionFavorites.length > 0) {
    favButton.style.visibility = "visible";
  }
  (isFavFiltered
    ? loadedProducts.filter((product) => isInfavourites(product.id))
    : loadedProducts
  ).forEach((product) => {
    galery.append(createArticle(product));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();

  favButton.addEventListener("click", handleFilterClick);
  favButton.style.visibility = "hidden";
});
