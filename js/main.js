// Navbar Functions
function checkLoginStatus() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo) {
    document.getElementById("user-name").textContent = userInfo.name;

    // Handle navigation buttons based on role
    const navButtonsContainer = document.getElementById(
      "nav-buttons-container"
    );
    if (navButtonsContainer) {
      if (userInfo.role === "admin") {
        // Admin navigation
        navButtonsContainer.innerHTML = `
                    <button class="nav-button" onclick="location.href='dashboard.html'">
                        <i class="fas fa-home"></i> Dashboard
                    </button>
                    <button class="nav-button" onclick="location.href='about.html'">
                        <i class="fas fa-info-circle"></i> About Us
                    </button>
                `;
      } else {
        // User navigation
        navButtonsContainer.innerHTML = `
                    <button class="nav-button" onclick="location.href='dashboard.html'">
                        <i class="fas fa-home"></i> Dashboard
                    </button>
                    <button class="nav-button" onclick="location.href='about.html'">
                        <i class="fas fa-info-circle"></i> About Us
                    </button>
                    <button class="nav-button" onclick="location.href='cart.html'">
                        <i class="fas fa-shopping-cart"></i> My Cart
                    </button>
                `;
      }
    }
  } else {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("userInfo");
  window.location.href = "index.html";
}

// Login Functions
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("userInfo", JSON.stringify(user));
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}

// Dashboard Functions
function initializeDashboard() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo) {
    window.location.href = "index.html";
    return;
  }

  if (userInfo.role === "admin") {
    document.querySelector(".admin-panel").style.display = "block";
  } else {
    document.querySelector(".user-panel").style.display = "block";
  }

  initializeSearchAndFilter();
  renderProducts();
}

// Profile Functions
function loadProfile() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("profile-name").textContent = userInfo.name;
  document.getElementById("profile-email").textContent = userInfo.email;
  document.getElementById("profile-role").textContent = userInfo.role;
}

// Load navbar dynamically
function loadNavbar() {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
      checkLoginStatus();
    });
}

// Initialize products from localStorage or use default data
let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Smartphone X",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    description: "Latest smartphone with advanced features...",
    quantity: 10, // Add available quantity
  },
  // Add more default products if needed
];

// Function to update localStorage
function updateLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Function to render products
function renderProducts() {
  const container = document.querySelector(".products-grid");
  if (!container) return;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.role === "admin";

  container.innerHTML = "";
  container.className = `products-grid ${isAdmin ? "admin" : ""}`;

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${product.image}" alt="${
      product.name
    }" class="product-image">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <p>Available: ${product.quantity}</p>
            ${
              isAdmin
                ? `
                <div class="product-actions">
                    <button class="action-button edit-button" onclick="editProduct(${product.id})">Edit</button>
                    <button class="action-button delete-button" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            `
                : `
                <button class="action-button add-to-cart-button" 
                    onclick="addToCart(${product.id})"
                    ${product.quantity < 1 ? "disabled" : ""}>
                    ${product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
                </button>
            `
            }
        `;
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("action-button")) {
        showProductDetails(product);
      }
    });
    container.appendChild(card);
  });
}

// Product modal functions
function showProductDetails(product) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <p>Available Quantity: ${product.quantity}</p>
            <p>${product.description}</p>
        </div>
    `;

  document.body.appendChild(modal);
  modal.style.display = "block";

  modal.querySelector(".close-button").onclick = () => {
    modal.remove();
  };
}

// Admin functions
function addProduct() {
  showProductForm();
}

function editProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    showProductForm(product);
  }
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((p) => p.id !== productId);
    updateLocalStorage();
    renderProducts();
    showNotification("Product deleted successfully!");
  }
}

