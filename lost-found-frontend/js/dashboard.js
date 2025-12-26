const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

// 🔒 Redirect if not logged in
if (!token) {
  window.location.href = "index.html";
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =========================
   TOAST NOTIFICATION
========================= */
function showToast(message, success = true) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.zIndex=10;
  toast.className = `toast show ${success ? "success" : "error"}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

/* =========================
   LOAD UNCLAIMED ITEMS
========================= */
async function loadItems() {
  try {
    const category = document.getElementById("category").value;
    const url = category
      ? `${API}/items/all?category=${category}`
      : `${API}/items/all`;

    const res = await fetch(url);
    const allItems = await res.json();

    // 👉 show ONLY unclaimed items
    const items = allItems.filter(item => !item.claimed);

    const container = document.getElementById("items");
    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = "<p>No items available</p>";
      return;
    }

    items.forEach((item, index) => {
      container.innerHTML += `
        <div class="item-card" id="card-${item._id}" data-aos="fade-up">
          <h4>${item.itemName}</h4>

          <p class="desc">${item.description}</p>

          <span class="badge">${item.category}</span>

          <button onclick="claimItem('${item._id}', 'card-${item._id}')">
            Claim
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    showToast("Failed to load items", false);
  }
}

/* =========================
   POST NEW ITEM
========================= */
async function postItem() {
  try {
    const body = {
      itemName: document.getElementById("itemName").value,
      location: document.getElementById("location").value,
      category: document.getElementById("itemCategory").value,
      description: document.getElementById("description").value,
      contactInfo: document.getElementById("contactInfo").value
    };

    await fetch(`${API}/items/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(body)
    });

    showToast("Item posted successfully 🎉");
    loadItems();

  } catch (err) {
    console.error(err);
    showToast("Failed to post item", false);
  }
}

/* =========================
   CLAIM ITEM (CORE LOGIC)
========================= */
async function claimItem(itemId, cardId) {
  try {
    await fetch(`${API}/items/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ itemId })
    });

    showToast("Item claimed successfully ✅");

    // 🔥 remove item from dashboard
    const card = document.getElementById(cardId);
    if (card) card.remove();

  } catch (err) {
    console.error(err);
    showToast("Failed to claim item", false);
  }
}

/* =========================
   MODAL CLOSE (if used)
========================= */
function closeModal() {
  const modal = document.getElementById("claimModal");
  if (modal) modal.style.display = "none";
}

/* =========================
   INITIAL LOAD
========================= */
loadItems();
