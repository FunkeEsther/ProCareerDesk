const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Define a route for the root URL
app.get('/about', (req, res) => {
    // Render the 'index.mustache' template
    res.render('about', { message: 'Hello, this is the root route!' });
});

// Define a route for the signup page
app.get('/signup', (req, res) => {
    // Render the 'signup.mustache' template
    res.render('signup', { /* any data you want to pass to the template */ });
});

// Define a route for the login page
app.get('/login', (req, res) => {
    // Render the 'login.mustache' template for the login route
    res.render('login', { /* any data you want to pass to the template */ });
});

// Other routes and middleware can go here

// Start the server
const port = 3000; // or any port you prefer
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
