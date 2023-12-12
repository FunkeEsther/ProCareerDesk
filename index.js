const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./Models/userModel');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Add this route to handle logout
app.get('/logout', (req, res) => {
    // Perform any logout logic here (e.g., clear session)
    // Redirect to the homepage after logout
    res.redirect('/');
});


app.get('/', (req, res) => {
    res.render('about', { message: 'Hello, this is the root route!' });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/student/signup', (req, res) => {
    const { firstName, lastName, studentId, email, department, username, password, confirmPassword } = req.body;

    const studentErrors = {};

    if (password !== confirmPassword) {
        studentErrors.confirmPassword = true;
        return res.render('signup', { studentErrorMessage: 'Password and Confirm Password must match', studentErrors });
    }

    if (username.length <= 5) {
        studentErrors.username = true;
        return res.render('signup', { studentErrorMessage: 'Username must be more than 5 characters', studentErrors });
    }

    if (password.length <= 8 || !/\d/.test(password)) {
        studentErrors.password = true;
        return res.render('signup', { studentErrorMessage: 'Password must be more than 8 characters and include at least one number', studentErrors });
    }

    if (!email.includes('@gmail') && !email.includes('@yahoo') && !email.includes('@')) {
        studentErrors.email = true;
        return res.render('signup', { studentErrorMessage: 'Invalid email address. Use Gmail, Yahoo, or another valid domain', studentErrors });
    }

    User.createUser(username, password, 'student', (err, newUser) => {
        if (err) {
            return res.render('error', { message: 'Error signing up' });
        }

        res.redirect('/student_dashboard');
    });
});

app.post('/admin/signup', (req, res) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;

    const adminErrors = {};

    if (password !== confirmPassword) {
        adminErrors.confirmPassword = true;
        return res.render('signup', { adminErrorMessage: 'Password and Confirm Password must match', adminErrors });
    }

    if (username.length <= 5) {
        adminErrors.username = true;
        return res.render('signup', { adminErrorMessage: 'Username must be more than 5 characters', adminErrors });
    }

    if (password.length <= 8 || !/\d/.test(password)) {
        adminErrors.password = true;
        return res.render('signup', { adminErrorMessage: 'Password must be more than 8 characters and include at least one number', adminErrors });
    }

    if (!email.includes('@aluadmin.com')) {
        adminErrors.email = true;
        return res.render('signup', { adminErrorMessage: 'Invalid email address.', adminErrors });
    }

    User.createUser(username, password, 'admin', (err, newUser) => {
        if (err) {
            return res.render('error', { message: 'Error signing up' });
        }

        res.redirect('/admin_dashboard');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findUserByUsername(username, (err, user) => {
        if (err || !user || !User.comparePassword(password, user.password)) {
            return res.render('login', { errorMessage: 'Invalid username or password' });
        }

        // Set user role in session or wherever you store user information
        const userRole = user.role;

        // Redirect based on user role
        if (userRole === 'student') {
            res.redirect('/student_dashboard');
        } else if (userRole === 'admin') {
            res.redirect('/admin_dashboard');
        } else {
            return res.render('login', { errorMessage: 'Unknown user role' });
        }
    });
});


app.get('/student_dashboard', (req, res) => {
    res.render('student_dashboard');
});

app.get('/admin_dashboard', (req, res) => {
    res.render('admin_dashboard');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
