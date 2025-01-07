const loginForm = {
    init() {
        const loginModal = document.createElement('div');
        loginModal.id = 'loginModal';
        loginModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';

        loginModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h3 class="text-xl font-bold mb-4 text-center">Login</h3>
                <form id="login-form">
                    <div class="mb-4">
                        <label for="username" class="block text-sm font-semibold text-gray-600">Username</label>
                        <input type="text" id="username" name="username" required
                            class="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block text-sm font-semibold text-gray-600">Password</label>
                        <input type="password" id="password" name="password" required
                            class="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button type="submit"
                        class="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300">
                        Login
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(loginModal);
        this.bindEvents();
    },

    bindEvents() {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', this.handleLogin.bind(this));
    },

    checkLoginStatus() {
        const authState = sessionStorage.getItem('authState');
        console.log('Current auth state:', authState);
        return authState ? JSON.parse(authState) : null;
    },

    logout() {
        sessionStorage.removeItem('authState');
        console.log('User logged out, auth state cleared');
        
        // Hide iframe if it's open
        const iframeContainer = document.getElementById('iframe-container');
        if (iframeContainer) {
            iframeContainer.style.display = 'none';
        }
    },

    async handleLogin(event) {
        event.preventDefault();

        try {
            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');

            // Disable the submit button to prevent double submission
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';

            const formData = new FormData(form);
            const userData = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            // Log in user
            const loginResponse = await this.loginUser(userData);

            if (loginResponse.success) {
                // Store user data in session storage
                sessionStorage.setItem('authState', JSON.stringify(loginResponse.user));
                console.log('Login successful, auth state set:', loginResponse.user);

                // Hide the login modal
                document.getElementById('loginModal').style.display = 'none';

                // Show success message
                alert('Login successful!');

                // Automatically open iframe after successful login
                const iframeContainer = document.getElementById('iframe-container');
                if (iframeContainer) {
                    iframeContainer.style.display = 'flex';
                    
                    // Trigger iframe load if needed
                    const iframe = document.getElementById('iframe');
                    if (iframe && !iframe.src) {
                        iframe.src = 'https://cheche.checheafrica.com//';
                    }
                }
            } else {
                console.error('Login failed:', loginResponse.message);
                throw new Error(loginResponse.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(`Login failed: ${error.message}`);
        } finally {
            // Re-enable the submit button
            const submitButton = event.target.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    },

    async loginUser(userData) {
        try {
            const response = await fetch('/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                console.error('HTTP Error:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login API response:', data);

            if (!data.success) {
                console.error('Login failed:', data.message);
                throw new Error(data.message || 'Login failed');
            }

            return data;
        } catch (error) {
            console.error('Login fetch error:', error);
            throw new Error('Login failed. Please try again.');
        }
    }
};

// Initialize the login system on link click
document.getElementById('login-link').addEventListener('click', function(event) {
    event.preventDefault();
    loginForm.init();
});

// Add global access to check login status
window.checkLoginStatus = loginForm.checkLoginStatus;