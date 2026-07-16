let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const wishlistItems = document.getElementById("wishlistItems");
const emptyWishlist = document.getElementById("emptyWishlist");

function displayWishlist() {
    if (!wishlistItems || !emptyWishlist) return;

    if (wishlist.length === 0) {
        wishlistItems.style.display = "none";
        emptyWishlist.style.display = "flex";
        return;
    }

    wishlistItems.style.display = "grid";
    emptyWishlist.style.display = "none";

    wishlistItems.innerHTML = wishlist.map((product, index) => {
        const price = Number(product.price) || 0;
        const img = product.image || 'placeholder.jpg';
        const name = product.name || 'Premium Shoe';

        return `
            <div class="wishlist-product-card">
                <button class="wishlist-remove-icon-btn" data-index="${index}" title="Remove from Wishlist">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="wishlist-image-container">
                    <img src="${img}" alt="${name}">
                </div>
                <div class="wishlist-card-details">
                    <h3>${name}</h3>
                    <p class="wishlist-card-price">₹${price.toFixed(2)}</p>
                    <button class="wishlist-add-to-cart-btn" data-index="${index}">
                        <i class="fa-solid fa-cart-plus"></i> Add To Cart
                    </button>
                </div>
            </div>
        `;
    }).join("");

    setupActionListeners();
}

function setupActionListeners() {
    // 1. Setup Remove Items Event Click Listeners
    wishlistItems.querySelectorAll(".wishlist-remove-icon-btn").forEach(button => {
        button.onclick = (e) => {
            const btn = e.target.closest(".wishlist-remove-icon-btn");
            const index = parseInt(btn.getAttribute("data-index"), 10);
            removeWishlistItem(index);
        };
    });

    // 2. Setup Move to Cart Items Event Click Listeners
    wishlistItems.querySelectorAll(".wishlist-add-to-cart-btn").forEach(button => {
        button.onclick = (e) => {
            const btn = e.target.closest(".wishlist-add-to-cart-btn");
            const index = parseInt(btn.getAttribute("data-index"), 10);
            moveToCart(index);
        };
    });
}

function removeWishlistItem(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    displayWishlist();
}

function moveToCart(index) {
    const product = wishlist[index];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(item => item.name === product.name);
    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({
            name: product.name,
            price: Number(product.price) || 0,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} moved to shopping cart!`);
    
    // Auto remove item from wishlist grid layout after transferring to the cart
    removeWishlistItem(index);
}

// Initial script execution runtime call
displayWishlist();
document.addEventListener("DOMContentLoaded", () => {
    const wishlistItemsContainer = document.getElementById("wishlistItems");
    const emptyWishlistState = document.getElementById("emptyWishlist");

    // Dynamic mock list fallback (Agar LocalStorage khali hai toh display hone ke liye)
    const fallbackWishlist = [
        {
            id: 1,
            name: "HyperGlide Sneaker V2",
            price: "₹8,499",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" // Fast loading sneaker img
        },
        {
            id: 2,
            name: "Apex Court High-Tops",
            price: "₹11,999",
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80"
        }
    ];

    // Load data from LocalStorage or use fallback
    let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || fallbackWishlist;

    // Save update state utility
    const updateStorageAndRender = () => {
        localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
        renderWishlist();
    };

    // Render Logic Engine
    const renderWishlist = () => {
        if (!wishlistItemsContainer) return;

        // Clear existing static HTML blocks
        wishlistItemsContainer.innerHTML = "";

        if (currentWishlist.length === 0) {
            wishlistItemsContainer.style.display = "none";
            emptyWishlistState.style.display = "flex";
            return;
        }

        // Show items grid and hide empty view
        wishlistItemsContainer.style.display = "grid";
        emptyWishlistState.style.display = "none";

        currentWishlist.forEach(product => {
            const card = document.createElement("div");
            card.className = "wishlist-card";
            card.innerHTML = `
                <button class="remove-wishlist-btn" data-id="${product.id}" aria-label="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
                <div class="wishlist-img-box">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="wishlist-details">
                    <h3>${product.name}</h3>
                    <p class="wishlist-price">${product.price}</p>
                    <button class="add-to-cart-action">
                        <i class="fa-solid fa-cart-plus"></i> Add To Cart
                    </button>
                </div>
            `;
            wishlistItemsContainer.appendChild(card);
        });

        // Attach event listeners dynamically to remove action buttons
        const deleteButtons = document.querySelectorAll(".remove-wishlist-btn");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetId = parseInt(e.currentTarget.getAttribute("data-id"));
                // Filter array to remove item
                currentWishlist = currentWishlist.filter(item => item.id !== targetId);
                updateStorageAndRender();
            });
        });
    };

    // Run render on initial load
    renderWishlist();
});