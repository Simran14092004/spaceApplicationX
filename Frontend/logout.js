window.logout = function () {
  console.log('Logout triggered');
  localStorage.clear();
  alert('You’ve been logged out.');
  setTimeout(() => {
    window.location.href = 'auth-modal.html';
  }, 100); // delay to allow alert to finish
};

