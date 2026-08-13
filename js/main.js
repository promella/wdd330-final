/* =====================================================
   NURTURED BY MEL
   Main JavaScript Module
   Final Web Application Project
   ===================================================== */



const menuButton =
    document.querySelector(".menu-button");

const navigation =
    document.querySelector(".navigation");


function setupNavigation() {

    if (!menuButton || !navigation) {
        return;
    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            navigation.classList.toggle("open");


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

    });

}
function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "nurturedByMelCart"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Unable to read shopping cart:",
            error
        );

        return [];

    }

}


function updateCartCount() {

    const cartCount =
        document.querySelector("#cart-count");


    if (!cartCount) {
        return;
    }


    const cart = getCart();


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );


    cartCount.textContent =
        String(totalItems);

}

const featuredProducts = [
    {
        id: 1,
        name: "Nurture Growth Oil",
        category: "Oils",
        price: 149.99,
        image: "images/growth-oil.webp",
        description:
            "A nourishing oil designed to complement a healthy hair-care routine."
    },

    {
        id: 2,
        name: "Mel Natural Shampoo",
        category: "Shampoo",
        price: 129.99,
        image: "images/shampoo.webp",
        description:
            "A gentle shampoo designed to leave hair feeling clean and moisturized."
    },

    {
        id: 3,
        name: "Nurture Deep Conditioner",
        category: "Conditioners",
        price: 139.99,
        image: "images/conditioner.webp",
        description:
            "A rich conditioner designed to add moisture to your hair-care routine."
    }
];


function formatCurrency(price) {

    return new Intl.NumberFormat(
        "en-ZA",
        {
            style: "currency",
            currency: "ZAR"
        }
    ).format(price);

}


function displayFeaturedProducts() {

    const container =
        document.querySelector(
            "#featured-products"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    featuredProducts.forEach((product) => {

        const card =
            document.createElement("article");


        card.classList.add(
            "product-card"
        );


        card.innerHTML = `
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

                    <a
                        class="button button-primary"
                        href="products.html"
                    >
                        View Product
                    </a>

                </div>

            </div>
        `;


        container.appendChild(card);

    });

}



function init() {

    setupNavigation();

    updateCartCount();

    displayFeaturedProducts();

}


init();