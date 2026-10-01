/* =========================================================
   SMARTROUTE — DASHBOARD JAVASCRIPT
========================================================= */


/* =========================================================
   DASHBOARD INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    updateDashboardDate();

    initializeDashboardInteractions();

    updateLiveBus();

});


/* =========================================================
   CURRENT DATE
========================================================= */

function updateDashboardDate() {

    const dateElement =
        document.querySelector(".dashboard-date strong");

    if (!dateElement) return;


    const today = new Date();


    const options = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


/* =========================================================
   LIVE BUS SIMULATION
========================================================= */

function updateLiveBus() {

    const etaElement =
        document.querySelector(
            ".eta-panel div:nth-child(1) strong"
        );


    const distanceElement =
        document.querySelector(
            ".eta-panel div:nth-child(2) strong"
        );


    const speedElement =
        document.querySelector(
            ".eta-panel div:nth-child(3) strong"
        );


    if (
        !etaElement ||
        !distanceElement ||
        !speedElement
    ) {
        return;
    }


    let eta = 8;

    let distance = 3.4;

    let speed = 42;


    setInterval(() => {


        /* Random realistic movement */

        speed =
            Math.floor(
                38 +
                Math.random() * 10
            );


        distance =
            Math.max(
                0.8,
                distance -
                (speed / 3600) * 4
            );


        eta =
            Math.max(
                2,
                Math.ceil(
                    distance /
                    speed *
                    60
                )
            );


        etaElement.textContent =
            eta + " min";


        distanceElement.textContent =
            distance.toFixed(1) + " km";


        speedElement.textContent =
            speed + " km/h";


    }, 5000);

}


/* =========================================================
   DASHBOARD INTERACTIONS
========================================================= */

function initializeDashboardInteractions() {


    /* ==============================================
       VIEW ALL TRIPS
    ============================================== */

    const viewAll =
        document.querySelector(".text-button");


    if (viewAll) {

        viewAll.addEventListener(
            "click",
            () => {

                alert(
                    "Trip history will be available " +
                    "when the backend is connected."
                );

            }
        );

    }


    /* ==============================================
       ADD FAVORITE STOP
    ============================================== */

    const addStop =
        document.querySelector(".circle-button");


    if (addStop) {

        addStop.addEventListener(
            "click",
            () => {

                alert(
                    "Add Favorite Stop feature " +
                    "will be connected to the backend."
                );

            }
        );

    }


    /* ==============================================
       STATS FILTER
    ============================================== */

    const statsSelect =
        document.querySelector(".stats-select");


    if (statsSelect) {

        statsSelect.addEventListener(
            "change",
            function () {

                updateTravelStats(
                    this.value
                );

            }
        );

    }

}


/* =========================================================
   TRAVEL STATISTICS
========================================================= */

function updateTravelStats(period) {

    const values = {

        "This Month": {
            distance: "186 km",
            trips: "18",
            time: "8h 24m",
            fare: "₹420"
        },

        "This Week": {
            distance: "54 km",
            trips: "6",
            time: "2h 18m",
            fare: "₹135"
        },

        "This Year": {
            distance: "1,820 km",
            trips: "186",
            time: "76h",
            fare: "₹4,250"
        }

    };


    const data =
        values[period];


    if (!data) return;


    const statValues =
        document.querySelectorAll(
            ".travel-stat strong"
        );


    if (statValues.length >= 4) {

        statValues[0].textContent =
            data.distance;

        statValues[1].textContent =
            data.trips;

        statValues[2].textContent =
            data.time;

        statValues[3].textContent =
            data.fare;

    }

}


/* =========================================================
   FAVORITE STOP CLICK
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const stop =
            event.target.closest(
                ".saved-stop"
            );


        if (!stop) return;


        const name =
            stop.querySelector(
                "strong"
            );


        if (name) {

            alert(
                "Showing buses near " +
                name.textContent
            );

        }

    }
);


/* =========================================================
   ALERT CLICK
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const alertItem =
            event.target.closest(
                ".alert-item"
            );


        if (!alertItem) return;


        const title =
            alertItem.querySelector(
                "strong"
            );


        if (title) {

            console.log(
                "Selected alert:",
                title.textContent
            );

        }

    }
);


/* =========================================================
   LIVE SYSTEM STATUS
========================================================= */

function checkSystemStatus() {

    const status =
        document.querySelector(
            ".dashboard-status"
        );


    if (!status) return;


    const dot =
        status.querySelector("span");


    if (!dot) return;


    /* Demo system always online */

    dot.style.background =
        "#16a673";

}


/* =========================================================
   RUN STATUS CHECK
========================================================= */

setInterval(
    checkSystemStatus,
    10000
);