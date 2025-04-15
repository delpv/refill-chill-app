/**
 * Simple Shop - Checkout Page JavaScript (Server-side version)
 */

// Cart state
let cart = {
  items: [],
  subtotal: 0,
  shipping: 5.00,
  total: 0,
  shippingMethod: 'standard'
};

// DOM Elements will be initialized after DOM is loaded
let elements = {
  orderSummary: null,
  subtotal: null,
  shipping: null,
  total: null,
  completeOrder: null,
  shippingRadios: null,
  checkoutForm: null
};

/**
* Initialize the checkout page
*/
function initCheckout() {
  // Initialize DOM elements
  elements = {
    orderSummary: document.getElementById('order-summary'),
    subtotal: document.getElementById('subtotal'),
    shipping: document.getElementById('shipping'),
    total: document.getElementById('total'),
    completeOrder: document.getElementById('complete-order'),
    shippingRadios: document.querySelectorAll('input[name="shipping-method"]'),
    checkoutForm: document.getElementById('checkout-form')
  };

  const savedCart = localStorage.getItem('simpleShopCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  
  renderOrderSummary();
  updateOrderSummary();
  setupEventListeners();
}

/**
* Set up all event listeners
*/
function setupEventListeners() {
  // Set up shipping method selection
  if (elements.shippingRadios.length) {
    elements.shippingRadios.forEach(radio => {
      if (radio.value === cart.shippingMethod) {
        radio.checked = true;
      }
      
      radio.addEventListener('change', updateShippingMethod);
    });
  }
  
  // Set up form validation
  if (elements.checkoutForm && elements.completeOrder) {
    elements.completeOrder.addEventListener('click', handleOrderSubmission);
  }
}

/**
* Update shipping method and costs
*/
function updateShippingMethod() {
  cart.shippingMethod = this.value;
  
  // Update shipping cost based on method
  cart.shipping = calculateShippingCost(cart.shippingMethod, cart.subtotal);
  
  // Update total
  cart.total = cart.subtotal + cart.shipping;
  
  // Save cart and update UI
  localStorage.setItem('simpleShopCart', JSON.stringify(cart));
  updateOrderSummary();
}

/**
* Calculate shipping cost based on method and subtotal
*/
function calculateShippingCost(method, subtotal) {
  switch (method) {
    case 'express': return 10.00;
    case 'premium': return 20.00;
    default: return subtotal >= 499 ? 0 : 5.00; // Free shipping for orders over 499 DKK
  }
}

/**
* Render order summary
*/
function renderOrderSummary() {
  if (!elements.orderSummary) return;
  elements.orderSummary.innerHTML = '';
  
  if (!cart.items.length) {
    showEmptyCart();
    return;
  }
  
  // Enable order button
  if (elements.completeOrder) {
    elements.completeOrder.classList.remove('disabled');
    elements.completeOrder.disabled = false;
  }
  
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'mb-4';
  
  // Render each item
  cart.items.forEach(item => {
    const imagePath = item.image ? `${item.image.replace(/\s+/g, '%20')}` : '';
    const itemElement = createItemElement(item, imagePath);
    itemsContainer.appendChild(itemElement);
  });
  
  elements.orderSummary.appendChild(itemsContainer);
}

/**
* Create item element for the order summary
*/
function createItemElement(item, imagePath) {
  const itemElement = document.createElement('div');
  itemElement.className = 'card mb-2';
  
  itemElement.innerHTML = `
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-3">
          ${imagePath ? `<img src="${imagePath}" alt="${item.name}" class="img-fluid" style="max-height: 60px; object-fit: contain;">` : ''}
        </div>
        <div class="col-6">
          <h6 class="mb-1">${item.name}</h6>
          <p class="text-muted small mb-0">Qty: ${item.quantity} × ${item.price.toFixed(2)} DKK</p>
        </div>
        <div class="col-3 text-end">
          <span class="fw-bold">${(item.price * item.quantity).toFixed(2)} DKK</span>
        </div>
      </div>
    </div>
  `;
  
  return itemElement;
}

/**
* Show empty cart message
*/
function showEmptyCart() {
  elements.orderSummary.innerHTML = `
    <div class="text-center py-4">
      <h3 class="mb-3">Your cart is empty</h3>
      <p class="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
      <a href="/basket" class="btn btn-primary">Return to Cart</a>
    </div>
  `;
  
  // Disable complete order button
  if (elements.completeOrder) {
    elements.completeOrder.classList.add('disabled');
    elements.completeOrder.disabled = true;
  }
}

/**
* Update order summary totals
*/
function updateOrderSummary() {
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
* Handle order form submission
*/
async function handleOrderSubmission(event) {
  event.preventDefault();
  
  if (!elements.checkoutForm.checkValidity()) {
    elements.checkoutForm.reportValidity();
    return;
  }
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    zip: document.getElementById('zip').value,
    paymentMethod: document.querySelector('input[name="payment-method"]:checked')?.value || 'credit-card'
  };
  
  // Create order object
  const order = {
    items: cart.items,
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
    shippingMethod: cart.shippingMethod,
    customer: formData
  };
  
  try {
    // Submit order to server
    const response = await fetch('/checkout/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save order to localStorage
      saveOrder(formData, data.orderId);
      
      // Clear cart
      await clearCart();
      
      // Redirect to confirmation page
      window.location.href = '/checkout/complete';
    } else {
      console.error('Failed to process order:', data.message);
      alert('There was a problem processing your order. Please try again.');
    }
  } catch (error) {
    console.error('Error processing order:', error);
    alert('There was a problem processing your order. Please try again.');
  }
}

/**
* Save order to localStorage
*/
function saveOrder(formData, orderId) {
  const order = {
    id: orderId || 'ORD-' + Math.floor(Math.random() * 10000),
    date: new Date().toISOString(),
    items: cart.items,
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
    shippingMethod: cart.shippingMethod,
    customer: formData
  };
  
  localStorage.setItem('simpleShopOrder', JSON.stringify(order));
}

/**
* Clear cart
*/
async function clearCart() {
  try {
    const response = await fetch('/basket/api/cart', {
      method: 'DELETE'
    });
    
    const data = await response.json();
    if (data.success) {
      cart = {
        items: [],
        subtotal: 0,
        shipping: 5.00,
        total: 0,
        shippingMethod: 'standard'
      };
      localStorage.setItem('simpleShopCart', JSON.stringify(cart));
    } else {
      console.error('Failed to clear cart on server:', data.message);
    }
  } catch (error) {
    console.error('Error clearing cart on server:', error);
    // Clear localStorage as a fallback
    cart = {
      items: [],
      subtotal: 0,
      shipping: 5.00,
      total: 0,
      shippingMethod: 'standard'
    };
    localStorage.setItem('simpleShopCart', JSON.stringify(cart));
  }
}

// Initialize the checkout page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initCheckout);
