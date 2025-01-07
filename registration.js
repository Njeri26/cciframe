const registrationForm = {
    init() {
        const registrationModal = document.createElement('div');
        registrationModal.id = 'registrationModal';
        registrationModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';

        registrationModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h3 class="text-xl font-bold mb-4 text-center">Registration</h3>
                <form id="registration-form">
                    <div class="mb-4">
                        <label for="user_name" class="block text-sm font-semibold text-gray-600">Full Name</label>
                        <input type="text" id="user_name" name="user_name" required
                            class="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label for="location" class="block text-sm font-semibold text-gray-600">Location</label>
                        <input type="text" id="location" name="location" required
                            class="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label for="phone" class="block text-sm font-semibold text-gray-600">Phone Number</label>
                        <input type="tel" id="phone" name="phone" required
                            class="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label for="grade" class="block text-sm font-semibold text-gray-600">Grade</label>
                        <input type="number" id="grade" name="grade" required
                            class="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button type="submit"
                        class="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300">
                        Register
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(registrationModal);
        this.bindEvents();
    },

    bindEvents() {
        const form = document.getElementById('registration-form');
        // Make sure event binding is working
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form submission
            this.handleRegistration(e);
        });
    },

    async handleRegistration(event) {
        event.preventDefault(); // Add another prevention just to be sure

        try {
            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.textContent = 'Registering...';

            // Get form data
            const formData = new FormData(form);
            const userData = {
                user_name: formData.get('user_name'),
                location: formData.get('location'),
                phone: formData.get('phone'),
                grade: formData.get('grade')
            };

            console.log('Sending registration data:', userData); // Debug log

            // Register user using fetch
            const registrationResponse = await fetch('/api/regestration.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await registrationResponse.json();

            if (data.success) {
                // Hide modal
                document.getElementById('registrationModal').style.display = 'none';
                alert('Registration successful!');
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(`Registration failed: ${error.message}`);
        } finally {
            const submitButton = event.target.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
        }
    }
};

// Initialize registration
document.getElementById('registration-link').addEventListener('click', function(event) {
    event.preventDefault();
    registrationForm.init();
});