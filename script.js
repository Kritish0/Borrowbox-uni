import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5eRu4osCsXxV74iCXgZ5sJN8kK1B3iGc",
  authDomain: "borrowbox-uni.firebaseapp.com",
  projectId: "borrowbox-uni",
  storageBucket: "borrowbox-uni.firebasestorage.app",
  messagingSenderId: "194399847190",
  appId: "1:194399847190:web:67fd77794e75c297ebc637",
  measurementId: "G-Q72LR4BMJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// Demo marketplace data
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

// Small helper for auth messages
function showMessage(message, isError = false) {
  const authMessage = document.getElementById("authMessage");
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#dc2626" : "#16a34a";
}

// Auth: Sign Up
async function signUp() {
  const fullName = document.getElementById("fullName")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!fullName || !email || !password) {
    showMessage("Please fill in name, email, and password.", true);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      createdAt: new Date().toISOString()
    });

    showMessage("Account created successfully.");
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Auth: Login
async function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    showMessage("Please enter both email and password.", true);
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage("Login successful.");
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Auth: Logout
async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error.message);
  }
}

async function loadUserListings() {
  if (!currentUser) return;

  try {
    const listingsQuery = query(
      collection(db, "listings"),
      where("ownerId", "==", currentUser.uid)
    );

    const querySnapshot = await getDocs(listingsQuery);

    listedItems = [];

    querySnapshot.forEach((docSnap) => {
      listedItems.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
  } catch (error) {
    console.error("Error loading listings:", error.message);
  }
}

// Show/hide app based on real auth state
onAuthStateChanged(auth, async (user) => {
  const loginPage = document.getElementById("loginPage");
  const appPage = document.getElementById("app");

  if (!loginPage || !appPage) return;

  if (user) {
    currentUser = user;

    loginPage.style.display = "none";
    appPage.classList.remove("hidden");

    populateHorizontal("popularItems", popularItems, "buy");
    populateHorizontal("recentItems", recentItems, "rent");

    await loadUserListings();
    updateCartUI();
  } else {
    currentUser = null;
    listedItems = [];

    loginPage.style.display = "flex";
    appPage.classList.add("hidden");
  }
});

function populateHorizontal(containerId, itemsArray, defaultAction = "rent") {
  const container = document.getElementById(containerId);
  if (!container) return;

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
  const query = document.getElementById("searchBar")?.value.toLowerCase().trim();
  const panel = document.getElementById("actionPanel");
  if (!panel) return;

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
  if (!box) return;

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
  const cartCount = document.getElementById("cartCount");
  const cartCountBottom = document.getElementById("cartCountBottom");
  const cartList = document.getElementById("cartList");

  if (cartCount) cartCount.innerText = cart.length;
  if (cartCountBottom) cartCountBottom.innerText = cart.length;
  if (!cartList) return;

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
  document.getElementById("cart")?.classList.toggle("show");
  document.getElementById("overlay")?.classList.toggle("hidden");
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert("Checkout successful!");
  cart = [];
  updateCartUI();
  document.getElementById("cart")?.classList.remove("show");
  document.getElementById("overlay")?.classList.add("hidden");
}

function showActionPanel(type) {
  const panel = document.getElementById("actionPanel");
  if (!panel) return;

  panel.classList.remove("hidden");

  if (type === "rent" || type === "buy") {
    panel.innerHTML = `
      <h3>${type === "rent" ? "Rent Items" : "Buy Items"}</h3>
      <p>Select a category to continue.</p>
      <div id="categoryButtons"></div>
    `;

    const categoryButtons = document.getElementById("categoryButtons");
    if (!categoryButtons) return;

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
  if (!panel) return;

  panel.innerHTML = `
    <h3>${type === "rent" ? "Rent" : "Buy"} - ${category}</h3>
    <button class="back-btn" onclick="showActionPanel('${type}')">← Back</button>
    <div class="panel-items" id="categoryItems"></div>
  `;

  const box = document.getElementById("categoryItems");
  if (!box) return;

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

async function addSellItemPanel() {
  const name = document.getElementById("sellNamePanel")?.value.trim();
  const price = document.getElementById("sellPricePanel")?.value.trim();
  const img = document.getElementById("sellImagePanel")?.value.trim();
  const type = document.getElementById("sellTypePanel")?.value;

  if (!name || !price || !img) {
    alert("Please fill all fields.");
    return;
  }

  if (!currentUser) {
    alert("You must be logged in to post an item.");
    return;
  }

  const newListing = {
    name,
    price: Number(price),
    img,
    type,
    ownerId: currentUser.uid,
    ownerEmail: currentUser.email,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, "listings"), newListing);

    listedItems.push({
      id: docRef.id,
      ...newListing
    });

    alert(`${name} posted for ${type}.`);

    document.getElementById("sellNamePanel").value = "";
    document.getElementById("sellPricePanel").value = "";
    document.getElementById("sellImagePanel").value = "";

    showListings();
  } catch (error) {
    alert("Error saving listing: " + error.message);
  }
}

function showListings() {
  const panel = document.getElementById("actionPanel");
  if (!panel) return;

  panel.classList.remove("hidden");

  panel.innerHTML = `
    <h3>My Listings</h3>
    <div class="panel-items" id="myListings"></div>
  `;

  const box = document.getElementById("myListings");
  if (!box) return;

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

// Expose functions to HTML buttons because this file is now a module
window.signUp = signUp;
window.login = login;
window.logout = logout;
window.searchItems = searchItems;
window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.showActionPanel = showActionPanel;
window.openCategoryInPanel = openCategoryInPanel;
window.addSellItemPanel = addSellItemPanel;
window.showListings = showListings;

updateCartUI();
