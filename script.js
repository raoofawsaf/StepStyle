// =========================================================
// STEPSTYLE GLOBAL SCRIPT (UNIFIED — SINGLE SOURCE OF TRUTH)
// One cart key ("cart"), one wishlist key ("wishlist"),
// used consistently across every page. No duplicate listeners.
// =========================================================

// =========================================================
// TOAST NOTIFICATION ENGINE
// =========================================================
window.showToast = (message, type = "info", duration = 3000) => {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }

    const icons = {
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        warning: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };
    const iconClass = icons[type] || icons.info;

    const toast = document.createElement("div");
    toast.className = `toast-card ${type}`;
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><div class="toast-message">${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        toast.addEventListener("transitionend", () => toast.remove());
    }, duration);
};

// =========================================================
// PRODUCT CATALOG DATA (single copy, used by products page,
// product-details page, and homepage)
// =========================================================
const products = [
    { id: 1, name: "Urban Runner", category: "Sneakers", brand: "StepStyle", price: 3499, rating: "★★★★★", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Street Air", category: "Sneakers", brand: "Premium", price: 4299, rating: "★★★★★", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Flex Max", category: "Running Shoes", brand: "SportX", price: 2899, rating: "★★★★☆", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Trail Blazer", category: "Sports Shoes", brand: "SportX", price: 3299, rating: "★★★★★", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "Classic Oxford", category: "Formal Shoes", brand: "Premium", price: 3999, rating: "★★★★★", image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Casual Comfort", category: "Casual Shoes", brand: "StepStyle", price: 2499, rating: "★★★★☆", image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=600&q=80" },
    { id: 7, name: "Cloud Slide", category: "Slippers", brand: "StepStyle", price: 1499, rating: "★★★★☆", image: "https://cdn11.bigcommerce.com/s-2eq7o/images/stencil/900x1450/products/1654/3925/cloud_pillow_foam_slides__84807.1646153028.jpg?c=2" },
    { id: 8, name: "Beach Sandal", category: "Sandals", brand: "Premium", price: 999, rating: "★★★★☆", image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80" },
    { id: 9, name: "Shoe Shine Kit", category: "Shoe Care", brand: "StepStyle", price: 599, rating: "★★★★★", image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80" },
    { id: 10, name: "Sport Socks Pack", category: "Accessories", brand: "SportX", price: 399, rating: "★★★★★", image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=600&q=80" }
];

// =========================================================
// SHARED CART / WISHLIST HELPERS — used by every page
// =========================================================
const CART_KEY = "cart";
const WISHLIST_KEY = "wishlist";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ name: item.name, price: Number(item.price) || 0, image: item.image || "", quantity: 1 });
    }
    saveCart(cart);
    return cart;
}

function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}
function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

