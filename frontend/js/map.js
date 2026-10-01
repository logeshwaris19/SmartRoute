// ============================================================
// SMARTROUTE
// MAP MANAGEMENT SYSTEM
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // --------------------------------------------------------
    // CHECK MAP ELEMENT
    // --------------------------------------------------------

    const mapElement = document.getElementById("map");

    if (!mapElement) {
        console.log("Map element not found.");
        return;
    }

    if (typeof L === "undefined") {
        console.error("Leaflet library is not loaded.");
        return;
    }


    // --------------------------------------------------------
    // INITIAL MAP
    // --------------------------------------------------------

    const map = L.map("map", {
        zoomControl: false
    }).setView(
        [11.3920, 77.8750],
        13
    );


    // --------------------------------------------------------
    // OPEN STREET MAP
    // --------------------------------------------------------

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // --------------------------------------------------------
    // ZOOM CONTROL
    // --------------------------------------------------------

    L.control.zoom({
        position: "bottomright"
    }).addTo(map);


    // ========================================================
    // ROUTES
    // ========================================================

    const routes = {

        route12: [
            [11.3920, 77.8750],
            [11.3945, 77.8810],
            [11.3975, 77.8880],
            [11.4010, 77.8950],
            [11.4050, 77.9020],
            [11.4100, 77.9090],
            [11.4160, 77.9160],
            [11.4220, 77.9230],
            [11.4280, 77.9300]
        ],

        route24: [
            [11.3780, 77.8650],
            [11.3830, 77.8730],
            [11.3890, 77.8810],
            [11.3960, 77.8890],
            [11.4030, 77.8980],
            [11.4110, 77.9060]
        ],

        route31: [
            [11.4300, 77.9200],
            [11.4250, 77.9120],
            [11.4190, 77.9040],
            [11.4120, 77.8970],
            [11.4050, 77.8890],
            [11.3980, 77.8810]
        ]

    };


    // ========================================================
    // DRAW DEFAULT ROUTE
    // ========================================================

    let activeRoute = L.polyline(
        routes.route12,
        {
            color: "#2563eb",
            weight: 6,
            opacity: 0.8
        }
    ).addTo(map);


    // ========================================================
    // BUS ICON
    // ========================================================

    const busIcon = L.divIcon({

        className: "smart-map-bus",

        html: `
            <div class="map-bus-marker">

                <i class="bi bi-bus-front-fill"></i>

            </div>
        `,

        iconSize: [44, 44],

        iconAnchor: [22, 22]

    });


    // ========================================================
    // BUS DATA
    // ========================================================

    const buses = [

        {
            id: "bus12",
            number: "TN 38 AB 1024",
            route: "Route 12",
            status: "On Time",
            speed: 47,
            positionIndex: 2,
            coordinates: routes.route12
        },

        {
            id: "bus24",
            number: "TN 38 CD 2088",
            route: "Route 24",
            status: "Delayed",
            speed: 31,
            positionIndex: 3,
            coordinates: routes.route24
        },

        {
            id: "bus31",
            number: "TN 38 EF 3165",
            route: "Route 31",
            status: "On Time",
            speed: 43,
            positionIndex: 1,
            coordinates: routes.route31
        }

    ];


    // ========================================================
    // CREATE BUS MARKERS
    // ========================================================

    const busMarkers = {};


    buses.forEach(function (bus) {

        const marker = L.marker(
            bus.coordinates[bus.positionIndex],
            {
                icon: busIcon
            }
        ).addTo(map);


        marker.bindPopup(`

            <div style="
                min-width:200px;
                font-family:Arial,sans-serif;
            ">

                <div style="
                    font-size:15px;
                    font-weight:700;
                    margin-bottom:8px;
                ">

                    🚌 ${bus.number}

                </div>

                <div style="
                    color:#64748b;
                    font-size:12px;
                    margin-bottom:7px;
                ">

                    ${bus.route}

                </div>

                <div style="
                    color:#16a34a;
                    font-weight:700;
                    font-size:11px;
                ">

                    ● ${bus.status}

                </div>

                <div style="
                    margin-top:7px;
                    font-size:11px;
                    color:#64748b;
                ">

                    Speed: ${bus.speed} km/h

                </div>

            </div>

        `);


        busMarkers[bus.id] = marker;

    });


    // ========================================================
    // BUS STOPS
    // ========================================================

    const stopData = [

        {
            name: "New Bus Stand",
            position: [11.3920, 77.8750]
        },

        {
            name: "Kumarapalayam",
            position: [11.4100, 77.9090]
        },

        {
            name: "Tiruchengode",
            position: [11.4280, 77.9300]
        },

        {
            name: "Central Market",
            position: [11.4030, 77.8980]
        },

        {
            name: "Railway Station",
            position: [11.3830, 77.8730]
        }

    ];


    // ========================================================
    // STOP ICON
    // ========================================================

    const stopIcon = L.divIcon({

        className: "smart-map-stop",

        html: `
            <div class="map-stop-marker"></div>
        `,

        iconSize: [18, 18],

        iconAnchor: [9, 9]

    });


    // ========================================================
    // ADD STOPS
    // ========================================================

    stopData.forEach(function (stop) {

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
                direction: "top"
            }
        );

    });


    // ========================================================
    // SEARCH LOCATION
    // ========================================================

    const searchInput =
        document.querySelector(
            ".map-search input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Enter") {
                    return;
                }

                const searchValue =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                if (!searchValue) {
                    return;
                }


                // Search bus stop
                const foundStop =
                    stopData.find(function (stop) {

                        return stop.name
                            .toLowerCase()
                            .includes(searchValue);

                    });


                if (foundStop) {

                    map.flyTo(
                        foundStop.position,
                        15,
                        {
                            duration: 1
                        }
                    );

                    L.popup()
                        .setLatLng(
                            foundStop.position
                        )
                        .setContent(
                            `<strong>${foundStop.name}</strong>`
                        )
                        .openOn(map);

                    return;
                }


                alert(
                    "Location not found. Try searching a bus stop."
                );

            }
        );

    }


    // ========================================================
    // MY LOCATION
    // ========================================================

    window.showMyLocation = function () {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const userLocation = [

                    position.coords.latitude,

                    position.coords.longitude

                ];


                map.flyTo(
                    userLocation,
                    16,
                    {
                        duration: 1.2
                    }
                );


                L.marker(
                    userLocation
                )
                .addTo(map)
                .bindPopup(
                    "📍 You are here"
                )
                .openPopup();

            },

            function () {

                alert(
                    "Unable to access your location."
                );

            }

        );

    };


    // ========================================================
    // CENTER DEFAULT ROUTE
    // ========================================================

    window.showRoute = function (routeName) {

        if (!routes[routeName]) {
            return;
        }


        // Remove previous route
        map.removeLayer(activeRoute);


        // Create new route
        activeRoute =
            L.polyline(
                routes[routeName],
                {
                    color: "#2563eb",
                    weight: 6,
                    opacity: 0.8
                }
            ).addTo(map);


        // Fit route
        map.fitBounds(
            activeRoute.getBounds(),
            {
                padding: [40, 40]
            }
        );

    };


    // ========================================================
    // SIMULATED LIVE BUS MOVEMENT
    // ========================================================

    setInterval(
        function () {

            buses.forEach(function (bus) {

                bus.positionIndex++;


                if (
                    bus.positionIndex >=
                    bus.coordinates.length
                ) {

                    bus.positionIndex = 0;

                }


                const newPosition =
                    bus.coordinates[
                        bus.positionIndex
                    ];


                const marker =
                    busMarkers[bus.id];


                if (marker) {

                    marker.setLatLng(
                        newPosition
                    );

                }

            });

        },
        4000
    );


    // ========================================================
    // MAP RESIZE
    // ========================================================

    setTimeout(
        function () {

            map.invalidateSize();

        },
        500
    );


    // ========================================================
    // GLOBAL MAP ACCESS
    // ========================================================

    window.smartRouteMap = map;


    console.log(
        "SmartRoute Map System initialized successfully."
    );

});