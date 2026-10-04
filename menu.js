const MENU_STORAGE_KEY = "restaurantMenu";
const DEFAULT_MENU = [
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

const $ = (id) => document.getElementById(id);
let menu = loadMenu();

function loadMenu() {
  try {
    const saved = JSON.parse(localStorage.getItem(MENU_STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.warn("Unable to load saved menu.", error);
  }
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(DEFAULT_MENU));
  return [...DEFAULT_MENU];
}

function saveMenu() {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function categories() {
  return [...new Set(menu.map((item) => item.category).filter(Boolean))].sort();
}

function renderFilters() {
  const selected = $("categoryFilter").value;
  $("categoryFilter").innerHTML = '<option value="">All categories</option>' +
    categories().map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
  $("categoryFilter").value = categories().includes(selected) ? selected : "";

  $("categoryOptions").innerHTML = categories()
    .map((category) => `<option value="${escapeHtml(category)}"></option>`).join("");
}

function renderTable() {
  const query = $("menuSearch").value.trim().toLowerCase();
  const category = $("categoryFilter").value;

  const items = menu.filter((item) => {
    const matchesSearch = !query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  $("menuTable").innerHTML = items.length ? `
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>
              <div class="managed-item">
                <span class="managed-icon">${escapeHtml(item.icon || "🍽️")}</span>
                <strong>${escapeHtml(item.name)}</strong>
              </div>
            </td>
            <td>${escapeHtml(item.category)}</td>
            <td><strong>₹${Number(item.price).toFixed(2)}</strong></td>
            <td>
              <div class="table-actions">
                <button class="action-btn" data-action="edit" data-id="${item.id}">Edit</button>
                <button class="action-btn danger" data-action="delete" data-id="${item.id}">Delete</button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : '<div class="empty-management"><div class="empty-icon">🍽️</div><strong>No menu items found</strong><span>Add a new item or change your search.</span></div>';

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      if (button.dataset.action === "edit") openEditItem(id);
      if (button.dataset.action === "delete") deleteItem(id);
    });
  });
}

function openAddItem() {
  $("itemForm").reset();
  $("itemId").value = "";
  $("itemModalTitle").textContent = "Add New Item";
  $("itemIcon").value = "🍽️";
  $("itemModal").classList.remove("hidden");
  $("itemName").focus();
}

function openEditItem(id) {
  const item = menu.find((entry) => entry.id === id);
  if (!item) return;

  $("itemId").value = String(item.id);
  $("itemName").value = item.name;
  $("itemCategory").value = item.category;
  $("itemPrice").value = item.price;
  $("itemIcon").value = item.icon || "🍽️";
  $("itemModalTitle").textContent = "Edit Menu Item";
  $("itemModal").classList.remove("hidden");
  $("itemName").focus();
}

function closeModal() {
  $("itemModal").classList.add("hidden");
}

function saveItem(event) {
  event.preventDefault();

  const id = Number($("itemId").value);
  const name = $("itemName").value.trim();
  const category = $("itemCategory").value.trim();
  const price = Number($("itemPrice").value);
  const icon = $("itemIcon").value.trim() || "🍽️";

  if (!name || !category || !Number.isFinite(price) || price <= 0) {
    alert("Please enter a valid item name, category and price.");
    return;
  }

  if (id) {
    const item = menu.find((entry) => entry.id === id);
    if (item) Object.assign(item, { name, category, price, icon });
  } else {
    const nextId = menu.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    menu.push({ id: nextId, name, category, price, icon });
  }

  saveMenu();
  renderFilters();
  renderTable();
  closeModal();
}

function deleteItem(id) {
  const item = menu.find((entry) => entry.id === id);
  if (!item) return;

  const confirmed = window.confirm(
    `Delete "${item.name}" from the menu? It will no longer appear on the billing screen.`
  );
  if (!confirmed) return;

  menu = menu.filter((entry) => entry.id !== id);
  saveMenu();
  renderFilters();
  renderTable();
}

$("addItemBtn").addEventListener("click", openAddItem);
$("itemForm").addEventListener("submit", saveItem);
$("cancelItemBtn").addEventListener("click", closeModal);
$("closeItemModalBtn").addEventListener("click", closeModal);
$("menuSearch").addEventListener("input", renderTable);
$("categoryFilter").addEventListener("change", renderTable);
$("itemModal").addEventListener("click", (event) => {
  if (event.target === $("itemModal")) closeModal();
});

renderFilters();
renderTable();