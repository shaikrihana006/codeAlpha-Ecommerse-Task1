const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


const summary =
    document.getElementById(
        "checkoutSummary"
    );


// =====================================
// CHECK CART
// =====================================

if (cart.length === 0) {

    summary.innerHTML =
        "<p>Your cart is empty.</p>";

}


// =====================================
// SHOW ORDER SUMMARY
// =====================================

let total = 0;


cart.forEach(item => {

    total +=
        item.price * item.quantity;

});


summary.innerHTML = `

    <h3>
        Order Summary
    </h3>

    <br>

    <p>
        Items:
        ${cart.length}
    </p>

    <p>
        Total:
        ₹${total}
    </p>

`;


// =====================================
// PLACE ORDER
// =====================================

document
    .getElementById("placeOrder")
    .addEventListener(
        "click",
        async function () {

            if (cart.length === 0) {

                alert("Your cart is empty.");

                return;
            }


            const items =
                cart.map(item => ({

                    productId:
                        item.productId,

                    quantity:
                        item.quantity

                }));


            const response =
                await fetch(
                    "/api/orders",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            items
                        })
                    }
                );


            const data =
                await response.json();


            const message =
                document.getElementById(
                    "message"
                );


            message.textContent =
                data.message;


            if (response.ok) {

                localStorage.removeItem(
                    "cart"
                );


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 1500);

            }

            else {

                if (response.status === 401) {

                    alert(
                        "Please login before placing an order."
                    );

                    window.location.href =
                        "login.html";
                }

            }

        }
    );