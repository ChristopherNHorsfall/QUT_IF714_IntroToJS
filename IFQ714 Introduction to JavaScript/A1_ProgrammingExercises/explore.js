const fs = require('fs');
const path = require("path");
const data = fs.readFileSync(path.resolve(__dirname, './NEOWISE_Dataset.json'));
const neowise = JSON.parse(data);

//console.table(neowise);
//console.table(neowise[0]);
//console.log(neowise.length);


const keyMapping = {
    designation : 'Designation',
    discovery_date : 'Date Discovered',
    h_mag : 'Observed Magnitude',
    moid_au : 'Minimum Orbit Intersection Distance (AU)',
    q_au_1 : 'Perihelion (AU)',
    q_au_2 : 'Aphelion (AU)',
    period_yr : 'Orbital Period (Years)',
    i_deg : 'Orbital Inclination (Degrees)',
    pha : 'Potentially Hazardous Asteroid',
    orbit_class : 'Orbit Class'
};
const newKeys = Object.values(keyMapping) // create array of the new keys
const newKeyLengths = newKeys.map(key => key.length) // array of the lengths of new keys
const maxKeyLength = Math.max(...newKeyLengths) // found max key length
//console.log(newKeys)
//console.log(newKeyLengths)
//console.log(maxKeyLength)

// Basic Functions

function displayNEOByIndex(index) {
     const dataInstance = neowise[index]
     console.log('Near Earth Object:')
     console.log('------------------')
    for (const key in dataInstance) {
        const mappedKey = keyMapping[key]; // Get the descriptive key
        const value = dataInstance[key]; // Get the value
        const paddedMappedKey = mappedKey.padEnd(maxKeyLength, " ") //pad the key for readability

        console.log(`${paddedMappedKey} :  ${value}`);
    }
};

//displayNEOByIndex(0);

function findNEOindexByDesignation(text) {
    let found = -1;
    for (let i = 0; i<neowise.length; i++){
        let instance = neowise[i]
        if (instance.designation === text){
            found = i;
            break;
        };
    };
    return found;
};

function displayNEOByDesignation(text) {
    index = findNEOindexByDesignation(text);
    displayNEOByIndex(index);
};

//console.log(findNEOindexByDesignation("419624 (2010 SO16)")); //returns 1, correct!
//console.log(findNEOindexByDesignation("414772 (2010 OC103)")); //returns 2, correct!
//console.log(findNEOindexByDesignation("1")); //returns -1, correct!

//displayNEOByDesignation("419624 (2010 SO16)");


function findAllOrbitClasses() {
    let OrbitClasses = new Set();
    for (let i = 0; i<neowise.length; i++){
        let instance = neowise[i];
        if (instance.orbit_class){
            OrbitClasses.add(instance.orbit_class);
        };
    };
    return Array.from(OrbitClasses);
};

//orbit_Classes = findAllOrbitClasses();
//['Apollo', 'Amor', 'Aten', 'Comet', 'Jupiter-family Comet', 'Halley-type Comet*', 'Parabolic Comet', 'Jupiter-family Comet*', 'Encke-type Comet']
//console.log(orbit_Classes);

function findIndexesByPropertyValue(property, value){
    let indexes = [];
    for (let i = 0; i<neowise.length; i++){
        if (neowise[i][property]===value) {
            indexes.push(i);
        };
    };
    return indexes;
};

const ApolloClassNEOindexes = findIndexesByPropertyValue('orbit_class','Apollo');
//console.log(ApolloClassNEOindexes);

const apolloClassObjects = neowise.filter(item => item.orbit_class === 'Apollo');
//console.table(apolloClassObjects);
/*
function displayNEOsByIndexes(indexes){
    const filteredNEOs = neowise.filter(checkByIndex);

    function checkByIndex(indexes){
        for (let i = 0; i<neowise.length; i++){
            if (neowise[]){
                return true
            }
        }
        
    }
}
*/

const amorClassObjects = neowise.filter(item => item.orbit_class === 'Amor');
//console.table(amorClassObjects);

const atenClassObjects = neowise.filter(item => item.orbit_class === 'Aten');
//console.table(atenClassObjects);

const cometClassObjects = neowise.filter(item => item.orbit_class === 'Comet'); // 9 in data
const jupiterFamilyCometClassObjects = neowise.filter(item => item.orbit_class === 'Jupiter-family Comet'); // 6 in data
const halleyTypeCometClassObjects = neowise.filter(item => item.orbit_class === 'Halley-type Comet*'); // only 2 in data
const parabolicCometClassObjects = neowise.filter(item => item.orbit_class === 'Parabolic Comet'); // only 2 in data
const enckeTypeCometClassObjects = neowise.filter(item => item.orbit_class === 'Encke-type Comet'); //only 1 in data

//console.table(cometClassObjects);

function sortNEOByProperty(property, array){
    //sorts from smallest to largest
    let newArray = Array.from(array); // prevents sorting the original
    newArray = removeNullEntries(property,newArray); // remove instances where property value is null
    return newArray.sort(function(a,b) {
        const aValue = a[property];
        const bValue = b[property];
        return a[property] - b[property]});
};

function removeNullEntries(property, array) {
    return array.filter(function(instance) {
        return instance[property] !== null && instance[property] !== undefined;
    });
}

sortedByMoidAU = sortNEOByProperty('moid_au',neowise);
//console.table(sortedByMoidAU);
sortedByHMag = sortNEOByProperty('h_mag',neowise);
//console.table(sortedByHMag);

function findMaxByProperty(property,array){
    //returns object with max value at property
    sortedArray = sortNEOByProperty(property,array);
    lastIndex = sortedArray.length - 1
    return sortedArray[lastIndex];
}

//console.log(findMaxByProperty('h_mag',neowise));

function findMinByProperty(property,array){
    //returns object with min value at property
    sortedArray = sortNEOByProperty(property,array);
    return sortedArray[0];
}

//console.log(findMinByProperty('h_mag',neowise));

phaNEOs = neowise.filter(item => item.pha === true);
//console.table(phaNEOs); // 30 pha's!

function calcAverageOfProperty(property,array){
    let values = [] //array of property values intialised
    for (let i = 0; i < array.length; i++){
         let value = array[i][property];
         if (value !== undefined && value !== null){
            values.push(value);
         }
         
    };
    let sumOFValues = 0;
    for (let i = 0; i < values.length; i++){
        sumOFValues += values[i];
    };
    const average = values.length > 0 ? sumOFValues/values.length : NaN;
    return average; 
};

 averageHMag = calcAverageOfProperty('h_mag', neowise);
 //console.log(averageHMag);