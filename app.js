const menu = [
  { id: 1, name: "Chicken Biriyani", category: "Main Course", price: 180, icon: "🍗" },
  { id: 2, name: "Mutton Biriyani", category: "Main Course", price: 240, icon: "🍖" },
  { id: 3, name: "Fish Curry", category: "Main Course", price: 150, icon: "🐟" },
  { id: 4, name: "Chicken 65", category: "Starters", price: 140, icon: "🍗" },
  { id: 5, name: "Paneer 65", category: "Starters", price: 130, icon: "🧀" },
  { id: 6, name: "Veg Meals", category: "Meals", price: 120, icon: "🍛" },
  { id: 7, name: "Parotta", category: "Breads", price: 25, icon: "🥞" },
  { id: 8, name: "Chapati", category: "Breads", price: 30, icon: "🫓" },
  { id: 9, name: "Curd Rice", category: "Meals", price: 80, icon: "🍚" },
  { id: 10, name: "Fresh Lime", category: "Drinks", price: 50, icon: "🍋" },
  { id: 11, name: "Coke", category: "Drinks", price: 40, icon: "🥤" },
  { id: 12, name: "Water Bottle", category: "Drinks", price: 20, icon: "💧" }
];

const TAX_RATE = 0.05;
let cart = [];
let activeCategory = "All";
let invoiceSequence = Number(localStorage.getItem("restaurantInvoiceSequence") || "0");

const $ = (id) => document.getElementById(id);
const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 2
}).format(value);

function nextInvoiceNumber() {
  invoiceSequence += 1;
  localStorage.setItem("restaurantInvoiceSequence", String(invoiceSequence));
  return `INV-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(invoiceSequence).padStart(3, "0")}`;
}

let currentInvoiceNumber = nextInvoiceNumber();
$("invoiceNumber").textContent = currentInvoiceNumber;

function renderCategories() {
  const categories = ["All", ...new Set(menu.map((item) => item.category))];
  $("categoryTabs").innerHTML = categories.map((category) => `
    <button class="category-btn ${category === activeCategory ? "active" : ""}" data-category="${category}">
      ${category}
    </button>
  `).join("");

  document.querySelectorAll(".category-btn").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderCategories();
      renderMenu();
    });
  });
}

function renderMenu() {
  const query = $("searchInput").value.trim().toLowerCase();
  const items = menu.filter((item) => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch = !query || item.name.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  $("menuGrid").innerHTML = items.length
    ? items.map((item) => `
      <button class="menu-card" data-id="${item.id}" type="button">
        <div class="food-icon">${item.icon}</div>
        <h3>${item.name}</h3>
        <div class="category">${item.category}</div>
        <div class="price">${money(item.price)}</div>
      </button>
    `).join("")
    : '<div class="empty-cart"><strong>No items found</strong><span>Try another search.</span></div>';

  document.querySelectorAll(".menu-card").forEach((card) => {
    card.addEventListener("click", () => addToCart(Number(card.dataset.id)));
  });
}

function addToCart(id) {
  const item = menu.find((entry) => entry.id === id);
  const existing = cart.find((entry) => entry.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  renderCart();
}

function changeQuantity(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((entry) => entry.id !== id);
  renderCart();
}

function totals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  return { subtotal, tax, total: subtotal + tax };
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $("cartCount").textContent = `${count} item${count === 1 ? "" : "s"}`;

  $("cartItems").innerHTML = cart.length
    ? cart.map((item) => `
      <div class="cart-line">
        <div class="cart-line-main">
          <div><h3>${item.name}</h3><span class="rate">${money(item.price)} each</span></div>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
        <div class="quantity">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `).join("")
    : `<div class="empty-cart"><div class="empty-icon">🛒</div><strong>Your cart is empty</strong><span>Add food items from the menu.</span></div>`;

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(Number(button.dataset.id), Number(button.dataset.delta)));
  });

  const { subtotal, tax, total } = totals();
  $("subtotal").textContent = money(subtotal);
  $("tax").textContent = money(tax);
  $("total").textContent = money(total);
  $("generateInvoiceBtn").disabled = cart.length === 0;
}

function generateInvoice() {
  if (!cart.length) return;
  const { subtotal, tax, total } = totals();
  const customer = $("customerName").value.trim() || "Walk-in Customer";

  $("printInvoiceNumber").textContent = currentInvoiceNumber;
  $("invoiceDate").textContent = new Date().toLocaleString("en-IN", {
    dateStyle: "medium", timeStyle: "short"
  });
  $("printCustomerName").textContent = customer;
  $("invoiceLines").innerHTML = cart.map((item) => `
    <tr><td>${item.name}</td><td>${item.qty}</td><td>${money(item.price)}</td><td>${money(item.price * item.qty)}</td></tr>
  `).join("");
  $("printSubtotal").textContent = money(subtotal);
  $("printTax").textContent = money(tax);
  $("printTotal").textContent = money(total);
  $("invoiceModal").classList.remove("hidden");
}

function newBill() {
  cart = [];
  $("customerName").value = "";
  currentInvoiceNumber = nextInvoiceNumber();
  $("invoiceNumber").textContent = currentInvoiceNumber;
  renderCart();
  $("invoiceModal").classList.add("hidden");
}

$("searchInput").addEventListener("input", renderMenu);
$("generateInvoiceBtn").addEventListener("click", generateInvoice);
$("printInvoiceBtn").addEventListener("click", () => window.print());
$("closeModalBtn").addEventListener("click", () => $("invoiceModal").classList.add("hidden"));
$("clearCartBtn").addEventListener("click", () => { cart = []; renderCart(); });
$("newBillBtn").addEventListener("click", newBill);
$("invoiceModal").addEventListener("click", (event) => {
  if (event.target === $("invoiceModal")) $("invoiceModal").classList.add("hidden");
});

renderCategories();
renderMenu();
renderCart();