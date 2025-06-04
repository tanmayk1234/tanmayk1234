document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Load products
    loadProducts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize cart from localStorage
    initCart();
}

function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // Get active filter
    const activeFilter = document.querySelector('.filter-btn.active');
    const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    
    // Filter products
    const filteredProducts = filterValue === 'all' 
        ? products 
        : products.filter(product => product.category === filterValue);
    
    // Create product cards
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="overlay">
                <a href="#" class="add-to-cart" data-id="${product.id}">Add to Cart</a>
            </div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
        </div>
    `;
    
    return card;
}

function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Reload products with filter
            loadProducts();
        });
    });
    
    // Add to cart buttons (using event delegation)
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            event.preventDefault();
            const productId = parseInt(event.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(event) {
            event.preventDefault();
            toggleCartSection();
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            showCheckout();
        });
    }
    
    // Payment method radio buttons
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment details
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.classList.add('hidden');
            });
            
            // Show selected payment details
            const selectedPaymentDetails = document.getElementById(`${this.value}-details`);
            if (selectedPaymentDetails) {
                selectedPaymentDetails.classList.remove('hidden');
            }
        });
    });
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            placeOrder();
        });
    }
    
    // Continue shopping button in success modal
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            hideModal();
            window.location.href = '#collection';
        });
    }
    
    // Close modal button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
    }
}

// Cart functionality
let cart = [];

function initCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('pearlCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count
    updateCartCount();
    
    // Show feedback
    showAddToCartFeedback(product.name);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCart() {
    localStorage.setItem('pearlCart', JSON.stringify(cart));
}

function showAddToCartFeedback(productName) {
    // Create a temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'add-to-cart-feedback';
    feedback.textContent = `${productName} added to cart!`;
    
    // Add to body
    document.body.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

function toggleCartSection() {
    const cartSection = document.getElementById('cart-section');
    if (!cartSection) return;
    
    // Toggle visibility
    cartSection.classList.toggle('hidden');
    
    // If showing cart, update cart items
    if (!cartSection.classList.contains('hidden')) {
        updateCartItems();
    }
}

function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
    }
    
    // Add cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <span class="remove-item" data-id="${item.id}">×</span>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateItemQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateItemQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    
    // Update cart summary
    updateCartSummary();
}

function updateItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        // Remove item if quantity is 0 or less
        removeFromCart(id);
    } else {
        // Update cart
        saveCart();
        updateCartCount();
        updateCartItems();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    updateCartItems();
}

function updateCartSummary() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const totalElement = document.getElementById('cart-total');
    
    if (!subtotalElement || !shippingElement || !totalElement) return;
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping (free over $100, otherwise $10)
    const shipping = subtotal > 100 ? 0 : 10;
    
    // Calculate total
    const total = subtotal + shipping;
    
    // Update elements
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function showCheckout() {
    // Hide cart section
    const cartSection = document.getElementById('cart-section');
    if (cartSection) {
        cartSection.classList.add('hidden');
    }
    
    // Show checkout section
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.classList.remove('hidden');
    }
    
    // Update order summary
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalElement = document.getElementById('order-total');
    
    if (!orderItemsContainer || !orderTotalElement) return;
    
    // Clear existing items
    orderItemsContainer.innerHTML = '';
    
    // Add order items
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        orderItem.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
    
    // Calculate total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;
    
    // Update total
    orderTotalElement.textContent = `$${total.toFixed(2)}`;
}

function placeOrder() {
    // Validate form fields
    if (!validateCheckoutForm()) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Process order (in a real app, this would send data to a server)
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Hide checkout section
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.classList.add('hidden');
    }
    
    // Show success modal
    showSuccessModal();
}

function validateCheckoutForm() {
    // Get required fields
    const requiredFields = document.querySelectorAll('#shipping-form input[required], #shipping-form select[required]');
    
    // Check if all required fields are filled
    let valid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Check payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (selectedPayment && selectedPayment.value === 'credit-card') {
        // Validate credit card fields
        const cardFields = document.querySelectorAll('#credit-card-details input');
        cardFields.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
    }
    
    return valid;
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Google Sign-In functionality
function handleCredentialResponse(response) {
    // This function will be called when a user successfully signs in with Google
    // In a real application, you would verify the credential with your backend
    console.log("Google Sign-In successful!");
    
    // Get user info from the credential
    const credential = response.credential;
    const payload = parseJwt(credential);
    
    // Show welcome message
    if (payload && payload.name) {
        showWelcomeMessage(payload.name);
    }
}

function parseJwt(token) {
    try {
        // Get the payload part of the JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error parsing JWT", e);
        return null;
    }
}

function showWelcomeMessage(name) {
    // Create a welcome message element
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'welcome-message';
    welcomeMsg.textContent = `Welcome, ${name}!`;
    
    // Add to header
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(welcomeMsg);
        
        // Remove after a few seconds
        setTimeout(() => {
            welcomeMsg.remove();
        }, 5000);
    }
}