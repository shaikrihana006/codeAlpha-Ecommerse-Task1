const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const db = require("./database");

const app = express();

const PORT = 3000;

// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "codealpha-ecommerce-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================

function requireLogin(req, res, next) {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please login first."
        });
    }

    next();
}

// =====================================
// PRODUCT API
// =====================================

// Get all products
app.get("/api/products", (req, res) => {

    const products = db
        .prepare("SELECT * FROM products ORDER BY id DESC")
        .all();

    res.json(products);
});

// Get single product
app.get("/api/products/:id", (req, res) => {

    const product = db
        .prepare("SELECT * FROM products WHERE id = ?")
        .get(req.params.id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found."
        });
    }

    res.json(product);
});

// =====================================
// REGISTER
// =====================================

app.post("/api/auth/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });
        }

        const existingUser = db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email);

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = db
            .prepare(`
                INSERT INTO users
                (name, email, password)
                VALUES (?, ?, ?)
            `)
            .run(name, email, hashedPassword);

        req.session.user = {
            id: result.lastInsertRowid,
            name,
            email
        };

        res.json({
            message: "Registration successful.",
            user: req.session.user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});

// =====================================
// LOGIN
// =====================================

app.post("/api/auth/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        res.json({
            message: "Login successful.",
            user: req.session.user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});

// =====================================
// CURRENT USER
// =====================================

app.get("/api/auth/me", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Not logged in."
        });
    }

    res.json(req.session.user);
});

// =====================================
// LOGOUT
// =====================================

app.post("/api/auth/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            message: "Logout successful."
        });

    });
});

// =====================================
// CREATE ORDER
// =====================================

app.post("/api/orders", requireLogin, (req, res) => {

    try {

        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty."
            });
        }

        let total = 0;
        const orderItems = [];

        // Check products and calculate total
        for (const item of items) {

            const product = db
                .prepare("SELECT * FROM products WHERE id = ?")
                .get(item.productId);

            if (!product) {
                return res.status(400).json({
                    message: "Product not found."
                });
            }

            if (item.quantity <= 0) {
                return res.status(400).json({
                    message: "Invalid quantity."
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message:
                        `${product.name} does not have enough stock.`
                });
            }

            total += product.price * item.quantity;

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create order
        const orderResult = db
            .prepare(`
                INSERT INTO orders
                (user_id, total, status)
                VALUES (?, ?, ?)
            `)
            .run(
                req.session.user.id,
                total,
                "Pending"
            );

        const orderId = orderResult.lastInsertRowid;

        // Insert order items
        const insertItem = db.prepare(`
            INSERT INTO order_items
            (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        `);

        const updateStock = db.prepare(`
            UPDATE products
            SET stock = stock - ?
            WHERE id = ?
        `);

        for (const item of orderItems) {

            insertItem.run(
                orderId,
                item.productId,
                item.quantity,
                item.price
            );

            updateStock.run(
                item.quantity,
                item.productId
            );
        }

        res.json({
            message: "Order placed successfully.",
            orderId,
            total
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not place order."
        });
    }
});

// =====================================
// GET USER ORDERS
// =====================================

app.get("/api/orders", requireLogin, (req, res) => {

    const orders = db
        .prepare(`
            SELECT *
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `)
        .all(req.session.user.id);

    res.json(orders);
});

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log(`
========================================
   CODEALPHA E-COMMERCE STORE
========================================

Server running at:

http://localhost:${PORT}

========================================
    `);

});