/* =====================================================
   NURTURED BY MEL
   Products Page
   Vanilla JavaScript
   ===================================================== */


/* =====================================================
   CONFIGURATION
   ===================================================== */

const PRODUCTS_URL = "data/products.json";

const CART_KEY = "nurturedByMelCart";


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const productGrid =
    document.querySelector("#product-grid");

const searchInput =
    document.querySelector("#product-search");

const categoryFilter =
    document.querySelector("#category-filter");

const sortSelect =
    document.querySelector("#sort-products");

const productMessage =
    document.querySelector("#product-message");

const cartCount =
    document.querySelector("#cart-count");


/* =====================================================
   APPLICATION STATE
   ===================================================== */

let products = [];

let filteredProducts = [];


/* =====================================================
   LOAD PRODUCTS
   ===================================================== */

async function loadProducts() {

    if (!productGrid) {
        return;
    }

    showMessage("Loading our hair-care collection...");

    try {

        const response =
            await fetch(PRODUCTS_URL);


        if (!response.ok) {

            throw new Error(
                `Unable to load products: ${response.status}`
            );

        }


        products =
            await response.json();


        filteredProducts =
            [...products];


        createCategoryOptions();

        displayProducts();

        updateCartCount();

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        showMessage(
            "Sorry, we could not load the products. Please try again later.",
            true
        );

    }

}


/* =====================================================
   CREATE CATEGORY OPTIONS
   ===================================================== */

function createCategoryOptions() {

    if (!categoryFilter) {
        return;
    }


    const categories =
        [
            ...new Set(
                products.map(
                    (product) => product.category
                )
            )
        ].sort();


    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;


    categories.forEach(
        (category) => {

            const option =
                document.createElement("option");

            option.value = category;

            option.textContent = category;

            categoryFilter.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   DISPLAY PRODUCTS
   ===================================================== */

function displayProducts() {

    if (!productGrid) {
        return;
    }


    productGrid.innerHTML = "";


    if (filteredProducts.length === 0) {

        showMessage(
            "No products matched your search."
        );

        return;

    }


    hideMessage();


    filteredProducts.forEach(
        (product) => {

            const card =
                createProductCard(product);


            productGrid.appendChild(card);

        }
    );

}


/* =====================================================
   CREATE PRODUCT CARD
   ===================================================== */

function createProductCard(product) {

    const article =
        document.createElement("article");

    article.className =
        "product-card";


    /* Product image */

    const image =
        document.createElement("img");

    image.className =
        "product-image";

    image.src =
        product.image;

    image.alt =
        product.name;

    image.loading =
        "lazy";


    image.addEventListener(
        "error",
        () => {

            image.src =
                "images/hero.webp";

            image.alt =
                `${product.name} product image unavailable`;

        }
    );


    /* Product content */

    const content =
        document.createElement("div");

    content.className =
        "product-card-content";


    /* Category */

    const category =
        document.createElement("p");

    category.className =
        "product-category";

    category.textContent =
        product.category;


    /* Name */

    const name =
        document.createElement("h2");

    name.className =
        "product-name";

    name.textContent =
        product.name;


    /* Description */

    const description =
        document.createElement("p");

    description.className =
        "product-description";

    description.textContent =
        product.description;


    /* Bottom row */

    const bottom =
        document.createElement("div");

    bottom.className =
        "product-card-bottom";


    /* Price */

    const price =
        document.createElement("strong");

    price.className =
        "product-price";

    price.textContent =
        formatCurrency(product.price);


    /* Add to cart button */

    const button =
        document.createElement("button");

    button.className =
        "button button-primary add-to-cart";

    button.type =
        "button";

    button.textContent =
        "Add to Cart";

    button.setAttribute(
        "aria-label",
        `Add ${product.name} to cart`
    );


    button.addEventListener(
        "click",
        () => {

            addToCart(product);

        }
    );


    /* Featured badge */

    if (product.featured) {

        const badge =
            document.createElement("span");

        badge.className =
            "product-badge";

        badge.textContent =
            "Featured";

        article.appendChild(badge);

    }


    bottom.append(
        price,
        button
    );


    content.append(
        category,
        name,
        description,
        bottom
    );


    article.append(
        image,
        content
    );


    return article;

}


/* =====================================================
   FORMAT CURRENCY
   ===================================================== */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-ZA",
        {
            style: "currency",
            currency: "ZAR"
        }
    ).format(amount);

}


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(product) {

    const cart =
        getCart();


    const existingProduct =
        cart.find(
            (item) =>
                item.id === product.id
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart(cart);

    updateCartCount();

    showCartConfirmation(
        product.name
    );

}


/* =====================================================
   GET CART
   ===================================================== */

function getCart() {

    try {

        const savedCart =
            localStorage.getItem(
                CART_KEY
            );


        if (!savedCart) {
            return [];
        }


        const cart =
            JSON.parse(savedCart);


        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Could not read cart:",
            error
        );

        return [];

    }

}


/* =====================================================
   SAVE CART
   ===================================================== */

function saveCart(cart) {

    try {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Could not save cart:",
            error
        );

    }

}


