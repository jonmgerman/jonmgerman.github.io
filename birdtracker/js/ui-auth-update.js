function updateUIBasedOnAuth() {
  // Check for access token in session storage
  const accessToken = sessionStorage.getItem('access_token');

  const signInBtn = document.getElementById('signIn-btn');
  const signOutBtn = document.getElementById('signOut-btn');
  const updateTablesBtn = document.getElementById('updateTables-btn');
  const dashboardLocked = document.getElementById('dashboard-locked');
  const dashboard = document.getElementById('dashboard');

  if (accessToken) {
    // User is logged in
    signInBtn.classList.add('hidden');
    signOutBtn.classList.remove('hidden');
    updateTablesBtn.classList.remove('hidden');
    dashboardLocked.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    // User is logged out
    signInBtn.classList.remove('hidden');
    signOutBtn.classList.add('hidden');
    updateTablesBtn.classList.add('hidden');
    dashboardLocked.style.display = 'block';
    dashboard.style.display = 'none';
  }
}
// Check auth state on page load
document.addEventListener('DOMContentLoaded', function () {
  updateUIBasedOnAuth();
});

// Listen for storage changes (if user logs in/out in another tab)
window.addEventListener('storage', function (e) {
  if (e.key === 'access_token') {
    updateUIBasedOnAuth();
  }
});