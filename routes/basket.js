import express from "express"

const router = express.Router()

// Render the basket page
router.get("/", (req, res) => {
    res.render("basket")
})

// API endpoint to get cart data
router.get("/api/cart", (req, res) => {
    // In a real application, this would fetch from a database
    // For now, we'll return a success message since the cart is managed client-side
    res.json({ success: true, message: "Cart data is managed client-side" })
})

// API endpoint to update cart
router.post("/api/cart", express.json(), (req, res) => {
    // In a real application, this would update the cart in a database
    // For now, we'll just return the data that was sent
    const cartData = req.body
    res.json({ 
        success: true, 
        message: "Cart updated successfully", 
        data: cartData 
    })
})

// API endpoint to clear cart
router.delete("/api/cart", (req, res) => {
    // In a real application, this would clear the cart in a database
    res.json({ success: true, message: "Cart cleared successfully" })
})

export default router
