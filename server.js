const express = require("express");
const path = require("path");

const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Public pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/shop.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "shop.html"));
});

app.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cart.html"));
});

app.get("/checkout.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/product.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "product.html"));
});

// =========================
// PRODUCTS API
// =========================

app.get("/api/products", (req, res) => {
  try {
    const products = db
      .prepare("SELECT * FROM products ORDER BY id DESC")
      .all();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading products" });
  }
});

app.get("/api/products/:id", (req, res) => {
  try {
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading product" });
  }
});

// =========================
// USER REGISTER
// =========================

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const result = db
      .prepare(
        `
                INSERT INTO users (name, email, password)
                VALUES (?, ?, ?)
            `,
      )
      .run(name, email, password);

    res.json({
      success: true,
      message: "Registration successful",
      userId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// =========================
// USER LOGIN
// =========================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    const user = db
      .prepare(
        `
                SELECT id, name, email
                FROM users
                WHERE email = ? AND password = ?
            `,
      )
      .get(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
