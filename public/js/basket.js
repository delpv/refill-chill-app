/**
 * Simple Shop - Basket Page JavaScript
 */

// Cart state
let cart = {
  items: [],
  subtotal: 0,
  shipping: 5.00,
  total: 0
};

// DOM Elements consolidated
const elements = {
  basketItems: document.getElementById('basket-items'),
  subtotal: document.getElementById('subtotal'),
  shipping: document.getElementById('shipping'),
  total: document.getElementById('total'),
  checkout: document.getElementById('checkout-button')
};

/**
* Initialize the basket page
*/
function initBasket() {
  // Load cart from localStorage
  const savedCart = localStorage.getItem('simpleShopCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  
  renderCartItems();
  updateCartSummary();
  
  // Add event listener to checkout button
  if (elements.checkout) {
    elements.checkout.addEventListener('click', () => {
      localStorage.setItem('simpleShopCart', JSON.stringify(cart));
      window.location.href = 'checkout.html';
    });
  }
}

/**
* Add item to cart
* @param {number} productId - The ID of the product to add
* @param {number} quantity - The quantity to add
* @param {Object} productData - Optional product data
*/
function addItemToCart(productId, quantity, productData = null) {
  if (!productData) {
    console.error('Product data is required but was not provided');
    return;
  }

  // Load existing cart
  const savedCart = localStorage.getItem('simpleShopCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  
  // Check if item exists
  const existingItem = cart.items.find(item => 
    item.id === productId &&
    item.size === productData.size &&
    item.color === productData.color
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      id: productId,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      size: productData.size,
      color: productData.color,
      quantity: quantity
    });
  }
  
  // Update cart totals and save
  updateCartTotals();
  localStorage.setItem('simpleShopCart', JSON.stringify(cart));
  
  // If we're on the basket page, update UI
  if (window.location.pathname.includes('html/basket.html')) {
    renderCartItems();
    updateCartSummary();
  }
  
  // Show notification
  showAddToCartNotification(productData.name);
}

/**
* Update cart totals
*/
function updateCartTotals() {
  // Calculate subtotal
  cart.subtotal = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Apply shipping rules
  cart.shipping = cart.subtotal >= 499 ? 0 : 5.00;
  
  // Calculate total
  cart.total = cart.subtotal + cart.shipping;
}

/**
* Render cart items
*/
function renderCartItems() {
  if (!elements.basketItems) return;
  elements.basketItems.innerHTML = '';
  
  if (cart.items.length === 0) {
    showEmptyCart();
    return;
  }
  
  // Enable checkout button
  if (elements.checkout) {
    elements.checkout.classList.remove('disabled');
    elements.checkout.disabled = false;
  }
  
  // Render each item
  cart.items.forEach(item => {
    const itemElement = createCartItemElement(item);
    elements.basketItems.appendChild(itemElement);
  });
  
  // Add event listeners
  setupCartItemEvents();
}

/**
* Create cart item element
*/
function createCartItemElement(item) {
  const itemElement = document.createElement('div');
  itemElement.className = 'card shadow-sm mb-3';
  
  const imagePath = item.image ? `${item.image.replace(/\s+/g, '%20')}` : '';
  const detailsString = getItemDetailsString(item);
  const itemSize = item.size || 'default';
  const itemColor = item.color || 'default';
  
  itemElement.innerHTML = `
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-md-2 col-sm-3 mb-3 mb-md-0">
          ${imagePath ? `<img src="${imagePath}" alt="${item.name}" class="img-fluid" style="max-height: 60px; object-fit: contain;">` : ''}
        </div>
        <div class="col-md-7 col-sm-6">
          <h5 class="mb-1">${item.name}</h5>
          <p class="text-muted mb-1">${item.price.toFixed(2)} DKK</p>
          ${detailsString ? `<p class="text-muted small mb-2">${detailsString}</p>` : ''}
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary decrease-quantity" 
              data-id="${item.id}" 
              data-size="${itemSize}" 
              data-color="${itemColor}">-</button>
            <span class="mx-3">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary increase-quantity" 
              data-id="${item.id}" 
              data-size="${itemSize}" 
              data-color="${itemColor}">+</button>
            <button class="btn btn-sm btn-outline-danger remove-item ms-3" 
              data-id="${item.id}" 
              data-size="${itemSize}" 
              data-color="${itemColor}">Remove</button>
          </div>
        </div>
        <div class="col-md-3 col-sm-3 text-end">
          <span class="fw-bold">${(item.price * item.quantity).toFixed(2)} DKK</span>
        </div>
      </div>
    </div>
  `;
  
  return itemElement;
}

