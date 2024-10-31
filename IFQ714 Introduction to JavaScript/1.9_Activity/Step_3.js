const applePrice = 2.50;
const appleQuantity = 2;

const orangePrice = 1.54;
const orangeQuantity = 4;

const bananaPrice = 6;
const bananaQuantity = 3;



const totalCostApple = applePrice * appleQuantity;
const totalCostOrange = orangePrice * orangeQuantity;
const totalCostBanana = bananaPrice * bananaQuantity;


const overallTotalCost = totalCostApple + totalCostBanana + totalCostOrange;


console.log(`Total cost for apples: $${totalCostApple}`);
console.log(`Total cost for oranges: $${totalCostOrange}`);
console.log(`Total cost for bananas: $${totalCostBanana}`);


console.log(`Overall total cost: $${overallTotalCost}`);