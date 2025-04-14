document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    const notyfLogin = new Notyf({
      duration: 1000,
      ripple: true,
      position: {
        x: "right",
        y: "bottom",
      },
      types: [
        {
          type: "warning",
          background: "orange",
          icon: {
            className: "material-icons",
            tagName: "i",
            text: "warning",
          },
        },
        {
          type: "error",
          background: "indianred",
          duration: 2000,
          dismissible: true,
        },
        {
          type: "success",
          background: "green",
          duration: 2000,
          dismissible: true,
        },
      ],
    });

    messageElement.textContent = "Sedang mendaftar...";

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      messageElement.textContent = "Registrasi berhasil dibuat! Mengalihkan...";
      setTimeout(() => (window.location.href = "/login/verify"), 2000);
    } catch (error) {
      messageElement.textContent = error.message;
    }
  });
