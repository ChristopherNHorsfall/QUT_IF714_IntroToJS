
//Import functions to be tested
const { 
  addTimezoneDifference,
   mapFlightsArray, 
   getUniqueDestinationAirportNames, 
   getFlightCorridors,
  calculateMax,
  calculateMin,
  calculateAvg } = require('./functionsToTest.js');
;

describe('addTimezoneDifference', () => {
    //test case 1
    it('should correctly calculate timezone difference and add it to the flight object', () => {
      
      const flight = {
        source_airport: {
          name: 'Airport A',
          timezone: 5,
        },
        destination_airport: {
          name: 'Airport B',
          timezone: 2,
        },
      };
  
      
      const updatedFlight = addTimezoneDifference(flight);
  
      
      expect(updatedFlight.timezoneDifference).toBe(3); 
      expect(updatedFlight).toHaveProperty('timezoneDifference', 3);
    });
    //test case 2
    it('should handle cases where source and destination timezones are the same', () => {
        const flight = {
            source_airport: {
              name: 'Airport A',
              timezone: 5,
            },
            destination_airport: {
              name: 'Airport B',
              timezone: 5,
            },
          };
        
        const updatedFlight = addTimezoneDifference(flight);

        expect(updatedFlight.timezoneDifference).toBe(0);
    });
    //test case 3
    it('should handle cases where source and/or destination timezone value are missing', ()=> {
        const flight = {
            source_airport: {
              name: 'Airport A',
              timezone: undefined,
            },
            destination_airport: {
              name: 'Airport B',
              timezone: 5,
            },
          };

        const updatedFlight = addTimezoneDifference(flight);

        expect(updatedFlight.timezoneDifference).toBe(NaN);
    })
    //test case 4
    it ('should handle cases where source and/or destination timezone properties are missing', ()=>{
        const flight = {
            source_airport: {
              name: 'Airport A',
              
            },
            destination_airport: {
              name: 'Airport B',
              timezone: 5,
            },
          };

        const updatedFlight = addTimezoneDifference(flight);

        expect(updatedFlight.timezoneDifference).toBe(NaN);
    })
});

describe('mapFlightsArray', () => {
    //test case 1
    it('should apply the operation function to each flight and add a last_updated timestamp', ()=> {
        const flights = [
            { id: 1, name: 'Flight A' },
            { id: 2, name: 'Flight B' },
        ];
        const mockOperation = jest.fn(flight => {
            return { ...flight, modified: true }; // Mock operation modifies flight, creates 'shallow' copy, does not modify original
        });

        const result = mapFlightsArray(flights, mockOperation);

        //Check if the operation was called for each flight
        expect(mockOperation).toHaveBeenCalledTimes(2); //Jest matcher used to check how many times a mock function has been called
        expect(mockOperation).toHaveBeenCalledWith(flights[0]);
        expect(mockOperation).toHaveBeenCalledWith(flights[1]);

        // Check if the flights are modified and have the timestamp
        result.forEach(flight => {
        expect(flight).toHaveProperty('modified', true);
        expect(flight).toHaveProperty('last_updated'); // Check if timestamp is added
        expect(new Date(flight.last_updated)).toBeInstanceOf(Date); // Check if it's a valid timestamp
        });
    });
    //test case 2
    it('should not mutate the original array', ()=> {
        const flights = [
            { id: 1, name: 'Flight A' },
            { id: 2, name: 'Flight B' },
        ];

        const mockOperation = jest.fn(flight => {
            return { ...flight, modified: true }; 
        });
        
        const result = mapFlightsArray(flights, mockOperation);

        //check that original array is unchanged
        expect(flights[0]).not.toHaveProperty('modified');
        expect(flights[1]).not.toHaveProperty('modified');

        //check if new array has modified property
        result.forEach(flight => {
            expect(flight).toHaveProperty('modified', true);
        });
    });
    //test case 3
    it('should modify the original object when modifying a reference object', ()=> {
        const flights = [
            { id: 1, name: 'Flight A', source_airport:{ID: 1, name:"MEL"}, destination_airport:{ID: 2, name:"BNE"} },
            { id: 2, name: 'Flight B', source_airport:{ID: 2, name:"BNE"}, destination_airport:{ID: 1, name:"MEL"} },
        ];

        //operation modifies source_airport
        const mockOperation = jest.fn(flight => {
            flight.source_airport.modified = true; // Modify source airport
            return flight; 
        });

        const updatedFlights = mapFlightsArray(flights, mockOperation);

        // check that the source_airport of Flight A is modified
        expect(updatedFlights[0].source_airport.modified).toBe(true);
        
        // check if the original flights array's referenced object was also modified 
        expect(flights[0].source_airport.modified).toBe(true);

        // check the mockOperation was called the correct number of times
        expect(mockOperation).toHaveBeenCalledTimes(flights.length);

        // check the destination_airport objects are also modified
        expect(updatedFlights[0].destination_airport.modified).toBe(true);
        expect(updatedFlights[1].destination_airport.modified).toBe(true);

    });
})

