
document.getElementById('flightsFile').addEventListener('change', handleFileSelect);
document.getElementById('airportsFile').addEventListener('change', handleFileSelect);
document.getElementById('runScript').addEventListener('click', runScript);
document.getElementById('filterSourceAirportSelect').addEventListener('change', filterFlights);
document.getElementById('filterDestinationAirportSelect').addEventListener('change', filterFlights);
document.getElementById('filterAirlineSelect').addEventListener('change', filterFlights);
document.getElementById('filterAircraftSelect').addEventListener('change', filterFlights);
document.getElementById('filterCitySelect').addEventListener('change', filterAirports);
document.getElementById("filterSearchTermInput").addEventListener('input', filterAirports);
document.getElementById('busiestFlightCorridorButton').addEventListener('click', displayBusiestFlightCorridors);
document.getElementById('greatestTimezoneDifference').addEventListener('click',displayTimeDifferences);
document.getElementById('busiestAirport').addEventListener('click', displayBusiestAirports);

let flightsArray, airportsArray;
let expandedFlightsArray = []; // Define expandedFlightsArray globally so it can be used by all functions

function handleFileSelect(event) {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const fileContent = e.target.result;
        try {
            const parsedData = JSON.parse(fileContent);
            if (event.target.id === 'flightsFile') {
                flightsArray = parsedData;
                console.log('Flights Data Loaded:', flightsArray);

            } else if (event.target.id === 'airportsFile') {
                airportsArray = parsedData;
                console.log('Airports Data Loaded:', airportsArray);

            }

            // Check if both files are uploaded to enable the "Run Script" button
            if (flightsArray && airportsArray) {
                document.getElementById('runScript').disabled = false;
            }
            
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    
    reader.readAsText(file); 
}

function runScript() {
    // Ensure both files are loaded before proceeding
    if (!flightsArray || !airportsArray) {
        console.error("Both files must be loaded before running the script.");
        return;
    }
    console.log("Running script with both files loaded...");
    //intialize airport flight counters to 0, some airports occur in 0 flights!
    initializeAirportCounters(airportsArray);
    // Process airportsArray into an object for quick lookup
    createAirportsObject();
    createExpandedFlightsArray();
    // Check if expandedFlightsArray is populated
    if (expandedFlightsArray && expandedFlightsArray.length > 0) {
        console.log("Running functions with expandedFlightsArray");
        populateAllDropdowns();
        //update expandedFlightsArray to include flight counters to airports
        expandedFlightsArray = mapFlightsArray(expandedFlightsArray, addFlightCounterToAirports);
        //update to include total flights at  every airport
        expandedFlightsArray = mapFlightsArray(expandedFlightsArray, addTotalFlightCounterToAirports);
        console.log(expandedFlightsArray);
        logAirportDetails("Brisbane Archerfield Airport");

    } else {
        console.error("functions did not run");
    }

}
//For debugging
function logAirportDetails(airportName) {
    // Check if airportsObject is defined
    if (!airportsObject) {
        console.error("airportsObject is not defined.");
        return;
    }

    // Find the airport by name
    const airport = Object.values(airportsObject).find(a => a.name === airportName);

    if (airport) {
        console.log("Airport Details:", airport);
    } else {
        console.error(`Airport with name "${airportName}" not found.`);
    }
}
//To lookup airport details quickly with id, the array must be changed to an object
function createAirportsObject() {
    if (!airportsArray) {
        console.error("Airports array is not loaded yet.");
        return;
    }

    airportsObject = {};
    airportsArray.forEach(function(airport) {
        airportsObject[airport.id] = airport;
    });
    console.log("Airports Object Created:", airportsObject);
}

// Reorganise flightsArray and expand it to include airport data
function createExpandedFlightsArray() {
    console.log("Entering createExpandedFlightsArray function...")
    if (!flightsArray) {
        console.error("Flights array is not loaded yet.");
        return;
    }
    flightsArray.forEach(function(flightObject){
        //expand data in 'source_airport' property
        const sourceAirportID = flightObject["source_airport_id"];
        flightObject.source_airport = airportsObject[sourceAirportID];

        //expand data in 'destination_airport' property
        const destinationAirportID = flightObject["destination_airport_id"];
        flightObject.destination_airport = airportsObject[destinationAirportID];

        //remove unnecessary flight properties
        delete flightObject.destination_airport_id;
        delete flightObject.source_airport_id;

        //reorganise airline data
        const airlineObject = {
            code: flightObject.airline,
            name: flightObject.airline_name,
            country: flightObject.airline_country
        };
        flightObject.airline = airlineObject;

        //remove unnecessary airline properties
        delete flightObject.airline_name;
        delete flightObject.airline_country;

        expandedFlightsArray.push(flightObject);
    });
    console.log("Expanded Flights Array Created:", expandedFlightsArray);
}

//Mapping Function
function mapFlightsArray(array,operation) {
    //date will be in format YYYY-MM-DDTHH:mm:ss.sssZ
    const timestamp = new Date().toISOString();

    return array.map(flight => {
        const modifiedFlight = operation(flight);
        //add/update timestamp
        modifiedFlight.last_updated = timestamp;
        return modifiedFlight;
    });
}

//Operations for mapping function
    function addTimezoneDifference(flight) {
        const sourceTimezone = flight.source_airport.timezone;
        const destinationTimezone = flight.destination_airport.timezone;

        //difference in timezones
        const timezoneDifference = Math.abs(sourceTimezone - destinationTimezone);

        // Add the timezone difference to the flight object
        flight.timezoneDifference = timezoneDifference;

        return flight;
    }
    //Flight counters for both To and From airport
    function addFlightCounterToAirports(flight) {
        const sourceAirport = flight.source_airport;
        const destinationAirport = flight.destination_airport;

        // Initialize counters
        if (!sourceAirport.countFlightsFrom) {
            sourceAirport.countFlightsFrom = 0;
        }
        if (!destinationAirport.countFlightsTo) {
            destinationAirport.countFlightsTo = 0;
        }

        // Increment the counters
        sourceAirport.countFlightsFrom += 1;
        destinationAirport.countFlightsTo += 1;

        return flight;
    }

    function addTotalFlightCounterToAirports(flight) {
        const sourceAirport = flight.source_airport;
        const destinationAirport = flight.destination_airport;

        // Initialize the counters if they haven't already been initialized
        if (sourceAirport.countFlightsFrom === undefined) {
            sourceAirport.countFlightsFrom = 0;
        }
        if (sourceAirport.countFlightsTo === undefined) {
            sourceAirport.countFlightsTo = 0;
        }
        if (destinationAirport.countFlightsTo === undefined) {
            destinationAirport.countFlightsTo = 0;
        }
        if (destinationAirport.countFlightsFrom === undefined) {
            destinationAirport.countFlightsFrom = 0;
        }

        // Initialize the total flight counters if they don't exist yet
        if (!sourceAirport.countTotalFlights) {
            sourceAirport.countTotalFlights = 0;
        }
        if (!destinationAirport.countTotalFlights) {
            destinationAirport.countTotalFlights = 0;
        }

        // Increment flight counters for both source and destination airports
        sourceAirport.countTotalFlights++;
        destinationAirport.countTotalFlights++;

        return flight; 
    }

function filterFlights() {
    const sourceAirport = document.getElementById('filterSourceAirportSelect').value;
    const destinationAirport = document.getElementById('filterDestinationAirportSelect').value;
    const airline = document.getElementById('filterAirlineSelect').value;
    const aircraft = document.getElementById('filterAircraftSelect').value;

    const filteredFlights = expandedFlightsArray.filter((flight) => {
        return (sourceAirport === 'any' || flight.source_airport.name === sourceAirport) &&
               (destinationAirport === 'any' || flight.destination_airport.name === destinationAirport) &&
               (airline === 'any' || flight.airline.name === airline) &&
               (aircraft === 'any' || flight.aircraft.includes(aircraft));
    });

    displayFlights(filteredFlights);
}

function filterAirports() {
    const selectedCity = document.getElementById('filterCitySelect').value;
    const searchTerm = document.getElementById("filterSearchTermInput").value.toLowerCase();
    
    const filteredAirports = airportsArray.filter((airport) => {
        const matchesCity = (selectedCity === 'any' || airport.city === selectedCity);
        const matchesSearch =   airport.name.toLowerCase().includes(searchTerm) ||
                                (airport.iata && airport.iata.toLowerCase().includes(searchTerm)) || //some airports don't have IATA
                                airport.city.toLowerCase().includes(searchTerm) ||
                                airport.country.toLowerCase().includes(searchTerm);
        return matchesCity && matchesSearch;
    });

    displayAirports(filteredAirports);
}


function displayFlight(flightObject) {
    const flightParagraph = document.createElement("p");
    flightParagraph.innerHTML = `
        Source Airport: ${flightObject.source_airport.name}<br>
        Destination Airport: ${flightObject.destination_airport.name}<br>
        Airline: ${flightObject.airline.name}<br>
        Aircraft: ${flightObject.aircraft.join(', ')}<br>
    `;
    return flightParagraph;
}

function displayFlights(flights) {
    const displayDiv = document.getElementById("flightFilterDisplayDiv");
    displayDiv.innerHTML = "";

    if (flights.length === 0) {
        displayDiv.textContent = "No flights meet the criteria.";
        return;
    }

    // Limit the flights array to the first 10 flights
    const limitedFlights = flights.slice(0, 10);

    limitedFlights.forEach((flight)=>{
        const flightElement = displayFlight(flight);
        displayDiv.appendChild(flightElement);
    });

}


function displayAirports(airports) {
    const displayDiv = document.getElementById("airportFilterDisplayDiv");
    displayDiv.innerHTML = "";

    if (airports.length === 0) {
        displayDiv.textContent = "No airports found in this city.";
        return;
    }

    // Limit the airports array to the first 10 flights
    const limitedAirports = airports.slice(0, 10);
    limitedAirports.forEach((airport) => {
        const airportElement = document.createElement("p");
        airportElement.innerHTML = `
            Name: ${airport.name}<br>
            IATA: ${airport.iata}<br>
            City: ${airport.city}<br>
            Country: ${airport.country}<br>
            Timezone: ${airport.timezone}<br>
            Altitude: ${airport.altitude}<br>
        `;
        displayDiv.appendChild(airportElement);
    });
}
function getFlightCorridors(flights) {
    const flightCorridors = {};

    flights.forEach((flight)=>{
        const sourceAirport = flight.source_airport.name;
        const destinationAirport = flight.destination_airport.name;

        // Create a key that doesn't depend on flight direct by using 'sort'.
        const airportPair = [sourceAirport, destinationAirport].sort().join(' - ');

        // Increment count for this airport pair
        if (flightCorridors[airportPair]) {
            flightCorridors[airportPair]++;
        } else {
            flightCorridors[airportPair] = 1;
        }
    });

    return flightCorridors
    
}

function calculateMax(array) {
    let max = -Infinity;
    for (let count of array) {
        if (count > max) {
            max = count;
        }
    }
    return max;
}

function calculateMin(array) {
    let min = Infinity;
    for (let count of array) {
        if (count < min) {
            min = count;
        }
    }
    return min;
}

function calculateAvg(array) {
    if (array.length === 0) return NaN; // Avoid division by zero
    let total = 0;
    for (let count of array) {
        total += count;
    }
    return total / array.length;
}

function displayBusiestFlightCorridors() {
    const flightCorridors = getFlightCorridors(expandedFlightsArray)
    const displayDiv = document.getElementById("summaryStatisticsDisplayDiv");
    displayDiv.innerHTML ="";

    const flightCounts = Object.values(flightCorridors);
    
    const maxFlights = calculateMax(flightCounts);
    const minFlights = calculateMin(flightCounts);
    const avgFlights = calculateAvg(flightCounts).toFixed(2);

    // Sort the corridors by the number of flights and get the top 10
    const sortedCorridors = Object.entries(flightCorridors)
        .sort((a, b) => b[1] - a[1]) // Sort by count (second item in each entry)
        .slice(0, 10); // Take the top 10


    const summaryStaticsElement = document.createElement("p");
    summaryStaticsElement.innerHTML = `
    Flight Corridor Information.<br>
    Flights between airport pair statistics:<br>
    Maximum: ${maxFlights} Minimum: ${minFlights} Average: ${avgFlights} <br>
    Top 10 Busiest Corridors:<br>
    `;

    displayDiv.appendChild(summaryStaticsElement);

    // Create and append the top 10 busiest corridors
    sortedCorridors.forEach(([corridor, count]) => {
        const corridorElement = document.createElement("p");
        corridorElement.textContent = `${corridor}: ${count} flights`;
        displayDiv.appendChild(corridorElement);
    });

}

function addTimezoneDifferenceToFlights(flightsArray, addTimezoneDifference) {
    return mapFlightsArray(flightsArray, addTimezoneDifference);
}

function displayTimeDifferences() {

    const displayDiv = document.getElementById("summaryStatisticsDisplayDiv");
    displayDiv.innerHTML ="";

    const updatedFlightsArray = addTimezoneDifferenceToFlights(flightsArray, addTimezoneDifference);
    const timezoneDifferences = updatedFlightsArray.map(flight => flight.timezoneDifference);

    const maxTimeDifference = calculateMax(timezoneDifferences);
    const minTimeDifference = calculateMin(timezoneDifferences);
    const avgTimeDifference = calculateAvg(timezoneDifferences);
    
    /* //Can use orderedFlightsArrayByTZDifference to calculate values
    const maxTimeDifference = orderedFlightsArrayByTZDifference[0].timezoneDifference;
    const minTimeDifference = orderedFlightsArrayByTZDifference[orderedFlightsArrayByTZDifference.length - 1].timezoneDifference;
    const totalTimeDifference = orderedFlightsArrayByTZDifference.reduce((total, flight) => total + flight.timezoneDifference, 0);
    const avgTimeDifference = totalTimeDifference / orderedFlightsArrayByTZDifference.length;
    */

    const orderedFlightsArrayByTZDifference = [...updatedFlightsArray].sort((a,b)=>b.timezoneDifference - a.timezoneDifference)
    const top10Flights = orderedFlightsArrayByTZDifference.slice(0, 10);

    const summaryStaticsElement = document.createElement("p");
    summaryStaticsElement.innerHTML = `
    Timezone Difference Information.<br>
    Difference between timezones for all airport pairs in flights data:<br>
    Maximum: ${maxTimeDifference} Minimum: ${minTimeDifference} Average: ${avgTimeDifference.toFixed(2)} <br>
    Top 10 Greatest difference in Timezones:<br>
    `;

    top10Flights.forEach((flight) => {
        summaryStaticsElement.innerHTML += `${flight.source_airport.name} - ${flight.destination_airport.name}: ${flight.timezoneDifference} hours<br>`;
    });

    displayDiv.appendChild(summaryStaticsElement);
}

function displayBusiestAirports() {
    const displayDiv = document.getElementById("summaryStatisticsDisplayDiv");
    displayDiv.innerHTML ="";

    // Convert airportsObject to an array of airport objects
    const airportArray = Object.values(airportsObject); //airportArray is close but not the same as airportsArray, careful as airportsArray is defined globally

    //use this totalFlightsArray for calculations
    const totalFlightsArray = airportArray.map(airport => airport.countTotalFlights);

    //Calculations
    const maxTotalFlights = calculateMax(totalFlightsArray);
    const minTotalFlights = calculateMin(totalFlightsArray);
    const avgTotalFlights = calculateAvg(totalFlightsArray).toFixed(2);

    // Sort airports by total flights, get top 10
    const orderedAirportsByTotalFlights = [...airportArray].sort((a, b) => b.countTotalFlights - a.countTotalFlights);
    const top10Airports = orderedAirportsByTotalFlights.slice(0, 10);

    const summaryStaticsElement = document.createElement("p");
    summaryStaticsElement.innerHTML = `
    Airport Utilization Information.<br>
    Number of Flights either arriving or leaving Airports:<br>
    Maximum: ${maxTotalFlights} <br>
    Minimum: ${minTotalFlights} <br>
    Average: ${avgTotalFlights} <br>
    Top 10 busiest Airports: <br>
    `;

    top10Airports.forEach((Airport) => {
        summaryStaticsElement.innerHTML += `${Airport.name}: ${Airport.countTotalFlights} Flights Total <br>`;
    });

    displayDiv.appendChild(summaryStaticsElement);
}

function getUniqueSourceAirportNames() {
    const uniqueSourceAirports = new Set();

    expandedFlightsArray.forEach((flight) => {
        const sourceAirport = flight.source_airport;
        if (sourceAirport) {
            uniqueSourceAirports.add(sourceAirport.name);
        }
    });

    return uniqueSourceAirports;
}

function getUniqueDestinationAirportNames() {
    const uniqueDestinationAirports = new Set();

    expandedFlightsArray.forEach((flight) => {
        const destinationAirport = flight.destination_airport;
        if (destinationAirport) {
            uniqueDestinationAirports.add(destinationAirport.name);
        }
    });

    return uniqueDestinationAirports;
}

function getUniqueAirlines() {
    const uniqueAirlines = new Set();
    expandedFlightsArray.forEach((flight) => {
        if (flight.airline) {
            uniqueAirlines.add(flight.airline.name);
        }
    });
    return uniqueAirlines;
}

function getUniqueAircraft() {
    const uniqueAircraft = new Set();
    expandedFlightsArray.forEach((flight) => {
        flight.aircraft.forEach((aircraft) => {
            uniqueAircraft.add(aircraft);
        });
    });
    return uniqueAircraft;
}

function getUniqueCities() {
    const uniqueCities = new Set();
    expandedFlightsArray.forEach((flight)=> {
        const sourceCity = flight.source_airport.city;
        uniqueCities.add(sourceCity);
        const destinationCity = flight.destination_airport.city;
        uniqueCities.add(destinationCity);
    });
    return uniqueCities;
}

function populateDropdown(id, items) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = ''; // Clear existing options
    const anyOption = document.createElement("option");
    anyOption.value = 'any';
    anyOption.textContent = 'Any';
    dropdown.appendChild(anyOption);

    items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}

function populateAllDropdowns() {
    populateDropdown('filterSourceAirportSelect', getUniqueSourceAirportNames());
    populateDropdown('filterDestinationAirportSelect', getUniqueDestinationAirportNames());
    populateDropdown('filterAirlineSelect', getUniqueAirlines());
    populateDropdown('filterAircraftSelect', getUniqueAircraft());

    populateDropdown('filterCitySelect',getUniqueCities());
}

function initializeAirportCounters(airports) {
    airports.forEach(airport => {
        // Ensure counters are initialized
        if (airport.countFlightsFrom === undefined) {
            airport.countFlightsFrom = 0;
        }
        if (airport.countFlightsTo === undefined) {
            airport.countFlightsTo = 0;
        }
        if (airport.countTotalFlights === undefined) {
            airport.countTotalFlights = 0;
        }
    });
}


// Export functions to be tested
module.exports = { 
    addTimezoneDifference, 
    mapFlightsArray, 
    getUniqueDestinationAirportNames, 
    getFlightCorridors,
    calculateMax,
    calculateMin,
    calculateAvg };
