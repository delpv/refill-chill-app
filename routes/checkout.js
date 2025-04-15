import express from "express"

const router = express.Router()

// Render the checkout page
router.get("/", (req, res) => {
    res.render("checkout")
})

// Render the checkout complete page
router.get("/complete", (req, res) => {
    res.render("checkout-complete")
})

// API endpoint to process an order
router.post("/api/order", express.json(), (req, res) => {
    // In a real application, this would:
    // 1. Validate the order data
    // 2. Process payment
    // 3. Save order to database
    // 4. Send confirmation email
    // 5. Clear the cart
    
    const orderData = req.body
    
    // Generate a random order ID
    const orderId = 'ORD-' + Math.floor(Math.random() * 10000)
    
    res.json({
        success: true,
        message: "Order processed successfully",
        orderId: orderId,
        data: orderData
    })
})

// API endpoint to get order details
router.get("/api/order/:id", (req, res) => {
    const orderId = req.params.id
    
    // In a real application, this would fetch the order from a database
    // For now, we'll return a mock order
    res.json({
        success: true,
        order: {
            id: orderId,
            date: new Date().toISOString(),
            status: "Processing",
            items: [],
            subtotal: 0,
            shipping: 5.00,
            total: 5.00,
            customer: {
                name: "Test Customer",
                email: "test@example.com",
                address: "123 Test Street",
                city: "Test City",
                zip: "12345"
            }
        }
    })
})

export default router