// Product Form Functions
function showProductForm(product = null) {
  const modal = document.getElementById("productFormModal");
  const form = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalTitle");

  // Clear previous form data
  form.reset();

  if (product) {
    // Edit mode
    modalTitle.textContent = "Edit Product";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productQuantity").value = product.quantity;
    document.getElementById("productImage").value = product.image;
    document.getElementById("productDescription").value = product.description;
  } else {
    // Add mode
    modalTitle.textContent = "Add New Product";
    document.getElementById("productId").value = "";
    document.getElementById("productQuantity").value = "0";
  }

  modal.style.display = "block";

  // Close modal when clicking the close button
  modal.querySelector(".close-button").onclick = () => {
    modal.style.display = "none";
  };

  // Close modal when clicking outside
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function saveProduct() {
  const productId = document.getElementById("productId").value;
  const newProduct = {
    id: productId ? parseInt(productId) : Date.now(),
    name: document.getElementById("productName").value,
    price: parseFloat(document.getElementById("productPrice").value),
    quantity: parseInt(document.getElementById("productQuantity").value),
    image: document.getElementById("productImage").value,
    description: document.getElementById("productDescription").value,
  };

  if (productId) {
    // Update existing product
    const index = products.findIndex((p) => p.id === parseInt(productId));
    if (index !== -1) {
      // Preserve existing cart items when updating quantity
      const existingProduct = products[index];
      const quantityDiff = newProduct.quantity - existingProduct.quantity;

      // Check if reducing quantity is possible with existing cart items
      if (quantityDiff < 0) {
        const totalInCarts = users.reduce((total, user) => {
          const cartItem = user.cart?.find(
            (item) => item.productId === parseInt(productId)
          );
          return total + (cartItem?.quantity || 0);
        }, 0);

        if (totalInCarts > newProduct.quantity) {
          showNotification(
            "Cannot reduce quantity below amount in customer carts!"
          );
          return;
        }
      }

      products[index] = newProduct;
      showNotification("Product updated successfully!");
    }
  } else {
    // Add new product
    products.push(newProduct);
    showNotification("New product added successfully!");
  }

  // Update localStorage and refresh display
  updateLocalStorage();
  document.getElementById("productFormModal").style.display = "none";
  renderProducts();
}

// Search and Filter Functions
function initializeSearchAndFilter() {
  const searchInput = document.getElementById("searchInput");
  const priceFilter = document.getElementById("priceFilter");

  searchInput.addEventListener("input", filterProducts);
  priceFilter.addEventListener("change", filterProducts);
}

function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filterValue = document.getElementById("priceFilter").value;

  let filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );

  if (filterValue === "low-to-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filterValue === "high-to-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(filteredProducts) {
  const container = document.querySelector(".products-grid");
  if (!container) return;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.role === "admin";

  container.innerHTML = "";
  container.className = `products-grid ${isAdmin ? "admin" : ""}`;

  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${product.image}" alt="${
      product.name
    }" class="product-image">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <p>Available: ${product.quantity}</p>
            ${
              isAdmin
                ? `
                <div class="product-actions">
                    <button class="action-button edit-button" onclick="editProduct(${product.id})">Edit</button>
                    <button class="action-button delete-button" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            `
                : `
                <button class="action-button add-to-cart-button" 
                    onclick="addToCart(${product.id})"
                    ${product.quantity < 1 ? "disabled" : ""}>
                    ${product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
                </button>
            `
            }
        `;
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("action-button")) {
        showProductDetails(product);
      }
    });
    container.appendChild(card);
  });
}

// Add notification function
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add data validation function
function validateProductData(productData) {
  if (!productData.name || productData.name.trim() === "") {
    throw new Error("Product name is required");
  }
  if (!productData.price || productData.price <= 0) {
    throw new Error("Valid price is required");
  }
  if (isNaN(productData.quantity) || productData.quantity < 0) {
    throw new Error("Valid quantity is required (must be 0 or greater)");
  }
  if (!productData.image || !isValidUrl(productData.image)) {
    throw new Error("Valid image URL is required");
  }
  if (!productData.description || productData.description.trim() === "") {
    throw new Error("Product description is required");
  }
  return true;
}

// URL validation helper
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Add this at the top of the file
let users = JSON.parse(localStorage.getItem("users")) || [
  {
    name: "Admin User",
    role: "admin",
    email: "admin@gmail.com",
    password: "1234",
  },
  {
    name: "Regular User",
    role: "user",
    email: "user@gmail.com",
    password: "1234",
    cart: [],
  },
];

// Add cart functions
function addToCart(productId) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || userInfo.role === "admin") return;

  const userIndex = users.findIndex((u) => u.email === userInfo.email);
  if (userIndex === -1) return;

  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (product.quantity < 1) {
    showNotification("Sorry, this product is out of stock!");
    return;
  }

  const cartItem = users[userIndex].cart?.find(
    (item) => item.productId === productId
  );

  if (cartItem) {
    if (cartItem.quantity >= product.quantity) {
      showNotification("Sorry, no more items available in stock!");
      return;
    }
    cartItem.quantity++;
  } else {
    users[userIndex].cart = users[userIndex].cart || [];
    users[userIndex].cart.push({
      id: Date.now(),
      productId: productId,
      quantity: 1,
    });
  }

  // Decrease available quantity
  product.quantity--;
  localStorage.setItem("products", JSON.stringify(products));

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("userInfo", JSON.stringify(users[userIndex]));
  showNotification("Product added to cart!");
}

function updateCartQuantity(cartItemId, change) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || userInfo.role === "admin") return;

  const userIndex = users.findIndex((u) => u.email === userInfo.email);
  if (userIndex === -1) return;

  const cartItemIndex = users[userIndex].cart.findIndex(
    (item) => item.id === cartItemId
  );
  if (cartItemIndex === -1) return;

  const cartItem = users[userIndex].cart[cartItemIndex];
  const product = products.find((p) => p.id === cartItem.productId);
  if (!product) return;

  if (change > 0 && product.quantity < 1) {
    showNotification("Sorry, no more items available in stock!");
    return;
  }

  const newQuantity = cartItem.quantity + change;
  if (newQuantity < 1) {
    users[userIndex].cart.splice(cartItemIndex, 1);
    product.quantity += cartItem.quantity; // Return items to stock
  } else {
    cartItem.quantity = newQuantity;
    product.quantity -= change; // Update stock
  }

  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("userInfo", JSON.stringify(users[userIndex]));
  renderCart();
}
