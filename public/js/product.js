document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.body.innerHTML = "<h2>Product not found</h2>";
        return;
    }

    fetch("../data/products.json") // Ensure this path is correct based on your folder structure
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) {
                document.body.innerHTML = "<h2>Product not found</h2>";
                return;
            }

            // Populate product details
            document.getElementById("product-img").src = product.image;
            document.getElementById("product-name").textContent = product.name;
            document.getElementById("product-description").textContent = product.description;
            document.getElementById("product-price").textContent = product.price;

            // Populate size options
            const sizeContainer = document.getElementById("size-buttons");
            sizeContainer.innerHTML="";
            product.category.sizes.forEach(size => {
                let button = document.createElement("button");
                button.textContent = size;
                button.classList.add("btn", "btn-outline-primary", "size-btn");
                button.addEventListener("click", () => {
                    document.querySelectorAll(".size-btn").forEach(btn => btn.classList.remove("selected"));
                    button.classList.add("selected");
                });
                sizeContainer.appendChild(button);
            });

            // Populate color dropdown
            const colorSelect = document.getElementById("color-select");
            colorSelect.innerHTML=`<option value="">Select a color</option>`;
            product.category.colors.forEach(color => {
                let option = document.createElement("option");
                option.value = color;
                option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
                colorSelect.appendChild(option);
            });

            // Handle Quantity Selection
            let quantity = 1;
            document.getElementById("decrease-qty").addEventListener("click", () => {
                if (quantity > 1) {
                    quantity--;
                    document.getElementById("quantity").textContent = quantity;
                }
            });

            document.getElementById("increase-qty").addEventListener("click", () => {
                quantity++;
                document.getElementById("quantity").textContent = quantity;
            });

            // Add to Cart Functionality
            document.getElementById("add-to-cart").addEventListener("click", () => {
                const selectedSize = document.querySelector(".size-btn.selected")?.textContent;
                const selectedColor = document.getElementById("color-select").value;
                const selectedQuantity = parseInt(document.getElementById("quantity").textContent);
            
                if (!selectedSize || !selectedColor) {
                    alert("Please select both size and color.");
                    return;
                }
            
                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: selectedSize,
                    color: selectedColor,
                    quantity: selectedQuantity
                };

                document.getElementById("quantity").textContent = 1
            
                // Use basket.js function to add the item to the cart
                addItemToCart(product.id, selectedQuantity, cartItem); // Ensure quantity is passed correctly
            });
            
        })
        .catch(error => console.error("Error loading product:", error));
});
