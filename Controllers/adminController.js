const Student = require("../Models/studentModel");

const addStudentPost = (req, res) => {
  // Extracting data from the form submission
  const { firstName, lastName, department, username, email } = req.body;

  // Creating a new student object
  const newStudent = new Student({
    firstName,
    lastName,
    department,
    username,
    email,
  });

  // Saving the new student to the database
  newStudent.save((err, savedStudent) => {
    if (err) {
      console.error(err);
      res.redirect("/error"); // Redirect to an error page in case of an error
    } else {
      // Render the "addStudent" view with the userId
      res.render("manageStudent", { userId: req.params.userId });
    }
  });
};

const displayStudents = (req, res) => {
  const userId = req.params.userId;

  Student.find({}, (err, students) => {
    if (err) {
      console.error(err);
      return res.redirect("/error");
    }

    console.log("Retrieved students:", students); // Add this line for debugging

    res.render("manageStudent", {
      userId: userId,
      students: students,
    });
  });
};



const submitStudent = (req, res) => {
  // Your logic to handle submitting a student
  res.send("Submitting Student");
};

module.exports = {
  addStudentPost,
  submitStudent,
  displayStudents,
};
