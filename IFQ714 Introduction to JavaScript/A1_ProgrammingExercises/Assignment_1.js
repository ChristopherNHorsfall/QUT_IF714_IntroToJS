const fs = require('fs');
const path = require("path");
const data = fs.readFileSync(path.resolve(__dirname, './NEOWISE_Dataset.json'));
const neowiseArray = JSON.parse(data);

//Object of objects
const neowiseObject = {};
neowiseArray.forEach(item => {
    const key = item.designation;
    neowiseObject[key] = item;
});
 
//console.table(neowiseArray);

//console.log(neowiseObject);
//console.log(JSON.stringify(neowiseObject, null, 2));
//console.dir(neowiseObject, { depth: 2, colors: true });

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

function renameObjectProperties(object, keyMapping) {
    const renamedObject = {};
    // If the objects key exists in keyMapping, rename it, else keep original key
    for (let key in object) {
        if (keyMapping[key]) {
            renamedObject[keyMapping[key]] = object[key];
        } else {
            renamedObject[key] = object[key];
        }
    }
    return renamedObject
};

function renameAllProperties(neowiseObject, keyMapping) {
    const renamedNEOObject = {};
    //for each object in neowiseObject, use renameObjectProperties function
    for (let key in neowiseObject) {
        renamedNEOObject[key] = renameObjectProperties(neowiseObject[key], keyMapping);
    }

    return renamedNEOObject;
};

// neowiseDataObject has all object properties renamed to be more readable
const neowiseDataObject = renameAllProperties(neowiseObject, keyMapping);

//displaying properties of a specific neowise object
//console.table(neowiseDataObject['419880 (2011 AH37)']);

//displaying properties of a specific neowise object using a method
neowiseDataObject.displayObject = function(designation) {
    if (this[designation]) {
        console.table(this[designation]);
    } else {
        console.log("Object not found")
    }
};

//neowiseDataObject.displayObject("419880 (2011 AH37)");

neowiseDataObject.getObjectByIndex = function(index) {
    const keysArray = Object.keys(this);
    if (index >= 0 && index < keysArray.length) {
        return this[keysArray[index]];
    } else {
        return null;
    }
}

//Using getObjectByIndex method to display first object
object = neowiseDataObject.getObjectByIndex(0);
//console.table(object);

//Using js object properties to access value of specific object
value = neowiseDataObject["419880 (2011 AH37)"]["Date Discovered"]
//console.log(value);


//Returns an array of objects with specified orbit class
neowiseDataObject.findByOrbitClass = function(orbitClass) {
    results = [];
    for (let key in this) {
        if (this[key]["Orbit Class"] === orbitClass) {
            results.push(this[key]);
        }
    }
    return results;
};


const Apollos = neowiseDataObject.findByOrbitClass("Apollo");
const Amors = neowiseDataObject.findByOrbitClass("Amor");
const Atens = neowiseDataObject.findByOrbitClass('Aten');
const Comets = neowiseDataObject.findByOrbitClass('Comet');
const HalleyTypeComets = neowiseDataObject.findByOrbitClass('Halley-type Comet*');
const ParabolicComets = neowiseDataObject.findByOrbitClass('Parabolic Comet');
const EnckeTypeComets = neowiseDataObject.findByOrbitClass('Encke-type Comet');
const JupiterFamilyComets = neowiseDataObject.findByOrbitClass("Jupiter-family Comet");

//find "Potentially Hazardous Asteroid" and return them as an array of objects
neowiseDataObject.findPHAs = function() {
    results = [];
    for (let key in this) {
        if (this[key]["Potentially Hazardous Asteroid"] === true) {
            results.push(this[key]);
        }
    }
    return results;
};

//Array of PHA objects
const PHAs = neowiseDataObject.findPHAs();
//console.table(PHAs);



//tried to make a function to output a txt file to display table data, Vscode can't display data well in debug console
//data is still difficult to read
/*
const headers = ["Designation", "Date Discovered", "Observed Magnitude", "Minimum Orbit Intersection Distance (AU)", "Perihelion (AU)", "Aphelion (AU)", "Orbital Period (Years)", "Orbital Inclination (Degrees)", "Potentially Hazardous Asteroid", "Orbit Class"]
function formatTableOfObjects(array, headers) {

    headerRow = headers.join('\t');

    rows = array.map(function(obj) {
        return headers.map(function(header) {
            return String(obj[header] || "");
        }).join('\t');
    });

    let table = [headerRow].concat(rows).join('\n');

    return table;
}
tablePHAs = formatTableOfObjects(PHAs, headers)
const filePath = path.join(__dirname, 'output.txt'); 
fs.writeFileSync(filePath, tablePHAs, 'utf-8');
*/

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

