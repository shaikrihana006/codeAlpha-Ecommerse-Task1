// ======================================
// ShopEase - Main JavaScript
// ======================================


// Load featured products when page opens
document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedProducts();
    updateCartCount();
});


// ======================================
// LOAD FEATURED PRODUCTS
// ======================================

async function loadFeaturedProducts() {

    const container = document.getElementById("featuredProducts");

    // If this page doesn't have featured products,
    // stop here.
    if (!container) {
        return;
    }

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        // Show first 8 products
        const featured = products.slice(0, 8);

        container.innerHTML = "";

        featured.forEach(product => {

            const card = document.createElement("div");

            card.className = "product-card";

            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        onerror="this.src='images/smartphone.jpg'"
                    >

                </div>

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <div class="product-rating">
                        ⭐ ${product.rating || "4.5"}
                    </div>

                    <div class="product-price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </div>

                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Error:", error);

        container.innerHTML = `
            <p>
                Unable to load products.
                Please make sure the server is running.
            </p>
        `;
    }
}


// ======================================
// ADD TO CART
// ======================================

async function addToCart(productId) {

    try {

        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();

        // Get existing cart
        let cart = JSON.parse(
            localStorage.getItem("cart")
        ) || [];

        // Check whether product already exists
        const existingProduct = cart.find(
            item => item.id === product.id
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

        // Save cart
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        updateCartCount();

        alert(`${product.name} added to cart!`);

    } catch (error) {

        console.error(error);

        alert("Unable to add product to cart.");
    }
}


// ======================================
// UPDATE CART COUNT
// ======================================

function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}


// ======================================
// SEARCH PRODUCTS
// ======================================

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    const searchText =
        searchInput.value.trim();

    if (searchText === "") {
        window.location.href = "shop.html";
        return;
    }

    window.location.href =
        `shop.html?search=${encodeURIComponent(searchText)}`;
}


// ======================================
// SEARCH WITH ENTER KEY
// ======================================

document.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        const searchInput =
            document.getElementById("searchInput");

        if (
            searchInput &&
            document.activeElement === searchInput
        ) {
            searchProducts();
        }
    }

});