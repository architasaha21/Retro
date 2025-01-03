// STEP 1: Initial setup and mobile detection
// Purpose: Set up basic variables and detect mobile devices
document.addEventListener('DOMContentLoaded', function () {
    // Original variables for cart functionality
    const menuContainers = document.querySelectorAll('.menu_container');
    
    // New variables for mobile menu
    const menuButton = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    let isMenuOpen = false;
    let scrollPosition = 0;
    
    // Function to detect mobile devices
    const isMobile = () => window.innerWidth <= 768;

    // STEP 2: Add scroll lock functionality
    // Purpose: Prevent background scrolling on mobile when menu is open
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuButton?.classList.toggle('active');
        mobileMenu?.classList.toggle('active');
        
        if (isMobile()) {
            if (isMenuOpen) {
                // Save and lock scroll position
                scrollPosition = window.pageYOffset;
                document.body.style.top = `-${scrollPosition}px`;
                document.body.classList.add('menu-open');
            } else {
                // Restore scroll position
                document.body.classList.remove('menu-open');
                document.body.style.top = '';
                window.scrollTo(0, scrollPosition);
            }
        }
    }

    // STEP 3: Add improved notification system
    // Purpose: Replace basic alert with better visual notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 25px',
            backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '1000'
        });
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // STEP 4: Enhance cart functionality
    // Purpose: Improve cart management with quantities and better storage
    function addToCart(item) {
        try {
            // Get existing cart
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // Check for existing item
            const existingItemIndex = cartItems.findIndex(
                cartItem => cartItem.name === item.name
            );
            
            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                cartItems[existingItemIndex].quantity = 
                    (cartItems[existingItemIndex].quantity || 1) + 1;
            } else {
                // Add new item with quantity
                cartItems.push({
                    ...item,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            showNotification(`${item.name} added to cart successfully`);
            updateCartCounter(cartItems.length);
            return true;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            showNotification('Failed to add item to cart', 'error');
            return false;
        }
    }

    // STEP 5: Add cart counter
    // Purpose: Show visual indicator of cart items
    function updateCartCounter(count) {
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // STEP 6: Add event listeners
    // Purpose: Handle menu and cart interactions
    
    // Mobile menu events
    menuButton?.addEventListener('click', toggleMenu);
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', () => {
        if (!isMobile() && isMenuOpen) {
            document.body.classList.remove('menu-open');
            document.body.style.top = '';
        }
    });

    // STEP 7: Initialize cart
    // Purpose: Set up initial cart state
    const initialCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCounter(initialCartItems.length);

    // STEP 8: Update original cart click handler
    // Purpose: Integrate new cart functionality with existing code
    menuContainers.forEach(function (container) {
        container.addEventListener('click', function (event) {
            if (event.target.classList.contains('butt')) {
                const item = event.target.closest('.items');
                if (!item) return;
                
                const itemName = item.querySelector('h3')?.textContent;
                const itemPrice = item.querySelector('p')?.textContent;
                
                if (!itemName || !itemPrice) {
                    showNotification('Error: Could not add item to cart', 'error');
                    return;
                }
                
                const newItem = {
                    name: itemName,
                    price: itemPrice,
                    id: `${itemName}-${Date.now()}`
                };
                
                if (addToCart(newItem)) {
                    window.location.href = "cart.html";
                }
            }
        });
    });
});
