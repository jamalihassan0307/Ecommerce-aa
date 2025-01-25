function renderCart() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || !userInfo.cart) return;

  const cartContainer = document.getElementById("cart-items");
  // Get products from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];
  let total = 0;

  cartContainer.innerHTML = "";

  if (userInfo.cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    document.getElementById("cart-total").textContent = "0.00";
    return;
  }

  userInfo.cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) return;

    const itemTotal = product.price * cartItem.quantity;
    total += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="cart-item-details">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${
                      cartItem.id
                    }, -1)">-</button>
                    <span>${cartItem.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${
                      cartItem.id
                    }, 1)">+</button>
                </div>
                <p>Total: $${itemTotal.toFixed(2)}</p>
            </div>
        `;
    cartContainer.appendChild(itemElement);
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
}
