const Datastore = require('nedb');

// Create or load the NeDB datastore
const db = new Datastore({ filename: 'opportunities.db', autoload: true });

class Opportunity {
    constructor(category, opportunity, mentor, date, time) {
        this.category = category;
        this.opportunity = opportunity;
        this.mentor = mentor;
        this.date = date;
        this.time = time;
    }

    save(callback) {
        db.insert(this, (err, savedOpportunity) => {
            if (err) {
                console.error('Error creating opportunity:', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, savedOpportunity);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    
    static findById(id, callback) {
        db.findOne({ _id: id }, (err, opportunity) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, opportunity);
            }
        });
    }

    static getAllOpportunities(callback) {
        db.find({}, (err, data) => {
         if (err) {
           callback(err, null);
         } else {
           console.log('Data:', data); // Log the data
           callback(null, data);
         }
        });
       }
  
       static deleteOpportunityById(opportunityId, callback) {
        db.remove({ _id: opportunityId }, {}, (err, numRemoved) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, numRemoved);
            }
        });
    }

    

    static updateOpportunityById(opportunityId, updatedOpportunity, callback) {
        db.update({ _id: opportunityId }, { $set: updatedOpportunity }, {}, (err, numReplaced) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, numReplaced);
            }
        });
    }
}



module.exports = Opportunity;
