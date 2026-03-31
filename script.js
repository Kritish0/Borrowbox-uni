const data = {
  Stationery: [
    {
      name: "Pen Set ✏️",
      img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80",
      buyPrice: 8,
      rentPrice: 2
    },
    {
      name: "Notebook 📓",
      img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80",
      buyPrice: 6,
      rentPrice: 2
    },
    {
      name: "Calculator 🧮",
      img: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=700&q=80",
      buyPrice: 25,
      rentPrice: 6
    }
  ],
  Furniture: [
    {
      name: "Study Table 🪑",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80",
      buyPrice: 85,
      rentPrice: 20
    },
    {
      name: "Chair 💺",
      img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=700&q=80",
      buyPrice: 45,
      rentPrice: 12
    },
    {
      name: "Lamp 💡",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80",
      buyPrice: 18,
      rentPrice: 5
    }
  ],
  Room: [
    {
      name: "Pillow 🛏️",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80",
      buyPrice: 20,
      rentPrice: 5
    },
    {
      name: "Heater 🔥",
      img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80",
      buyPrice: 40,
      rentPrice: 10
    },
    {
      name: "Kettle ☕",
      img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=700&q=80",
      buyPrice: 22,
      rentPrice: 6
    }
  ],
  Sports: [
    {
      name: "Football ⚽",
      img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=700&q=80",
      buyPrice: 18,
      rentPrice: 5
    },
    {
      name: "Badminton Set 🏸",
      img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=700&q=80",
      buyPrice: 26,
      rentPrice: 7
    }
  ],
  Notes: [
    {
      name: "Math Notes 📚",
      img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=700&q=80",
      buyPrice: 10,
      rentPrice: 3
    },
    {
      name: "IT Notes 💻",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80",
      buyPrice: 12,
      rentPrice: 4
    }
  ]
};

const popularItems = [
  { ...data.Stationery[1], category: "Stationery" },
  { ...data.Sports[0], category: "Sports" },
  { ...data.Furniture[1], category: "Furniture" }
];

const recentItems = [
  { ...data.Stationery[2], category: "Stationery" },
  { ...data.Room[2], category: "Room" },
  { ...data.Notes[1], category: "Notes" }
];

let cart = [];
let listedItems = [];

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").classList.remove("hidden");

  populateHorizontal("popularItems", popularItems, "buy");
  populateHorizontal("recentItems", recentItems, "rent");
}

function populateHorizontal(containerId, itemsArray, defaultAction = "rent") {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  itemsArray.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p class="price-tag">$${defaultAction === "buy" ? item.buyPrice : item.rentPrice} ${defaultAction === "buy" ? "buy" : "rent"}</p>
      <div class="meta">
        <span>${item.category || "Student essential"}</span>
        <span>${defaultAction === "buy" ? "Buy" : "Rent"}</span>
      </div>
      <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}')">Add to Cart 🛒</button>
    `;

    container.appendChild(card);
  });
}

function searchItems() {
  const query = document.getElementById("searchBar").value.toLowerCase().trim();
  const panel = document.getElementById("actionPanel");
  panel.innerHTML = "";

  if (!query) {
    panel.classList.add("hidden");
    return;
  }

  let foundItems = [];

  for (let category in data) {
    data[category].forEach(item => {
      if (item.name.toLowerCase().includes(query)) {
        foundItems.push({ ...item, category });
      }
    });
  }

  panel.classList.remove("hidden");
  panel.innerHTML = `
    <h3>Search Results</h3>
    <div class="panel-items" id="searchResults"></div>
  `;

  const box = document.getElementById("searchResults");

  if (foundItems.length === 0) {
    box.innerHTML = `<p class="empty-message">No items found for "${query}".</p>`;
    return;
  }

  foundItems.forEach(item => {
    box.innerHTML += `
      <div class="card">
        <img src="${item.img}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p class="price-tag">Buy: $${item.buyPrice} | Rent: $${item.rentPrice}</p>
        <div class="meta">
          <span>${item.category}</span>
          <span>Student item</span>
        </div>
        <select>
          <option>🗓️ Daily Rent</option>
          <option>📅 Weekly Rent</option>
          <option>📆 Monthly Rent</option>
          <option>🏫 Semester Rent</option>
          <option>🗓️ Yearly Rent</option>
        </select>
        <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}')">Add to Cart 🛒</button>
      </div>
    `;
  });
}

function addToCart(item) {
  cart.push(item);
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.length;
  document.getElementById("cartCountBottom").innerText = cart.length;

  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="empty-message">Your cart is empty.</li>`;
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    cartList.appendChild(li);
  });
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("hidden");
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert("Checkout successful!");
  cart = [];
  updateCartUI();
  document.getElementById("cart").classList.remove("show");
  document.getElementById("overlay").classList.add("hidden");
}

