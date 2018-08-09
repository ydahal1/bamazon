DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
	id INT(10) AUTO_INCREMENT  NOT NULL,
	product_name VARCHAR(150) NOT NULL,
    department_name VARCHAR(150) NOT NULL,
    price FLOAT(10) NOT NULL,
    stock_quantity INT(10) NOT NULL,
		PRIMARY KEY(id)
    );

USE bamazon;
INSERT INTO products(product_name, department_name, price, stock_quantity)
					     VALUES('Black Decker - Chain Shaw', 'lawn and garden',  140.5 , 12),
                                ('Tiny tip paint brush ', 'Hobby',14.9     , 112),
                                ('Powarade plastic water bottle ', 'Fitness', 10.5 , 22),
                                ('A song of Ice and Fire ','books', 10.5 , 52);
                                     
USE bamazon;
ALTER TABLE products ADD COLUMN product_sales FLOAT(20);

USE bamazon;
CREATE TABLE departments(
	department_id INT(10) AUTO_INCREMENT  NOT NULL,
	department_name VARCHAR(150) NOT NULL,
    over_head_costs FLOAT(10),
    total_product_sales FLOAT(20) ,
		PRIMARY KEY(department_id)
    );
    