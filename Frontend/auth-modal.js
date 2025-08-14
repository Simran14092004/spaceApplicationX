const BASE_URL = 'https://spaceapplicationx.onrender.com/';



let modalOverlay, modalClose, tabBtns, tabContents, signupForm, loginForm, socialBtns;
let currentTab = 'signup';
let isAuthenticated = false;

// Inject modal HTML and initialize
document.addEventListener('DOMContentLoaded', () => {
  fetch(`${BASE_URL}/auth-modal`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('auth-modal-container').innerHTML = html;
      window.AuthModal.init(); // Initialize after injection
    })
    .catch(err => console.error('Modal load error:', err));
});

function init() {
  modalOverlay = document.getElementById('auth-modal');
  modalClose = document.getElementById('modal-close');
  tabBtns = document.querySelectorAll('.tab-btn');
  tabContents = document.querySelectorAll('.tab-content');
  signupForm = document.getElementById('auth-signup-form');
  loginForm = document.getElementById('auth-login-form');
  socialBtns = document.querySelectorAll('.social-btn');

  setupEventListeners();
  checkAuthenticationStatus();
}

function showModal() {
  document.getElementById('auth-modal').classList.add('active');
  document.body.classList.add('modal-open'); // Prevent outer scroll
}

function hideModal() {
  document.getElementById('auth-modal').classList.remove('active');
  document.body.classList.remove('modal-open'); // Restore scroll
}


function checkAuthenticationStatus() {
  const user = localStorage.getItem('user');
  isAuthenticated = !!user;

  if (!isAuthenticated) {
    showModal();
  } else {
    hideModal();
  }
}

function setupEventListeners() {
  if (modalClose) modalClose.addEventListener('click', hideModal);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  if (signupForm) signupForm.addEventListener('submit', handleSignup);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  socialBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const provider = e.target.closest('.social-btn').dataset.provider;
      handleSocialLogin(provider);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideModal();
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) hideModal();
    });
  }
}

function switchTab(tab) {
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tab}-form-container`);
  });

  currentTab = tab;
  clearErrorMessages();
}

async function handleSignup(e) {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const userData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password')
  };

  if (!validateSignupData(userData)) return;

  try {
    showLoadingState('signup');

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(userData));
      isAuthenticated = true;
      showSuccessMessage('Account created successfully!');
      setTimeout(() => {
        hideModal();
        redirectToHome();
      }, 1500);
    } else {
      showError('signup', result.message || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Signup error:', error);
    showError('signup', 'Network error. Please check your connection and try again.');
  } finally {
    hideLoadingState('signup');
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const credentials = {
    email: formData.get('email'),
    password: formData.get('password')
  };

  if (!validateLoginData(credentials)) return;

  try {
    showLoadingState('login');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify({ email: credentials.email }));
      isAuthenticated = true;
      showSuccessMessage('Login successful!');
      setTimeout(() => {
        hideModal();
        redirectToHome();
      }, 1500);
    } else {
      showError('login', result.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('login', 'Network error. Please check your connection and try again.');
  } finally {
    hideLoadingState('login');
  }
}

async function handleSocialLogin(provider) {
  try {
    showLoadingState(currentTab);
    setTimeout(() => {
      hideLoadingState(currentTab);
      showError(currentTab, `${provider} login coming soon! We're working on integrating social authentication.`);
    }, 1000);
  } catch (error) {
    console.error('Social login error:', error);
    showError(currentTab, 'Social login temporarily unavailable.');
  }
}

// Validation
function validateSignupData(data) {
  if (!data.firstName || data.firstName.trim().length < 2) {
    showError('signup', 'First name must be at least 2 characters long.');
    return false;
  }
  if (!data.lastName || data.lastName.trim().length < 2) {
    showError('signup', 'Last name must be at least 2 characters long.');
    return false;
  }
  if (!validateEmail(data.email)) {
    showError('signup', 'Please enter a valid email address.');
    return false;
  }
  if (!validatePassword(data.password)) {
    showError('signup', 'Password must be at least 6 characters long.');
    return false;
  }
  return true;
}

function validateLoginData(data) {
  if (!validateEmail(data.email)) {
    showError('login', 'Please enter a valid email address.');
    return false;
  }
  if (!data.password || data.password.length < 1) {
    showError('login', 'Please enter your password.');
    return false;
  }
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// UI helpers
function showLoadingState(formType) {
  const submitBtn = document.querySelector(`#${formType === 'signup' ? 'auth-signup-form' : 'auth-login-form'} .auth-btn.primary`);
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Processing...';
    submitBtn.disabled = true;
  }
}

function hideLoadingState(formType) {
  const submitBtn = document.querySelector(`#${formType === 'signup' ? 'auth-signup-form' : 'auth-login-form'} .auth-btn.primary`);
  if (submitBtn) {
    submitBtn.innerHTML = formType === 'signup' ? 'Create Account' : 'Sign In';
    submitBtn.disabled = false;
  }
}

function showError(formType, message) {
  const errorDiv = document.getElementById(`${formType}-error`);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.color = '#ff4757';
    errorDiv.style.marginTop = '1rem';
    errorDiv.style.padding = '0.5rem';
    errorDiv.style.backgroundColor = '#ffe6e6';
    errorDiv.style.borderRadius = '4px';
  }
}

function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.color = '#2ed573';
  successDiv.style.marginTop = '1rem';
  successDiv.style.padding = '0.5rem';
  successDiv.style.backgroundColor = '#e6ffe6';
  successDiv.style.borderRadius = '4px';

  const form = currentTab === 'signup' ? signupForm : loginForm;
  if (form) {
    form.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  }
}

function clearErrorMessages() {
  const signupError = document.getElementById('signup-error');
  const loginError = document.getElementById('login-error');
  if (signupError) signupError.style.display = 'none';
  if (loginError) loginError.style.display = 'none';
}

function redirectToHome() {
  window.location.href = 'index.html';
}

// Export functions for external use
window.AuthModal = {
    init,
    showModal,
    hideModal,
    switchTab,
    handleSocialLogin
};