function showActionPanel(type) {
  const panel = document.getElementById("actionPanel");
  panel.classList.remove("hidden");

  if (type === "rent" || type === "buy") {
    panel.innerHTML = `
      <h3>${type === "rent" ? "Rent Items" : "Buy Items"}</h3>
      <p>Select a category to continue.</p>
      <div id="categoryButtons"></div>
    `;

    const categoryButtons = document.getElementById("categoryButtons");

    for (let category in data) {
      const button = document.createElement("button");
      button.className = "category-btn";
      button.innerText = category;
      button.onclick = () => openCategoryInPanel(category, type);
      categoryButtons.appendChild(button);
    }
  } else if (type === "sell") {
    panel.innerHTML = `
      <h3>Sell or Rent an Item</h3>
      <div class="sell-form">
        <input type="text" id="sellNamePanel" placeholder="Item Name">
        <input type="number" id="sellPricePanel" placeholder="Price ($)">
        <input type="text" id="sellImagePanel" placeholder="Image URL">
        <select id="sellTypePanel">
          <option>Sell</option>
          <option>Rent</option>
        </select>
        <button onclick="addSellItemPanel()">Post Item</button>
      </div>
    `;
  }
}

function openCategoryInPanel(category, type) {
  const panel = document.getElementById("actionPanel");

  panel.innerHTML = `
    <h3>${type === "rent" ? "Rent" : "Buy"} - ${category}</h3>
    <button class="back-btn" onclick="showActionPanel('${type}')">← Back</button>
    <div class="panel-items" id="categoryItems"></div>
  `;

  const box = document.getElementById("categoryItems");

  data[category].forEach(item => {
    box.innerHTML += `
      <div class="card">
        <img src="${item.img}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p class="price-tag">$${type === "buy" ? item.buyPrice : item.rentPrice} ${type === "buy" ? "buy" : "rent"}</p>
        <div class="meta">
          <span>${category}</span>
          <span>${type === "buy" ? "Buy" : "Rent"}</span>
        </div>
        ${
          type === "rent"
            ? `
          <select>
            <option>🗓️ Daily Rent</option>
            <option>📅 Weekly Rent</option>
            <option>📆 Monthly Rent</option>
            <option>🏫 Semester Rent</option>
            <option>🗓️ Yearly Rent</option>
          </select>
        `
            : ""
        }
        <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}')">Add to Cart 🛒</button>
      </div>
    `;
  });
}

function addSellItemPanel() {
  const name = document.getElementById("sellNamePanel").value.trim();
  const price = document.getElementById("sellPricePanel").value.trim();
  const img = document.getElementById("sellImagePanel").value.trim();
  const type = document.getElementById("sellTypePanel").value;

  if (!name || !price || !img) {
    alert("Please fill all fields.");
    return;
  }

  listedItems.push({
    name,
    price,
    img,
    type
  });

  alert(`${name} posted for ${type}.`);

  document.getElementById("sellNamePanel").value = "";
  document.getElementById("sellPricePanel").value = "";
  document.getElementById("sellImagePanel").value = "";

  showListings();
}

function showListings() {
  const panel = document.getElementById("actionPanel");
  panel.classList.remove("hidden");

  panel.innerHTML = `
    <h3>My Listings</h3>
    <div class="panel-items" id="myListings"></div>
  `;

  const box = document.getElementById("myListings");

  if (listedItems.length === 0) {
    box.innerHTML = `<p class="empty-message">No items listed yet.</p>`;
    return;
  }

  listedItems.forEach(item => {
    box.innerHTML += `
      <div class="card">
        <img src="${item.img}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p class="price-tag">$${item.price}</p>
        <div class="meta">
          <span>${item.type}</span>
          <span>My Listing</span>
        </div>
        <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}')">Add to Cart 🛒</button>
      </div>
    `;
  });
}

updateCartUI();
