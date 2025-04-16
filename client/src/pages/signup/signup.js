const clientId = '805561252134-mgf46ljpbtpq115n08oeodpfobms76a6.apps.googleusercontent.com';
const redirectUri = 'http://localhost:3000/auth/google/callback';
const responseType = "code";
const scope = "profile email";
const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const name = `${firstName} ${lastName}`;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

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
          background: "#f3b008",
          icon: {
            className: "material-icons",
            tagName: "i",
            text: "warning",
          },
        },
        {
          type: "error",
          background: "#ec354b",
          duration: 2000,
          dismissible: true,
        },
        {
          type: "success",
          background: "#72ca13",
          duration: 2000,
          dismissible: true,
        },
        {
          type: "info",
          background: "#32bcf2",
          duration: 2000,
          dismissible: true,
        },
      ],
    });

    notyfLogin.open({
      type: "info",
      message: "Sedang Mendaftar...",
    })
    const baseurl = `http://localhost:3000/api`;

    try {
      const response = await fetch(baseurl + '/v1/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      notyfLogin.open({
        type: "success",
        message: "Akun Berhasil Di Buat!",
      })
      setTimeout(() => (window.location.href = "../verify-otp.html"), 2000);
    } catch (error) {
      notyfLogin.open({
        type: "error",
        message: error.message,
      })
    }
  });
