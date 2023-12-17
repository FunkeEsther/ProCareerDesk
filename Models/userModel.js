const Datastore = require('nedb');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Create or load the NeDB datastore
const db = new Datastore({ filename: 'users.db', autoload: true });

class User {
    static hashPassword(password) {
        return bcrypt.hashSync(password, saltRounds);
    }

    static createUser(username, password, role, firstName, lastName, studentId, email, department, callback) {
        const hashedPassword = this.hashPassword(password);

        const user = {
            username: username,
            password: hashedPassword,
            role: role,
            firstName: firstName,
            lastName: lastName,
            studentId: studentId,
            email: email,
            department: department
        };

        db.insert(user, (err, newUser) => {
            if (err) {
                console.error('Error creating user:', err);
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, newUser);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    static findUserByUsername(username, callback) {
        db.findOne({ username: username }, (err, user) => {
            if (err) {
                console.error('Error finding user:', err);
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, user);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    static comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compareSync(candidatePassword, hashedPassword);
    }
}

module.exports = User;
