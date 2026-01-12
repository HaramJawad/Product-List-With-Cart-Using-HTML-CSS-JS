const addToCartContainers = document.querySelectorAll('.addToCartContainer')
const cartSection = document.querySelector('.cart-section')
const cartSectionImg = document.querySelector('.cart-section-img')
const cartSectionParagraph = document.querySelector('.cart-section-paragraph')
const allItemsList = document.getElementById('all-items-lists')
const TotalOrder = document.querySelector('.total-order')
const deliveryType = document.querySelector('.delivery-type')
const orderConfirmedContainer = document.querySelector('.order-confirmed-container')
const orderContent = document.querySelector('.order-content')
const productsAmount = document.getElementById('products-amount')
const mainContainer = document.querySelector('.main-container')
// array for storing the products
let cart = [];
//  Load previous cart from local storage (if available)
cart = JSON.parse(localStorage.getItem("cart")) || [];
if (cart.length > 0) {
    showingProductsInCart(); // to show saved items on page load
}
let productObj;
// save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}
// adding products in cart array when user clicks addToCart button
function addingProductsToCart(element) {
    let parentDiv = element.closest('.product')
    const id = parentDiv.id
    let productName = parentDiv.querySelector(".full-name").textContent
    let priceText = parentDiv.querySelector(".price").textContent
    let productPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')); // removes $ and converts to number
    let productImage = parentDiv.querySelector(".product-img").src
    productObj = { name: productName, price: productPrice, quantity: 1, image: productImage, id: id }
    const existingProductIndex = cart.findIndex(item => item.id === productObj.id);
    if (existingProductIndex > -1) {
        // If product exists, increment its quantity
        cart[existingProductIndex].quantity++;
    } else {
        // If product is new, add it to the cart with quantity 1
        cart.push({ ...productObj, quantity: 1 });
    }
    saveCart() //  save after adding
}
// deleting products from cart + updating DOM
function deleteProductsFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    // updating the UI
    showingProductsInCart();
    //  Restore original "Add to Cart" button in product grid
    const productDiv = document.getElementById(productId);
    const addToCartBtn = productDiv.querySelector('.addToCartContainer');
    const qtyButton = productDiv.querySelector('.button-container');
    if (qtyButton) {
        qtyButton.remove(); // remove the +/- quantity buttons
    }
    addToCartBtn.style.display = 'flex'; // show the original add to cart
    saveCart() //  save after removing
}
// calculating total products amount
function totalProductsAmount() {
    const totalProductsAmount = cart.reduce((sum, c) => sum + c.quantity, 0)
    productsAmount.textContent = `Your Cart(${totalProductsAmount})`
    // give it the .productsAmount class
    productsAmount.classList.add("productsAmount")
}
// calculate total Order amount
function calculateTotalOrder() {
    let totalOrder = 0;
    cart.forEach(item => {
        totalOrder += item.price * item.quantity;
    });
    showingTotalOrder(totalOrder)
}
//displaying totalOrder on DOM
function showingTotalOrder(totalOrder) {
    TotalOrder.textContent = ""
    if (cart.length === 0) {
        return;
    }
    const orderTotalHeadingDiv = document.createElement('div')
    const orderTotalHeadingParagraph = document.createElement('p')
    orderTotalHeadingParagraph.textContent = "Order Total"
    orderTotalHeadingDiv.appendChild(orderTotalHeadingParagraph)
    TotalOrder.appendChild(orderTotalHeadingDiv)
    const orderTotalPriceDiv = document.createElement('div')
    const orderTotalPrice = document.createElement('h2')
    orderTotalPrice.textContent = `$${totalOrder.toFixed(2)}`
    orderTotalPriceDiv.appendChild(orderTotalPrice)
    TotalOrder.appendChild(orderTotalPriceDiv)
}
function showingOtherDetails() {
    if (cart.length === 0) {
        deliveryType.textContent = ""
        deliveryType.classList.remove("deliveryType")
        const oldBtn = document.querySelector(".confirmOrder");
        if (oldBtn) oldBtn.remove(); // remove button when cart is empty
        return;
    }
    // remove any previous Confirm Order button
    const oldBtn = document.querySelector(".confirmOrder");
    if (oldBtn) oldBtn.remove();
    // clearing the DOM(deliveryType Div)
    deliveryType.textContent = ""
    deliveryType.classList.add("deliveryType")
    const deliveryImgContainer = document.createElement('div')
    const deliveryImg = document.createElement('img')
    deliveryImg.src = "assets/images/icon-carbon-neutral.svg"
    deliveryImg.alt = "image"
    deliveryImgContainer.appendChild(deliveryImg)
    deliveryType.appendChild(deliveryImgContainer)
    const deliveryParagraphContainer = document.createElement('div')
    const deliveryParagraph = document.createElement('p')
    deliveryParagraph.textContent = "This is a carbon-neutral delivery"
    deliveryParagraphContainer.appendChild(deliveryParagraph)
    deliveryType.appendChild(deliveryParagraphContainer)

    // making a confirmOrderButton
    const confirmOrderButton = document.createElement('button')
    confirmOrderButton.classList.add("confirmOrder")
    confirmOrderButton.textContent = "Confirm Order"
    cartSection.insertBefore(confirmOrderButton, cartSectionImg)
}
function showingProductsInCart() {
    if (cart.length === 0) {
        cartSectionImg.style.display = "block";
        cartSectionParagraph.style.display = "block";
        productsAmount.textContent = 'Your Cart(0)'
        // clearing the DOM
        allItemsList.textContent = ""
        calculateTotalOrder()
        showingOtherDetails()
        return;
    }
    // clearing the default img and paragraph from cart section
    productsAmount.textContent = ""
    cartSectionImg.style.display = "none"
    cartSectionParagraph.style.display = "none"
    // clearing the DOM
    allItemsList.textContent = ""
    // totalProductsAmount
    totalProductsAmount()
    // loop through cart array 
    cart.forEach((c) => {
        const itemsList = document.createElement('li')
        // give it the .itemsList class
        itemsList.classList.add("itemsList");
        const productDiv = document.createElement('div')
        const itemName = document.createElement('p')
        itemName.textContent = c.name
        // give it the .itemName class
        itemName.classList.add("itemName")
        productDiv.appendChild(itemName)
        const itemQuantity = document.createElement('span')
        itemQuantity.textContent = `${c.quantity}x`
        //give it the .itemQuantity class
        itemQuantity.classList.add("itemQuantity")
        productDiv.appendChild(itemQuantity)
        const itemPrice = document.createElement('span')
        itemPrice.textContent = `@ $${c.price.toFixed(2)}`
        // give it the .itemPrice class
        itemPrice.classList.add("itemPrice")
        productDiv.appendChild(itemPrice)
        const totalPrice = c.price * c.quantity
        const itemTotalPrice = document.createElement('span')
        itemTotalPrice.textContent = `$${totalPrice.toFixed(2)}`
        //give it the .itemTotalPrice class
        itemTotalPrice.classList.add("itemTotalPrice")
        productDiv.appendChild(itemTotalPrice)
        itemsList.appendChild(productDiv)
        const deleteProductDiv = document.createElement('div')
        // giving class to the deleteProductDiv 
        deleteProductDiv.classList.add("deleteProductDiv")
        const deleteProductImg = document.createElement('img')
        // giving class to the deleteProductImg
        deleteProductImg.classList.add("deleteProductImg")
        deleteProductImg.src = "assets/images/icon-remove-item.svg"
        deleteProductImg.alt = "image"
        deleteProductImg.dataset.id = c.id;
        deleteProductDiv.appendChild(deleteProductImg)
        itemsList.appendChild(deleteProductDiv)
        allItemsList.appendChild(itemsList)
        //  Add the event listener on each deleteProductImg
        deleteProductImg.addEventListener("click", (event) => {
            const productId = event.target.dataset.id;
            deleteProductsFromCart(productId)
        });
    })
    calculateTotalOrder()
    showingOtherDetails()
}
// showing quantityIncrementDecrement option on each product
function showingQuantityIncrementDecrement(element) {
    // creating new buttonContainer
    const buttonContainer = document.createElement('div')
    // give it the  class button-container
    buttonContainer.classList.add("button-container");
    const decrementImg = document.createElement('img')
    decrementImg.src = "assets/images/icon-decrement-quantity.svg"
    decrementImg.alt = "image"
    decrementImg.classList.add('decrement-img')
    const decrementBtn = document.createElement('button')
    decrementBtn.classList.add("decrement-btn")
    decrementBtn.appendChild(decrementImg)
    buttonContainer.appendChild(decrementBtn)
    const productQuantity = document.createElement('span')
    let parentDiv = element.closest('.product')
    const id = parentDiv.id
    const shortTermName = parentDiv.querySelector('.short-name')
    const specificProduct = cart.find(item => item.id === id);
    const Quantity = specificProduct.quantity;
    productQuantity.textContent = Quantity;
    buttonContainer.appendChild(productQuantity)
    const incrementImg = document.createElement('img')
    incrementImg.src = "assets/images/icon-increment-quantity.svg"
    incrementImg.alt = "image"
    incrementImg.classList.add('increment-img')
    const incrementBtn = document.createElement('button')
    incrementBtn.classList.add("increment-btn")
    incrementBtn.appendChild(incrementImg)
    buttonContainer.appendChild(incrementBtn)
    // style to addToCartContainer
    element.style.display = "none"
    // appendTo parentDiv (.product)
    parentDiv.insertBefore(buttonContainer, shortTermName);
    // decrementing the product's quantity
    decrementBtn.addEventListener('click', () => {
        const specificProduct = cart.find(item => item.id === id);
        if (specificProduct.quantity > 1)
            specificProduct.quantity--;
        productQuantity.textContent = specificProduct.quantity;
        showingProductsInCart()
        saveCart();
    })
    // incrementing the product's quantity
    incrementBtn.addEventListener('click', () => {
        const specificProduct = cart.find(item => item.id === id);
        specificProduct.quantity++;
        productQuantity.textContent = specificProduct.quantity;
        showingProductsInCart()
        saveCart()
    })
}
function showingOrderConfirmedProducts() {
    const orderConfirmedProductsUl = document.createElement('ul')
    orderConfirmedProductsUl.classList.add("orderConfirmedProductsUl");
    orderConfirmedContainer.style.display = "block"
    cart.forEach((c) => {
        const orderConfirmedProductsLi = document.createElement('li')
        // give it the .orderConfirmedList style
        orderConfirmedProductsLi.classList.add("orderConfirmedListOne");
        orderConfirmedProductsLi.classList.add("orderConfirmedList");
        const productSection = document.createElement('div')
        // give it the .productSection style
        productSection.classList.add("productSection");
        const productImageContainer = document.createElement('div')
        // give it the .productImgContainer style
        productImageContainer.classList.add("productImgContainer");
        const productImage = document.createElement('img')
        productImage.src = c.image
        productImage.alt = "image"
        // give it the .productImg style
        productImage.classList.add("productImg");
        productImageContainer.appendChild(productImage)
        productSection.appendChild(productImageContainer)
        productDetailsContainer = document.createElement('div')
        const productName = document.createElement('h4')
        productName.textContent = c.name
        productDetailsContainer.appendChild(productName)
        const productQuantity = document.createElement('span')
        productQuantity.textContent = `${c.quantity}x`
        productDetailsContainer.appendChild(productQuantity)
        const productPrice = document.createElement('span')
        productPrice.textContent = `@ $${c.price.toFixed(2)}`
        productDetailsContainer.appendChild(productPrice)
        productSection.appendChild(productDetailsContainer)
        orderConfirmedProductsLi.appendChild(productSection)
        const totalSection = document.createElement('div')
        const totalProductAmount = c.price * c.quantity
        totalSection.textContent = `$${totalProductAmount.toFixed(2)}`
        orderConfirmedProductsLi.appendChild(totalSection)
        orderConfirmedProductsUl.appendChild(orderConfirmedProductsLi)
        orderContent.appendChild(orderConfirmedProductsUl)
    })
    const orderConfirmedProductTotalLi = document.createElement('li')
    // give it the .orderConfirmedTotalList style
    orderConfirmedProductTotalLi.classList.add("orderConfirmedTotalListTwo");
    orderConfirmedProductTotalLi.classList.add("orderConfirmedList");
    const orderTotalDiv = document.createElement('div')
    const orderTotalParagraph = document.createElement('p')
    orderTotalParagraph.textContent = "Order Total"
    orderTotalDiv.appendChild(orderTotalParagraph)
    orderConfirmedProductTotalLi.appendChild(orderTotalDiv)
    const orderTotalPriceDiv = document.createElement('div')
    const orderTotalPriceHeading = document.createElement('h2')
    let totalOrder = 0;
    cart.forEach(item => {
        totalOrder += item.price * item.quantity;
    });
    orderTotalPriceHeading.textContent = `$${totalOrder.toFixed(2)}`;
    orderTotalPriceDiv.appendChild(orderTotalPriceHeading)
    orderConfirmedProductTotalLi.appendChild(orderTotalPriceDiv)
    orderConfirmedProductsUl.appendChild(orderConfirmedProductTotalLi)
    orderContent.appendChild(orderConfirmedProductsUl)
    const startNewOrderButton = document.createElement('button')
    // give it the .orderConfirmedTotalList style
    startNewOrderButton.classList.add("startNewOrderButton");
    startNewOrderButton.textContent = "Start New Order"
    orderContent.appendChild(startNewOrderButton)
    // when clicking the startNewOrderButton
    startNewOrderButton.addEventListener('click', () => {
        // logic for each product item
        cart.forEach((c) => {
            // the id of each item
            const id = c.id;
            // get its productDiv
            const productDiv = document.getElementById(id)
            // get its addtoCartContainerBtn
            const addToCartContainer = productDiv.querySelector('.addToCartContainer')
            // get its qryButton
            const qryButton = productDiv.querySelector('.button-container')
            // remove qryButton
            if (qryButton) {
                qryButton.remove();
                // display addToCartBtn
                addToCartContainer.style.display = "flex"
            }
        });
        localStorage.removeItem("cart");
        // clearing the cart array
        cart = [];
        // update UI
        showingProductsInCart()
        orderConfirmedContainer.style.display = "none";
        document.querySelector(".overlay")?.remove();

    })
}
// loop through each addToCart button
for (let index = 0; index < addToCartContainers.length; index++) {
    const element = addToCartContainers[index];
    // click event on each button
    element.addEventListener('click', () => {
        // adding products data in cart array
        addingProductsToCart(element);
        // showing products on dom in cart section
        showingProductsInCart()
        // showingQuantityIncrementDecrement for each product
        showingQuantityIncrementDecrement(element)
    })
}
function modalOverlayEffectOnMain() {
    // make a new div
    const overlay = document.createElement("div");
    // give it the .overlay style
    overlay.classList.add("overlay");
    // add it to the page
    document.body.appendChild(overlay);
    // click on overlay (outside the order-confirmed-container)
    overlay.addEventListener('click', () => {
        // remove the orderConfirmedContainer 
        orderConfirmedContainer.style.display = "none"
        // remove the overlay 
        overlay.remove();
    })
}
const confirmBtn = document.querySelector(".confirmOrder");
cartSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('confirmOrder')) {
        // clearing the UI (orderConfirmedContainer)
        orderContent.textContent = ""
        const orderConfirmedImg = document.createElement('img')
        orderConfirmedImg.src = "assets/images/icon-order-confirmed.svg"
        orderConfirmedImg.alt = "image"
        orderContent.appendChild(orderConfirmedImg)
        const orderConfirmedHeading = document.createElement('h2')
        orderConfirmedHeading.textContent = "Order Confirmed"
        orderContent.appendChild(orderConfirmedHeading)
        const orderConfirmedParagraph = document.createElement('p')
        orderConfirmedParagraph.textContent = "We hope you enjoy your food!"
        orderContent.appendChild(orderConfirmedParagraph)
        showingOrderConfirmedProducts()
        modalOverlayEffectOnMain()
    }
})