describe('getUniqueDestinationAirportNames', ()=> {
  let expandedFlightsArray;

  //This code run before each test, beforeEach and afterEach are special Jest functions
  beforeEach(() => {
    // Define expandedFlightsArray for each test
    global.expandedFlightsArray = [
        { destination_airport: { name: "Sydney" } },
        { destination_airport: { name: "Melbourne" } },
        { destination_airport: { name: "Sydney" } },  // Duplicate to test unique behavior
        { destination_airport: { name: "Brisbane" } },
        { destination_airport: null },  // Null case
    ];
  });

  //This code runs after each test
  afterEach(() => {
      // delete expandedFlightArray after each test
      delete global.expandedFlightsArray;
  });

  it('should return a set of unique destination airport names', () => {
    const uniqueAirports = getUniqueDestinationAirportNames();
    expect(uniqueAirports).toEqual(new Set(["Sydney", "Melbourne", "Brisbane"]));
  });

  it('should handle an empty array', () => {
      global.expandedFlightsArray = [];
      const uniqueAirports = getUniqueDestinationAirportNames();
      expect(uniqueAirports.size).toBe(0);
  });

  it('should skip flights with null destination_airport', () => {
      const uniqueAirports = getUniqueDestinationAirportNames();
      expect(uniqueAirports).toEqual(new Set(["Sydney", "Melbourne", "Brisbane"]));
      expect(uniqueAirports.has(null)).toBe(false);  // Null should be excluded
  });
});

describe('getFlightCorridors', ()=> {
  it('should correctly calculate the number of flights between airport pairs, irrespective of direction', () => {
    const flights = [
        { source_airport: { name: "MEL" }, destination_airport: { name: "SYD" } },
        { source_airport: { name: "SYD" }, destination_airport: { name: "MEL" } },
        { source_airport: { name: "BNE" }, destination_airport: { name: "SYD" } },
        { source_airport: { name: "MEL" }, destination_airport: { name: "BNE" } }
    ];

    const result = getFlightCorridors(flights);

    expect(result).toEqual({
        'MEL - SYD': 2, // MEL - SYD and SYD - MEL are counted together
        'BNE - SYD': 1,
        'BNE - MEL': 1
    });
  });

  it('should return an empty object when given an empty flights array', () => {
    const flights = [];
    const result = getFlightCorridors(flights);

    expect(result).toEqual({});
  });

  it('should handle cases with missing airports/information and unusual routes', ()=> {
    const flights = [
      { source_airport: { name: "MEL" } }, //missing data
      { source_airport: { name: "SYD" }, destination_airport: { name: "SYD" } }, //sight seeing flight?
  ];
    
  const result = getFlightCorridors(flights);

  expect(result).toEqual({
    'MEL - undefined': 1, 
    'SYD - SYD': 1
    });
  })
});

describe('calculateMax', () => {

  it('should return the maximum value in an array of positive numbers', () => {
      const numbers = [1, 3, 7, 2, 5];
      const result = calculateMax(numbers);
      expect(result).toBe(7);
  });

  it('should return the maximum value in an array of negative numbers', () => {
      const numbers = [-10, -3, -22, -5];
      const result = calculateMax(numbers);
      expect(result).toBe(-3);
  });

  it('should return the maximum value in a mixed array of positive and negative numbers', () => {
      const numbers = [-10, 5, 3, -1, 8];
      const result = calculateMax(numbers);
      expect(result).toBe(8);
  });

  it('should return -Infinity if the array is empty', () => {
      const numbers = [];
      const result = calculateMax(numbers);
      expect(result).toBe(-Infinity);
  });

  it('should return the only element if the array contains a single number', () => {
      const numbers = [42];
      const result = calculateMax(numbers);
      expect(result).toBe(42);
  });
});

describe('calculateMin', () => {

  it('should return the minimum value in an array of positive numbers', () => {
      const numbers = [1, 3, 7, 2, 5];
      const result = calculateMin(numbers);
      expect(result).toBe(1);
  });

  it('should return the minimum value in an array of negative numbers', () => {
      const numbers = [-10, -3, -22, -5];
      const result = calculateMin(numbers);
      expect(result).toBe(-22);
  });

  it('should return the minimum value in a mixed array of positive and negative numbers', () => {
      const numbers = [-10, 5, 3, -1, 8];
      const result = calculateMin(numbers);
      expect(result).toBe(-10);
  });

  it('should return +Infinity if the array is empty', () => {
      const numbers = [];
      const result = calculateMin(numbers);
      expect(result).toBe(Infinity);
  });

  it('should return the only element if the array contains a single number', () => {
      const numbers = [42];
      const result = calculateMin(numbers);
      expect(result).toBe(42);
  });
});

describe('calculateAvg', () => {

    it('should return the correct average for an array of positive numbers', () => {
        const numbers = [4, 8, 12];
        const result = calculateAvg(numbers);
        expect(result).toBe(8);
    });

    it('should return the correct average for an array of negative numbers', () => {
        const numbers = [-5, -15, -10];
        const result = calculateAvg(numbers);
        expect(result).toBe(-10);
    });

    it('should return the correct average for a mixed array of positive and negative numbers', () => {
        const numbers = [5, -10, 15, -5];
        const result = calculateAvg(numbers);
        expect(result).toBe(1.25);
    });

    it('should return NaN for an empty array', () => {
        const numbers = [];
        const result = calculateAvg(numbers);
        expect(result).toBe(NaN);
    });

    it('should return the only element if the array contains a single number', () => {
        const numbers = [100];
        const result = calculateAvg(numbers);
        expect(result).toBe(100);
    });

    it('should handle arrays with decimal numbers', () => {
        const numbers = [2.5, 3.5, 4.0];
        const result = calculateAvg(numbers);
        expect(result).toBe(3.3333333333333335);
    });

});