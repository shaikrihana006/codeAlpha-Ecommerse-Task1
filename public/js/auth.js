// =====================================
// REGISTER
// =====================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;


            const response =
                await fetch(
                    "/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            const message =
                document.getElementById("message");


            message.textContent =
                data.message;


            if (response.ok) {

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 1000);

            }

        }
    );

}


// =====================================
// LOGIN
// =====================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;


            const response =
                await fetch(
                    "/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            const message =
                document.getElementById("message");


            message.textContent =
                data.message;


            if (response.ok) {

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 1000);

            }

        }
    );

}