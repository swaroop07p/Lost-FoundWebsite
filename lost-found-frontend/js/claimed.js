const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function loadClaimed() {
  const res = await fetch(`${API}/items/claimed`, {
    headers: { Authorization: token }
  });

  const items = await res.json();
  const container = document.getElementById("claimedItems");

  items.forEach(item => {
    container.innerHTML += `
      <div class="item-card">
        <h4>${item.itemName}</h4>
        <span class="badge claimed">Claimed</span>
        <p>Claimed by: <b>${item.claimedBy.name}</b></p>
        <p>Email: ${item.claimedBy.email}</p>
      </div>
    `;
  });
}

loadClaimed();
