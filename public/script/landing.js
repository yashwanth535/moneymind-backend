function hideAll() {
  const ids = ['hero', 'signinform', 'reset-otp-generate-form','reset-password-form','success','signupForm','otpForm'];
  ids.forEach(function(id) {
      var element = document.getElementById(id);
      if (element) {
          element.style.display = 'none';
      }
  });
}


function showSignInPage(){
  hideAll();
  document.getElementById('signinform').style.display='block';
}

function showHomePage(){
  hideAll();
  document.getElementById('hero').style.display='block';
}

function showRegisterPage(){
  hideAll();
  document.getElementById('signupForm').style.display='block';
}

window.addEventListener('DOMContentLoaded', (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const showSignin = urlParams.get('showSignin'); // Check if 'showSignin' query parameter exists

  // If the 'showSignin' parameter is set to 'true', automatically show the sign-in form
  if (showSignin === 'true') {
    showSignInPage()
  }
});