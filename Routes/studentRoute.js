const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');


router.get("/:userId/addOpp", studentController.addOpportunity);

// Route to handle form submission for adding opportunities
router.post('/:userId/submitOpportunity', studentController.submitOpportunity);

// Route to display student dashboard with opportunities
router.get('/:userId/myOpp', studentController.displayMyOpportunities);

// Route to handle opportunity deletion by ID
router.get("/:userId/deleteOpportunity/:opportunityId", studentController.deleteOpportunity);


// Add this route to handle opportunity updates
router.post('/:userId/updateOpportunity/:opportunityId', studentController.updateOpportunity);


router.get('/:userId/edit/:_id', studentController.displayOpportunity);



module.exports = router;
