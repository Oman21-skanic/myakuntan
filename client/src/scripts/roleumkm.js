let userId = null;
const notyfLogin = new Notyf({
  duration: 1500,
  ripple: true,
  position: {
    x: "right",
    y: "bottom",
  },
  types: [
    {
      type: "info",
      background: "#386cf3",
      dismissible: true,
      icon: {
        color: "#fff",
        className: "bx bx-info-circle bx-tada",
        tagName: "i",
      },
    },
    {
      type: "warning",
      background: "#e78d00",
      dismissible: true,
      icon: {
        color: "#fff",
        className: "bx bxs-error",
        tagName: "i",
      },
    },
    {
      type: "error",
      background: "#d71619",
      duration: 3000,
      dismissible: true,
    },
    {
      type: "success",
      background: "#49b803",
      duration: 3000,
      dismissible: true,
    },
  ],
});

async function fetchUserId() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/users/me", {
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      userId = data.data._id;
      console.log("User ID:", userId);
    } else {
      notyfLogin.open({
        type: "error",
        message: "Gagal mengambil data user: " + data.message,
      });
    }
  } catch (err) {
    console.error("Error saat ambil user:", err);
    notyfLogin.open({
      type: "error",
      message: "Terjadi kesalahan saat ambil user login",
    });
  }
}

fetchUserId();

const form = document.getElementById("roleForm");
const cards = document.querySelectorAll(".card");

// Highlight card yang dipilih
cards.forEach((card) => {
  const input = card.querySelector('input[type="radio"]');
  input.addEventListener("change", () => {
    cards.forEach((c) => c.classList.remove("selected"));
    if (input.checked) {
      card.classList.add("selected");
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!userId) {
    notyfLogin.open({
      type: "error",
      message: "User belum terautentikasi",
    });
    return;
  };

  const selected = document.querySelector('input[name="bidangUsaha"]:checked');
  if (!selected){
     notyfLogin.open({
      type: "info",
      message: "Pilih bidang usaha terlebih dahulu",
    });
    return;
    }

  const bidangUsaha = selected.value;

  const baseurl = `http://localhost:3000/api`;

  try {
    const response = await fetch(baseurl + `/users/${userId}/role`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bidangUsaha }),
    });

    const data = await response.json();
    if (response.ok) {
      notyfLogin.open({
        type: "success",
        message: data.message,
      });
      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 2000);
    } else {
      notyfLogin.open({
        type: "error",
        message: data.message,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    notyfLogin.open({
      type: "error",
      message: "Terjadi kesalahan saat mengirim data",
    });
  }
});
