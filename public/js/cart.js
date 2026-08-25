let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// =====================================
// DISPLAY CART
// =====================================

function displayCart() {

    const container =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("cartTotal");


    if (cart.length === 0) {

        container.innerHTML = `
            <h3>Your cart is empty.</h3>
        `;

        totalElement.textContent = "0";

        return;
    }


    let total = 0;


    container.innerHTML = "";


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        container.innerHTML += `

            <div class="cart-item">

                <div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        Price: ₹${item.price}
                    </p>

                    <p>
                        Quantity: ${item.quantity}
                    </p>

                    <p>
                        Subtotal: ₹${itemTotal}
                    </p>

                </div>


                <button
                    class="btn btn-danger"
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            </div>

        `;

    });


    totalElement.textContent = total;
}


// =====================================
// REMOVE ITEM
// =====================================

function removeItem(index) {

    cart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();
}


displayCart();