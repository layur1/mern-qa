document.getElementById('loginBtn').addEventListener('click', () => {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();
  if (u && p) {
    document.getElementById('welcomeMsg').textContent = 'Welcome, ' + u + '!';
  } else {
    document.getElementById('welcomeMsg').textContent = 'Please enter username and password';
  }
});
