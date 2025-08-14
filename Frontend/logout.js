document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('showAuthModal') === 'true') {
    fetch(`${BASE_URL}/auth-modal`)
      .then(res => res.text())
      .then(html => {
        document.getElementById('auth-modal-container').innerHTML = html;
        window.AuthModal.init();
        sessionStorage.removeItem('showAuthModal'); // clear flag after use
      })
      .catch(err => console.error('Modal load error:', err));
  }
});