/**
* Get item details string
*/
function getItemDetailsString(item) {
  const sizeText = item.size ? `Size: ${item.size}` : '';
  const colorText = item.color ? `Color: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)}` : '';
  
  if (sizeText && colorText) {
    return `${sizeText} | ${colorText}`;
  }
  return sizeText || colorText;
}

/**
* Show empty cart message
*/
function showEmptyCart() {
  elements.basketItems.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-body text-center py-5">
        <h3 class="mb-3">Your cart is empty</h3>
        <p class="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
        <a href="home.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    </div>
  `;
  
  // Disable checkout button
  if (elements.checkout) {
    elements.checkout.classList.add('disabled');
    elements.checkout.disabled = true;
  }
}

/**
* Set up cart item event listeners
*/
function setupCartItemEvents() {
  // Decrease quantity buttons
  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      const size = this.getAttribute('data-size');
      const color = this.getAttribute('data-color');
      
      const item = findCartItem(productId, size, color);
      if (item) {
        updateItemQuantity(productId, size, color, item.quantity - 1);
      }
    });
  });
  
  // Increase quantity buttons
  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      const size = this.getAttribute('data-size');
      const color = this.getAttribute('data-color');
      
      const item = findCartItem(productId, size, color);
      if (item) {
        updateItemQuantity(productId, size, color, item.quantity + 1);
      }
    });
  });
  
  // Remove buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      const size = this.getAttribute('data-size');
      const color = this.getAttribute('data-color');
      
      removeFromCart(productId, size, color);
    });
  });
}

/**
* Find item in cart
*/
function findCartItem(productId, size, color) {
  return cart.items.find(item =>
    item.id === productId &&
    item.size === size &&
    item.color === color
  );
}

/**
* Update item quantity
*/
function updateItemQuantity(productId, size, color, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId, size, color);
    return;
  }
  
  const item = findCartItem(productId, size, color);
  if (item) {
    item.quantity = newQuantity;
    updateCartTotals();
    localStorage.setItem('simpleShopCart', JSON.stringify(cart));
    renderCartItems();
    updateCartSummary();
  }
}

/**
* Remove item from cart
*/
function removeFromCart(productId, size, color) {
  cart.items = cart.items.filter(item => 
    !(item.id === productId && item.size === size && item.color === color)
  );
  
  updateCartTotals();
  localStorage.setItem('simpleShopCart', JSON.stringify(cart));
  renderCartItems();
  updateCartSummary();
}

/**
* Update cart summary
*/
function updateCartSummary() {
  if (elements.subtotal) {
    elements.subtotal.textContent = `${cart.subtotal.toFixed(2)} DKK`;
  }
  
  if (elements.shipping) {
    elements.shipping.textContent = cart.shipping === 0 ? 'Free' : `${cart.shipping.toFixed(2)} DKK`;
  }
  
  if (elements.total) {
    elements.total.textContent = `${cart.total.toFixed(2)} DKK`;
  }
}

/**
* Show a notification when an item is added to cart
*/
function showAddToCartNotification(productName) {
  // Create notification element if it doesn't exist
  let notification = document.getElementById('cart-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'cart-notification';
    notification.className = 'toast align-items-center text-white bg-success border-0';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.zIndex = '1100';
    
    notification.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-check-circle me-2"></i>
          <span id="notification-text"></span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    document.body.appendChild(notification);
  }
  
  // Get the Bootstrap Toast instance or create it
  let toastInstance = bootstrap.Toast.getInstance(notification);
  if (!toastInstance) {
    toastInstance = new bootstrap.Toast(notification, {
      autohide: true,
      delay: 3000
    });
  }
  
  document.getElementById('notification-text').textContent = `${productName} added to cart`;
  toastInstance.show();
}

/**
 * Add to cart function for the product page
 */
function addToCart(product) {
  if (!product || !product.id || !window.location.pathname.includes('product.html')) {
    console.error('Invalid product data or not on product page');
    return;
  }
  
  addItemToCart(product.id, 1, product);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('basket.html')) {
    initBasket();
  }
});
