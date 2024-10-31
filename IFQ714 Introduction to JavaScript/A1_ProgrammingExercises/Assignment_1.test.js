//Assignment_1.test.js
const removeNullEntries = require("./Assignment_1")
const sortNEOByProperty = require("./Assignment_1")

describe("testing removeNullEntries function",()=>{

    //Test Case 1
    it("should remove objects with null or undefined values in the array",()=>{
        const array = [
            {name: "object1", value: 10},
            {name: "object2", value: null},
            {name: "object3", value: 2},
            {name: "object4", value: undefined}
        ];
        const property = 'value';
        const expected = [
            {name: "object1", value: 10},
            {name: "object3", value: 2}
        ];
        const result = removeNullEntries(property, array);
        // Use arrayContaining to ignore order
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toBe(expected.length); // Also check array length
    });

    //Test Case 2
    it("should return an empty array if all values are null or undefined",()=>{
        const array = [
            {name: "object2", value: null},
            {name: "object4", value: undefined}
        ];
        const property = 'value';
        const expected = [];
        const result = removeNullEntries(property,array);
        expect(result).toEqual(expected);        

    });

    //Test case 3
    it("should return the original array if no values are null or undefined", () =>{
        const array = [
            {name: "object1", value: 10},
            {name: "object3", value: 2}
        ];
        const property = 'value';
        const expected = [
            {name: "object1", value: 10},
            {name: "object3", value: 2}
        ];

        const result = removeNullEntries(property, array);
        // Use arrayContaining to ignore order
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toBe(expected.length); // Also check array length 
    });
});

describe("testing sortNEOByProperty function",()=>{
    it("should sort objects from smallest to largest by the value of the specified property",()=>{
        const array = [
            {name: "object1", propertyA: 10, propertyB: 1},
            {name: "object2", propertyA: 1, propertyB: 10},
            {name: "object3", propertyA: 2, propertyB: 7},
            {name: "object4", propertyA: 9, propertyB: 9}
        ];

        const propertyToSort = 'propertyA';
        const expected = [ 
            {name: "object2", propertyA: 1, propertyB: 10},
            {name: "object3", propertyA: 2, propertyB: 7},
            {name: "object4", propertyA: 9, propertyB: 9},
            {name: "object1", propertyA: 10, propertyB: 1}
         ];

        const result =  sortNEOByProperty(propertyToSort,array);
        expect(result).toEqual(expected);

    });
    it("should return the original array if object are already in order from smallest to largest",()=>{
        const array = [ 
            {name: "object2", propertyA: 1, propertyB: 10},
            {name: "object3", propertyA: 2, propertyB: 7},
            {name: "object4", propertyA: 9, propertyB: 9},
            {name: "object1", propertyA: 10, propertyB: 1}
         ];

         const expected = [ 
            {name: "object2", propertyA: 1, propertyB: 10},
            {name: "object3", propertyA: 2, propertyB: 7},
            {name: "object4", propertyA: 9, propertyB: 9},
            {name: "object1", propertyA: 10, propertyB: 1}
         ];

        const propertyToSort = 'propertyA';
        const result =  sortNEOByProperty(propertyToSort,array);
        expect(result).toEqual(expected);
    })
});