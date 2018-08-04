var inquirer = require("inquirer");
var functions = require("./functions.js");

inquirer.prompt([
    {
        name : 'menu',
        type : 'list',
        message : 'Select Action',
        choices : ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
]).then(function(answers){
        var action = answers.menu;
        switch(action){
            case 'View Products for Sale':
                functions.managerView();
                break;
            case 'View Low Inventory':
                functions.getLowInventory();
                break;
            case 'Add to Inventory':
                functions.addToInventory();
                break;
            case 'Add New Product':
                functions.getNewProductDetails();
                break;
            
        }

})