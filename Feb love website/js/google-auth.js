// Google Authentication for FebLove Website

// Your Google OAuth Client ID
const CLIENT_ID = '410105712729-egke8noqkocnr7tbktiuq7idtinrnsm2.apps.googleusercontent.com';

// Initialize Google Sign-In
function initGoogleAuth() {
    // Load the Google Identity Services script if not already loaded
    if (!document.getElementById('google-signin-script')) {
        const script = document.createElement('script');
        script.id = 'google-signin-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        
        script.onload = configureGoogleSignIn;
    } else {
        configureGoogleSignIn();
    }
}

// Configure Google Sign-In button and callback
function configureGoogleSignIn() {
    // Initialize the Sign In With Google button
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    // Render the button
    google.accounts.id.renderButton(
        document.getElementById('google-signin-button'), 
        { 
            theme: 'outline', 
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
        }
    );
}

// Handle the credential response
function handleCredentialResponse(response) {
    // Get the JWT token
    const credential = response.credential;
    
    // Parse the JWT token to get user info
    const payload = parseJwt(credential);
    
    if (payload) {
        // Store user info in session storage
        storeUserSession(payload);
        
        // Update UI to show logged in state
        updateUIForLoggedInUser(payload);
        
        // Send user data to Google Sheets if needed
        sendUserDataToGoogleSheets(payload);
    }
}

// Parse JWT token
function parseJwt(token) {
    try {
        // Get the payload part of the JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error parsing JWT", e);
        return null;
    }
}

// Store user session
function storeUserSession(userData) {
    // Store essential user data in sessionStorage
    const userSession = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        loggedInAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('febLoveUserSession', JSON.stringify(userSession));
}

// Update UI for logged in user
function updateUIForLoggedInUser(userData) {
    // Hide sign-in button
    const signInContainer = document.querySelector('.g_id_signin');
    if (signInContainer) {
        signInContainer.style.display = 'none';
    }
    
    // Create user profile element if it doesn't exist
    if (!document.getElementById('user-profile')) {
        const userProfile = document.createElement('div');
        userProfile.id = 'user-profile';
        userProfile.className = 'user-profile';
        
        userProfile.innerHTML = `
            <img src="${userData.picture}" alt="${userData.name}" class="user-avatar">
            <span class="user-name">${userData.name}</span>
            <button id="sign-out-button" class="sign-out-button">Sign Out</button>
        `;
        
        // Add to nav-icons
        const navIcons = document.querySelector('.nav-icons');
        if (navIcons) {
            navIcons.appendChild(userProfile);
        }
        
        // Add sign out event listener
        document.getElementById('sign-out-button').addEventListener('click', signOut);
    }
    
    // Show welcome message
    showWelcomeMessage(userData.name);
}

// Sign out function
function signOut() {
    // Clear session storage
    sessionStorage.removeItem('febLoveUserSession');
    
    // Remove user profile element
    const userProfile = document.getElementById('user-profile');
    if (userProfile) {
        userProfile.remove();
    }
    
    // Show sign-in button again
    const signInContainer = document.querySelector('.g_id_signin');
    if (signInContainer) {
        signInContainer.style.display = 'block';
    }
    
    // Reload the page to reset state
    window.location.reload();
}

// Show welcome message
function showWelcomeMessage(name) {
    // Create a welcome message element
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'welcome-message';
    welcomeMsg.textContent = `Welcome, ${name}!`;
    
    // Add to header
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(welcomeMsg);
        
        // Remove after a few seconds
        setTimeout(() => {
            welcomeMsg.remove();
        }, 5000);
    }
}

// Send user data to Google Sheets
function sendUserDataToGoogleSheets(userData) {
    // Only send if our Google Sheets integration is set up
    if (typeof sendToGoogleSheets === 'function') {
        const userLoginData = {
            formType: 'login',
            timestamp: new Date().toISOString(),
            userId: userData.sub,
            name: userData.name,
            email: userData.email,
            picture: userData.picture
        };
        
        sendToGoogleSheets(userLoginData);
    }
}

// Check if user is already logged in on page load
function checkExistingSession() {
    const userSession = sessionStorage.getItem('febLoveUserSession');
    
    if (userSession) {
        const userData = JSON.parse(userSession);
        updateUIForLoggedInUser(userData);
        return true;
    }
    
    return false;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing session first
    const isLoggedIn = checkExistingSession();
    
    // If not logged in, initialize Google Auth
    if (!isLoggedIn) {
        initGoogleAuth();
    }
});