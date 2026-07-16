document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItems");
    const subtotalPriceEl = document.getElementById("subtotalPrice");
    const totalPriceEl = document.getElementById("totalPrice");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // Dynamic Mock Database (Fallback agar LocalStorage empty hai)
    const fallbackCart = [
        {
            id: 101,
            name: "StepStyle Air-Zoom Runner",
            price: 7499,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
        },
        {
            id: 102,
            name: "StepStyle Classic Street Sneakers",
            price: 5999,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80"
        }
    ];

    // Single unified key use karein: "stepstyle_cart" (or "cart")
    let cart = JSON.parse(localStorage.getItem("stepstyle_cart")) || fallbackCart;

    // Helper to format currency to Indian Rupees (INR)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate Prices & Render Totals
    const updateCartInvoice = () => {
        if (!subtotalPriceEl || !totalPriceEl) return;
        
        const subtotal = cart.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);
        
        // Update Subtotal and Total UI
        subtotalPriceEl.textContent = formatCurrency(subtotal);
        totalPriceEl.textContent = formatCurrency(subtotal);

        // Sync local storage state
        localStorage.setItem("stepstyle_cart", JSON.stringify(cart));
    };

    // Main Render Engine
    const renderCart = () => {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-view">
                    <i class="fa-solid fa-cart-flatbed-suitcases"></i>
                    <p>Your shopping cart is empty</p>
                    <a href="products.html" class="explore-shoes-btn" style="display:inline-block; margin-top:10px; text-decoration: none; padding: 10px 20px; background: #ff6b00; color: #000; border-radius: 5px; font-weight: bold;">Shop New Collection</a>
                </div>
            `;
            updateCartInvoice();
            return;
        }

        cart.forEach(item => {
            const itemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">${formatCurrency(item.price)}</p>
                    </div>
                    
                    <!-- Quantity Adjusters -->
                    <div class="cart-qty-control">
                        <button class="qty-btn dec-btn" aria-label="Decrease quantity">-</button>
                        <span class="qty-value">${item.quantity || 1}</span>
                        <button class="qty-btn inc-btn" aria-label="Increase quantity">+</button>
                    </div>

                    <!-- Delete Button -->
                    <button class="cart-item-delete" aria-label="Remove item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
        });

        attachActionListeners();
        updateCartInvoice();
    };

    // Interactive Action Listeners (Qty Change & Delete)
    const attachActionListeners = () => {
        // Increase Quantity
        document.querySelectorAll(".inc-btn").forEach(btn => {
            btn.onclick = (e) => {
                const itemId = parseInt(e.target.closest(".cart-item").dataset.id, 10);
                const item = cart.find(i => i.id === itemId);
                if (item) {
                    item.quantity = (item.quantity || 1) + 1;
                    renderCart();
                }
            };
        });

        // Decrease Quantity
        document.querySelectorAll(".dec-btn").forEach(btn => {
            btn.onclick = (e) => {
                const itemId = parseInt(e.target.closest(".cart-item").dataset.id, 10);
                const item = cart.find(i => i.id === itemId);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                    renderCart();
                }
            };
        });

        // Delete Item
        document.querySelectorAll(".cart-item-delete").forEach(btn => {
            btn.onclick = (e) => {
                const itemId = parseInt(e.target.closest(".cart-item").dataset.id, 10);
                cart = cart.filter(i => i.id !== itemId);
                renderCart();
            };
        });
    };

    // Checkout Trigger
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) {
                alert("Please add items to your cart before checking out!");
                return;
            }
            // checkout.html page par redirect karein
            window.location.href = "checkout.html";
        };
    }

    // Initial Execution
    renderCart();
});