/* =====================================================
   UPDATE CART COUNT
   ===================================================== */

function updateCartCount() {

    if (!cartCount) {
        return;
    }


    const cart =
        getCart();


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;


    cartCount.setAttribute(
        "aria-label",
        `${totalItems} ${
            totalItems === 1
                ? "item"
                : "items"
        } in cart`
    );

}


/* =====================================================
   CART CONFIRMATION
   ===================================================== */

function showCartConfirmation(
    productName
) {

    if (!productMessage) {
        return;
    }


    productMessage.textContent =
        `${productName} has been added to your cart.`;


    productMessage.hidden =
        false;


    productMessage.classList.add(
        "success-message"
    );


    window.setTimeout(
        () => {

            productMessage.hidden =
                true;

        },
        3000
    );

}


/* =====================================================
   SEARCH AND FILTER
   ===================================================== */

function filterProducts() {

    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    filteredProducts =
        products.filter(
            (product) => {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchTerm) ||

                    product.description
                        .toLowerCase()
                        .includes(searchTerm) ||

                    product.category
                        .toLowerCase()
                        .includes(searchTerm) ||

                    product.tags.some(
                        (tag) =>
                            tag
                                .toLowerCase()
                                .includes(searchTerm)
                    );


                const matchesCategory =
                    selectedCategory === "all" ||
                    product.category ===
                        selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    sortProducts();

}


/* =====================================================
   SORT PRODUCTS
   ===================================================== */

function sortProducts() {

    const sortValue =
        sortSelect
            ? sortSelect.value
            : "default";


    if (sortValue === "name-asc") {

        filteredProducts.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    if (sortValue === "price-low") {

        filteredProducts.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sortValue === "price-high") {

        filteredProducts.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (sortValue === "featured") {

        filteredProducts.sort(
            (a, b) =>
                Number(b.featured) -
                Number(a.featured)
        );

    }


    displayProducts();

}


/* =====================================================
   EVENT LISTENERS
   ===================================================== */

searchInput?.addEventListener(
    "input",
    filterProducts
);


categoryFilter?.addEventListener(
    "change",
    filterProducts
);


sortSelect?.addEventListener(
    "change",
    sortProducts
);


/* =====================================================
   MESSAGE HELPERS
   ===================================================== */

function showMessage(
    message,
    isError = false
) {

    if (!productMessage) {
        return;
    }


    productMessage.textContent =
        message;


    productMessage.hidden =
        false;


    productMessage.classList.toggle(
        "error-message",
        isError
    );

}


function hideMessage() {

    if (!productMessage) {
        return;
    }


    productMessage.hidden =
        true;

}


/* =====================================================
   START APPLICATION
   ===================================================== */

loadProducts();