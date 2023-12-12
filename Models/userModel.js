const Datastore = require('nedb');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Create or load the NeDB datastore
const db = new Datastore({ filename: 'users.db', autoload: true });

// Define the user model
class User {
    // Hash the password before saving to the database
    static hashPassword(password) {
        return bcrypt.hashSync(password, saltRounds);
    }

    // Create a new user
    static createUser(username, password, role, callback) {
        const hashedPassword = this.hashPassword(password);

        const user = {
            username: username,
            password: hashedPassword,
            role: role // Added the role field
        };

        db.insert(user, (err, newUser) => {
            if (err) {
                console.error('Error creating user:', err);
                // Ensure the callback is a function before calling it
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                // Ensure the callback is a function before calling it
                if (typeof callback === 'function') {
                    callback(null, newUser);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    // Find a user by username
    static findUserByUsername(username, callback) {
        db.findOne({ username: username }, (err, user) => {
            if (err) {
                console.error('Error finding user:', err);
                // Ensure the callback is a function before calling it
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                // Ensure the callback is a function before calling it
                if (typeof callback === 'function') {
                    callback(null, user);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    // Compare password during login
    static comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compareSync(candidatePassword, hashedPassword);
    }
}

module.exports = User;
