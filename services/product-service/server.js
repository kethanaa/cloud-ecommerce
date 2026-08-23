const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");

const app = express();

const PORT = 3000;

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
// MongoDB Connection
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Product Service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });

// Home
app.get("/", (req, res) => {
    res.json({
        service: "Product Service",
        status: "running",
        database: "MongoDB"
    });
});

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    });
});

// Create Product
app.post("/products", async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// Get All Products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Get Product By ID
app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({
            error: "Invalid product ID"
        });
    }
});
// Update Product
app.put("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({
            error: "Invalid product ID or data"
        });
    }
});