window.addEventListener("DOMContentLoaded", handleCognitoRedirect);

async function handleCognitoRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  // If there is no code, user isn't returning from Cognito
  if (!code) return;

  // Exchange the code for tokens
  const tokens = await exchangeCodeForTokens(code);

  // Optional: clean the URL (remove ?code=...)
  window.history.replaceState({}, document.title, window.location.pathname);

  console.log("User is logged in:", tokens);
}

async function exchangeCodeForTokens(code) {
  const tokenUrl = "https://us-east-13wianfaoi.auth.us-east-1.amazoncognito.com/oauth2/token";

  // Retrieve the PKCE code_verifier that you generated before redirecting user to login
  const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

  if (!codeVerifier) {
    console.error("Missing PKCE code verifier. Cannot complete login.");
    return;
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "https://jonmgerman.github.io/birdtracker/home.html",
    client_id: "1a4nhn6ofmmkj8krvnci85dssk",
    code_verifier: codeVerifier
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    console.error("Token request failed:", await response.text());
    return;
  }

  const tokens = await response.json();

  // Store tokens
  sessionStorage.setItem("id_token", tokens.id_token);
  sessionStorage.setItem("access_token", tokens.access_token);
  sessionStorage.setItem("refresh_token", tokens.refresh_token);

  return tokens;
}
