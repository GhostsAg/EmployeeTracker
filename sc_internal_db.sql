DROP DATABASE IF EXISTS internal_db;

CREATE DATABASE internal_db;

USE internal_db;

CREATE TABLE emp_role (
	id INT AUTO_INCREMENT NOT NULL
    , title VARCHAR(30) NOT NULL
    , salary INT NOT NULL
    , department VARCHAR(30) NOT NULL
    , PRIMARY KEY (id)
);

CREATE TABLE department (
	id INT AUTO_INCREMENT NOT NULL
    , dept_name VARCHAR(30) NOT NULL
    , PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT NOT NULL
    , first_name VARCHAR(30) NOT NULL
    , last_name VARCHAR(30) NOT NULL
    , role_id INT NOT NULL
    , manager_id INT NOT NULL
    , PRIMARY KEY (id)
);

CREATE TABLE capital (
    id INT AUTO_INCREMENT NOT NULL
    , expense INT NOT NULL
    , PRIMARY KEY (id)
);