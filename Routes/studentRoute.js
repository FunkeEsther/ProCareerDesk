// routes/routes.js
const express = require('express');
const router = express.Router();

router.post('/addopportunities', (req, res) => {
    // Handle the form submission logic here
    const selectedOpportunities = req.body.opportunities;

    // Assuming you want to process the selected opportunities
    // You can perform actions like storing them in a database or processing them in any way you need.

    // Redirect back to the student dashboard after processing
    res.redirect('/student_dashboard');
});

module.exports = router;
