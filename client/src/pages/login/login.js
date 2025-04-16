     // Google OAuth URL
     const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=805561252134-mgf46ljpbtpq115n08oeodpfobms76a6.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=profile%20email';

     // Event listener untuk tombol Google login
     const btn = document.getElementById("google-login-btn");
     btn.addEventListener("click", (e) => {
       e.preventDefault();
       window.location.href = googleAuthUrl;
     });

     // Handler login form
     document
       .getElementById("loginForm")
       .addEventListener("submit", async function (event) {
         event.preventDefault();

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

         try {
           const response = await fetch(
             "http://localhost:3000/api/v1/auth/sessions",
             {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               credentials: "include",
               body: JSON.stringify({ email, password }),
             }
           );

           const result = await response.json();
           console.log(result);
           if (!response.ok) throw new Error(result.message);

           notyfLogin.open({
            type: "success",
            message: 'login berhasil, mengalihkan..',
           })
           setTimeout(() => (window.location.href = "../dashboard/index.html"), 2000);
         } catch (error) {
           notyfLogin.open({
            type: "error",
            message: error.message,
           })
         }
       });