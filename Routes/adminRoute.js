const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');  


// Route to display student dashboard with opportunities
router.get('/manageStudent', adminController.displayStudents);

router.post("/addStudent", adminController.addStudentPost);

// router.post("/submitStudent", adminController.addStudentPost);

module.exports = router;


