const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function loadClaimed() {
  const res = await fetch(`${API}/items/claimed`, {
    headers: { Authorization: token }
  });

  const items = await res.json();
  const container = document.getElementById("claimedItems");
  container.innerHTML = "";

  items.forEach(item => {
    container.innerHTML += `
      <div class="item-card" id="claimed-${item._id}">
        <h4>${item.itemName}</h4>
        <span class="badge claimed">Claimed</span>
        <p><b>Claimed by:</b> ${item.claimedBy.name}</p>
        <p><b>Email:</b> ${item.claimedBy.email}</p>
        <button style="background:#ef4444" onclick="removeItem('${item._id}')">
          Remove
        </button>
      </div>
    `;
  });
}

async function removeItem(id) {
  await fetch(`${API}/items/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });

  document.getElementById(`claimed-${id}`).remove();
}

loadClaimed();
