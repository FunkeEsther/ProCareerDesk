const Datastore = require('nedb');

// Create or load the NeDB datastore
const db = new Datastore({ filename: 'students.db', autoload: true });

class Student {
    constructor(firstName, lastName, department, username, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.username = username;
        this.email = email;
    }

    save(callback) {
        db.insert(this, (err, savedStudent) => {
            if (err) {
                console.error('Error creating student:', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                console.log('Student saved successfully:', savedStudent);
                if (typeof callback === 'function') {
                    callback(null, savedStudent);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }
    

    static findById(id, callback) {
        db.findOne({ _id: id }, (err, student) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, student);
            }
        });
    }

    static getAllStudents(callback) {
        db.find({}, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    }

    static deleteStudentById(studentId, callback) {
        db.remove({ _id: studentId }, {}, (err, numRemoved) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, numRemoved);
            }
        });
    }

    static updateStudentById(studentId, updatedStudent, callback) {
        db.update({ _id: studentId }, { $set: updatedStudent }, {}, (err, numReplaced) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, numReplaced);
            }
        });
    }
}

module.exports = Student;
