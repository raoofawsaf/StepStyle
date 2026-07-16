// ======================================
// PRODUCT CATALOG DATA
// ======================================
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

// ======================================
// PRODUCTS PAGE RENDERING (guarded — no-ops on other pages)
// ======================================
const productContainer = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const brandFilter = document.getElementById("brandFilter");

function renderProducts(list) {
    if (!productContainer) return;

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

    setupCardListeners();
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

function setupCardListeners() {
    productContainer.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.onclick = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({
                name: btn.getAttribute("data-name"),
                price: Number(btn.getAttribute("data-price")),
                image: btn.getAttribute("data-image")
            });
            localStorage.setItem("cart", JSON.stringify(cart));
            btn.textContent = "Added! ✓";
            btn.disabled = true;
            setTimeout(() => { btn.textContent = "Add to Cart"; btn.disabled = false; }, 1000);
        };
    });

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

if (productContainer) renderProducts(products);
// Add event listeners to all 'Add to Cart' buttons on your product page
document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        // Targets the button even if you click an icon inside it
        const btn = e.target.closest(".add-to-cart-btn");
        
        // 1. Gather product info from HTML data attributes
        const product = {
            name: btn.getAttribute("data-name"),
            price: Number(btn.getAttribute("data-price")) || 0,
            image: btn.getAttribute("data-image") || "placeholder.jpg",
            quantity: 1
        };

        // Safety check: Don't add empty products
        if (!product.name || product.price === 0) {
            console.error("Product data missing on this button element.");
            return;
        }

        // 2. Pull down the latest cart from localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // 3. Check if this specific item is already inside the array
        const existingItemIndex = cart.findIndex(item => item.name === product.name);

        if (existingItemIndex > -1) {
            // If it exists, increase quantity
            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        } else {
            // If it is new, push it to the list
            cart.push(product);
        }

        // 4. Save the updated cart state back to browser memory
        localStorage.setItem("cart", JSON.stringify(cart));
        
        alert(`${product.name} added to cart successfully!`);
    });
});

// Apne product.js ke card-generation code ko is structure se matching rakho:
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-card-img-wrapper">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-card-info">
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
            </div>
            <div class="product-card-price-row">
                <span class="price">$${product.price}</span>
                <button class="btn-add-cart">ADD +</button>
            </div>
        </div>
    `;
}