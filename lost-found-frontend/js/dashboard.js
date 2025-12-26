const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) window.location.href = "index.html";

/* LOGOUT */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* TOAST */
function showToast(message, success = true) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = `toast show ${success ? "success" : "error"}`;
  setTimeout(() => toast.className = "toast", 3000);
}

/* LOAD ITEMS */
async function loadItems() {
  const category = document.getElementById("category").value;
  const url = category ? `${API}/items/all?category=${category}` : `${API}/items/all`;

  const res = await fetch(url);
  const allItems = await res.json();

  const items = allItems.filter(i => !i.claimed);
  const container = document.getElementById("items");
  container.innerHTML = "";

  items.forEach(item => {
    container.innerHTML += `
      <div class="item-card" id="card-${item._id}" data-aos="fade-up">
        <h4>${item.itemName}</h4>
        <p class="desc">${item.description}</p>
        <span class="badge ${item.category}">${item.category}</span>
        <button onclick="claimItem('${item._id}', 'card-${item._id}')">
          Claim
        </button>
      </div>
    `;
  });
}

/* POST ITEM */
async function postItem() {
  await fetch(`${API}/items/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      itemName: itemName.value,
      location: location.value,
      category: itemCategory.value,
      description: description.value,
      contactInfo: contactInfo.value
    })
  });

  showToast("Item posted successfully 🎉");
  loadItems();
}

/* CLAIM ITEM + SHOW REPORTER DETAILS */
async function claimItem(itemId, cardId) {
  const res = await fetch(`${API}/items/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ itemId })
  });

  const data = await res.json();

  document.getElementById("contactText").innerHTML = `
    <b>${data.reporter.name}</b><br>
    ${data.reporter.email}<br>
    ${data.reporter.contactInfo}
  `;

  document.getElementById("claimModal").style.display = "flex";

  document.getElementById(cardId).remove();
}

/* MODAL CLOSE */
function closeModal() {
  document.getElementById("claimModal").style.display = "none";
}

loadItems();
