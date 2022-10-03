fetch("http://localhost:3000/api/products/"+ getProductIdFromUrl())
.then((res) => res.json())
.then((kanap) => displayProduct(kanap))

function getProductIdFromUrl(){
    const url = new URL (document.location);
    const id = url.searchParams.get("id");
    return id
}

function displayProduct(kanap){
    const title = document.querySelector("#title")
    title.innerHTML = kanap.name

    const price = document.querySelector("#price")
    price.innerHTML = kanap.price

    const description = document.querySelector("#description")
    description.innerHTML = kanap.description
    
    const image = document.createElement("img")
    image.src = kanap.imageUrl
    image.alt = kanap.altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image)

    const color = document.getElementById("colors");
    for (i = 0; i < kanap.colors.length; i++) {
      color.innerHTML += `<option value="${kanap.colors[i]}">${kanap.colors[i]}</option>`
    }
}