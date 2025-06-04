// Google Sheets API Integration for FebLove Website
// This script handles collecting user data and sending it to Google Sheets

// Your Google Sheet ID
const SHEET_ID = '1Qe0A_AKEuFI3r4_pX-tbOuAZuLoEdihnyC0C20yRTrQ';
// Your Google Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4YNSdzKjbccKnU-uOpz5xvfxLHjE3J2wYaQXQh6am-5npCvKOm1FFVhUXMe2p3GL3Yw/exec';

// Add login data collection to Google Sheets
function setupLoginDataCollection() {
    // This function will be called by google-auth.js when a user logs in
    window.sendUserDataToGoogleSheets = function(userData) {
        sendToGoogleSheets(userData);
    };
}

// Function to send data to Google Sheets
function sendToGoogleSheets(data) {
    // Show loading indicator
    showLoadingIndicator();
    
    // Send data to Google Sheets via the web app
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data)
    })
    .then(response => {
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Show success message
        showSuccessMessage('Information submitted successfully!');
        
        // Clear form if it's a form submission
        if (data.formType) {
            clearForm(data.formType);
        }
    })
    .catch(error => {
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Show error message
        showErrorMessage('There was an error submitting your information. Please try again.');
        console.error('Error:', error);
    });
}

// Helper functions for UI feedback
function showLoadingIndicator() {
    // Create loading indicator if it doesn't exist
    if (!document.getElementById('loading-indicator')) {
        const loader = document.createElement('div');
        loader.id = 'loading-indicator';
        loader.innerHTML = '<div class="spinner"></div><p>Submitting...</p>';
        document.body.appendChild(loader);
    } else {
        document.getElementById('loading-indicator').style.display = 'flex';
    }
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.className = 'message success-message';
    successMsg.textContent = message;
    
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'message error-message';
    errorMsg.textContent = message;
    
    document.body.appendChild(errorMsg);
    
    setTimeout(() => {
        errorMsg.remove();
    }, 5000);
}

function clearForm(formType) {
    let formId;
    
    switch(formType) {
        case 'contact':
            formId = 'contact-form';
            break;
        case 'newsletter':
            formId = 'newsletter-form';
            break;
        case 'checkout':
            formId = 'shipping-form';
            break;
    }
    
    if (formId) {
        document.getElementById(formId).reset();
    }
}

// Contact form submission handler
function setupContactFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const contactData = {
                formType: 'contact',
                timestamp: new Date().toISOString(),
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };
            
            sendToGoogleSheets(contactData);
        });
    }
}

// Newsletter subscription handler
function setupNewsletterSubmission() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            const newsletterData = {
                formType: 'newsletter',
                timestamp: new Date().toISOString(),
                email: email
            };
            
            sendToGoogleSheets(newsletterData);
        });
    }
}

// Order submission handler
function setupOrderSubmission() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        // We'll hook into the existing placeOrder function in app.js
        const originalPlaceOrder = window.placeOrder;
        
        window.placeOrder = function() {
            // Validate form fields (using existing validation)
            if (!validateCheckoutForm()) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Collect order data
            const orderData = {
                formType: 'order',
                timestamp: new Date().toISOString(),
                customerInfo: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    zip: document.getElementById('zip').value,
                    country: document.getElementById('country').value
                },
                paymentMethod: document.querySelector('input[name="payment"]:checked').value,
                orderItems: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                orderTotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 
                            (cart.reduce((total, item) => total + (item.price * item.quantity), 0) > 100 ? 0 : 10)
            };
            
            // Send order data to Google Sheets
            sendToGoogleSheets(orderData);
            
            // Continue with original order processing
            originalPlaceOrder.call(window);
        };
    }
}

// Initialize all data collection
document.addEventListener('DOMContentLoaded', function() {
    setupContactFormSubmission();
    setupNewsletterSubmission();
    setupOrderSubmission();
    setupLoginDataCollection();
});