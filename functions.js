//npm requires
var mysql      = require('mysql');
var inquirer = require("inquirer");
var Table = require('cli-table');


//Connecting to mySql
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  port: 3306,
  password : '158966211',
  database : 'bamazon'
});
connection.connect();

//Function to add new product into the table
var addProduct = function addProduct(productName,productDepartment,productPrice,productQty){
    var query = `INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales) VALUES('${productName}' , '${productDepartment}' , ${productPrice} , ${productQty}, 0)`;
    connection.query(query, function(error, results){
    if(error) throw error;
    console.log("new product has been added");


});
}

//Function to update new Qty or  adding items to inventory
var getItemById = function getItemById(productId, addationalQty){
    var query = `SELECT * FROM products WHERE id =${productId}`;
    connection.query(query, function(error, results, fields){
        if(error) throw error;
        var currentQty = results[0].stock_quantity;
        var newQty = currentQty + addationalQty;
        connection.query(`UPDATE products SET stock_quantity=${newQty} WHERE id=${productId}`, function(error, results){
            if(error) throw error;
            console.log(`Item Id : ${productId} => ${addationalQty} have been added`)
        });
    });
}

//Function to fulfill customer order
var fulfillOrder = function fulfillOrder(productId, quantity){
    var query = "SELECT * FROM products WHERE id=" + productId ;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        var avaliableQty = results[0].stock_quantity;
        var itemName = results[0].product_name;
        var item_price = results[0].price; 
        var product_sales_total = results[0].product_sales; 
        var department = results[0].department_name;

        if(quantity > avaliableQty){
            console.log(`There are only ${avaliableQty} ${itemName} in stock`)
        }else{
            var remainingQty = avaliableQty - quantity;
            var total = parseFloat(quantity * item_price);
            var total_revenue = total + product_sales_total;
            updateQty(remainingQty, productId,total_revenue);
            console.log(`Your order of ${quantity} ${itemName} has been processed, Total : $ ${total}`);
            toatalSalesByDept(department, total);

        }
      });
}

//Function to update the quantity
function updateQty(remainingQty, productId,total){
    var query = `UPDATE products SET stock_quantity= ${remainingQty}, product_sales=${total} WHERE id= ${productId}` ; 
    connection.query(query, function (error, results) {
        if (error) throw error;
    });
}

//Function to pull all products from table products
var getAllProducts = function getAllProducts(){
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        connection.end();
      });
}

//Functions to pull low inventory
var getLowInventory = function (){
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(error, results, fields){
        if(error) throw error;
        var table = new Table({
            head : ["id", "product_name", "Qty"],
            colWidths : [20, 40, 20]
            }); 
        for(i=0; i<results.length; i++){
            table.push(
                [results[i].id, results[i].product_name, results[i].stock_quantity]
            );
        }
        console.log("\n" + table.toString());
        connection.end();
    });
}

//Add to inventory
var addToInventory = function addToInventory(){
    inquirer.prompt([
        {
            type : 'input',
            name : 'id',
            message : 'Which Item would you like to add to inventory - Enter product Id'
        },
        {
            type : 'input',
            name : 'quantity',
            message : 'How many of these items are you adding'
        }

    ]).then( function (answer){
        var productId = answer.id;
        var addQuantity = parseInt(answer.quantity);
        getItemById(productId, addQuantity);
        // connection.end();

    });
}

//Add New Product
var getNewProductDetails = function getNewProductDetails (){
    inquirer.prompt([
        {   
            type : 'input',
            name : 'product_name',
            message : 'Name of the product'
        },
        {   
            type : 'input',
            name : 'department_name',
            message : 'What department does this product belong to?'
        },
        {
        type : 'input',
        name : 'price',
        message : 'Set price'
        },
        {
        type : 'input',
        name : 'qty',
        message : 'Enter Quantity'
        }
    ]).then( function (answer){
        var productName = answer.product_name;
        var productDepartment = answer.department_name;
        var productPrice = answer.price;
        var productQty = answer.qty;
        addProduct(productName,productDepartment,productPrice,productQty);
    });
}

