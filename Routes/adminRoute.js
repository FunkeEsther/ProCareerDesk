const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/adminController');

// Route to display student dashboard with opportunities
router.get('/manageStudent', adminController.displayStudent);