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
      // Redirect to the manageStudent view with the savedStudent data and userId
      const studentString = encodeURIComponent(JSON.stringify(savedStudent));
      //res.redirect(`/displayStudent?student=${studentString}`);
      res.redirect(`/displayStudent?student=${studentString}`);
    }
  });
 };

const getAllStudents = (req, res) => {
  Student.getAllStudents({}, (err, students) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Render the student data on a page (assuming you are using a templating engine like EJS)
    res.render("manageStudent", {
      students: students
    });
  });
};

  // Use the Student model's delete method (you need to define this method in your model)
  const deleteStudent = (req, res) => {
    const studentId = req.params._id;

    console.log(studentId);
  
    Student.deleteStudentById(studentId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
  
      // Check if the student is successfully deleted
      if (result && result.message === "Student deleted successfully") {
        // Redirect to the displayStudent page
        res.redirect("/displayStudent");
      } else {
        // Handle other cases if needed
        res.status(500).send("Internal Server Error");
      }
    });
  };

const submitStudent = (req, res) => {
  // Your logic to handle submitting a student
  res.send("Submitting Student");
};

module.exports = {
  addStudentPost,
  submitStudent,
  deleteStudent,
  // displayStudents,
  getAllStudents
};
