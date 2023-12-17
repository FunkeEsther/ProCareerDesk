const Datastore = require('nedb');

// Create or load the NeDB datastore
const db = new Datastore({ filename: 'opportunities.db', autoload: true });

class Opportunity {
    static createOpportunity(opportunityName, callback) {
        const opportunity = {
            name: opportunityName,
        };

        db.insert(opportunity, (err, newOpportunity) => {
            if (err) {
                console.error('Error creating opportunity:', err);
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, newOpportunity);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    static updateOpportunity(opportunityId, updatedOpportunityName, callback) {
        const updatedOpportunity = {
            _id: opportunityId,
            name: updatedOpportunityName,
        };

        db.update({ _id: opportunityId }, updatedOpportunity, {}, (err, numReplaced) => {
            if (err) {
                console.error('Error updating opportunity:', err);
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, numReplaced);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }

    static deleteOpportunity(opportunityId, callback) {
        db.remove({ _id: opportunityId }, {}, (err, numRemoved) => {
            if (err) {
                console.error('Error deleting opportunity:', err);
                if (typeof callback === 'function') {
                    return callback(err, null);
                } else {
                    console.error('Callback function is not provided.');
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, numRemoved);
                } else {
                    console.error('Callback function is not provided.');
                }
            }
        });
    }
}

module.exports = Opportunity;
