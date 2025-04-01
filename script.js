import {products} from './objects.js';
import {
    addToCart, 
    updateCartIcon, 
    showCartModal, 
    addCartStyles
} from './cart.js';

document.getElementById('menu-btn').addEventListener('click', function () {
    document.getElementById('nav-menu').classList.toggle('hidden');
});

// Function to generate HTML for all product cards
function renderProducts() {
    const productsContainer = document.querySelector('#products-container');

    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }

    // Create HTML for each product
    const productsHTML = products.map(product => `
      <div class="group bg-white p-4 shadow rounded-lg hover:shadow-lg transition-shadow">
        <img src="${product.image}" alt="${product.imageAlt}" class="w-full h-40 object-cover rounded-md group-hover:opacity-90 transition-opacity">
        <h3 class="text-lg font-semibold mt-3 group-hover:text-blue-600 transition-colors">${product.name}</h3>
        <p class="text-gray-600 mt-1">${product.currency} ${product.price}</p>
        <button class="add-to-cart mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full" 
                data-product-id="${product.id}">Add to Cart</button>
      </div>
    `).join('');

    // Insert the HTML into the container
    productsContainer.innerHTML = productsHTML;

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// Handle "Add to Cart" button clicks
function handleAddToCart(event) {
    const productId = event.target.dataset.productId;
    const product = products.find(p => p.id === productId);
    
    if (product) {
        addToCart(product);
        
        // Optional: Show some feedback when adding to cart
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.classList.add('bg-green-600');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
        }, 1000);
    }
}

// Initialize the page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartIcon();
    addCartStyles();
    
    // Add click event to cart icon to show cart modal
    const cartIcon = document.querySelector('.material-symbols-outlined.cart');
    if (cartIcon && cartIcon.textContent === 'add_shopping_cart') {
        cartIcon.parentElement.addEventListener('click', showCartModal);
    }
});