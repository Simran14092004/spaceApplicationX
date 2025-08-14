window.logout = function () {
  // Clear all user-related data
  localStorage.removeItem('user');
  localStorage.removeItem('token'); // if you're using tokens
  localStorage.clear(); // optional: clears everything

  // Show alert before redirect
  alert('You’ve been logged out.');

  // Redirect to login/signup form
  window.location.href = 'login.html'; // or 'signup.html' if that's your entry point
};



