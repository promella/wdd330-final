/* =========================================
   NURTURED BY MEL
   Products Module
   ========================================= */
import products from "../data/products.js";
const productContainer =
    document.querySelector("#product-container");
const searchInput =
    document.querySelector("#product-search");
const categoryFilter =
    document.querySelector("#category-filter");
const sortProducts =
    document.querySelector("#sort-products");
const resultsMessage =
    document.querySelector("#results-message");
/* =========================================
   Format Currency
   ========================================= */
function formatCurrency(price) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR"
    }).format(price);
}
/* =========================================
   Display Products
   ========================================= */
function displayProducts(productList) {
    if (!productContainer) {
        return;
    }
    productContainer.innerHTML = "";
    if (productList.length === 0) {
        productContainer.innerHTML = `
            <div class="no-products">
                <h2>No products found</h2>
                <p>
                    Try changing your search or category.
                </p>
            </div>
        `;
        return;
    }
    productList.forEach((product) => {
        const productCard =
            document.createElement("article");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>
            <div class="product-info">
                <p class="product-category">
                    ${product.category}
                </p>
                <h2>
                    ${product.name}
                </h2>
                <p class="product-description">
                    ${product.description}
                </p>
                <div class="product-bottom">
                    <p class="product-price">
                        ${formatCurrency(product.price)}
                    </p>
                    <button
                        class="button button-primary add-to-cart"
                        type="button"
                        data-product-id="${product.id}"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        productContainer.appendChild(productCard);
    });
    addCartListeners();
    if (resultsMessage) {
        resultsMessage.textContent =
            `${productList.length} product${productList.length === 1 ? "" : "s"
            } found`;
    }
}
/* =========================================
   Add Product to Cart
   ========================================= */
function addToCart(productId) {
    const selectedProduct =
        products.find(
            (product) => product.id === productId
        );
    if (!selectedProduct) {
        return;
    }
    let cart = [];
    try {
        cart =
            JSON.parse(
                localStorage.getItem(
                    "nurturedByMelCart"
                )
            ) || [];
    } catch (error) {
        console.error(
            "Unable to read cart:",
            error
        );
    }
    const existingProduct =
        cart.find(
            (item) => item.id === productId
        );
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,
            quantity: 1
        });
    }
    localStorage.setItem(
        "nurturedByMelCart",
        JSON.stringify(cart)
    );
    updateCartCount();
    showCartMessage(
        `${selectedProduct.name} added to your cart.`
    );
}
/* =========================================
   Cart Button Listeners
   ========================================= */
function addCartListeners() {
    const buttons =
        document.querySelectorAll(".add-to-cart");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId =
                Number(button.dataset.productId);
            addToCart(productId);
        });
    });
}
/* =========================================
   Update Cart Count
   ========================================= */
function updateCartCount() {
    const cartCount =
        document.querySelector("#cart-count");
    if (!cartCount) {
        return;
    }
    let cart = [];
    try {
        cart =
            JSON.parse(
                localStorage.getItem(
                    "nurturedByMelCart"
                )
            ) || [];
    } catch (error) {
        console.error(
            "Unable to update cart count:",
            error
        );
    }
    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );
    cartCount.textContent =
        String(totalItems);
}
/* =========================================
   Search and Filter
   ========================================= */
function filterProducts() {
    const searchTerm =
        searchInput?.value
            .trim()
            .toLowerCase() || "";
    const selectedCategory =
        categoryFilter?.value || "All";
    let filteredProducts =
        products.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchTerm) ||
                product.description
                    .toLowerCase()
                    .includes(searchTerm);
            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;
            return matchesSearch &&
                matchesCategory;
        });
    filteredProducts =
        sortProductList(filteredProducts);
    displayProducts(filteredProducts);
}
/* =========================================
   Sort Products
   ========================================= */
function sortProductList(productList) {
    const sortValue =
        sortProducts?.value || "default";
    const sortedProducts =
        [...productList];
    if (sortValue === "price-low") {
        sortedProducts.sort(
            (a, b) => a.price - b.price
        );
    }
    if (sortValue === "price-high") {
        sortedProducts.sort(
            (a, b) => b.price - a.price
        );
    }
    if (sortValue === "name") {
        sortedProducts.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }
    return sortedProducts;
}
/* =========================================
   Cart Notification
   ========================================= */
function showCartMessage(message) {
    const notification =
        document.querySelector(
            "#cart-notification"
        );
    if (!notification) {
        return;
    }
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}
/* =========================================
   Event Listeners
   ========================================= */
searchInput?.addEventListener(
    "input",
    filterProducts
);
categoryFilter?.addEventListener(
    "change",
    filterProducts
);
sortProducts?.addEventListener(
    "change",
    filterProducts
);
/* =========================================
   Initialize
   ========================================= */
displayProducts(products);
updateCartCount();