const iframeContainer = document.getElementById('iframe-container');
const iframeIcon = document.getElementById('iframe-icon');
const closeIframe = document.getElementById('close-iframe');
const iframe = document.getElementById('iframe');

// Store the current iframe URL and state in session storage
let currentIframeUrl = sessionStorage.getItem('iframeUrl') || 'https://cheche.checheafrica.com//';
let isIframeOpen = sessionStorage.getItem('isIframeOpen') === 'true';

// Function to handle user authentication
function authenticateUser() {
    const authState = sessionStorage.getItem('authState');
    return authState ? JSON.parse(authState) : null;
}

// Update iframe URL and state in session storage
function updateIframeUrl(url) {
    currentIframeUrl = url;
    sessionStorage.setItem('iframeUrl', url);
    sessionStorage.setItem('isIframeOpen', 'true');
    iframe.src = url;
}

// Handle iframe opening with authentication
// In iframe.js, replace the existing iframeIcon event listener:
iframeIcon.addEventListener('click', function () {
    const authResult = authenticateUser();
    
    // Add debug logging
    console.log('Current auth state:', authResult);

    if (authResult) {
        iframeContainer.style.display = 'flex';
        iframe.addEventListener('load', function () {
            try {
                const iframeWindow = iframe.contentWindow;

                if (iframeWindow.location.href !== currentIframeUrl) {
                    updateIframeUrl(iframeWindow.location.href);
                }

                iframeWindow.parent = iframeWindow;
                iframeWindow.top = iframeWindow;

                iframeWindow.onbeforeunload = function () {
                    return undefined;
                };
            } catch (error) {
                console.warn('Could not modify iframe navigation:', error);
            }
        });
    } else {
        // Instead of alert, open login modal
        if (typeof loginForm !== 'undefined') {
            loginForm.init();
        } else {
            console.error('Login form module not found');
            alert('Please log in to access the iframe content.');
        }
    }
});

// Handle page refresh
function handlePageRefresh() {
    if (isIframeOpen) {
        iframeContainer.style.display = 'flex';
        iframe.src = currentIframeUrl;
    }
}

// Add event listener for page load to restore iframe state
window.addEventListener('load', handlePageRefresh);

// Preserve state before unloading the page
window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('isIframeOpen', iframeContainer.style.display === 'flex');
});

// Close iframe modal when close button is clicked
closeIframe.addEventListener('click', function () {
    iframeContainer.style.display = 'none';
    sessionStorage.setItem('isIframeOpen', 'false');
});

// Close iframe modal if clicked outside the iframe area
window.addEventListener('click', function (event) {
    if (event.target === iframeContainer) {
        iframeContainer.style.display = 'none';
        sessionStorage.setItem('isIframeOpen', 'false');
    }
});

// Handle messages from iframe
window.addEventListener('message', function (event) {
    if (event.origin === "https://cheche.checheafrica.com/") {
        console.log("Received data from iframe:", event.data);
    }
});

// Configure iframe sandbox and permissions
iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-top-navigation allow-popups');
iframe.setAttribute('allow', 'fullscreen; autoplay; clipboard-write; encrypted-media');