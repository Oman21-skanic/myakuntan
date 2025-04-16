import Dropdown from "./sidebardropdown.js";

document.addEventListener("DOMContentLoaded", () => {
  new Dropdown("dropdownBtn", "dropdownMenu");
});

const datatest = [
  {
    id: 1,
    namaTransaksi: "Pembelian Perlengkapan Kantor",
    tanggal: "2023-05-15",
    akun: "Beban Perlengkapan",
    tipe: "berkurang",
    nominal: 1250000,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.getElementById("openModalBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeBtn = document.querySelector(".close-btn");

  // Open modal when button is clicked
  openModalBtn.addEventListener("click", function () {
    modalOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  // Close modal when X button is clicked
  closeBtn.addEventListener("click", function () {
    modalOverlay.style.display = "none";
    document.body.style.overflow = "auto";
    resetForm();
  });

  // Close modal when clicking outside the modal box
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
      document.body.style.overflow = "auto";
      resetForm();
    }
  });
});

const form = document.getElementById("transactionForm");
const resultInput = document.getElementById("resultInput");
const submitBtn = document.querySelector(
  '#transactionForm button[type="submit"]'
);
const STORAGE_KEY = "transactions";

// Add hidden input for ID in the form
const idInput = document.createElement("input");
idInput.type = "hidden";
idInput.id = "id";
form.insertBefore(idInput, form.firstChild);

const elements = {
  id: document.getElementById("id"),
  namaTransaksi: document.getElementById("namaTransaksi"),
  tanggal: document.getElementById("tanggal"),
  akun: document.getElementById("akun"),
  tipe: document.getElementById("tipe"),
  nominal: document.getElementById("nominal"),
  modalDebit: document.getElementById("modalDebit"),
  modalKredit: document.getElementById("modalKredit"),
  modalSaldo: document.getElementById("modalSaldo"),
  kasDebit: document.getElementById("kasDebit"),
  kasKredit: document.getElementById("kasKredit"),
  kasSaldo: document.getElementById("kasSaldo"),
};

function resetForm() {
  form.reset();
  elements.id.value = "";
  submitBtn.textContent = "Tambahkan";
}

const updateValues = (akun, tipe, nominal) => {
  // ... your existing updateValues function remains the same ...
};

function init() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datatest));
  }
  renderTransactions();
}

function getTransactions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function renderTransactions() {
  const transactions = getTransactions();
  resultInput.innerHTML = "";

  if (transactions.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    row.className = "text-center";
    cell.colSpan = 6;
    cell.className = "text-center py-4 text-gray-500";
    cell.style.textAlign = "center";
    cell.textContent = "Saat ini Anda belum ada data transaksi";
    row.appendChild(cell);
    resultInput.appendChild(row);
    return;
  }

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${transaction.namaTransaksi}</td>
      <td class="p-2">${transaction.tanggal}</td>
      <td class="p-2">${transaction.akun}</td>
      <td class="p-2">${
        transaction.tipe === "berkurang"
          ? transaction.nominal.toLocaleString()
          : 0
      }</td>
      <td class="p-2">${
        transaction.tipe === "bertambah"
          ? transaction.nominal.toLocaleString()
          : 0
      }</td>
      <td class="p-2 flex gap-2">
        <button onclick="editTransaction(${
          transaction.id
        })" class="bg-transparent hover:cursor-pointer text-white font-bold p-1 rounded">
          <img src="/src/assets/images/pencil.svg" class="w-[15px] hover:scale-110 transition-transform"/>
        </button>
        <button onclick="deleteTransaction(${
          transaction.id
        })" class="bg-transparent text-white font-bold p-1 rounded">
          <img src="/src/assets/images/trash.svg" class="size-[15px] hover:scale-110 transition-transform"/>
        </button>
      </td>
    `;
    resultInput.appendChild(row);
  });
}

form.addEventListener("submit", (e) => {
  const transaction = {
    id: elements.id.value ? parseInt(elements.id.value) : Date.now(),
    namaTransaksi: elements.namaTransaksi.value,
    tanggal: elements.tanggal.value,
    akun: elements.akun.value,
    tipe: elements.tipe.value,
    nominal: Number(elements.nominal.value),
  };

  let transactions = getTransactions();

  if (elements.id.value) {
    transactions = transactions.map((t) =>
      t.id === transaction.id ? transaction : t
    );
  } else {
    transactions.push(transaction);
  }

  saveTransactions(transactions);
  renderTransactions();

  // Close modal and reset form
  document.getElementById("modalOverlay").style.display = "none";
  document.body.style.overflow = "auto";
  resetForm();
});

window.editTransaction = function (id) {
  const transactions = getTransactions();
  const transaction = transactions.find((t) => t.id === id);

  if (transaction) {
    elements.id.value = transaction.id;
    elements.namaTransaksi.value = transaction.namaTransaksi;
    elements.tanggal.value = transaction.tanggal;
    elements.akun.value = transaction.akun;
    elements.tipe.value = transaction.tipe;
    elements.nominal.value = transaction.nominal;
    submitBtn.textContent = "Update Transaksi";

    // Open modal
    document.getElementById("modalOverlay").style.display = "flex";
    document.body.style.overflow = "hidden";
  }
};

window.deleteTransaction = async function (id) {
  if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
    try {
      const transactions = getTransactions().filter((t) => t.id !== id);
      saveTransactions(transactions);
      renderTransactions();

      notyf.open({
        type: "delete",
        message: "Transaksi berhasil dihapus!",
      });
    } catch (error) {
      notyf.error("Gagal menghapus transaksi");
    }
  }
};

init();
