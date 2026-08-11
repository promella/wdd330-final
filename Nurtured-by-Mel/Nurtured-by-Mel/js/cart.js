/* =====================================================
   NURTURED BY MEL
   Shopping Cart JavaScript Module
   Final Web Application Project
   ===================================================== */
/* =====================================================
   DOM ELEMENTS
   ===================================================== */
const cartItemsContainer =
    document.querySelector("#cart-items");
const cartLayout =
    document.querySelector("#cart-layout");
const emptyCart =
    document.querySelector("#empty-cart");
const cartCount =
    document.querySelector("#cart-count");
const cartItemCount =
    document.querySelector("#cart-item-count");
const cartSubtotal =
    document.querySelector("#cart-subtotal");
const cartTotal =
    document.querySelector("#cart-total");
const checkoutButton =
    document.querySelector("#checkout-button");
const checkoutMessage =
    document.querySelector("#checkout-message");
const closeMessage =
    document.querySelector("#close-message");
const closeCheckout =
    document.querySelector("#close-checkout");
/* =====================================================
   CART STORAGE
   ===================================================== */
const CART_KEY = "nurturedByMelCart";
function getCart() {
    try {
        return JSON.parse(
            localStorage.getItem(CART_KEY)
        ) || [];
    } catch (error) {
        console.error(
            "Unable to read cart:",
            error
        );
        return [];
    }
}
function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
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
   UPDATE CART COUNT
   ===================================================== */
function updateCartCount(cart) {
    if (!cartCount) {
        return;
    }
    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );
    cartCount.textContent =
        String(totalQuantity);
}
/* =====================================================
   UPDATE ITEM COUNT
   ===================================================== */
function updateItemCount(cart) {
    if (!cartItemCount) {
        return;
    }
    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );
    cartItemCount.textContent =
        `${totalQuantity} ${totalQuantity === 1
            ? "item"
            : "items"
        }`;
}
/* =====================================================
   CREATE CART ITEM
   ===================================================== */
function createCartItem(item) {
    const article =
        document.createElement("article");
    article.classList.add(
        "cart-item"
    );
    article.dataset.productId =
        String(item.id);
    article.innerHTML = `
        <div class="cart-item-image">
            <img
                src="${item.image}"
                alt="${item.name}"
                loading="lazy"
            >
        </div>
        <div class="cart-item-details">
            <p class="cart-item-category">
                Hair Care
            </p>
            <h3>
                ${item.name}
            </h3>
            <p class="cart-item-price">
                ${formatCurrency(item.price)}
            </p>
            <div class="cart-item-actions">
                <div
                    class="quantity-controls"
                    aria-label="Quantity controls"
                >
                    <button
                        class="quantity-button decrease"
                        type="button"
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Decrease quantity of ${item.name}"
                    >
                        −
                    </button>
                    <span
                        class="quantity-value"
                        aria-label="Quantity"
                    >
                        ${item.quantity}
                    </span>
                    <button
                        class="quantity-button increase"
                        type="button"
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Increase quantity of ${item.name}"
                    >
                        +
                    </button>
                </div>
                <button
                    class="remove-item"
                    type="button"
                    data-action="remove"
                    data-id="${item.id}"
                >
                    Remove
                </button>
            </div>
        </div>
        <div class="cart-item-total">
            <span>
                Item total
            </span>
            <strong>
                ${formatCurrency(
        item.price * item.quantity
    )}
            </strong>
        </div>
    `;
    return article;
}
/* =====================================================
   DISPLAY CART
   ===================================================== */
function displayCart() {
    const cart = getCart();
    updateCartCount(cart);
    updateItemCount(cart);
    if (!cartItemsContainer) {
        return;
    }
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        if (cartLayout) {
            cartLayout.hidden = true;
        }
        if (emptyCart) {
            emptyCart.hidden = false;
        }
        updateTotals([]);
        return;
    }
    if (cartLayout) {
        cartLayout.hidden = false;
    }
    if (emptyCart) {
        emptyCart.hidden = true;
    }
    cart.forEach((item) => {
        const cartItem =
            createCartItem(item);
        cartItemsContainer.appendChild(
            cartItem
        );
    });
    updateTotals(cart);
}
/* =====================================================
   UPDATE TOTALS
   ===================================================== */
function updateTotals(cart) {
    if (!cartSubtotal || !cartTotal) {
        return;
    }
    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );
    cartSubtotal.textContent =
        formatCurrency(subtotal);
    cartTotal.textContent =
        formatCurrency(subtotal);
}
/* =====================================================
   CHANGE PRODUCT QUANTITY
   ===================================================== */
function changeQuantity(productId, change) {
    const cart = getCart();
    const product =
        cart.find(
            (item) =>
                item.id === productId
        );
    if (!product) {
        return;
    }
    product.quantity += change;
    if (product.quantity <= 0) {
        const updatedCart =
            cart.filter(
                (item) =>
                    item.id !== productId
            );
        saveCart(updatedCart);
    } else {
        saveCart(cart);
    }
    displayCart();
}
/* =====================================================
   REMOVE PRODUCT
   ===================================================== */
function removeProduct(productId) {
    const cart = getCart();
    const updatedCart =
        cart.filter(
            (item) =>
                item.id !== productId
        );
    saveCart(updatedCart);
    displayCart();
}
/* =====================================================
   CART BUTTON ACTIONS
   ===================================================== */
function handleCartAction(event) {
    const button =
        event.target.closest(
            "button[data-action]"
        );
    if (!button) {
        return;
    }
    const productId =
        Number(button.dataset.id);
    const action =
        button.dataset.action;
    if (action === "increase") {
        changeQuantity(
            productId,
            1
        );
    }
    if (action === "decrease") {
        changeQuantity(
            productId,
            -1
        );
    }
    if (action === "remove") {
        removeProduct(
            productId
        );
    }
}
/* =====================================================
   CHECKOUT MESSAGE
   ===================================================== */
function openCheckoutMessage() {
    const cart = getCart();
    if (cart.length === 0) {
        return;
    }
    if (!checkoutMessage) {
        return;
    }
    checkoutMessage.hidden = false;
    document.body.classList.add(
        "modal-open"
    );
    closeMessage?.focus();
}
function closeCheckoutMessage() {
    if (!checkoutMessage) {
        return;
    }
    checkoutMessage.hidden = true;
    document.body.classList.remove(
        "modal-open"
    );
    checkoutButton?.focus();
}
/* =====================================================
   CHECKOUT BUTTON
   ===================================================== */
checkoutButton?.addEventListener(
    "click",
    openCheckoutMessage
);
closeMessage?.addEventListener(
    "click",
    closeCheckoutMessage
);
closeCheckout?.addEventListener(
    "click",
    closeCheckoutMessage
);
/* =====================================================
   CLOSE CHECKOUT WITH ESCAPE
   ===================================================== */
document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            checkoutMessage &&
            !checkoutMessage.hidden
        ) {
            closeCheckoutMessage();
        }
    }
);
/* =====================================================
   CART EVENT LISTENER
   ===================================================== */
cartItemsContainer?.addEventListener(
    "click",
    handleCartAction
);
/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */
const menuButton =
    document.querySelector(".menu-button");
const navigation =
    document.querySelector(".navigation");
function setupNavigation() {
    if (!menuButton || !navigation) {
        return;
    }
    menuButton.addEventListener(
        "click",
        () => {
            const isOpen =
                navigation.classList.toggle(
                    "open"
                );
            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        }
    );
}
setupNavigation();
/* =====================================================
   INITIALIZE CART
   ===================================================== */
displayCart();