// =========================================================
// MAIN
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

    // ---------- 1. MOBILE MENU TOGGLE ----------
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = menuBtn.querySelector("i");
            const isOpen = navLinks.classList.contains("active");
            menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
            if (icon) icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });
    }

    // ---------- 2. DYNAMIC COPYRIGHT YEAR ----------
    const copyright = document.querySelector(".copyright");
    if (copyright) {
        copyright.textContent = `© ${new Date().getFullYear()} StepStyle. All Rights Reserved.`;
    }

    // ---------- 3. AUTH (LOGIN / SIGNUP / SESSION) ----------
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const navActions = document.querySelector(".nav-actions");

    const checkUserSession = () => {
        const loggedInUser = localStorage.getItem("stepstyle_user");
        const loginBtn = document.querySelector(".login-btn");
        if (loggedInUser && navActions) {
            const user = JSON.parse(loggedInUser);
            if (loginBtn) loginBtn.remove();
            if (!document.getElementById("userProfileNav")) {
                navActions.insertAdjacentHTML("beforeend", `
                    <div class="user-profile-nav" id="userProfileNav">
                        <span style="font-size:0.9rem; font-weight:500; color:#ff6b00; margin-right: 10px;">
                            <i class="fa-solid fa-user"></i> ${user.name}
                        </span>
                        <button class="logout-btn" id="logoutBtn">Logout</button>
                    </div>
                `);
                document.getElementById("logoutBtn").onclick = () => {
                    localStorage.removeItem("stepstyle_user");
                    showToast("Logged out successfully!", "info");
                    setTimeout(() => window.location.reload(), 1000);
                };
            }
        }
    };
    checkUserSession();

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = signupForm.querySelector('input[placeholder="Full Name"]');
            const emailInput = signupForm.querySelector('input[type="email"]');
            const passwordInput = signupForm.querySelector('input[type="password"]');

            if (!nameInput || !emailInput || !passwordInput || !nameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value) {
                showToast("Please fill in all details!", "warning");
                return;
            }

            const registrationData = {
                name: nameInput.value.trim().toUpperCase(),
                email: emailInput.value.trim().toLowerCase(),
                password: passwordInput.value
            };

            let registeredUsers = JSON.parse(localStorage.getItem("stepstyle_users_db")) || [];
            if (registeredUsers.some(u => u.email === registrationData.email)) {
                showToast("This email is already registered! Redirecting to login...", "warning");
                setTimeout(() => window.location.href = "login.html", 1500);
                return;
            }

            registeredUsers.push(registrationData);
            localStorage.setItem("stepstyle_users_db", JSON.stringify(registeredUsers));
            localStorage.setItem("temp_signup_email", registrationData.email);

            showToast("Account created successfully! Redirecting...", "success");
            setTimeout(() => window.location.href = "login.html", 1500);
        });
    }

    if (loginForm) {
        const emailField = loginForm.querySelector('input[type="email"]');
        const savedTempEmail = localStorage.getItem("temp_signup_email");
        if (savedTempEmail && emailField) {
            emailField.value = savedTempEmail;
            localStorage.removeItem("temp_signup_email");
        }

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = loginForm.querySelector('input[type="email"]').value.trim().toLowerCase();
            const passwordInput = loginForm.querySelector('input[type="password"]').value;

            if (!emailInput || !passwordInput) {
                showToast("Please fill in all details!", "warning");
                return;
            }

            const registeredUsers = JSON.parse(localStorage.getItem("stepstyle_users_db")) || [];
            const matchingUser = registeredUsers.find(u => u.email === emailInput);

            if (matchingUser) {
                if (matchingUser.password === passwordInput) {
                    localStorage.setItem("stepstyle_user", JSON.stringify({ email: matchingUser.email, name: matchingUser.name }));
                    showToast(`Welcome back, ${matchingUser.name}!`, "success");
                    setTimeout(() => window.location.href = "index.html", 1500);
                } else {
                    showToast("Incorrect Password! Please try again.", "error");
                }
            } else {
                const mockUser = { email: emailInput, name: emailInput.split("@")[0].toUpperCase() };
                localStorage.setItem("stepstyle_user", JSON.stringify(mockUser));
                showToast(`Welcome back, ${mockUser.name}!`, "success");
                setTimeout(() => window.location.href = "index.html", 1500);
            }
        });
    }

    // ---------- 4. GLOBAL "ADD TO CART" — event delegation ----------
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-to-cart-btn, .quick-add-btn");
        if (!btn) return;

        const name = btn.getAttribute("data-name");
        const price = btn.getAttribute("data-price");
        const image = btn.getAttribute("data-image");

        if (!name) return;

        addToCart({ name, price, image });
        showToast(`${name} added to cart! 🛒`, "success");

        btn.disabled = true;
        setTimeout(() => { btn.disabled = false; }, 800);
    });

    // ---------- 5. GLOBAL "ADD TO WISHLIST" — event delegation ----------
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".wishlist-btn");
        if (!btn || btn.classList.contains("remove-wishlist-btn") || btn.classList.contains("wishlist-remove-icon-btn")) return;

        const item = {
            name: btn.getAttribute("data-name"),
            price: Number(btn.getAttribute("data-price")) || 0,
            category: btn.getAttribute("data-category") || "Footwear",
            image: btn.getAttribute("data-image") || ""
        };
        if (!item.name) return;

        const wishlist = getWishlist();
        if (wishlist.some(w => w.name === item.name)) {
            showToast("Already in your Wishlist! ❤️", "warning");
            return;
        }
        wishlist.push(item);
        saveWishlist(wishlist);
        btn.classList.add("active");
        showToast(`${item.name} added to Wishlist! ❤️`, "success");
    });

    // ---------- 6. PRODUCTS PAGE (grid + filters) ----------
    const productContainer = document.getElementById("productGrid");
    if (productContainer) {
        const searchInput = document.getElementById("searchInput");
        const searchBtn = document.getElementById("searchBtn");
        const categoryFilter = document.getElementById("categoryFilter");
        const priceFilter = document.getElementById("priceFilter");
        const brandFilter = document.getElementById("brandFilter");

        function renderProducts(list) {
            if (list.length === 0) {
                productContainer.innerHTML = `<p class="no-products">No products found.</p>`;
                return;
            }
            productContainer.innerHTML = list.map(product => `
                <div class="product-card">
                    <div class="product-thumb">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <button class="wishlist-btn" aria-label="Add to Wishlist"
                                data-name="${product.name}" data-price="${product.price}"
                                data-category="${product.category}" data-image="${product.image}">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <span class="category-tag">${product.category}</span>
                        <h3>${product.name}</h3>
                        <div class="stars">${product.rating}</div>
                        <div class="price-row">
                            <span class="price">₹${product.price}</span>
                            <button class="add-to-cart-btn"
                                    data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                                Add to Cart
                            </button>
                        </div>
                        <button class="btn-outline view-btn" data-id="${product.id}">View Details</button>
                    </div>
                </div>
            `).join("");

            productContainer.querySelectorAll(".view-btn").forEach(btn => {
                btn.onclick = () => {
                    const id = Number(btn.getAttribute("data-id"));
                    const product = products.find(p => p.id === id);
                    if (product) {
                        localStorage.setItem("selectedProduct", JSON.stringify(product));
                        window.location.href = `product-details.html?id=${id}`;
                    }
                };
            });
        }

        function applyFilters() {
            let result = [...products];
            if (searchInput) {
                const query = searchInput.value.toLowerCase().trim();
                if (query) result = result.filter(p => p.name.toLowerCase().includes(query));
            }
            if (categoryFilter && categoryFilter.value !== "all") {
                result = result.filter(p => p.category === categoryFilter.value);
            }
            if (brandFilter && brandFilter.value !== "all") {
                result = result.filter(p => p.brand === brandFilter.value);
            }
            if (priceFilter) {
                if (priceFilter.value === "low") result.sort((a, b) => a.price - b.price);
                else if (priceFilter.value === "high") result.sort((a, b) => b.price - a.price);
            }
            renderProducts(result);
        }

        if (searchInput) searchInput.addEventListener("input", applyFilters);
        if (searchBtn) searchBtn.addEventListener("click", applyFilters);
        if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
        if (priceFilter) priceFilter.addEventListener("change", applyFilters);
        if (brandFilter) brandFilter.addEventListener("change", applyFilters);

        renderProducts(products);
    }

    // ---------- 7. PRODUCT DETAILS PAGE ----------
    const productImageEl = document.getElementById("productImage");
    if (productImageEl) {
        const params = new URLSearchParams(window.location.search);
        const idFromUrl = Number(params.get("id"));
        let product = JSON.parse(localStorage.getItem("selectedProduct"));

        if (!product || (idFromUrl && product.id !== idFromUrl)) {
            if (idFromUrl) product = products.find(p => p.id === idFromUrl) || product;
        }

        if (product) {
            const nameEl = document.getElementById("productName");
            const priceEl = document.getElementById("productPrice");
            const catEl = document.getElementById("productCategory");
            const ratEl = document.getElementById("productRating");

            productImageEl.src = product.image || "";
            productImageEl.alt = product.name || "Product Image";
            if (nameEl) nameEl.textContent = product.name || "Unnamed Product";
            if (priceEl) priceEl.textContent = `₹${Number(product.price || 0).toFixed(2)}`;
            if (catEl) catEl.textContent = product.category || "General";
            if (ratEl) ratEl.textContent = product.rating || "No reviews yet";

            const cartBtn = document.querySelector(".cart-btn");
            const buyBtn = document.querySelector(".buy-btn");

            if (cartBtn) {
                cartBtn.onclick = () => {
                    addToCart({ name: product.name, price: product.price, image: product.image });
                    showToast(`${product.name} added to Cart! 🛒`, "success");
                };
            }
            if (buyBtn) {
                buyBtn.onclick = () => {
                    addToCart({ name: product.name, price: product.price, image: product.image });
                    window.location.href = "checkout.html";
                };
            }
        } else {
            console.warn("No product details found — redirecting to products page.");
            window.location.href = "products.html";
        }
    }

    // ---------- 8. CART PAGE ----------
    const cartItemsContainer = document.getElementById("cartItems");
    if (cartItemsContainer) {
        const subtotalPriceEl = document.getElementById("subtotalPrice");
        const totalPriceEl = document.getElementById("totalPrice");
        const checkoutBtn = document.getElementById("checkoutBtn");

        const formatCurrency = (amount) =>
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

        const updateCartInvoice = (cart) => {
            if (!subtotalPriceEl || !totalPriceEl) return;
            const subtotal = cart.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);
            subtotalPriceEl.textContent = formatCurrency(subtotal);
            totalPriceEl.textContent = formatCurrency(subtotal);
        };

        const renderCart = () => {
            const cart = getCart();
            cartItemsContainer.innerHTML = "";

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty-view">
                        <i class="fa-solid fa-cart-flatbed-suitcases"></i>
                        <p>Your shopping cart is empty</p>
                        <a href="products.html" class="explore-shoes-btn" style="display:inline-block; margin-top:10px;">Shop New Collection</a>
                    </div>
                `;
                updateCartInvoice(cart);
                return;
            }

            cart.forEach((item, index) => {
                cartItemsContainer.insertAdjacentHTML("beforeend", `
                    <div class="cart-item" data-index="${index}">
                        <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p class="cart-item-price">${formatCurrency(item.price)}</p>
                        </div>
                        <div class="cart-qty-control">
                            <button class="qty-btn dec-btn" aria-label="Decrease quantity">-</button>
                            <span class="qty-value">${item.quantity || 1}</span>
                            <button class="qty-btn inc-btn" aria-label="Increase quantity">+</button>
                        </div>
                        <button class="cart-item-delete" aria-label="Remove item"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                `);
            });

            cartItemsContainer.querySelectorAll(".inc-btn").forEach(btn => {
                btn.onclick = (e) => {
                    const index = parseInt(e.target.closest(".cart-item").dataset.index, 10);
                    const cart = getCart();
                    cart[index].quantity = (cart[index].quantity || 1) + 1;
                    saveCart(cart);
                    renderCart();
                };
            });
            cartItemsContainer.querySelectorAll(".dec-btn").forEach(btn => {
                btn.onclick = (e) => {
                    const index = parseInt(e.target.closest(".cart-item").dataset.index, 10);
                    const cart = getCart();
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                        saveCart(cart);
                        renderCart();
                    }
                };
            });
            cartItemsContainer.querySelectorAll(".cart-item-delete").forEach(btn => {
                btn.onclick = (e) => {
                    const index = parseInt(e.target.closest(".cart-item").dataset.index, 10);
                    const cart = getCart();
                    cart.splice(index, 1);
                    saveCart(cart);
                    renderCart();
                };
            });

            updateCartInvoice(cart);
        };

        if (checkoutBtn) {
            checkoutBtn.onclick = () => {
                if (getCart().length === 0) {
                    showToast("Please add items to your cart before checking out!", "warning");
                    return;
                }
                window.location.href = "checkout.html";
            };
        }

        renderCart();
    }

    // ---------- 9. CHECKOUT PAGE ----------
    const orderItemsContainer = document.getElementById("orderItems");
    if (orderItemsContainer) {
        const totalPriceEl = document.getElementById("totalPrice");
        const checkoutForm = document.getElementById("checkoutForm");
        const promoInput = document.getElementById("promoInput");
        const applyPromoBtn = document.getElementById("applyPromoBtn");
        const promoFeedback = document.getElementById("promoFeedback");
        const discountContainer = document.getElementById("discountContainer");
        const discountValueEl = document.getElementById("discountValue");

        const AVAILABLE_PROMOS = { "STEP10": 0.10, "STEP20": 0.20 };
        let activeDiscountPercentage = 0;

        const formatCurrency = (amount) =>
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

        const getSubtotal = () => getCart().reduce((acc, item) => acc + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);

        const recalculateInvoiceTotals = () => {
            const subtotal = getSubtotal();
            const absoluteDiscount = subtotal * activeDiscountPercentage;
            const netFinalPayable = subtotal - absoluteDiscount;

            if (discountContainer) {
                if (activeDiscountPercentage > 0) {
                    discountContainer.style.display = "flex";
                    if (discountValueEl) discountValueEl.textContent = `-${formatCurrency(absoluteDiscount)}`;
                } else {
                    discountContainer.style.display = "none";
                }
            }
            if (totalPriceEl) totalPriceEl.textContent = formatCurrency(netFinalPayable);
        };

        const renderCheckoutSummary = () => {
            const cart = getCart();
            orderItemsContainer.innerHTML = "";

            if (cart.length === 0) {
                orderItemsContainer.innerHTML = `<p style="color: #999; text-align: center; padding: 20px;">Your cart is empty.</p>`;
                if (totalPriceEl) totalPriceEl.textContent = "₹0";
                return;
            }

            cart.forEach(item => {
                const itemPrice = Number(item.price) || 0;
                const itemQty = Number(item.quantity) || 1;
                orderItemsContainer.insertAdjacentHTML("beforeend", `
                    <div class="summary-checkout-item">
                        <div class="summary-item-thumb"><img src="${item.image || ''}" alt="${item.name}"></div>
                        <div class="summary-item-info"><h4>${item.name}</h4><p>Qty: ${itemQty}</p></div>
                        <div class="summary-item-price">${formatCurrency(itemPrice * itemQty)}</div>
                    </div>
                `);
            });
            recalculateInvoiceTotals();
        };

        if (applyPromoBtn && promoInput) {
            applyPromoBtn.addEventListener("click", () => {
                const sanitizedKey = promoInput.value.trim().toUpperCase();
                if (getCart().length === 0) {
                    showToast("Cannot apply discount code on an empty cart.", "warning");
                    return;
                }
                if (AVAILABLE_PROMOS.hasOwnProperty(sanitizedKey)) {
                    activeDiscountPercentage = AVAILABLE_PROMOS[sanitizedKey];
                    if (promoFeedback) {
                        promoFeedback.style.display = "block";
                        promoFeedback.style.color = "#2e7d32";
                        promoFeedback.textContent = `Promo "${sanitizedKey}" applied! Savings of ${activeDiscountPercentage * 100}%.`;
                    }
                } else {
                    activeDiscountPercentage = 0;
                    if (promoFeedback) {
                        promoFeedback.style.display = "block";
                        promoFeedback.style.color = "#c62828";
                        promoFeedback.textContent = "Invalid code. Try 'STEP10' or 'STEP20'";
                    }
                }
                recalculateInvoiceTotals();
            });
        }

        if (checkoutForm) {
            checkoutForm.addEventListener("submit", (e) => {
                e.preventDefault();
                if (getCart().length === 0) {
                    showToast("Please add items to your cart before checking out!", "warning");
                    return;
                }
                const checkedPaymentInput = document.querySelector('input[name="payment"]:checked');
                const selectedPayment = checkedPaymentInput ? checkedPaymentInput.value : "cod";
                let paymentMsg = "Cash On Delivery";
                if (selectedPayment === "upi") paymentMsg = "Instant UPI Apps";
                if (selectedPayment === "card") paymentMsg = "Credit/Debit Card Gateway";

                const netPayableValue = getSubtotal() * (1 - activeDiscountPercentage);
                showToast(`Order placed via ${paymentMsg}! Total ${formatCurrency(netPayableValue)}. Thank you!`, "success", 4000);

                saveCart([]);
                setTimeout(() => window.location.href = "index.html", 1800);
            });
        }

        renderCheckoutSummary();
    }

    // ---------- 10. WISHLIST PAGE ----------
    const wishlistItemsContainer = document.getElementById("wishlistItems");
    if (wishlistItemsContainer) {
        const emptyWishlist = document.getElementById("emptyWishlist");

        const renderWishlistPage = () => {
            const wishlist = getWishlist();

            if (wishlist.length === 0) {
                wishlistItemsContainer.innerHTML = "";
                wishlistItemsContainer.style.display = "none";
                if (emptyWishlist) emptyWishlist.style.display = "flex";
                return;
            }

            wishlistItemsContainer.style.display = "grid";
            if (emptyWishlist) emptyWishlist.style.display = "none";

            wishlistItemsContainer.innerHTML = wishlist.map((item, index) => `
                <div class="wishlist-product-card">
                    <button class="wishlist-remove-icon-btn" data-index="${index}" title="Remove from Wishlist">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div class="wishlist-image-container">
                        <img src="${item.image || ''}" alt="${item.name}">
                    </div>
                    <div class="wishlist-card-details">
                        <h3>${item.name}</h3>
                        <p class="wishlist-card-price">₹${Number(item.price || 0).toFixed(2)}</p>
                        <button class="wishlist-add-to-cart-btn" data-index="${index}">
                            <i class="fa-solid fa-cart-plus"></i> Add To Cart
                        </button>
                    </div>
                </div>
            `).join("");

            wishlistItemsContainer.querySelectorAll(".wishlist-remove-icon-btn").forEach(btn => {
                btn.onclick = () => {
                    const index = parseInt(btn.getAttribute("data-index"), 10);
                    const wishlist = getWishlist();
                    wishlist.splice(index, 1);
                    saveWishlist(wishlist);
                    renderWishlistPage();
                };
            });

            wishlistItemsContainer.querySelectorAll(".wishlist-add-to-cart-btn").forEach(btn => {
                btn.onclick = () => {
                    const index = parseInt(btn.getAttribute("data-index"), 10);
                    const wishlist = getWishlist();
                    const item = wishlist[index];
                    addToCart({ name: item.name, price: item.price, image: item.image });
                    showToast(`${item.name} moved to cart!`, "success");
                    wishlist.splice(index, 1);
                    saveWishlist(wishlist);
                    renderWishlistPage();
                };
            });
        };

        renderWishlistPage();
    }

    // ---------- 11. CONTACT FORM ----------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector(".submit-action-btn");
            const btnText = submitBtn ? submitBtn.querySelector("span") : null;
            const btnIcon = submitBtn ? submitBtn.querySelector("i") : null;

            if (submitBtn) {
                submitBtn.style.opacity = "0.7";
                submitBtn.disabled = true;
                if (btnText) btnText.textContent = "Sending...";
                if (btnIcon) btnIcon.className = "fa-solid fa-spinner fa-spin";
            }

            setTimeout(() => {
                contactForm.innerHTML = `
                    <div class="form-success-message" style="text-align: center; padding: 2rem 1rem; color: #fff;">
                        <div style="font-size: 3rem; color: #ff6b00; margin-bottom: 1rem;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h3 style="margin-bottom: 0.5rem; font-weight: 600;">Thank You!</h3>
                        <p style="color: rgba(255,255,255,0.6); font-size: 0.95rem;">Your message has been sent successfully. We will get back to you within 24 hours.</p>
                    </div>
                `;
                showToast("Message sent successfully!", "success");
            }, 1200);
        });
    }

    // ---------- 12. NEWSLETTER ----------
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
        const btn = newsletterForm.querySelector("button");
        const input = newsletterForm.querySelector("input");
        if (btn && input) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!input.value.trim()) {
                    showToast("Please enter a valid email address.", "warning");
                } else {
                    showToast("Subscribed Successfully! Welcome to StepStyle.", "success");
                    input.value = "";
                }
            });
        }
    }

    // ---------- 13. COUNTDOWN TIMER (FLASH DEALS) ----------
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (hoursEl && minutesEl && secondsEl) {
        let hours = 12, minutes = 45, seconds = 9;
        setInterval(() => {
            if (seconds > 0) { seconds--; }
            else {
                seconds = 59;
                if (minutes > 0) { minutes--; }
                else {
                    minutes = 59;
                    if (hours > 0) { hours--; }
                    else { hours = 12; minutes = 45; seconds = 9; }
                }
            }
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }
});