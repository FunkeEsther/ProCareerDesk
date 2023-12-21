const Opportunity = require("../Models/opportunityModel");
const User = require("../Models/userModel");

const { v4: uuidv4 } = require('uuid');

const submitOpportunity = (req, res) => {
  const { category, opportunity, mentor, date, time } = req.body;
  const userId = req.params.userId;

  // Find the user by ID in the database
  User.findById(userId, (userErr, user) => {
    if (userErr) {
      console.error(userErr);
      return res.status(500).send("Internal Server Error");
    }

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Generate a unique _id for the new opportunity
    const _id = uuidv4();

    // Create a new opportunity object
    const newOpportunity = {
      _id,
      category,
      opportunity,
      mentor,
      date,
      time
    };

    // If the opportunity property is not an array, initialize it as an empty array
    if (!Array.isArray(user.opportunity)) {
      user.opportunity = [];
    }

    // Push the new opportunity to the opportunity array
    user.opportunity.push(newOpportunity);

    // Update the user document in the database with the new opportunity array
    User.updateOne({ _id: userId }, { $set: { opportunity: user.opportunity } }, (updateErr) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).send("Internal Server Error");
      }

      // Redirect to the student dashboard
      res.redirect(`/${userId}/myOpp`);
    });
  });
};



const displayMyOpportunities = (req, res) => {
  const userId = req.params.userId; // Extract the user ID from the route parameter

  // Find the user by ID in the database
  User.findById(userId, (userErr, user) => {
    if (userErr) {
      console.error(userErr);
      return res.redirect("/error");
    }

    console.log('User:', user);

    // Extract opportunities from user or set to an empty array if undefined
    const opportunities = user ? user.opportunity || [] : [];

    // Convert the opportunities object to an array
    const opportunitiesArray = Object.values(opportunities);

    // Group opportunities by category
    const categories = opportunitiesArray.reduce((groups, opportunity) => {
      const category = opportunity.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(opportunity);
      return groups;
    }, {});

    // Render the Mustache template with the data
    res.render("myOpp", {
      userId: userId,
      categories: categories,
      opportunities: opportunities,
    });
  });
};



const displayOpportunity = (req, res) => {
  const userId = req.params.userId; // Extract the user ID from the route parameter
  const opportunityId = req.params._id; // Extract the opportunity ID from the route parameter
 
  // Find the user by ID in the database
  User.findById(userId, (userErr, user) => {
   if (userErr || !user) {
     console.error(userErr);
     return res.redirect("/error");
   }
 
   // If the opportunity property is not an array, initialize it as an empty array
   if (!Array.isArray(user.opportunity)) {
     user.opportunity = [];
   }
 
   // Find the opportunity by ID in the user's data
   const opportunity = user.opportunity.find(op => op._id === opportunityId);

   console.log(opportunity);
 
   if (!opportunity) {
     console.error('Opportunity not found');
     return res.redirect("/error");
   }

   // Render the Mustache template with the data
   res.render("edit", {
     userId: userId,
     opportunity: opportunity
   });
  });
 };
 
const addOpportunity = (req, res) => {
  // Fetch the user ID from the route
  const userId = req.params.userId;

  // Fetch the user from the data
  User.findById(userId, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect("/error");
    } else {
      // Render the addOpp mustache page and pass the userId
      res.render("addOpp", { userId: userId });
    }
  });
};

// const deleteOpportunity = (req, res) => {
//   const opportunityId = req.params.id;

//   Opportunity.deleteOpportunityById(opportunityId, (err, result) => {
//     if (err) {
//       console.error(err);
//       res.redirect("/error");
//     } else {
//       // Redirect to the page where you want to display opportunities after deletion
//       res.redirect("/myOpp");
//     }
//   });

// };

// const deleteOpportunity = (req, res) => {
//   const userId = req.params.userId;
//   const opportunityId = req.params.opportunityId;

//   User.deleteOpportunity(userId, opportunityId, (deleteErr, numReplaced) => {
//     if (deleteErr) {
//       console.error(deleteErr);

//       // Redirect to the error page if an error occurs during deletion
//       return res.redirect("/error");
//     }

//     // If the deletion is successful, redirect to the success page
//     if (numReplaced > 0) {
//       return  res.redirect(`/${userId}/myOpp`);
//     } else {
//       // If no opportunities were deleted, send a message
//       return res.send("No opportunities were deleted.");
//     }
//   });
// };

const deleteOpportunity = (req, res) => {
  const userId = req.params.userId;
  const opportunityId = req.params.opportunityId;

  User.deleteOpportunity(userId, opportunityId, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
      }

      // Check if the opportunity is successfully deleted
      if (result && result.message === "Opportunity deleted successfully") {
          // Redirect to the student dashboard
          res.redirect(`/${userId}/myOpp`);
      } else {
          // Handle other cases if needed
          res.status(500).send("Internal Server Error");
      }
  });
};




const updateOpportunity = (req, res) => {
  const userId = req.params.userId;
  const opportunityId = req.params.opportunityId;
  const { category, opportunity: _opportunity, mentor, date, time } = req.body;
 
  // Find the user by their ID
  User.findById(userId, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect("/error");
    } else {
      // Find the opportunity within the user's data
      const opportunity = user.opportunity.find(op => op._id === opportunityId);
 
      if (opportunity) {
        // Update the opportunity
        opportunity.category = category;
        opportunity.opportunity = _opportunity;
        opportunity.mentor = mentor;
        opportunity.date = date;
        opportunity.time = time;
 
        // Save the updated user
        User.updateUser(userId, user, (err, numReplaced) => {
          if (err) {
            console.error(err);
            res.redirect("/error");
          } else {
            res.redirect(`/${userId}/myOpp`);
          }
        });
      } else {
        // Handle case where opportunity is not found
        res.redirect("/opportunityNotFound");
      }
    }
  });
 };


module.exports = {
  submitOpportunity,
  displayMyOpportunities,
  deleteOpportunity,
  addOpportunity,
  updateOpportunity,
  displayOpportunity,
};
