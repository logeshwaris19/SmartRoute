// ==========================================================
// SMARTROUTE - ROUTES PAGE
// Search From + To
// Maximum 5 routes only
// Matching routes come FIRST
// Fare / Amount removed
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const fromInput = document.getElementById("fromLocation");
    const toInput = document.getElementById("toLocation");
    const searchButton = document.getElementById("searchRoutes");
    const swapButton = document.getElementById("swapBtn");

    const routeCards = Array.from(
        document.querySelectorAll(".route-card")
    );

    const routeList = document.getElementById("routeList");
    const noResults = document.getElementById("noResults");
    const routeSummary = document.getElementById("routeSummary");


    // ======================================================
    // MAXIMUM ROUTES TO DISPLAY
    // ======================================================

    const MAX_ROUTES = 5;


    // ======================================================
    // BUS / ROUTE DATA
    // ======================================================

    const busRoutes = [

        // --------------------------------------------------
        // ROUTE 12
        // --------------------------------------------------

        {
            route: "Route 12",
            bus: "TN 38 AB 1024",

            from: "College",
            to: "Kumarapalayam",

            via: [
                "College",
                "Velagoundampatty",
                "Kumarapalayam"
            ],

            departure: "08:30 AM",
            arrival: "09:05 AM",

            duration: "35 min",
            stops: "8 stops",

            eta: "6 min",

            status: "On Time",
            type: "fastest"
        },


        // --------------------------------------------------
        // ROUTE 24
        // --------------------------------------------------

        {
            route: "Route 24",
            bus: "TN 38 CD 2088",

            from: "Velagoundampatty",
            to: "Ksr College",

            via: [
                "Velagoundampatty",
                "Kumarapalayam",
                "Ksr College"
            ],

            departure: "08:42 AM",
            arrival: "09:24 AM",

            duration: "42 min",
            stops: "11 stops",

            eta: "11 min",

            status: "5 min delay",
            type: "cheapest"
        },


        // --------------------------------------------------
        // ROUTE 31
        // --------------------------------------------------

        {
            route: "Route 31",
            bus: "TN 38 EF 3165",

            from: "Erode",
            to: "Namakkal",

            via: [
                "Erode",
                "Pallipalayam",
                "Namakkal"
            ],

            departure: "08:55 AM",
            arrival: "09:32 AM",

            duration: "37 min",
            stops: "9 stops",

            eta: "18 min",

            status: "On Time",
            type: "fastest"
        },


        // --------------------------------------------------
        // ROUTE 18
        // --------------------------------------------------

        {
            route: "Route 18",
            bus: "TN 38 GH 4210",

            from: "Tiruchengode",
            to: "Ksr College",

            via: [
                "Tiruchengode",
                "Kumarapalayam",
                "Ksr College"
            ],

            departure: "09:10 AM",
            arrival: "09:48 AM",

            duration: "38 min",
            stops: "10 stops",

            eta: "22 min",

            status: "On Time",
            type: "fastest"
        },


        // --------------------------------------------------
        // ROUTE 42
        // --------------------------------------------------

        {
            route: "Route 42",
            bus: "TN 38 JK 5521",

            from: "New Bus Stand",
            to: "Tiruchengode",

            via: [
                "New Bus Stand",
                "Central Market",
                "Tiruchengode"
            ],

            departure: "09:20 AM",
            arrival: "10:00 AM",

            duration: "40 min",
            stops: "7 stops",

            eta: "25 min",

            status: "On Time",
            type: "cheapest"
        }

    ];


    // ======================================================
    // NORMALIZE TEXT
    // ======================================================

    function normalize(value) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    }


    // ======================================================
    // GET SEARCH VALUES
    // ======================================================

    function getSearchValues() {

        const from = normalize(
            fromInput ? fromInput.value : ""
        );

        const to = normalize(
            toInput ? toInput.value : ""
        );

        return {
            from,
            to
        };

    }


    // ======================================================
    // GET ROUTE STOPS
    // ======================================================

    function getRouteStops(route) {

        return route.via.map(
            location => normalize(location)
        );

    }


    // ======================================================
    // CHECK ROUTE MATCH
    // ======================================================

    function routeMatches(route, from, to) {

        if (!from && !to) {
            return true;
        }

        const stops = getRouteStops(route);

        let fromIndex = -1;
        let toIndex = -1;


        // --------------------------------------------------
        // FIND FROM
        // --------------------------------------------------

        if (from) {

            fromIndex = stops.findIndex(
                stop => stop.includes(from)
            );

        }


        // --------------------------------------------------
        // FIND TO
        // --------------------------------------------------

        if (to) {

            toIndex = stops.findIndex(
                stop => stop.includes(to)
            );

        }


        // --------------------------------------------------
        // FROM VALIDATION
        // --------------------------------------------------

        if (from && fromIndex === -1) {
            return false;
        }


        // --------------------------------------------------
        // TO VALIDATION
        // --------------------------------------------------

        if (to && toIndex === -1) {
            return false;
        }


        // --------------------------------------------------
        // DESTINATION MUST COME AFTER SOURCE
        // --------------------------------------------------

        if (
            from &&
            to &&
            fromIndex !== -1 &&
            toIndex !== -1 &&
            fromIndex > toIndex
        ) {

            return false;

        }


        return true;

    }


    // ======================================================
    // CALCULATE SEARCH PRIORITY
    // ======================================================

    function getRoutePriority(route, from, to) {

        if (!from && !to) {
            return 0;
        }

        const routeFrom = normalize(route.from);
        const routeTo = normalize(route.to);

        const stops = getRouteStops(route);

        let score = 0;


        // --------------------------------------------------
        // EXACT FROM + TO
        // --------------------------------------------------

        if (
            from &&
            to &&
            routeFrom === from &&
            routeTo === to
        ) {

            score += 100;

        }


        // --------------------------------------------------
        // EXACT FROM
        // --------------------------------------------------

        if (
            from &&
            routeFrom === from
        ) {

            score += 50;

        }


        // --------------------------------------------------
        // EXACT TO
        // --------------------------------------------------

        if (
            to &&
            routeTo === to
        ) {

            score += 50;

        }


        // --------------------------------------------------
        // FROM EXISTS IN STOPS
        // --------------------------------------------------

        if (
            from &&
            stops.some(stop => stop === from)
        ) {

            score += 30;

        }


        // --------------------------------------------------
        // TO EXISTS IN STOPS
        // --------------------------------------------------

        if (
            to &&
            stops.some(stop => stop === to)
        ) {

            score += 30;

        }


        return score;

    }


    // ======================================================
    // SORT ROUTES
    // Matching routes FIRST
    // ======================================================

    function sortRoutes(routes, from, to) {

        return [...routes].sort((a, b) => {

            const scoreA =
                getRoutePriority(a, from, to);

            const scoreB =
                getRoutePriority(b, from, to);

            return scoreB - scoreA;

        });

    }


    // ======================================================
    // SEARCH ROUTES
    // ======================================================

    function searchRoutes() {

        const {
            from,
            to
        } = getSearchValues();


        // --------------------------------------------------
        // FIND MATCHING ROUTES
        // --------------------------------------------------

        const matchingRoutes =
            busRoutes.filter(route =>
                routeMatches(
                    route,
                    from,
                    to
                )
            );


        // --------------------------------------------------
        // SORT ALL ROUTES
        // Matching routes first
        // --------------------------------------------------

        const sortedRoutes =
            sortRoutes(
                busRoutes,
                from,
                to
            );


        // --------------------------------------------------
        // ONLY MAXIMUM 5 ROUTES
        // --------------------------------------------------

        const limitedRoutes =
            sortedRoutes.slice(
                0,
                MAX_ROUTES
            );


        displayRoutes(
            limitedRoutes,
            from,
            to,
            matchingRoutes.length
        );

    }


    // ======================================================
    // DISPLAY ROUTES
    // ======================================================

    function displayRoutes(
        routes,
        from,
        to,
        matchingCount
    ) {

        // --------------------------------------------------
        // HIDE ALL CARDS FIRST
        // --------------------------------------------------

        routeCards.forEach(card => {

            card.style.display = "none";

        });


        // --------------------------------------------------
        // NO ROUTE CARDS
        // --------------------------------------------------

        if (routeCards.length === 0) {

            console.error(
                "No .route-card elements found in routes.html"
            );

            return;

        }


        // --------------------------------------------------
        // NO MATCHING ROUTE
        // --------------------------------------------------

        if (from || to) {

            if (matchingCount === 0) {

                if (noResults) {
                    noResults.style.display = "block";
                }

                if (routeSummary) {

                    routeSummary.textContent =
                        `No buses found from ${fromInput.value || "anywhere"} to ${toInput.value || "anywhere"}.`;

                }

            } else {

                if (noResults) {
                    noResults.style.display = "none";
                }

            }

        } else {

            if (noResults) {
                noResults.style.display = "none";
            }

        }


        // --------------------------------------------------
        // SHOW MAXIMUM 5 ROUTES
        // --------------------------------------------------

        routes
            .slice(0, MAX_ROUTES)
            .forEach((route, index) => {

                const card =
                    routeCards[index];

                if (!card) {
                    return;
                }


                card.style.display = "grid";


                // ------------------------------------------
                // CHECK MATCH
                // ------------------------------------------

                const isMatch =
                    routeMatches(
                        route,
                        from,
                        to
                    );


                // ------------------------------------------
                // MATCH CLASS
                // ------------------------------------------

                card.classList.toggle(
                    "search-match",
                    isMatch &&
                    (from || to)
                );


                // ------------------------------------------
                // ROUTE TITLE
                // ------------------------------------------

                const routeName =
                    card.querySelector(
                        ".route-title strong"
                    );

                if (routeName) {

                    routeName.childNodes[0].textContent =
                        route.route + " ";

                }


                // ------------------------------------------
                // ROUTE DIRECTION
                // ------------------------------------------

                const routeDirection =
                    card.querySelector(
                        ".route-title span:not(.recommended)"
                    );

                if (routeDirection) {

                    routeDirection.textContent =
                        `${route.from} → ${route.to}`;

                }


                // ------------------------------------------
                // BUS NUMBER
                // ------------------------------------------

                const busNumber =
                    card.querySelector(
                        ".bus-number"
                    );

                if (busNumber) {

                    busNumber.textContent =
                        route.bus;

                    busNumber.setAttribute(
                        "title",
                        route.bus
                    );

                }


                // ------------------------------------------
                // DEPARTURE / ARRIVAL
                // ------------------------------------------

                const timePoints =
                    card.querySelectorAll(
                        ".time-point"
                    );

                if (timePoints.length >= 2) {

                    const departureStrong =
                        timePoints[0]
                            .querySelector("strong");

                    const arrivalStrong =
                        timePoints[1]
                            .querySelector("strong");


                    if (departureStrong) {

                        departureStrong.textContent =
                            route.departure;

                    }


                    if (arrivalStrong) {

                        arrivalStrong.textContent =
                            route.arrival;

                    }

                }


                // ------------------------------------------
                // INFORMATION ROWS
                // NO FARE / AMOUNT
                // ------------------------------------------

                const infoRows =
                    card.querySelectorAll(
                        ".info-row"
                    );


                if (infoRows.length >= 2) {

                    infoRows[0].innerHTML = `
                        <i class="bi bi-clock"></i>
                        ${route.duration}
                    `;


                    infoRows[1].innerHTML = `
                        <i class="bi bi-signpost"></i>
                        ${route.stops}
                    `;

                }


                // ------------------------------------------
                // HIDE EXTRA INFO ROWS
                // Especially fare row
                // ------------------------------------------

                if (infoRows.length > 2) {

                    for (
                        let i = 2;
                        i < infoRows.length;
                        i++
                    ) {

                        infoRows[i].style.display =
                            "none";

                    }

                }


                // ------------------------------------------
                // STATUS
                // ------------------------------------------

                const status =
                    card.querySelector(
                        ".status"
                    );

                if (status) {

                    if (
                        route.status === "On Time"
                    ) {

                        status.className =
                            "status on-time";

                        status.innerHTML = `
                            <i class="bi bi-circle-fill"></i>
                            On Time
                        `;

                    } else {

                        status.className =
                            "status delayed";

                        status.innerHTML = `
                            <i class="bi bi-circle-fill"></i>
                            ${route.status}
                        `;

                    }

                }


                // ------------------------------------------
                // ETA
                // ------------------------------------------

                const eta =
                    card.querySelector(
                        ".eta"
                    );

                if (eta) {

                    eta.innerHTML = `
                        ${route.eta}
                        <small>away</small>
                    `;

                }


                // ------------------------------------------
                // MATCH LABEL
                // ------------------------------------------

                const recommended =
                    card.querySelector(
                        ".recommended"
                    );

                if (recommended) {

                    if (
                        isMatch &&
                        (from || to)
                    ) {

                        recommended.style.display =
                            "inline-flex";

                        recommended.textContent =
                            "MATCH";

                    } else {

                        recommended.style.display =
                            "none";

                    }

                }


                // ------------------------------------------
                // TRACK LIVE BUTTON
                // ------------------------------------------

                const trackButton =
                    card.querySelector(
                        ".track-route"
                    );

                if (trackButton) {

                    trackButton.onclick = () => {

                        // Save selected bus
                        localStorage.setItem(
                            "selectedBus",
                            route.bus
                        );


                        // Save selected route
                        localStorage.setItem(
                            "selectedRoute",
                            route.route
                        );


                        // Save source
                        localStorage.setItem(
                            "routeFrom",
                            route.from
                        );


                        // Save destination
                        localStorage.setItem(
                            "routeTo",
                            route.to
                        );


                        // Go tracking page
                        window.location.href =
                            "tracking.html";

                    };

                }

            });


        // ==================================================
        // SUMMARY
        // ==================================================

        if (!from && !to) {

            routeSummary.textContent =
                `${Math.min(routes.length, MAX_ROUTES)} routes available`;

            return;

        }


        if (matchingCount === 0) {

            routeSummary.textContent =
                "No exact route found. Showing available routes.";

            return;

        }


        if (from && to) {

            routeSummary.textContent =
                `${matchingCount} matching bus${matchingCount > 1 ? "es" : ""} found from ${fromInput.value} to ${toInput.value}.`;

        }

        else if (from) {

            routeSummary.textContent =
                `${matchingCount} matching bus${matchingCount > 1 ? "es" : ""} found from ${fromInput.value}.`;

        }

        else if (to) {

            routeSummary.textContent =
                `${matchingCount} matching bus${matchingCount > 1 ? "es" : ""} found to ${toInput.value}.`;

        }

    }


    // ======================================================
    // SWAP FROM / TO
    // ======================================================

    if (swapButton) {

        swapButton.addEventListener(
            "click",
            () => {

                const temp =
                    fromInput.value;

                fromInput.value =
                    toInput.value;

                toInput.value =
                    temp;

                searchRoutes();

            }
        );

    }


    // ======================================================
    // SEARCH BUTTON
    // ======================================================

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchRoutes
        );

    }


    // ======================================================
    // ENTER KEY SEARCH
    // ======================================================

    [fromInput, toInput].forEach(input => {

        if (!input) {
            return;
        }


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    searchRoutes();

                }

            }
        );

    });


    // ======================================================
    // FILTER BUTTONS
    // ======================================================

    const filterButtons =
        document.querySelectorAll(
            ".filter-buttons button"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                // Active button

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });

                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                const {
                    from,
                    to
                } = getSearchValues();


                // ------------------------------------------
                // FIND MATCHING ROUTES
                // ------------------------------------------

                let filtered =
                    busRoutes.filter(route =>
                        routeMatches(
                            route,
                            from,
                            to
                        )
                    );


                // ------------------------------------------
                // APPLY FILTER
                // ------------------------------------------

                if (
                    filter &&
                    filter !== "all"
                ) {

                    filtered =
                        filtered.filter(
                            route =>
                                route.type === filter
                        );

                }


                // ------------------------------------------
                // SORT
                // ------------------------------------------

                const sorted =
                    sortRoutes(
                        filtered,
                        from,
                        to
                    );


                // ------------------------------------------
                // MAXIMUM 5
                // ------------------------------------------

                const limited =
                    sorted.slice(
                        0,
                        MAX_ROUTES
                    );


                displayRoutes(
                    limited,
                    from,
                    to,
                    filtered.length
                );

            }
        );

    });


    // ======================================================
    // LOAD SEARCH FROM HOME PAGE
    // ======================================================

    const savedFrom =
        localStorage.getItem(
            "fromLocation"
        );


    const savedTo =
        localStorage.getItem(
            "toLocation"
        );


    if (savedFrom && fromInput) {

        fromInput.value =
            savedFrom;

    }


    if (savedTo && toInput) {

        toInput.value =
            savedTo;

    }


    // ======================================================
    // INITIAL DISPLAY
    // ======================================================

    if (
        savedFrom ||
        savedTo
    ) {

        searchRoutes();

    } else {

        displayRoutes(
            busRoutes.slice(
                0,
                MAX_ROUTES
            ),
            "",
            "",
            busRoutes.length
        );

    }


    // ======================================================
    // DEBUG
    // ======================================================

    console.log(
        "SmartRoute Routes initialized."
    );

    console.log(
        `Maximum ${MAX_ROUTES} routes will be displayed.`
    );

});