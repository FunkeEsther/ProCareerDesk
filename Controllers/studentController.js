// Define the controller object
const studentDashboardController = {
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
        // Implement modify logic here if needed
        alert(`Modify ${opportunityType}`);
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

