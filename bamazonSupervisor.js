var inquirer = require("inquirer");
var functions = require("./functions.js");
inquirer.prompt([
    {
        type : 'list',
        name : 'selection',
        choices : ['View Product Sales by Department', 'Create New Department' ],
        message : 'Select Action'
    }
]).then( function (answer){
    var action = answer.selection;
    switch(action){
        case 'View Product Sales by Department':
        functions.getDepartmentInfo();
            break;
        case 'Create New Department':
            functions.createNewDept();
            break;
    }
});


