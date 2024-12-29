function togglePassword(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);

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

function show_reset_form(){
    document.getElementById('signinform').style.display='none';
    document.getElementById('reset-otp-generate-form').style.display='block';
}

document.getElementById('reset-otp-generate-form').addEventListener('submit', send_otp);
async function send_otp(event){
    event.preventDefault();
    const email = document.getElementById('email-reset').value;
    document.getElementById('loading').style.display='block';
    const errorMessages = document.getElementById("errorMessages");
    errorMessages.innerHTML = "";
    document.getElementById('wait').style.display = 'block';
    const json_data={
        email:email,
        text:'this is your one-time password to reset your password'
      }
    const response = await fetch('/auth/generateOTP', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json_data)
    });

    const data = await response.json();
    if (response.status === 400) {
        const message = document.createElement("p");
        message.textContent = data.message;
        errorMessages.appendChild(message);
        document.getElementById('wait').style.display = 'none';
        document.getElementById('loading').style.display='none';

      } else if (response.status === 200) {
        document.getElementById('reset-otp-generate-form').style.display='none';
        document.getElementById('otpForm').style.display='block';
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
            document.getElementById('otpForm').style.display='none';
            document.getElementById('reset-password-form').style.display='block';
        }
}

document.getElementById('reset-password-form').addEventListener('submit', checkPassword);
function checkPassword(event) {
    event.preventDefault();
    const errorMessages = document.getElementById("errorMessages-2");
    errorMessages.innerHTML = "";
    const password = document.getElementById("password_reset").value;
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
        reset_password();
    }
}

async function reset_password(){
    const password=document.getElementById('password_reset').value;
    const email = document.getElementById('email-reset').value;
    try {
        const response = await fetch('/auth/reset_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) 
        });

        const data = await response.json();
        
        if (response.status === 200) {
            document.getElementById('reset-password-form').style.display='none';
            document.getElementById('success').style.display='block';
          } else if (response.status === 500) {
            document.getElementById('errorMessages-2').innerHTML=data.message;
          }
    } catch (error) {
        console.error('Error during signin:', error);
    }
}

