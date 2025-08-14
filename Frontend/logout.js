const BASE_URL = 'https://spaceapplicationx.onrender.com';


function logout() {
  fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Logout failed');
      return res.json();
    })
    .then(() => {
      sessionStorage.setItem('showAuthModal', 'true');
      window.location.href = '/'; // later try once to check if works 'index.html'
    })
    .catch(err => {
      console.error('Logout error:', err);
      alert('Something went wrong during logout.');
    });
}

