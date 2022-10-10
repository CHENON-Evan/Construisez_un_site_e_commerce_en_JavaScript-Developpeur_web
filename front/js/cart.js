const cart = []

retrieveProductsFromLocalStorage()
cart.forEach((product) => displayProduct(product))

function retrieveProductsFromLocalStorage() {
    const numberOfProducts = localStorage.length
    for (let i = 0; i < numberOfProducts; i++) {
        console.log(i)
        const product = localStorage.getItem(localStorage.key(i))
        console.log("objet à la position", i, "est", product)
        const productObject = JSON.parse(product)
        cart.push(productObject)
    }
}

function displayProduct(product) {
    const article = makeArticle(product)
    const divImage = makeImage(product)
    article.appendChild(divImage)
    const cardProductContent = makeCartContent(product)
    article.appendChild(cardProductContent)
    displayArticle(article)
}

function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}

function makeArticle(product) {
    const article = document.createElement("article")
    article.classList.add("card__item")
    article.dataset.id = product.id
    article.dataset.color = product.color
    return article
}

function makeImage(product) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement('img')
    image.src = product.imageUrl
    image.alt = product.altTxt
    div.appendChild(image)
    return div
}

function makeCartContent(product) {
    const cardProductContent = document.createElement("div")
    cardProductContent.classList.add("cart__item__content")
}