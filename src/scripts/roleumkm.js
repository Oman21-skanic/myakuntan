// Handle form submission
document
  .getElementById("role-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get submit button for loading state
    const submitButton = document.querySelector(
      '#role-form button[type="submit"]'
    );
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

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Mengirim..";

      const roleInput = document.querySelector('input[name="role"]:checked');

      if (!roleInput) {
        throw new Error("Pilih tipe terlebih dahulu");
      }

      const data = {
        role: roleInput.value,
      };

      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000),
      };

      const response = await fetch(
        "https://api.example.com/xx/xx/xx",
        fetchOptions
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Unexpected API response");
      }

      console.log("Success:", result);
      notyfLogin.open({
        type: "success",
        message: "Berhasil mengirim",
      });

      document.getElementById("role-form").reset();
    } catch (error) {
      console.error("Error:", error.message);
            notyfLogin.open({
        type: "error",
        message: `${error.message}`,
      });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "LANJUT";
    }
  });
