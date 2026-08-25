// Get product ID from URL

const params =
    new URLSearchParams(window.location.search);

const productId =
    params.get("id");


// =====================================
// LOAD PRODUCT
// =====================================

async function loadProduct() {

    const response =
        await fetch(
            `/api/products/${productId}`
        );

    const product =
        await response.json();

    const container =
        document.getElementById(
            "productDetails"
        );

    if (!response.ok) {

        container.innerHTML = `
            <h2>Product not found.</h2>
        `;

        return;
    }


    container.innerHTML = `

        <div>

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        </div>


        <div>

            <h1>
                ${product.name}
            </h1>

            <p>
                ${product.description}
            </p>

            <br>

            <div class="price">
                ₹${product.price}
            </div>

            <p>
                Available stock:
                ${product.stock}
            </p>

            <br>

            <label>
                Quantity:
            </label>

            <input
                type="number"
                id="quantity"
                value="1"
                min="1"
                max="${product.stock}"
            >

            <br><br>

            <button
                class="btn btn-primary"
                onclick="addToCart()"
            >
                Add to Cart
            </button>

        </div>

    `;


    window.currentProduct = product;
}


// =====================================
// ADD TO CART
// =====================================

function addToCart() {

    const quantity =
        parseInt(
            document.getElementById("quantity").value
        );

    if (quantity <= 0) {

        alert("Invalid quantity.");

        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existing =
        cart.find(
            item =>
                item.productId === window.currentProduct.id
        );


    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({
            productId: window.currentProduct.id,
            name: window.currentProduct.name,
            price: window.currentProduct.price,
            image: window.currentProduct.image,
            quantity: quantity
        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert("Product added to cart!");

    window.location.href = "cart.html";
}


loadProduct();