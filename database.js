const Database = require("better-sqlite3");

const db = new Database("ecommerce.db");

// Enable foreign keys
db.pragma("foreign_keys = ON");

// ================================
// USERS TABLE
// ================================
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// ================================
// PRODUCTS TABLE
// ================================
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        stock INTEGER DEFAULT 10,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// ================================
// ORDERS TABLE
// ================================
db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
`);

// ================================
// ORDER ITEMS TABLE
// ================================
db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,

        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

        FOREIGN KEY (product_id)
        REFERENCES products(id)
    )
`);

// ================================
// INSERT SAMPLE PRODUCTS
// ================================

const productCount = db
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get();

if (productCount.count === 0) {

    const insertProduct = db.prepare(`
        INSERT INTO products
        (name, description, price, image, stock)
        VALUES (?, ?, ?, ?, ?)
    `);

    const products = [
        [
            "Wireless Headphones",
            "High quality wireless headphones with clear sound.",
            1499,
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            20
        ],
        [
            "Smart Watch",
            "Smart watch with fitness tracking and notifications.",
            2499,
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            15
        ],
        [
            "Laptop",
            "Powerful laptop suitable for students and developers.",
            54999,
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
            10
        ],
        [
            "Smartphone",
            "Modern smartphone with a powerful camera.",
            19999,
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            25
        ],
        [
            "Backpack",
            "Durable backpack suitable for college and travel.",
            999,
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
            30
        ],
        [
            "Running Shoes",
            "Comfortable running shoes for everyday use.",
            1799,
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            20
        ]
    ];

    for (const product of products) {
        insertProduct.run(...product);
    }

    console.log("Sample products inserted successfully.");
}

console.log("Database connected successfully.");

module.exports = db;