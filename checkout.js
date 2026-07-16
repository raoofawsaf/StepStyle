document.addEventListener("DOMContentLoaded", () => {
    const orderItemsContainer = document.getElementById("orderItems");
    const totalPriceEl = document.getElementById("totalPrice");
    const checkoutForm = document.getElementById("checkoutForm");
    
    // Promo Elements
    const promoInput = document.getElementById("promoInput");
    const applyPromoBtn = document.getElementById("applyPromoBtn");
    const promoFeedback = document.getElementById("promoFeedback");
    const discountContainer = document.getElementById("discountContainer");
    const discountValueEl = document.getElementById("discountValue");

    // Promo Configurations setup
    const AVAILABLE_PROMOS = {
        "STEP10": 0.10, // 10% Discount
        "STEP20": 0.20  // 20% Discount
    };
    let activeDiscountPercentage = 0;

    // Dynamic Fallback items
    const fallbackCart = [
        {
            id: 101,
            name: "StepStyle Air-Zoom Runner",
            price: 7499,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
        }
    ];

    let cart = JSON.parse(localStorage.getItem("stepstyle_cart")) || fallbackCart;

    // Helper to format currency safely to Indian Rupees (INR)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate baseline pricing before discounts
    const getSubtotal = () => {
        return cart.reduce((acc, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            return acc + (price * quantity);
        }, 0);
    };

    // Update dynamically calculated pricing details text rows
    const recalculateInvoiceTotals = () => {
        const subtotal = getSubtotal();
        const absoluteDiscount = subtotal * activeDiscountPercentage;
        const netFinalPayable = subtotal - absoluteDiscount;

        if (activeDiscountPercentage > 0) {
            discountContainer.style.display = "flex";
            discountValueEl.textContent = `-${formatCurrency(absoluteDiscount)}`;
        } else {
            discountContainer.style.display = "none";
        }

        if (totalPriceEl) {
            totalPriceEl.textContent = formatCurrency(netFinalPayable);
        }
    };

    // Render Order Summary Items securely
    const renderCheckoutSummary = () => {
        if (!orderItemsContainer) return;
        orderItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            orderItemsContainer.innerHTML = `<p style="color: #999; text-align: center; padding: 20px;">Your cart is empty.</p>`;
            if (totalPriceEl) totalPriceEl.textContent = "₹0";
            return;
        }

        cart.forEach(item => {
            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.quantity) || 1;
            const itemImg = item.image || 'placeholder.jpg';
            const itemName = item.name || 'Premium Footwear';

            const itemHTML = `
                <div class="summary-checkout-item">
                    <div class="summary-item-thumb">
                        <img src="${itemImg}" alt="${itemName}">
                    </div>
                    <div class="summary-item-info">
                        <h4>${itemName}</h4>
                        <p>Qty: ${itemQty}</p>
                    </div>
                    <div class="summary-item-price">
                        ${formatCurrency(itemPrice * itemQty)}
                    </div>
                </div>
            `;
            orderItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
        });

        recalculateInvoiceTotals();
    };

    // Coupon Apply Event Trigger
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener("click", () => {
            const sanitizedKey = promoInput.value.trim().toUpperCase();

            if (cart.length === 0) {
                alert("Cannot apply discount code on an empty cart.");
                return;
            }

            if (AVAILABLE_PROMOS.hasOwnProperty(sanitizedKey)) {
                activeDiscountPercentage = AVAILABLE_PROMOS[sanitizedKey];
                promoFeedback.style.display = "block";
                promoFeedback.style.color = "#2e7d32";
                promoFeedback.textContent = `Promo "${sanitizedKey}" applied! Savings of ${activeDiscountPercentage * 100}%.`;
            } else {
                activeDiscountPercentage = 0;
                promoFeedback.style.display = "block";
                promoFeedback.style.color = "#c62828";
                promoFeedback.textContent = "Invalid code. Try using 'STEP10' or 'STEP20'";
            }
            recalculateInvoiceTotals();
        });
    }

    // Handle Final Submission Checkout Form Formats
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert("Please add items to your cart before checking out!");
                return;
            }

            const checkedPaymentInput = document.querySelector('input[name="payment"]:checked');
            const selectedPayment = checkedPaymentInput ? checkedPaymentInput.value : "cod";
            
            let paymentMsg = "Cash On Delivery";
            if (selectedPayment === "upi") paymentMsg = "Instant UPI Apps";
            if (selectedPayment === "card") paymentMsg = "Credit/Debit Card Gateway";

            const netPayableValue = getSubtotal() * (1 - activeDiscountPercentage);

            alert(`Processing final amount of ${formatCurrency(netPayableValue)} via ${paymentMsg}...\nOrder Placed Successfully! Thank you for choosing StepStyle!`);
            
            localStorage.removeItem("stepstyle_cart");
            window.location.href = "index.html";
        });
    }

    renderCheckoutSummary();
});
