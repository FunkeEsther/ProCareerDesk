// Define the controller object
window.studentDashboardController = {
    addOpportunity: function () {
        const opportunityType = prompt("Enter the opportunity type:");
        if (opportunityType) {
            const opportunityElement = document.createElement("div");
            opportunityElement.classList.add("opportunity");
  
            const labelElement = document.createElement("label");
            labelElement.textContent = opportunityType;
  
            const modifyButton = document.createElement("button");
            modifyButton.textContent = "Modify";
            modifyButton.onclick = () => this.modifyOpportunity(opportunityType);
  
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = () => this.deleteOpportunity(opportunityType);
  
            opportunityElement.appendChild(labelElement);
            opportunityElement.appendChild(modifyButton);
            opportunityElement.appendChild(deleteButton);
  
            document.getElementById("addedOpportunities").appendChild(opportunityElement);
        }
    },
  
    modifyOpportunity: function (opportunityType) {
        const opportunityElement = document.querySelector(`label:contains(${opportunityType})`).parentNode;
        const opportunityId = opportunityElement.dataset.id;
  
        // Display the modify form
        document.getElementById('modify-opportunity-form').style.display = 'block';
  
        // Fill in the opportunity ID and name
        document.getElementById('modify-opportunity-id').value = opportunityId;
        document.getElementById('modify-opportunity-name').value = opportunityType;
  
        // Handle the form submission
        document.getElementById('modify-opportunity-form').onsubmit = (event) => {
            event.preventDefault();
  
            const updatedOpportunityName = document.getElementById('modify-opportunity-name').value;
  
            // Send a POST request to the server to modify the opportunity
            fetch('/modifyopportunity', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  opportunityId: opportunityId,
                  updatedOpportunityName: updatedOpportunityName,
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Handle the server response
                if (data.success) {
                  // Update the opportunity name in the UI
                  opportunityElement.querySelector('label').textContent = updatedOpportunityName;
  
                  // Hide the modify form
                  document.getElementById('modify-opportunity-form').style.display = 'none';
                } else {
                  // Handle the error
                  alert('Error modifying opportunity');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        };
    },
  
    deleteOpportunity: function (opportunityType) {
        // Implement delete logic here if needed
        const confirmed = confirm(`Are you sure you want to delete ${opportunityType}?`);
        if (confirmed) {
            const opportunityElement = document.querySelector(`label:contains(${opportunityType})`).parentNode;
            opportunityElement.parentNode.removeChild(opportunityElement);
        }
    }
  };
  