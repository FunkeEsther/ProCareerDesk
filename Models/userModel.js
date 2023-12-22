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

    
    static findByIdAndUpdate(userId, updateData, callback) {
        const updateQuery = { $set: updateData };
      
        db.update({ _id: userId }, updateQuery, {}, (err, numAffected) => {
          if (err) {
            console.error('Error updating user:', err);
            if (typeof callback === 'function') {
              return callback(err, null);
            } else {
              console.error('Callback function is not provided.');
            }
          } else {
            if (typeof callback === 'function') {
              callback(null, numAffected);
            } else {
              console.error('Callback function is not provided.');
            }
          }
        });
      }
      
       

    static findById(userId, callback) {
        db.findOne({ _id: userId }, (err, user) => {
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
 
 


    static getAllOpportunities(callback) {
        db.find({}, (err, data) => {
         if (err) {
           callback(err, null);
         } else {
           console.log('Data:', data); // Log the data
           callback(null, data);
         }
        });
       }
     
       static updateUser(userId, user, callback) {
        db.update(
          { _id: userId },
          user,
          {},
          function (err, numReplaced) {
            if (err) {
              console.error('Error updating user:', err);
              if (typeof callback === 'function') {
                return callback(err, null);
              } else {
                console.error('Callback function is not provided.');
              }
            } else {
              if (typeof callback === 'function') {
                callback(null, numReplaced);
              } else {
                console.error('Callback function is not provided.');
              }
            }
          }
        );
      }

      static updateOne(query, update, callback) {
        db.update(query, update, {}, (err, numAffected) => {
            if (err) {
                console.error('Error updating user:', err);
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, numAffected);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    
    

    static deleteOpportunity(userId, opportunityId, callback) {
        // Find the user by ID in the database
        User.findById(userId, (userErr, user) => {
            if (userErr) {
                console.error(userErr);
                return callback(userErr, null);
            }

            if (!user) {
                const notFoundError = new Error("User not found");
                console.error(notFoundError);
                return callback(notFoundError, null);
            }

            // Filter out the opportunity with the specified ID
            user.opportunity = user.opportunity.filter(opportunity => opportunity._id !== opportunityId);

            // Update the user document in the database with the modified opportunity array
            User.updateOne({ _id: userId }, { $set: { opportunity: user.opportunity } }, (updateErr, numAffected) => {
                if (updateErr) {
                    console.error(updateErr);
                    return callback(updateErr, null);
                }

                if (numAffected === 0) {
                    const updateError = new Error("No user document was updated");
                    console.error(updateError);
                    return callback(updateError, null);
                }

                // Successfully deleted the opportunity
                callback(null, { message: "Opportunity deleted successfully" });
            });
        });
    }
     
     

    static comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compareSync(candidatePassword, hashedPassword);
    }
}

module.exports = User;
