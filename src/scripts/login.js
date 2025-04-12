document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("inputEmail");
    const passwordInput = document.getElementById("inputPassword");

    if (!form || !emailInput || !passwordInput) {
        console.error("Elemen form tidak ditemukan!");
        return;
    }

    const dummyUsers = [
        { email: "user1@gmail.com", password: "password123" },
        { email: "user2@gmail.com", password: "securepass" }
    ];

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            showToast("Email wajib diisi.", "error");
            return;
        }
        if (!email.includes("@")) {
            showToast("Email harus mengandung tanda @.", "error");
            return;
        }
        if (!password) {
            showToast("Password wajib diisi.", "error");
            return;
        }
        if (password.length < 8) {
            showToast("Password minimal 8 karakter.", "error");
            return;
        }

        const user = dummyUsers.find(u => u.email === email);

        if (!user) {
            showToast("Data user tidak ditemukan.", "error");
            return;
        }

        if (user.password !== password) {
            showToast("Login Gagal. Terdapat kesalahan pada email atau password.", "error");
            return;
        }

        showToast("Berhasil Login!", "success");
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 3000);
    });

    // Validasi custom untuk input email dan password
    const customValidationHandler = (event) => {
        event.target.setCustomValidity("");

        if (event.target.validity.valueMissing) {
            event.target.setCustomValidity("Wajib diisi.");
            return;
        }

        if (event.target.type === "email" && !event.target.value.includes("@")) {
            event.target.setCustomValidity("Email harus mengandung tanda @.");
            return;
        }

        if (event.target.type === "password" && event.target.value.length < 8) {
            event.target.setCustomValidity("Minimal panjang password adalah 8 karakter.");
            return;
        }
    };

    emailInput.addEventListener("change", customValidationHandler);
    emailInput.addEventListener("invalid", customValidationHandler);
    passwordInput.addEventListener("change", customValidationHandler);
    passwordInput.addEventListener("invalid", customValidationHandler);

    // Menampilkan pesan validasi
    const handleBlur = (event) => {
        const isValid = event.target.validity.valid;
        const errorMessage = event.target.validationMessage;
        
        const connectedValidationId = event.target.getAttribute("aria-describedby");
        const connectedValidationEl = connectedValidationId
            ? document.getElementById(connectedValidationId)
            : null;

        if (connectedValidationEl && errorMessage && !isValid) {
            connectedValidationEl.innerText = errorMessage;
        } else if (connectedValidationEl) {
            connectedValidationEl.innerText = "";
        }
    };

    emailInput.addEventListener("blur", handleBlur);
    passwordInput.addEventListener("blur", handleBlur);
});

// Fungsi untuk menampilkan toast
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

