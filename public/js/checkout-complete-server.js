/**
 * Simple Shop - Checkout Complete Page JavaScript (Server-side version)
 */

// DOM Elements will be initialized after DOM is loaded
let elements = {
  orderId: null,
  orderEmail: null,
  orderItems: null,
  subtotal: null,
  shipping: null,
  total: null,
  shippingAddress: null,
  shippingMethod: null
};

/**
 * Initialize the checkout complete page
 */
function initCheckoutComplete() {
  // Initialize DOM elements
  elements = {
    orderId: document.getElementById('order-id'),
    orderEmail: document.getElementById('order-email'),
    orderItems: document.getElementById('order-items'),
    subtotal: document.getElementById('subtotal'),
    shipping: document.getElementById('shipping'),
    total: document.getElementById('total'),
    shippingAddress: document.getElementById('shipping-address'),
    shippingMethod: document.getElementById('shipping-method')
  };

  // Get order from localStorage
  const savedOrder = localStorage.getItem('simpleShopOrder');
  if (!savedOrder) {
    showErrorMessage();
    return;
  }
  
  const order = JSON.parse(savedOrder);
  displayOrderDetails(order);
}

/**
 * Display order details
 */
function displayOrderDetails(order) {
  // Display order ID
  if (elements.orderId) {
    elements.orderId.textContent = order.id;
  }
  
  // Display customer email
  if (elements.orderEmail) {
    elements.orderEmail.textContent = order.customer.email;
  }
  
  // Display order items
  if (elements.orderItems) {
    renderOrderItems(order.items);
  }
  
  // Display order totals
  if (elements.subtotal) {
    elements.subtotal.textContent = `${order.subtotal.toFixed(2)} DKK`;
  }
  
  if (elements.shipping) {
    elements.shipping.textContent = order.shipping === 0 ? 'Free' : `${order.shipping.toFixed(2)} DKK`;
  }
  
  if (elements.total) {
    elements.total.textContent = `${order.total.toFixed(2)} DKK`;
  }
  
  // Display shipping information
  if (elements.shippingAddress) {
    elements.shippingAddress.textContent = formatShippingAddress(order.customer);
  }
  
  if (elements.shippingMethod) {
    elements.shippingMethod.textContent = formatShippingMethod(order.shippingMethod);
  }
  
  // Fetch order details from server (optional, for verification)
  fetchOrderFromServer(order.id);
}

/**
 * Render order items
 */
function renderOrderItems(items) {
  elements.orderItems.innerHTML = '';
  
  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'd-flex justify-content-between mb-2';
    
    itemElement.innerHTML = `
      <span>${item.quantity} × ${item.name}</span>
      <span>${(item.price * item.quantity).toFixed(2)} DKK</span>
    `;
    
    elements.orderItems.appendChild(itemElement);
  });
}

/**
 * Format shipping address
 */
function formatShippingAddress(customer) {
  return `${customer.name}, ${customer.address}, ${customer.city} ${customer.zip}`;
}

/**
 * Format shipping method
 */
function formatShippingMethod(method) {
  switch (method) {
    case 'express':
      return 'Express Shipping (1-2 business days)';
    case 'premium':
      return 'Premium Shipping (Same day delivery)';
    default:
      return 'Standard Shipping (3-5 business days)';
  }
}

/**
 * Show error message if no order is found
 */
function showErrorMessage() {
  const container = document.querySelector('.card-body');
  if (container) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h3 class="mb-3">Order Not Found</h3>
        <p class="text-muted mb-4">We couldn't find your order details.</p>
        <a href="/" class="btn btn-primary">Return to Home</a>
      </div>
    `;
  }
}

/**
 * Fetch order from server (optional, for verification)
 */
async function fetchOrderFromServer(orderId) {
  try {
    const response = await fetch(`/checkout/api/order/${orderId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Order verified with server:', data.order);
      // You could update the UI with the server data if needed
    } else {
      console.warn('Could not verify order with server');
    }
  } catch (error) {
    console.error('Error fetching order from server:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCheckoutComplete);
