const errorMessages = document.getElementById("errorMessages");
    
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
 
document.getElementById('signupForm').addEventListener('submit', userExists);
async function userExists(event){
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    errorMessages.innerHTML = "";
    const response = await fetch('/auth/userExists', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
     const data = await response.json();

     if (response.status === 400) {
            const message = document.createElement("p");
            message.textContent = data.message;
            errorMessages.appendChild(message);
      } 
      else if (response.status === 200) {
          checkPassword();
      }
}


function checkPassword() {
    errorMessages.innerHTML = "";
    const password = document.getElementById("password").value;
    const message = document.createElement("p");
    message.textContent = 'Password must contain:';
    errorMessages.appendChild(message);
   
    const criteria = [
    { regex: /.{8,}/, message: "> At least 8 characters." },
    { regex: /[A-Z]/, message: "> At least one uppercase letter." },
    { regex: /[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/]/, message: "> At least one special character." },
    { regex: /^\S+$/, message: "> No spaces allowed." }
    ];

    let isValid = true;

    // Check each criterion
    criteria.forEach(criterion => {
        if (!criterion.regex.test(password)) {
            const message = document.createElement("p");
            message.textContent = criterion.message;
            errorMessages.appendChild(message);
            isValid = false;
        }
    });
    if(isValid){
      errorMessages.innerHTML="";
        generateOTP();
    }
}
 
async function generateOTP() {
         
          console.log("generate otp function");
          document.getElementById('loading').style.display='block';
          errorMessages.innerHTML = "";
          const email = document.getElementById('email').value;
          document.getElementById('wait').style.display = 'block';

            const response = await fetch('/auth/generateOTP', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email})
            });

            const data = await response.json();

            if (response.status === 400) {
              const message = document.createElement("p");
              message.textContent = data.message;
              errorMessages.appendChild(message);
              document.getElementById('wait').style.display = 'none';
              document.getElementById('loading').style.display='none';

            } else if (response.status === 200) {
              const otpForm = document.getElementById('otpForm');
              const signupForm = document.getElementById('signupForm');
              otpForm.style.display = 'block';
              signupForm.style.display = 'none';
            }
}


document.getElementById('otpForm').addEventListener('submit', verifyOTP);
async function verifyOTP(event) {
        event.preventDefault();
        const otpval = document.getElementById('otp').value;
        const response = await fetch('/auth/verifyOTP', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ otpval })
        });

        const data = await response.json();

        if (response.status === 400) {
          document.getElementById('otpmessage').textContent = data.message;
        } else if (response.status === 200) {
           signUpUser();
        }
}

async function signUpUser(){
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const response= await fetch('/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (response.status === 400) {
             document.getElementById('otpmessage').textContent = data.message;
          } else if (response.status === 200) {
            window.location.href = '/home';
          } else {
            document.getElementById('otpmessage').textContent  = 'An error occurred. Please try again.';
          }
}

