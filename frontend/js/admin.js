// =====================================================
// ADD BUS MODAL
// =====================================================

function openAddBusModal() {
    const modal = document.getElementById("addBusModal");

    if (modal) {
        modal.classList.add("show");
    }
}


function closeAddBusModal() {
    const modal = document.getElementById("addBusModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

const addBusModal = document.getElementById("addBusModal");

if (addBusModal) {

    addBusModal.addEventListener("click", function (event) {

        if (event.target === addBusModal) {
            closeAddBusModal();
        }

    });

}


// =====================================================
// ADD BUS FORM
// =====================================================

const addBusForm = document.getElementById("addBusForm");

if (addBusForm) {

    addBusForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // Get form values

        const busNumber =
            document.getElementById("busNumber").value.trim();

        const busRoute =
            document.getElementById("busRoute").value;

        const driverName =
            document.getElementById("driverName").value.trim();


        // Validate

        if (!busNumber || !busRoute || !driverName) {

            alert("Please fill all fields.");

            return;
        }


        // =================================================
        // ADD NEW BUS TO ACTIVITY
        // =================================================

        addRecentActivity(
            "New bus added",
            `${busNumber} was added to fleet`,
            "green-bg",
            "bi-plus-lg"
        );


        // =================================================
        // CLOSE MODAL
        // =================================================

        closeAddBusModal();


        // =================================================
        // RESET FORM
        // =================================================

        addBusForm.reset();


        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        alert(
            `${busNumber} added successfully to ${busRoute}.`
        );

    });

}


// =====================================================
// ADD RECENT ACTIVITY
// =====================================================

function addRecentActivity(
    title,
    description,
    iconClass,
    icon
) {

    // Find Recent Activity card

    const activityItems =
        document.querySelectorAll(".activity-item");


    if (activityItems.length === 0) {
        return;
    }


    // Get the first activity

    const firstActivity =
        activityItems[0];


    // Create new activity item

    const newActivity =
        document.createElement("div");

    newActivity.className =
        "activity-item";


    // Create activity HTML

    newActivity.innerHTML = `

        <div class="activity-icon ${iconClass}">

            <i class="bi ${icon}"></i>

        </div>


        <div>

            <strong>
                ${title}
            </strong>

            <span>
                ${description}
            </span>

            <small>
                Just now
            </small>

        </div>

    `;


    // Add new activity at TOP

    firstActivity.parentNode.insertBefore(
        newActivity,
        firstActivity
    );

}