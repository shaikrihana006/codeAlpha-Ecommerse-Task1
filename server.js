const express = require("express");
const path = require("path");

const db = require("./database");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// PRODUCTS API
// =========================

// Get all products
app.get("/api/products", (req, res) => {

    try {

        const products = db
            .prepare("SELECT * FROM products ORDER BY id DESC")
            .all();

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error loading products"
        });
    }
});

// Get single product
app.get("/api/products/:id", (req, res) => {

    try {

        const product = db
            .prepare("SELECT * FROM products WHERE id = ?")
            .get(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error loading product"
        });
    }
});

// =========================
// USER REGISTER
// =========================

app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

    try {

        const existingUser = db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email);

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO users (name, email, password)
                VALUES (?, ?, ?)
            `)
            .run(name, email, password);

        res.json({
            success: true,
            message: "Registration successful",
            userId: result.lastInsertRowid
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

// =========================
// USER LOGIN
// =========================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message: "Please enter email and password"
        });
    }

    try {

        const user = db
            .prepare(`
                SELECT id, name, email
                FROM users
                WHERE email = ? AND password = ?
            `)
            .get(email, password);

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (error) {

        console.error(error);<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Shop - CodeAlpha Store</title>

    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <!-- ================= HEADER ================= -->

    <header class="header">

        <div class="logo">
            CodeAlpha Store
        </div>

        <nav class="navbar">

            <a href="index.html">Home</a>

            <a href="shop.html" class="active">Shop</a>

            <a href="cart.html">
                Cart 🛒
                <span id="cart-count">0</span>
            </a>

            <a href="login.html">Login</a>

        </nav>

    </header>


    <!-- ================= SHOP SECTION ================= -->

    <main>

        <section class="shop-section">

            <h1>Our Products</h1>

            <p class="shop-description">
                Explore our latest products and find what you need.
            </p>


            <!-- Search -->

            <div class="shop-controls">

                <input
                    type="text"
                    id="search-input"
                    placeholder="Search products..."
                >

                <select id="category-filter">

                    <option value="all">
                        All Products
                    </option>

                </select>

            </div>


            <!-- Products -->

            <div
                id="products-container"
                class="products-container"
            >

                <!-- Products will be loaded using JavaScript -->

                <p>Loading products...</p>

            </div>

        </section>

    </main>


    <!-- ================= FOOTER ================= -->

    <footer class="footer">

        <p>
            © 2026 CodeAlpha Store. All Rights Reserved.
        </p>

    </footer>


    <!-- JavaScript -->

    <script src="js/app.js"></script>

    <script src="js/products.js"></script>

    <script src="js/cart.js"></script>

</body>

</html>

        res.status(500).json({
            message: "Login failed"
        });
    }
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Shop - CodeAlpha Store</title>

    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <!-- ================= HEADER ================= -->

    <header class="header">

        <div class="logo">
            CodeAlpha Store
        </div>

        <nav class="navbar">

            <a href="index.html">Home</a>

            <a href="shop.html" class="active">Shop</a>

            <a href="cart.html">
                Cart 🛒
                <span id="cart-count">0</span>
            </a>

            <a href="login.html">Login</a>

        </nav>

    </header>


    <!-- ================= SHOP SECTION ================= -->

    <main>

        <section class="shop-section">

            <h1>Our Products</h1>

            <p class="shop-description">
                Explore our latest products and find what you need.
            </p>


            <!-- Search -->

            <div class="shop-controls">

                <input
                    type="text"
                    id="search-input"
                    placeholder="Search products..."
                >

                <select id="category-filter">

                    <option value="all">
                        All Products
                    </option>

                </select>

            </div>


            <!-- Products -->

            <div
                id="products-container"
                class="products-container"
            >

                <!-- Products will be loaded using JavaScript -->

                <p>Loading products...</p>

            </div>

        </section>

    </main>


    <!-- ================= FOOTER ================= -->

    <footer class="footer">

        <p>
            © 2026 CodeAlpha Store. All Rights Reserved.
        </p>

    </footer>


    <!-- JavaScript -->

    <script src="js/app.js"></script>

    <script src="js/products.js"></script>

    <script src="js/cart.js"></script>

</body>

</html>