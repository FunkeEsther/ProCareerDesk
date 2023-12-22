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

    static getAllStudents(query, callback) {
        // You can pass a query object to filter the students if needed
        db.find(query, (err, students) => {
            if (err) {
                console.error('Error fetching students:', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                console.log('Students fetched successfully:', students);
                if (typeof callback === 'function') {
                    callback(null, students);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    static deleteStudentById(studentId, callback) {
        db.remove({ _id: studentId }, {}, (err, numRemoved) => {
          if (err) {
            console.error('Error deleting student:', err);
            callback(err);
          } else {
            console.log('Student deleted successfully:', numRemoved);
            // Use the same callback structure as in the provided deleteOpportunity method
            callback(null, { message: "Student deleted successfully" });
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
