// logout.js
function handleLogout() {
  // Clear session/token
  localStorage.removeItem('user');
  
  // Re-inject modal if needed
  fetch('/auth-modal')
    .then(res => res.text())
    .then(html => {
      document.getElementById('auth-modal-container').innerHTML = html;
      openModal(); // Show the modal
    });
}


