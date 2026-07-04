require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure database directory exists for Render persistent disk
const dbDir = path.dirname(process.env.DATABASE_PATH || './data/layboka.db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(process.env.DATABASE_PATH || './data/layboka.db');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        business_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        subscription_status TEXT DEFAULT 'trial',
        stripe_customer_id TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        phone TEXT,
        gender TEXT,
        measurements TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        customer_id INTEGER,
        status TEXT,
        total_price REAL,
        deadline DATE,
        timeline_step INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
});

// Middleware for Auth
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
    const { name, email, password, business_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(`INSERT INTO users (name, email, password, business_name) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, business_name],
        function(err) {
            if (err) return res.status(400).json({ error: "Email already exists" });
            const token = jwt.sign({ id: this.lastID, email }, process.env.JWT_SECRET);
            res.json({ token, user: { id: this.lastID, name, email, business_name, created_at: new Date() } });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
        res.json({ token, user });
    });
});

// Subscription Check Endpoint
app.get('/api/subscription-status', authenticateToken, (req, res) => {
    db.get(`SELECT created_at, subscription_status FROM users WHERE id = ?`, [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const regDate = new Date(row.created_at);
        const now = new Date();
        const diffDays = Math.ceil((now - regDate) / (1000 * 60 * 60 * 24));
        
        const isLocked = diffDays > 7 && row.subscription_status === 'trial';
        res.json({
            daysUsed: diffDays,
            status: row.subscription_status,
            isLocked: isLocked,
            remainingDays: Math.max(0, 7 - diffDays)
        });
    });
});

// Stripe Checkout
app.post('/api/create-checkout-session', authenticateToken, async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: { name: 'Layboka Premium Monthly' },
                unit_amount: 4900,
                recurring: { interval: 'month' },
            },
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
        client_reference_id: req.user.id.toString(),
    });
    res.json({ id: session.id });
});

// Dashboard Data
app.get('/api/dashboard', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM orders WHERE user_id = ?`, [req.user.id], (err, orders) => {
        db.all(`SELECT * FROM customers WHERE user_id = ?`, [req.user.id], (err, customers) => {
            res.json({ orders, customers });
        });
    });
});

// Handle React Routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Luxe Server running on port ${PORT}`));
