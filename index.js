const express = require("express");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./Models/userModel");
const Student = require("./Models/studentModel");
const Opportunity = require("./Models/opportunityModel");
const path = require("path");
const studentController = require("./Controllers/studentController");
const adminController = require("./Controllers/adminController");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));


// Middleware to set the correct MIME type for CSS files
app.use("/public/css", (req, res, next) => {
  res.type("text/css");
  next();
});

app.use(
  session({
    secret: "esther", // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: true,
  })
);
// Route to handle logout
app.get("/logout", (req, res) => {
  
  res.redirect("/");
});

// Homepage route
app.get("/", (req, res) => {
  res.render("about", { message: "Hello, this is the root route!" });
});

// Signup routes
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Login route
app.get("/login", (req, res) => {
  res.render("login");
});

// manage student route
app.get("/manageStudent", (req, res) => {
  res.render("manageStudent");
});

// modify student route
app.get("/modifyStudent", (req, res) => {
  res.render("modifyStudent");
});

// manage mentor route
app.get("/manageMentor", (req, res) => {
  res.render("manageMentor");
});

// add student route
app.get("/addStudent", (req, res) => {
  res.render("addStudent");
});

//Student Route
const studentRoute = require("./Routes/studentRoute");

app.use("/", studentRoute);

//Admin Route
const adminRoute = require("./Routes/adminRoute");

app.use("/", adminRoute);



// Student Signup route
app.post("/student/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    studentId,
    email,
    department,
    username,
    password,
    confirmPassword,
  } = req.body;

  const studentErrors = {};

  if (password !== confirmPassword) {
    studentErrors.confirmPassword = true;
    return res.render("signup", {
      studentErrorMessage: "Password and Confirm Password must match",
      studentErrors,
    });
  }

  try {
    if (username.length <= 5) {
      studentErrors.username = true;
      return res.render("signup", {
        studentErrorMessage: "Username must be more than 5 characters",
        studentErrors,
      });
    }

    if (password.length <= 8 || !/\d/.test(password)) {
      studentErrors.password = true;
      return res.render("signup", {
        studentErrorMessage:
          "Password must be more than 8 characters and include at least one number",
        studentErrors,
      });
    }

    if (
      !email.includes("@gmail") &&
      !email.includes("@yahoo") &&
      !email.includes("@")
    ) {
      studentErrors.email = true;
      return res.render("signup", {
        studentErrorMessage:
          "Invalid email address. Use Gmail, Yahoo, or another valid domain",
        studentErrors,
      });
    }

    // Check if the username already exists
    User.findUserByUsername(username, (err, existingUser) => {
      if (err) {
        return res.render("error", {
          message: "Error checking username availability",
        });
      }

      if (existingUser) {
        // Username already exists, prompt the user to choose a different one
        studentErrors.usernameExists = true;
        return res.render("signup", {
          studentErrorMessage:
            "Username is already taken. Choose a different one.",
          studentErrors,
        });
      }

      // If username is available, create the new user
      const newUser = new User({
        username,
        password,
        role: "student",
        firstName,
        lastName,
        studentId,
        email,
        department,
      });

      User.createUser(
        username,
        password,
        "student",
        firstName,
        lastName,
        studentId,
        email,
        department,
        (err, newUser) => {
          if (err) {
            return res.render("error", { message: "Error signing up" });
          }

          res.redirect("/login");
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Error signing up" });
  }
});

// Admin Signup route
app.post("/admin/signup", (req, res) => {
  const { firstName, lastName, username, email, password, confirmPassword } =
    req.body;

  const adminErrors = {};

  if (password !== confirmPassword) {
    adminErrors.confirmPassword = true;
    return res.render("signup", {
      adminErrorMessage: "Password and Confirm Password must match",
      adminErrors,
    });
  }

  // Check if the username already exists
  User.findUserByUsername(username, (err, existingUser) => {
    if (err) {
      return res.render("error", {
        message: "Error checking username availability",
      });
    }

    if (existingUser) {
      // Username already exists, prompt the user to choose a different one
      adminErrors.usernameExists = true;
      return res.render("signup", {
        adminErrorMessage: "Username is already taken. Choose a different one.",
        adminErrors,
      });
    }

    if (username.length <= 5) {
      adminErrors.username = true;
      return res.render("signup", {
        adminErrorMessage: "Username must be more than 5 characters",
        adminErrors,
      });
    }

    if (password.length <= 8 || !/\d/.test(password)) {
      adminErrors.password = true;
      return res.render("signup", {
        adminErrorMessage:
          "Password must be more than 8 characters and include at least one number",
        adminErrors,
      });
    }

    if (!email.includes("@aluadmin.com")) {
      adminErrors.email = true;
      return res.render("signup", {
        adminErrorMessage: "Invalid email address.",
        adminErrors,
      });
    }

    // If username is available, create the new user
    User.createUser(
      username,
      password,
      "admin",
      firstName,
      lastName,
      null,
      email,
      null,
      (err, newUser) => {
        if (err) {
          return res.render("error", { message: "Error signing up" });
        }
        res.redirect("/login");
      }
    );
  });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findUserByUsername(username, (err, user) => {
    if (err || !user || !User.comparePassword(password, user.password)) {
      return res.render("login", {
        errorMessage: "Invalid username or password",
      });
    }

    // Set user role in session or wherever you store user information
    const userRole = user.role;
    const Name = user.username;

    console.log(Name);

    // Redirect based on user role
    if (userRole === "student") {
      const userId = user._id;
  console.log(userId);

      req.session.userData = {
        username: Name,
        role: userRole,
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        userId: user._id,
      };

     

      res.redirect(`/student_dashboard/${userId}`);
    } else if (userRole === "admin") {
      // Set admin user data in the session or wherever you store user information
      req.session.adminUserData = {
        username: Name,
        role: userRole,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      res.redirect("/admin_dashboard");
    } else {
      return res.render("login", { errorMessage: "Unknown user role" });
    }
  });
});

//Student Dashboard route
app.get("/student_dashboard/:userId", (req, res) => {
  const userData = req.session.userData;
  // Fetch opportunities data from your database or wherever it's stored
  const opportunitiesData = [
    { opportunityName: "careerAdvice", _id: "ngL0frTfFeUC2aMn" },
    { opportunityName: "resumeReview", _id: "lDrHXJLfJnNFx7t3" },
    { opportunityName: "mockInterview", _id: "f3YhQrNOlZDVAQWe" },
  ];
  res.render("student_dashboard", {
    userData,
    opportunities: opportunitiesData,
  });
});

//Admin Dashboard routes
app.get("/admin_dashboard", (req, res) => {
  // Get admin user data from the session or wherever you store user information
  const adminUserData = req.session.adminUserData;

  // Pass the admin user data to the template
  res.render("admin_dashboard", { userData: adminUserData });
});

// Add a route to handle myOpportunity display
app.get("/myOpportunity", studentController.displayMyOpportunities);

// Add a route to handle opportunity deletion
app.get("/deleteOpportunity/:id", studentController.deleteOpportunity);


const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
