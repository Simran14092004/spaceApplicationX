window.logout = function () {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
  alert('You’ve been logged out.');
};


