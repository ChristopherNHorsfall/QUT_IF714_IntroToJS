//jest was breaking on document event listeners in script.js, moved functions here for testing

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
// Export functions to be tested
module.exports = { 
    addTimezoneDifference, 
    mapFlightsArray, 
    getUniqueDestinationAirportNames, 
    getFlightCorridors,
    calculateMax,
    calculateMin,
    calculateAvg };