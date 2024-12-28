
function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleButton = event.target; // The clicked button
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "Show";
    }
}
document.getElementById('signinform').addEventListener('submit', signinUser);
async function signinUser(event) {
            event.preventDefault(); 
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }) 
                });

                const data = await response.json();
                
                if (data.success) {
                    window.location.href = '/home'; 
                } else {
                    document.getElementById('message').innerHTML=data.message;
                }
            } catch (error) {
                console.error('Error during signin:', error);
            }
        }

