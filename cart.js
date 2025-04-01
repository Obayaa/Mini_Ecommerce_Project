// Initialize cart from localStorage or as empty array
export function initializeCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
export function addToCart(product) {
    const cart = initializeCart();
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Product exists, increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Product doesn't exist, add with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartIcon();
    return cart;
}

// Remove item from cart
export function removeFromCart(productId) {
    let cart = initializeCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartIcon();
    return cart;
}

// Update item quantity
export function updateQuantity(productId, quantity) {
    const cart = initializeCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            return removeFromCart(productId);
        } else {
            cart[itemIndex].quantity = quantity;
            saveCart(cart);
            updateCartIcon();
        }
    }
    
    return cart;
}

// Calculate total price
export function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Update cart icon to show number of items
export function updateCartIcon() {
    const cart = initializeCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create or update badge
    let badge = document.getElementById('cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.id = 'cart-badge';
        badge.className = 'absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center';
        
        // Find cart icon container and make it relative for badge positioning
        const cartIcon = document.querySelector('.material-symbols-outlined.cart');
        if (cartIcon && cartIcon.parentElement) {
            cartIcon.parentElement.classList.add('relative');
            cartIcon.parentElement.appendChild(badge);
        }
    }
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Create and show cart modal
export function showCartModal() {
    const cart = initializeCart();
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('cart-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideCartModal();
            }
        });
    }
    
    // Update modal content
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Shopping Cart</h2>
                <button id="close-cart" class="text-gray-600 hover:text-gray-900">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            ${cart.length === 0 ? 
                '<p class="text-center py-4">Your cart is empty</p>' : 
                `<div class="space-y-4">
                    ${cart.map(item => `
                        <div class="flex items-center justify-between p-3 border-b">
                            <div class="flex items-center gap-3">
                                <img src="${item.image}" alt="${item.imageAlt}" class="w-16 h-16 object-cover rounded">
                                <div>
                                    <h3 class="font-medium">${item.name}</h3>
                                    <p class="text-gray-600">${item.currency} ${item.price}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                                <button class="remove-item ml-2 text-red-500" data-id="${item.id}">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                    <div class="pt-4 border-t">
                        <div class="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>${cart[0]?.currency || 'USD'} ${calculateTotal(cart)}</span>
                        </div>
                    </div>
                    <button id="checkout-btn" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full">
                        Proceed to Checkout
                    </button>
                </div>`
            }
        </div>
    `;
    
    modal.classList.remove('hidden');
    
    // Add event listeners for modal buttons
    document.getElementById('close-cart')?.addEventListener('click', hideCartModal);
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity - 1);
                showCartModal(); // Refresh modal
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
                showCartModal(); // Refresh modal
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.remove-item').dataset.id;
            removeFromCart(id);
            showCartModal(); // Refresh modal
        });
    });
    
    // Checkout button (placeholder for now)
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        alert('Thanks for purchasing at DeeGeez\'s shopping center! \n Checkout interface would be made soon');
    });
}

// Hide cart modal
export function hideCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Add some CSS for the cart
export function addCartStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .quantity-btn {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f3f4f6;
            border-radius: 4px;
            cursor: pointer;
        }
        .quantity-btn:hover {
            background-color: #e5e7eb;
        }
    `;
    document.head.appendChild(style);
}