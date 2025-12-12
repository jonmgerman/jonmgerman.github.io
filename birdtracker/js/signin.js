// ---------------------------
// Cognito Configuration
// ---------------------------
const cognitoDomain = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_3WiAnFAoi';
const clientId = '1a4nhn6ofmmkj8krvnci85dssk';
const redirectUri = "https://jonmgerman.github.io/birdtracker/home.html"; //window.location.origin + window.location.pathname;
const signInUri = 'https://us-east-13wianfaoi.auth.us-east-1.amazoncognito.com/oauth2/authorize';
const responseType = "code"; // or "code" for auth code flow
const scope = "email+openid+profile"
const challengeMethod = "S256";
let accessToken = null;

// ---------------------------
// PCKE Value generation
// ---------------------------

// Generate a random string for code verifier
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

// Generate SHA256 hash and base64url encode
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);

  // Convert to base64url
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}


// ---------------------------
// Detect if logged in via token in URL hash
// ---------------------------


// ---------------------------
// Login / Logout Functions
// ---------------------------
const signInBtn = document.getElementById("signIn-btn");
signInBtn.onclick = async () => {
  if (!accessToken) {
    // redirect to Cognito Hosted UI
    console.log('Redirecting to Cognito login page...');

    // Generate code verifier (43-128 characters)
    const codeVerifier = generateRandomString(128);

    // Generate code challenge from verifier
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code verifier in sessionStorage for use after redirect back
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);

    // Generate state parameter for CSRF protection
    const state = generateRandomString(32);
    sessionStorage.setItem('pkce_state', state);

    // window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=${code_challenge_method}&state=${state}`;
    console.log('cod verifier:', codeVerifier);
        // Build the full Cognito login URL
    const authUrl = `${signInUri}` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&response_type=${encodeURIComponent(responseType)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code_challenge=${encodeURIComponent(codeChallenge)}` +
      `&code_challenge_method=${encodeURIComponent(challengeMethod) || 'S256'}` +
      `&state=${encodeURIComponent(state)}`;

    // Redirect the browser to Cognito Hosted UI
    window.location.href = authUrl; //https://us-east-13wianfaoi.auth.us-east-1.amazoncognito.com/login?client_id=1a4nhn6ofmmkj8krvnci85dssk&response_type=code&scope=email+openid+profile&redirect_uri=https%3A%2F%2Foidanew.com&code_challenge=g7nEC2cGw807p68IB11bh9AyOLbBCkqG-UgJZxMd6Ck&code_challenge_method=S256&state=5Wi2pL-BasUE1Na14kEruVSg2~z0rifo

  } else {
    // logout
    accessToken = null;
    signInBtn.innerText = "SignIn";
    location.reload();
  }
};
