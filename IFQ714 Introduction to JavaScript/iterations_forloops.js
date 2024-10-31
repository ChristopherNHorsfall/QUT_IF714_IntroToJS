

// starts at '0', ends at '19'
//for (let i=0; i<20;i++) {console.log(`the counter is at ${i}`);}

// starts at '0', ends at '20'
//for(let i=0; i<=20;i++) {console.log(`the counter is at ${i}`);}

// starts at '0', ends at '19'
//for (let i=0; i<20;++i) {console.log(`the counter is at ${i}`);}


const names = ["Alice", "Bob", "Charlie", "David", "Emma"];

for (let i=0; i < names.length; i++) {
    console.log(`Hello ${names[i]}`);
}

let brands = ["Ferrari", "Pagani", "Mazda", "Holden", "Ford", "Mercedes", "Nissan", "Dacia", "Saab"];
for (let i = 0; i < brands.length; i++) {
    console.log(brands[i]);
}

let target = "Nissan";for (let i = 0; i < brands.length; i++) {
    if (brands[i] == target) {
        console.log(`The value ${target} is in position ${i} of the array.`);
        break;
    }
}