//Function to calculate total sales of each department and updates the department table with new figure
var toatalSalesByDept = function toatalSalesByDept(department, total){
        var query = `SELECT * FROM departments WHERE department_name='${department}';`
        connection.query(query, function(error,results,fields){
            if(error) throw error;
            // console.log(results);
            var total_product_sales = results[0].total_product_sales;
            total_product_sales = parseFloat(total_product_sales + total);
        connection.query(`UPDATE departments SET total_product_sales=${total_product_sales} WHERE department_name='${department}';`,
                        function(error, results, fields){
                            if(error) throw error;
                        }
        )
        });
}


//Function to get all info from department table
var getDepartmentInfo = function getDepartmentInfo(){
    var query = 'SELECT * FROM departments';
    connection.query(query, function(error, results, fields){

        var table = new Table({
            head : ["department_id", "department_name", "overhead_costs", "product_sales", "total_profit"],
            colWidths : [20, 20, 20, 20, 20]
            });
       
        for(i=0; i<results.length; i++){
            var total_profit = parseFloat(results[i].total_product_sales - results[i].over_head_costs);
            table.push(
                [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].total_product_sales, total_profit]
            );

        }
        console.log("\n" + table.toString());

    });
}

 //function to complete order
 function completeOrder(){
    const questions = [
        { type: 'input', name: 'productId',message : 'Enter the id of item you would like to buy'},
        { type: 'input', name: 'quantity',message : 'Enter your quantity'}
    
    ];
        inquirer
        .prompt(questions)
        .then(function (answers) {
            var productId = answers.productId;
            var quantity = answers.quantity;
            fulfillOrder(productId,quantity);
        });
    }

    //Display all items and run inquirer
var displayAllItems = function displayAllItems(){
    var query = `SELECT * FROM products`;
    connection.query(query, function(error, results,fields){
        if(error) throw error;
        var table = new Table({
            head : ["Product Id", "Product Name", "Price", "Stock_qty"],
            colWidths : [20, 40, 20,20]
        });
        for(var i=0; i<results.length; i++){
            table.push(
                [results[i].id, results[i].product_name, results[i].price, results[i].stock_quantity]
            );
        }
        console.log("\n" + table.toString());
        completeOrder();
    });

}

//Display products Manager view

var managerView = function managerView(){
    var query = `SELECT * FROM products`;
    connection.query(query, function(error, results,fields){
        if(error) throw error;
        var table = new Table({
            head : ["Product Id", "Product Name", "Price", "Qty available"],
            colWidths : [20, 40, 20,20]
        });
        for(var i=0; i<results.length; i++){
            table.push(
                [results[i].id, results[i].product_name, results[i].price, results[i].stock_quantity]
            );
        }
        console.log("\n" + table.toString());
    });
}

//createNewDept
var createNewDept = function createNewDept(){
    inquirer.prompt([{
        type: 'input',
        name : 'newDept',
        message : 'What is the new dept name?'
    }]).then(function(answers){
        var newDept = answers.newDept;
        console.log(newDept);
        var query = `INSERT INTO departments(department_name, over_head_costs, total_product_sales) VALUES('${newDept}', 100000, 0)`
        connection.query(query, function(error, results,fields){
        if(error) throw error;
        console.log("Departemt Added");
    })
    });
    
}

module.exports = {
    fulfillOrder : fulfillOrder,
    getAllProducts : getAllProducts,
    getLowInventory : getLowInventory,
    addToInventory :addToInventory,
    getNewProductDetails : getNewProductDetails,
    getDepartmentInfo : getDepartmentInfo,
    displayAllItems : displayAllItems,
    managerView : managerView,
    createNewDept : createNewDept
}

