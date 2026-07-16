// Support both: a product saved via localStorage AND a plain link with ?id=
const params = new URLSearchParams(window.location.search);
const idFromUrl = Number(params.get("id"));

let product = JSON.parse(localStorage.getItem("selectedProduct"));

// If the stored product doesn't match the URL id, or nothing is stored, look it up
if (!product || (idFromUrl && product.id !== idFromUrl)) {
    if (idFromUrl && typeof products !== "undefined") {
        product = products.find(p => p.id === idFromUrl) || product;
    }
}

if (product) {
    const imgEl = document.getElementById("productImage");
    const nameEl = document.getElementById("productName");
    const priceEl = document.getElementById("productPrice");
    const catEl = document.getElementById("productCategory");
    const ratEl = document.getElementById("productRating");

    if (imgEl) {
        imgEl.src = product.image || "";
        imgEl.alt = product.name || "Product Image";
    }
    if (nameEl) nameEl.textContent = product.name || "Unnamed Product";
    if (priceEl) priceEl.textContent = `₹${Number(product.price || 0).toFixed(2)}`;
    if (catEl) catEl.textContent = product.category || "General";
    if (ratEl) ratEl.textContent = product.rating || "No reviews yet"; // fixed: was overwriting catEl

    const cartBtn = document.querySelector(".cart-btn");
    const buyBtn = document.querySelector(".buy-btn");

    if (cartBtn) {
        cartBtn.onclick = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({ name: product.name, price: product.price, image: product.image });
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${product.name} added to Cart! 🛒`);
        };
    }

    if (buyBtn) {
        buyBtn.onclick = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({ name: product.name, price: product.price, image: product.image });
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.href = "checkout.html";
        };
    }
} else {
    console.warn("No product details found — redirecting to products page.");
    window.location.href = "products.html";
}
