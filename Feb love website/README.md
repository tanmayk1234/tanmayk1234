# Elegant Pearls - Pearl Necklace Drop Shipping Website

A modern e-commerce website for selling pearl necklaces with a smooth and elegant UI.

## Features

- Responsive design that works on desktop and mobile devices
- Product catalog with filtering options
- Shopping cart functionality
- Secure checkout process
- Multiple payment methods
- Google Sign-In integration
- Contact form
- Newsletter subscription

## Setup Instructions

1. Replace the placeholder images in the `images` folder with actual product images
2. Update the Google Sign-In client ID in `index.html` with your actual Google API client ID
3. For a production environment, connect the checkout process to a real payment processor
4. Set up a server to handle form submissions and order processing

## File Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styles for the website
- `js/app.js` - Main JavaScript functionality
- `js/products.js` - Product data
- `images/` - Directory for product images

## Customization

### Adding New Products

To add new products, edit the `products.js` file and add new product objects to the products array.

### Changing Colors

The website uses CSS variables for colors. To change the color scheme, edit the following variables in `styles.css`:

```css
:root {
    --primary-color: #f8f3e9;
    --secondary-color: #d4af37;
    --accent-color: #8b5a2b;
    --text-color: #333;
    --light-text: #fff;
    --dark-bg: #222;
    --light-bg: #f9f9f9;
    --border-color: #ddd;
}
```

## Payment Integration

The website includes a basic checkout form. For actual payment processing, you'll need to:

1. Set up accounts with payment processors (e.g., Stripe, PayPal)
2. Implement their APIs in the checkout process
3. Set up a server to handle payment securely

## Google Sign-In

To enable Google Sign-In:

1. Create a project in the Google Developer Console
2. Configure OAuth consent screen
3. Create OAuth client ID credentials
4. Replace `YOUR_GOOGLE_CLIENT_ID` in the index.html file with your actual client ID

## License

This project is for demonstration purposes only.