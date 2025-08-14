document.addEventListener("DOMContentLoaded", function () {
  window.logout = function () {
    console.log('Logout triggered');
    localStorage.clear();
    alert('You’ve been logged out.');
    window.location.href = 'auth-modal.html';
  };
});

