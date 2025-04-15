let products = [];

async function fetchProducts() {
    try {
        const response = await fetch("../data/products.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = `
            <div class="text-center mt-4">
                <p class="fw-bold text-danger">No product found.</p>
                <a href="list.html" class="btn btn-primary">Back to Shop</a>
                <br>
                <br>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="col-12 col-sm-6 col-md-4 text-center d-flex justify-content-center align-items-center mb-4">
            <!-- anchor tag -->
            <a href="product.html?id=${product.id}" class="text-decoration-none text-dark" style="width:100%; max-width: 300px;">
                <div class="card" style="width:100%; max-width: 300px;">
                    <img class="card-img-top" src="${product.image}" alt="${product.name}"
                        style="height: 200px; width: 100%; object-fit: contain;">
                    <div class="card-body">
                        <h4 class="card-title">${product.name}</h4>
                        <div class="d-flex justify-content-center align-items-center gap-2">
                            <span class="fw-bold text-primary">${product.price} DKK</span>
                            <!-- No "Add to Cart" button on list page - users must go to product page to add items -->
                        </div>
                    </div>
                </div>
            </a>
        </div>
        `;
        container.innerHTML += productCard;
    });
}

function filterProducts() {
    const material = document.getElementById('material').value;
    const consumer = document.getElementById('consumer').value;
    const size = document.getElementById('size').value;
    const color = document.getElementById('color').value;

    const filteredProducts = products.filter(product => {
        const category = product.category;

        return (material === 'all' || category.material === material) &&
            (consumer === 'all' || category.consumer === consumer) &&
            (size === 'all' || category.sizes.includes(size)) &&
            (color === 'all' || category.colors.includes(color));
    });

    displayProducts(filteredProducts);
}

window.onload = async function () {
    await fetchProducts();
    document.getElementById('material').addEventListener('change', filterProducts);
    document.getElementById('consumer').addEventListener('change', filterProducts);
    document.getElementById('size').addEventListener('change', filterProducts);
    document.getElementById('color').addEventListener('change', filterProducts);
}
