// ============================================================
// SMARTROUTE - REAL TIME BUS TRACKING
// Tracking starts ONLY when Start Live Tracking is clicked
// ============================================================


// ============================================================
// 1. MAKE SURE LEAFLET IS LOADED
// ============================================================

if (typeof L === "undefined") {

    console.error("Leaflet library not loaded.");

} else {


    // ========================================================
    // 2. MAP INITIALIZATION
    // ========================================================

    const map = L.map("map", {
        zoomControl: false
    }).setView(
        [11.3920, 77.8750],
        13
    );


    // ========================================================
    // 3. OPEN STREET MAP
    // ========================================================

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // ========================================================
    // 4. ZOOM CONTROL
    // ========================================================

    L.control.zoom({
        position: "bottomright"
    }).addTo(map);


    // ========================================================
    // 5. ROUTE DATA
    // ========================================================

    const routeCoordinates = [

        [11.3920, 77.8750],

        [11.3945, 77.8810],

        [11.3975, 77.8880],

        [11.4010, 77.8950],

        [11.4050, 77.9020],

        [11.4100, 77.9090],

        [11.4160, 77.9160],

        [11.4220, 77.9230],

        [11.4280, 77.9300]

    ];


    // ========================================================
    // 6. ROUTE LINE
    // ========================================================

    const routeLine = L.polyline(
        routeCoordinates,
        {
            color: "#2563eb",
            weight: 6,
            opacity: 0.85
        }
    ).addTo(map);


    // Fit route inside map

    map.fitBounds(
        routeLine.getBounds(),
        {
            padding: [50, 50]
        }
    );


    // ========================================================
    // 7. BUS ICON
    // ========================================================

    const busIcon = L.divIcon({

        className: "smart-bus-marker",

        html: `
            <div style="
                width:46px;
                height:46px;
                background:#2563eb;
                border:4px solid white;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                color:white;
                font-size:21px;
                box-shadow:0 5px 18px rgba(37,99,235,.4);
            ">
                <i class="bi bi-bus-front-fill"></i>
            </div>
        `,

        iconSize: [46, 46],

        iconAnchor: [23, 23]

    });


    // ========================================================
    // 8. INITIAL BUS POSITION
    // ========================================================

    let currentIndex = 0;

    let busPosition =
        routeCoordinates[currentIndex];


    // ========================================================
    // 9. CREATE BUS MARKER
    // ========================================================

    const busMarker = L.marker(
        busPosition,
        {
            icon: busIcon
        }
    ).addTo(map);


    // ========================================================
    // 10. BUS POPUP
    // ========================================================

    busMarker.bindPopup(`

        <div style="
            min-width:180px;
            font-family:Arial;
        ">

            <strong style="
                font-size:15px;
                color:#0f172a;
            ">
                🚌 TN 38 AB 1024
            </strong>

            <br><br>

            <span style="
                color:#16a34a;
                font-weight:bold;
            ">
                ● LIVE
            </span>

            <br>

            <span style="font-size:12px;">
                Route 12 • City Express
            </span>

        </div>

    `);


    // ========================================================
    // 11. BUS STOP DATA
    // ========================================================

    const stops = [

        {
            name: "Velagoundampatty",
            position: [11.3920, 77.8750]
        },

        {
            name: "Kumarapalayam",
            position: [11.4100, 77.9090]
        },

        {
            name: "KSR College",
            position: [11.4280, 77.9300]
        }

    ];


    // ========================================================
    // 12. STOP ICON
    // ========================================================

    const stopIcon = L.divIcon({

        className: "bus-stop-marker",

        html: `
            <div style="
                width:18px;
                height:18px;
                background:#16a34a;
                border:3px solid white;
                border-radius:50%;
                box-shadow:0 3px 10px rgba(0,0,0,.25);
            "></div>
        `,

        iconSize: [18, 18],

        iconAnchor: [9, 9]

    });


    // ========================================================
    // 13. ADD BUS STOPS
    // ========================================================

    stops.forEach(function (stop) {

        L.marker(
            stop.position,
            {
                icon: stopIcon
            }
        )
        .addTo(map)
        .bindTooltip(
            stop.name,
            {
                direction: "top",
                offset: [0, -8]
            }
        );

    });


    // ========================================================
    // 14. GET HTML ELEMENTS
    // ========================================================

    const speedValue =
        document.getElementById("speedValue");

    const etaValue =
        document.getElementById("etaValue");

    const passengerValue =
        document.getElementById("passengerValue");

    const routePercent =
        document.getElementById("routePercent");

    const routeProgressBar =
        document.getElementById("routeProgressBar");

    const bottomEta =
        document.getElementById("bottomEta");

    const lastUpdate =
        document.getElementById("lastUpdate");


    // ========================================================
    // 15. TRACKING STATUS
    // ========================================================

    let trackingActive = false;

    let trackingInterval = null;


    // ========================================================
    // 16. UPDATE BUS INFORMATION
    // ========================================================

    function updateBusInformation() {


        // ----------------------------------------------------
        // SPEED
        // ----------------------------------------------------

        const speed =
            Math.floor(
                Math.random() * 12
            ) + 42;


        // ----------------------------------------------------
        // REMAINING STOPS
        // ----------------------------------------------------

        const remainingStops =
            routeCoordinates.length -
            currentIndex;


        // ----------------------------------------------------
        // ETA
        // ----------------------------------------------------

        const eta =
            Math.max(
                2,
                Math.ceil(
                    remainingStops * 0.8
                )
            );


        // ----------------------------------------------------
        // PASSENGERS
        // ----------------------------------------------------

        const passengers =
            Math.floor(
                Math.random() * 10
            ) + 28;


        // ----------------------------------------------------
        // ROUTE PROGRESS
        // ----------------------------------------------------

        const progress =
            Math.min(
                100,
                Math.round(
                    (
                        currentIndex /
                        (routeCoordinates.length - 1)
                    ) * 100
                )
            );


        // ----------------------------------------------------
        // UPDATE SPEED
        // ----------------------------------------------------

        if (speedValue) {

            speedValue.textContent =
                speed;

        }


        // ----------------------------------------------------
        // UPDATE ETA
        // ----------------------------------------------------

        if (etaValue) {

            etaValue.textContent =
                String(eta).padStart(2, "0");

        }


        if (bottomEta) {

            bottomEta.textContent =
                String(eta).padStart(2, "0");

        }


        // ----------------------------------------------------
        // UPDATE PASSENGERS
        // ----------------------------------------------------

        if (passengerValue) {

            passengerValue.textContent =
                passengers;

        }


        // ----------------------------------------------------
        // UPDATE PROGRESS
        // ----------------------------------------------------

        if (routePercent) {

            routePercent.textContent =
                progress + "%";

        }


        if (routeProgressBar) {

            routeProgressBar.style.width =
                progress + "%";

        }


        // ----------------------------------------------------
        // LAST UPDATE
        // ----------------------------------------------------

        if (lastUpdate) {

            if (trackingActive) {

                lastUpdate.textContent =
                    "Updated just now";

            } else {

                lastUpdate.textContent =
                    "Tracking not started";

            }

        }

    }


    // ========================================================
    // 17. MOVE BUS
    // ========================================================

    function moveBus() {


        // Only move when tracking is active

        if (!trackingActive) {

            return;

        }


        // Move to next position

        currentIndex++;


        // Restart route after destination

        if (
            currentIndex >=
            routeCoordinates.length
        ) {

            currentIndex = 0;

        }


        // Update position

        busPosition =
            routeCoordinates[currentIndex];


        // Move marker

        busMarker.setLatLng(
            busPosition
        );


        // Move map smoothly

        map.panTo(
            busPosition,
            {
                animate: true,
                duration: 1
            }
        );


        // Update information

        updateBusInformation();

    }


    // ========================================================
    // 18. START LIVE TRACKING
    // ========================================================

    function startLiveTracking() {


        // Already running

        if (trackingActive) {

            return;

        }


        trackingActive = true;


        // Initial update

        updateBusInformation();


        // Start bus movement

        trackingInterval =
            setInterval(
                moveBus,
                4000
            );


        console.log(
            "SmartRoute Live Tracking started."
        );


        updateTrackingButton();

    }


    // ========================================================
    // 19. STOP LIVE TRACKING
    // ========================================================

    function stopLiveTracking() {


        trackingActive = false;


        // Stop movement

        if (trackingInterval) {

            clearInterval(
                trackingInterval
            );

            trackingInterval = null;

        }


        if (lastUpdate) {

            lastUpdate.textContent =
                "Tracking paused";

        }


        console.log(
            "SmartRoute Live Tracking stopped."
        );


        updateTrackingButton();

    }


    // ========================================================
    // 20. TRACKING BUTTON
    // ========================================================

    function updateTrackingButton() {


        const trackingButton =
            document.querySelector(
                ".start-tracking-btn"
            );


        if (!trackingButton) {

            return;

        }


        if (trackingActive) {


            trackingButton.innerHTML = `

                <i class="bi bi-pause-circle-fill"></i>

                Stop Live Tracking

            `;


            trackingButton.style.background =
                "#dc2626";


        } else {


            trackingButton.innerHTML = `

                <i class="bi bi-broadcast"></i>

                Start Live Tracking

            `;


            trackingButton.style.background =
                "#2563eb";

        }

    }


    // ========================================================
    // 21. START / STOP BUTTON CLICK
    // ========================================================

    const trackingButton =
        document.querySelector(
            ".start-tracking-btn"
        );


    if (trackingButton) {

        trackingButton.addEventListener(
            "click",
            function () {


                if (trackingActive) {

                    stopLiveTracking();

                } else {

                    startLiveTracking();

                }

            }
        );

    }


    // ========================================================
    // 22. INITIAL STATE
    // ========================================================

    updateBusInformation();

    updateTrackingButton();


    // ========================================================
    // 23. LOCATE BUS
    // ========================================================

    window.centerBus = function () {


        map.flyTo(
            busMarker.getLatLng(),
            15,
            {
                animate: true,
                duration: 1.2
            }
        );


        busMarker.openPopup();

    };


    // ========================================================
    // 24. NOTIFICATION BUTTON
    // ========================================================

    const notifyButton =
        document.querySelector(
            ".notify-btn"
        );


    if (notifyButton) {

        notifyButton.addEventListener(
            "click",
            function () {


                this.innerHTML = `

                    <i class="bi bi-check-circle-fill"></i>

                    Notifications On

                `;


                this.style.background =
                    "#16a34a";

            }
        );

    }


    // ========================================================
    // 25. SHARE BUTTON
    // ========================================================

    const shareButton =
        document.querySelector(
            ".share-btn"
        );


    if (shareButton) {

        shareButton.addEventListener(
            "click",
            async function () {


                const shareData = {

                    title:
                        "SmartRoute - Live Bus",

                    text:
                        "Track TN 38 AB 1024 - Route 12",

                    url:
                        window.location.href

                };


                try {


                    if (navigator.share) {

                        await navigator.share(
                            shareData
                        );

                    } else {

                        await navigator.clipboard.writeText(
                            window.location.href
                        );


                        alert(
                            "Live tracking link copied!"
                        );

                    }


                } catch (error) {

                    console.log(
                        "Share cancelled."
                    );

                }

            }
        );

    }


    // ========================================================
    // 26. CALL DRIVER
    // ========================================================

    const callDriver =
        document.querySelector(
            ".call-driver"
        );


    if (callDriver) {

        callDriver.addEventListener(
            "click",
            function () {


                window.location.href =
                    "tel:+919876543210";

            }
        );

    }


    // ========================================================
    // 27. MAP RESIZE FIX
    // ========================================================

    setTimeout(
        function () {

            map.invalidateSize();

        },
        500
    );


    // ========================================================
    // 28. CONSOLE
    // ========================================================

    console.log(
        "SmartRoute Tracking page loaded."
    );

    console.log(
        "Tracking is currently OFF. Click Start Live Tracking to begin."
    );

}