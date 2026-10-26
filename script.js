/* =========================
   VARIABLES
========================= */

const productsContainer =
    document.getElementById("productsContainer");

const noProducts =
    document.getElementById("noProducts");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const wishlistCount =
    document.getElementById("wishlistCount");

const overlay =
    document.getElementById("overlay");


let products = [];

let cart =
    JSON.parse(localStorage.getItem("gloweCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("gloweWishlist")) || [];


/* =========================
   LOADER
========================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        document
            .getElementById("loader")
            .classList.add("hide");

    }, 800);

});


/* =========================
   FETCH PRODUCTS
========================= */

async function getProducts() {

    try {

        productsContainer.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;">
                Loading products...
            </p>
        `;

        const response =
            await fetch(
                "https://dummyjson.com/products/category/beauty"
            );

        const data =
            await response.json();

        products = data.products;

        displayProducts(products);

    }

    catch (error) {

        console.log(error);

        productsContainer.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;">
                Failed to load products.
            </p>
        `;

    }

}

getProducts();


/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts(productList) {

    productsContainer.innerHTML = "";

    if (productList.length === 0) {

        noProducts.style.display = "block";

        return;

    }

    noProducts.style.display = "none";


    productList.forEach(product => {

        const isLiked =
            wishlist.includes(product.id);


        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <button
                    class="wishlist ${isLiked ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})">

                    <i class="${isLiked
                        ? "fa-solid"
                        : "fa-regular"
                    } fa-heart"></i>

                </button>

                <img
                    src="${product.thumbnail}"
                    alt="${product.title}"
                    loading="lazy"
                >

            </div>


            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <div class="rating">

                    ${getStars(product.rating)}

                    <span>
                        ${product.rating}
                    </span>

                </div>


                <div class="product-bottom">

                    <div class="price">
                        $${product.price}
                    </div>

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})">

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

            </div>
        `;


        card.addEventListener("click", (event) => {

            if (
                event.target.closest(".wishlist") ||
                event.target.closest(".add-cart")
            ) {
                return;
            }

            showProductDetails(product.id);

        });


        productsContainer.appendChild(card);

    });

}


/* =========================
   STARS
========================= */

function getStars(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= Math.round(rating)) {

            stars +=
                `<i class="fa-solid fa-star"></i>`;

        } else {

            stars +=
                `<i class="fa-regular fa-star"></i>`;

        }

    }

    return stars;

}


/* =========================
   CART
========================= */

function addToCart(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;


    const existing =
        cart.find(item => item.id === id);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    updateCart();

    openCart();

}


function saveCart() {

    localStorage.setItem(
        "gloweCart",
        JSON.stringify(cart)
    );

}


function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;

        count += item.quantity;


        const div =
            document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `

            <img
                src="${item.thumbnail}"
                alt="${item.title}"
            >

            <div>

                <h4>
                    ${item.title}
                </h4>

                <div class="cart-price">
                    $${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}
                </div>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(
                            ${item.id}, -1
                        )">
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(
                            ${item.id}, 1
                        )">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${item.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;


        cartItems.appendChild(div);

    });


    cartCount.textContent = count;

    cartTotal.textContent =
        `$${total.toFixed(2)}`;


    document.getElementById("cartEmpty")
        .style.display =
        cart.length === 0
            ? "block"
            : "none";

}


function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);

    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);

    }


    saveCart();

    updateCart();

}


function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);

    saveCart();

    updateCart();

}


updateCart();


/* =========================
   CART OPEN/CLOSE
========================= */

document
    .getElementById("cartBtn")
    .addEventListener("click", openCart);


document
    .getElementById("closeCart")
    .addEventListener("click", closeCart);


overlay.addEventListener("click", closeCart);


function openCart() {

    cartSidebar.classList.add("open");

    overlay.classList.add("show");

}


function closeCart() {

    cartSidebar.classList.remove("open");

    overlay.classList.remove("show");

}


/* =========================
   WISHLIST
========================= */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                productId => productId !== id
            );

    } else {

        wishlist.push(id);

    }


    localStorage.setItem(
        "gloweWishlist",
        JSON.stringify(wishlist)
    );


    wishlistCount.textContent =
        wishlist.length;


    displayProducts(
        getCurrentProducts()
    );

}


wishlistCount.textContent =
    wishlist.length;


