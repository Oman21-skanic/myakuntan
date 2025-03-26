document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const notyfLogin = new Notyf({
      duration: 1000,
      ripple : true,
      position: {
        x: 'right',
        y: 'bottom',
      },
      types: [
        {
          type: 'warning',
          background: 'orange',
          icon: {
            className: 'material-icons',
            tagName: 'i',
            text: 'warning'
          }
        },
        {
          type: 'error',
          background: 'indianred',
          duration: 2000,
          dismissible: true
        },
        {
          type: 'success',
          background: 'green',
          duration: 2000,
          dismissible: true
        }
      ]
    });
  
    const formdata = {
      firstName,
      lastName,
      email,
      password
    };
  
    try {
      const response = await fetch('APIIII', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         },

         body: JSON.stringify(formdata)
      });
  
      if (!response.ok) {
        throw new Error('Signup failed');
      }
  
      const result = await response.json();
      notyfLogin.success(result.message);
      console.log(result.message);

      document.getElementById('signupForm').reset();
  
    } catch (error) {
      console.error(error.message);
    }

    notyfLogin.success('Akun berhasil dibuat! 🎉')
  });