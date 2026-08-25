// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        const products =
            await response.json();

        const productList =
            document.getElementById("productList");

        productList.innerHTML = "";

        products.forEach(product => {

            productList.innerHTML += `

                <div class="product-card">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="product-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${product.description}
                        </p>

                        <div class="price">
                            ₹${product.price}
                        </div>

                        <a
                            class="btn btn-primary"
                            href="product.html?id=${product.id}"
                        >
                            View Product
                        </a>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }
}


// =====================================
// CART COUNT
// =====================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}


// =====================================
// RUN
// =====================================

loadProducts();

updateCartCount();