/* =========================
   FILTER
========================= */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");


                const filter =
                    button.dataset.filter;


                if (filter === "all") {

                    displayProducts(products);

                } else {

                    const filtered =
                        products.filter(
                            product =>
                                product.category
                                    .toLowerCase()
                                    .includes(filter)
                        );

                    displayProducts(filtered);

                }

            }
        );

    });


/* =========================
   CATEGORY BUTTONS
========================= */

document
    .querySelectorAll(".category-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;

                const filtered =
                    products.filter(product =>
                        product.category
                            .toLowerCase()
                            .includes(category)
                    );


                document
                    .getElementById("products")
                    .scrollIntoView({
                        behavior: "smooth"
                    });


                displayProducts(filtered);

            }
        );

    });


/* =========================
   SORT
========================= */

document
    .getElementById("sortProducts")
    .addEventListener(
        "change",
        function () {

            let sorted =
                [...getCurrentProducts()];


            if (this.value === "low") {

                sorted.sort(
                    (a, b) =>
                        a.price - b.price
                );

            }


            if (this.value === "high") {

                sorted.sort(
                    (a, b) =>
                        b.price - a.price
                );

            }


            if (this.value === "rating") {

                sorted.sort(
                    (a, b) =>
                        b.rating - a.rating
                );

            }


            displayProducts(sorted);

        }
    );


function getCurrentProducts() {

    const active =
        document.querySelector(
            ".filter.active"
        );


    if (!active ||
        active.dataset.filter === "all") {

        return products;

    }


    return products.filter(product =>
        product.category
            .toLowerCase()
            .includes(
                active.dataset.filter
            )
    );

}


/* =========================
   SEARCH
========================= */

const searchBox =
    document.getElementById("searchBox");


document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        () => {

            searchBox.classList.toggle("show");

            document
                .getElementById("searchInput")
                .focus();

        }
    );


document
    .getElementById("closeSearch")
    .addEventListener(
        "click",
        () => {

            searchBox.classList.remove("show");

        }
    );


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function () {

            const value =
                this.value.toLowerCase().trim();


            const filtered =
                products.filter(product =>

                    product.title
                        .toLowerCase()
                        .includes(value)

                );


            displayProducts(filtered);

        }
    );


/* =========================
   PRODUCT DETAILS
========================= */

function showProductDetails(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;


    const details =
        document.getElementById(
            "productDetails"
        );


    details.innerHTML = `

        <div class="product-detail">

            <img
                src="${product.thumbnail}"
                alt="${product.title}"
            >

            <div>

                <p class="product-category">
                    ${product.category}
                </p>

                <h2>
                    ${product.title}
                </h2>

                <div class="rating">
                    ${getStars(product.rating)}
                    <span>
                        ${product.rating}
                    </span>
                </div>

                <div class="detail-price">
                    $${product.price}
                </div>

                <p class="detail-description">
                    ${product.description}
                </p>

                <button
                    class="btn"
                    onclick="addToCart(${product.id});
                    closeProductModal();">

                    Add To Cart

                </button>

            </div>

        </div>

    `;


    document
        .getElementById("productModal")
        .classList.add("show");

}


document
    .getElementById("closeProductModal")
    .addEventListener(
        "click",
        closeProductModal
    );


function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("show");

}


/* =========================
   LOGIN
========================= */

document
    .getElementById("loginBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("loginModal")
                .classList.add("show");

        }
    );


document
    .getElementById("closeLogin")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("loginModal")
                .classList.remove("show");

        }
    );


document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert("Login successful! ✨");

            this.reset();

            document
                .getElementById("loginModal")
                .classList.remove("show");

        }
    );


/* =========================
   MOBILE MENU
========================= */

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            document
                .querySelector(".nav-links")
                .classList.toggle("active");

        }
    );


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                document
                    .querySelector(".nav-links")
                    .classList.remove("active");

            }
        );

    });


/* =========================
   NEWSLETTER
========================= */

document
    .getElementById("newsletterForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById(
                        "newsletterEmail"
                    ).value;


            alert(
                `Thank you! ${email} is subscribed. 💕`
            );


            this.reset();

        }
    );


/* =========================
   CHECKOUT
========================= */

document
    .getElementById("checkoutBtn")
    .addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );

                return;

            }


            alert(
                "Checkout feature coming soon! 🛍️"
            );

        }
    );