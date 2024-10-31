
function employeeRecord(staffID, firstName, lastName, gender, age, position) {
    this.staffID = staffID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.position = position;
    this.logFullName = function(){
        console.log(
            "Full Name: " + this.firstName + " " + this.lastName)
    }
}

function salesRecord(staffID, item, price, date) {
    this.staffID = staffID;
    this.item = item;
    this.price = price;
    this.date = date;
}

const joannaBates = new employeeRecord(30, "Joanna", "Bates", "Female", 42, "Salesperson");
const gamingPCSale = new salesRecord(30,"GamingPC", 1700, "01/11/2023")

console.log(
    "Employee Record"+"\n",
    "Name: ", joannaBates.firstName + " "+joannaBates.lastName +"\n",
    "Position: ", joannaBates.position +"\n",
    "Age: ", joannaBates.age +"\n"
 )

console.log(
    "Sales Record"+"\n",
    "Item Sold: " + gamingPCSale.item +"\n",
    "Item Price: " + gamingPCSale.price +"\n"
)

const monitorSale = new salesRecord(30,"4K Monitor",1100,"10/11/2023");

sales = [gamingPCSale,monitorSale]

console.log("4k Monitor price: " +"$"+ monitorSale.price);
console.log(sales[1].price);

joannaBates.logFullName();