function findMaxObjectByProperty(property,array){
    //returns object with max value at property
    sortedArray = sortNEOByProperty(property,array);
    lastIndex = sortedArray.length - 1
    return sortedArray[lastIndex];
}


function findMinObjectByProperty(property,array){
    //returns object with min value at property
    sortedArray = sortNEOByProperty(property,array);
    return sortedArray[0];
}

function calcAverageOfProperty(property,array){
    let values = [] //array of property values intialised
    for (let i = 0; i < array.length; i++){
         let value = array[i] ? array[i][property] : undefined; // check if property exists for object
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

//Numerical properties
const properties = ["Observed Magnitude", 
    "Minimum Orbit Intersection Distance (AU)", 
    "Perihelion (AU)", 
    "Aphelion (AU)", 
    "Orbital Period (Years)", 
    "Orbital Inclination (Degrees)"]

function analyseClass(classArray) {
    //returns object containing list of numerical properties paired with min,max, average values
    results = {};
    for (let i = 0; i < properties.length; i++) {
        let property = properties[i];

        let minObject = findMinObjectByProperty(property, classArray);
        let min = (minObject && minObject[property] !== undefined) ? minObject[property] : null; //prevent crash if no property found
        let maxObject = findMaxObjectByProperty(property, classArray);
        let max = (maxObject && maxObject[property] !== undefined) ? maxObject[property] : null; //prevent crash if no property found
        let average = calcAverageOfProperty(property, classArray);

        results[property] = {
            min: min,
            max: max,
            average: average
        };
    }
    return results;
};


//Finding min,max,ave values for Apollo class objects
analysisApollos = analyseClass(Apollos)
console.log(`Analysis: Apollos`)
console.table(analysisApollos)

analysisAmors = analyseClass(Amors)
console.log(`Analysis: Amors`)
console.table(analysisAmors)

analysisAtens = analyseClass(Atens)
console.log(`Analysis: Atens`)
console.table(analysisAtens)

analysisComets = analyseClass(Comets)
console.log(`Analysis: Comets`)
console.table(analysisComets)

analysisHalleyTypeComets = analyseClass(HalleyTypeComets)
console.log(`Analysis: HalleyTypeComets`)
console.table(analysisHalleyTypeComets)

analysisParabolicComets = analyseClass(ParabolicComets)
console.log(`Analysis: ParabolicComets`)
console.table(analysisParabolicComets)

analysisEnckeTypeComets = analyseClass(EnckeTypeComets)
console.log(`Analysis: EnckeTypeComets`)
console.table(analysisEnckeTypeComets)

analysisJupiterFamilyComets = analyseClass(JupiterFamilyComets)
console.log(`Analysis: JupiterFamilyComets`)
console.table(analysisJupiterFamilyComets)

analysisPHAs = analyseClass(PHAs)
console.log(`Analysis: PHAs`)
console.table(analysisPHAs)


//Exporting NEO Class Arrays to JSON

function exportClassArraysToJSON() {
    const classes = {
        Apollos: Apollos,
        Amors: Amors,
        Atens: Atens,
        Comets: Comets,
        HalleyTypeComets: HalleyTypeComets,
        ParabolicComets: ParabolicComets,
        EnckeTypeComets: EnckeTypeComets,
        JupiterFamilyComets: JupiterFamilyComets
    };

    for (let className in classes) {
        const data = JSON.stringify(classes[className], null, 2);
        const filePath = path.join(__dirname, `${className}.json`);
        fs.writeFileSync(filePath,data,"utf-8");
    }
};


exportClassArraysToJSON();


// I used Output to text file because VSCODE truncates debug console too much
//const outputString = JSON.stringify(PHAs, null, 2);
//const filePath = path.join(__dirname, 'output.txt'); 
//fs.writeFileSync(filePath, outputString, 'utf-8');

module.exports = removeNullEntries;
module.exports = sortNEOByProperty;