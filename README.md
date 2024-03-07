# capstone-back-end

Welcome to our Ticket Submission and Management App! This application is designed to streamline the process of submitting, assigning, and tracking tickets for software development projects. Whether you're a staff member reporting an issue, a developer working on tickets, or an admin overseeing the process, this app provides a centralized platform for efficient ticket management.

## Setup Instructions

1. Clone the repository to your local machine.
[Code Beetle/ Back-End Repo](git@github.com:reggiecheston/capstone-back-end.git)

2. Navigate to the cloned directory: 
cd capstone-bacck-end

3. Install dependencies: 
npm install

4. Run the backend server.
nodemon start

3. Create an `.env` file in the root directory of the project.

4. Add the following variables to the `.env` file:
   database_HOST= " "
   database_USER= " "
   database_PASSWORD= " "
   database_NAME= " "

##Database Setup

1. Open your MySQL workbench
2. Craete your own databse
3. Insert the following quiries to set up databse for the application 

-- MySQL Script generated by MySQL Workbench
-- Mon Feb 26 18:19:09 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema capstone_team_3
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `capstone_team_3` ;

-- -----------------------------------------------------
-- Schema capstone_team_3
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `capstone_team_3` DEFAULT CHARACTER SET utf8 ;
USE `capstone_team_3` ;

-- -----------------------------------------------------
-- Table `capstone_team_3`.`admins`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_team_3`.`admins` ;

CREATE TABLE IF NOT EXISTS `capstone_team_3`.`admins` (
  `admin_id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`admin_id`),
  UNIQUE INDEX `admin_id_UNIQUE` (`admin_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_team_3`.`developers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_team_3`.`developers` ;

CREATE TABLE IF NOT EXISTS `capstone_team_3`.`developers` (
  `developer_id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`developer_id`),
  UNIQUE INDEX `developer_id_UNIQUE` (`developer_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_team_3`.`reports`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_team_3`.`reports` ;

CREATE TABLE IF NOT EXISTS `capstone_team_3`.`reports` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `category` ENUM("functional", "usability", "syntax errors", "missing information", "compatibility", "performance", "unit level", "calculation errors", "communication error", "boundary value error") NOT NULL,
  `priority` ENUM("low", "medium", "high") NOT NULL,
  `due_date` DATE NOT NULL,
  `staff_id` INT NOT NULL,
  PRIMARY KEY (`report_id`, `staff_id`),
  INDEX `fk_reports_staff1_idx` (`staff_id` ASC) VISIBLE,
  UNIQUE INDEX `report_id_UNIQUE` (`report_id` ASC) VISIBLE,
  CONSTRAINT `fk_reports_staff1`
    FOREIGN KEY (`staff_id`)
    REFERENCES `capstone_team_3`.`staff` (`staff_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_team_3`.`staff`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_team_3`.`staff` ;

CREATE TABLE IF NOT EXISTS `capstone_team_3`.`staff` (
  `staff_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL UNIQUE,
  `email` VARCHAR(45) NOT NULL UNIQUE,
  `user_password` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `developer_id` INT NULL UNIQUE,
  `admin_id` INT NULL UNIQUE,
  PRIMARY KEY (`staff_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`staff_id` ASC) VISIBLE,
  INDEX `fk_staff_developers1_idx` (`developer_id` ASC) VISIBLE,
  INDEX `fk_staff_admin1_idx` (`admin_id` ASC) VISIBLE,
  CONSTRAINT `fk_staff_developers1`
    FOREIGN KEY (`developer_id`)
    REFERENCES `capstone_team_3`.`developers` (`developer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_staff_admin1`
    FOREIGN KEY (`admin_id`)
    REFERENCES `capstone_team_3`.`admins` (`admin_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_team_3`.`tickets`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_team_3`.`tickets` ;

CREATE TABLE IF NOT EXISTS `capstone_team_3`.`tickets` (
  `ticket_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `category` ENUM("functional", "usability", "syntax errors", "missing information", "compatibility", "performance", "unit level", "calculation errors", "communication error", "boundary value error") NOT NULL,
  `size` ENUM("small", "medium", "large") NOT NULL,
  `due_date` DATE NOT NULL,
  `priority` ENUM("low", "medium", "high") NOT NULL,
  `progress` ENUM("not started", "in progress", "progress  blocked", "ready for review") NOT NULL,
  `isapproved` TINYINT NOT NULL,
  `escalated` TINYINT NULL,
  `developer_assigned_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `admin_assignor_id` INT NOT NULL,
  PRIMARY KEY (`ticket_id`, `developer_assigned_id`, `staff_id`, `admin_assignor_id`),
  UNIQUE INDEX `ticket_id_UNIQUE` (`ticket_id` ASC) VISIBLE,
  INDEX `fk_tickets_admin1_idx` (`admin_assignor_id` ASC) VISIBLE,
  INDEX `fk_tickets_developers1_idx` (`developer_assigned_id` ASC) VISIBLE,
  INDEX `fk_tickets_staff1_idx` (`staff_id` ASC) VISIBLE,
  CONSTRAINT `fk_tickets_admin1`
    FOREIGN KEY (`admin_assignor_id`)
    REFERENCES `capstone_team_3`.`admins` (`admin_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tickets_developers1`
    FOREIGN KEY (`developer_assigned_id`)
    REFERENCES `capstone_team_3`.`developers` (`developer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tickets_staff1`
    FOREIGN KEY (`staff_id`)
    REFERENCES `capstone_team_3`.`staff` (`staff_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- describe statements

describe `admins`;
describe `developers`;
describe `reports`;
describe `staff`;
describe `tickets`;

--
-- QUERIES
--

-- create 1st admin
SELECT COUNT(*) INTO @admin_id FROM admins;

INSERT INTO admins (admin_id)
VALUES (@admin_id);

INSERT INTO staff (username, email, user_password, first_name, last_name, admin_id)
VALUES ('admin', 'admin@codebeetle.com', 'beetle123!', 'Admin', 'Account', 1);

--
-- SELECT STATEMENTS
--

-- select all
SELECT * FROM admins;
SELECT * FROM developers;
SELECT * FROM reports;
SELECT * FROM staff;
SELECT * FROM tickets;

-- Login
SELECT * FROM staff
WHERE email = ${email} 
AND user_password = ${user_password}

-- Select tickets based on progress
SELECT * 
FROM tickets 
WHERE progress = ${progress};

-- Select tickets based on category
SELECT * 
FROM tickets 
WHERE category = ${category};

-- Select tickets based on size
SELECT * 
FROM tickets 
WHERE size = ${size};

-- Select tickets based on multiple criteria (progress, category, and size)
SELECT * 
FROM tickets 
WHERE progress = ${progress} 
  AND category = ${category}
  AND size = ${size}
  AND escalated = 1;

-- same as above but with staff username as a potential field (think if an admin is searching for a staff membr in particular)
SELECT t.*, s.username AS staff_username
FROM tickets t
JOIN staff s ON t.staff_id = s.staff_id
WHERE progress = ${progress} 
  AND category = ${category}
  AND size = ${size}
  AND s.username = ${username};

--
-- DEVELOPER VIEW
--

-- select all tickets assigned to a particular developer
SELECT t.ticket_id, t.size, t.progress, t.category
FROM tickets t
WHERE t.developer_assigned_id = ${developer_id};

-- select all tickets along with the admin who assigned them for a particular developer
SELECT t.ticket_id, t.name, t.size, t.progress, t.category, admin_assignor.admin_id AS admin_assignor_id, admin_assignor.username AS admin_assignor_username
FROM tickets t
JOIN staff admin_assignor ON t.admin_assignor_id = admin_assignor.staff_id
WHERE t.developer_assigned_id = ${developer_id};

--
-- ADMIN VIEW
--

-- join to select all reports with corresponding staff details
SELECT r.*, s.first_name
FROM reports r 
JOIN staff s 
ON r.staff_id = s.staff_id;

-- select all tickets along with staff who reported and developer assigned to work on them
SELECT t.*, reporter.username AS reporter_username, assignee.username AS assignee_username
FROM tickets t
JOIN staff reporter ON t.staff_id = reporter.staff_id
JOIN staff assignee ON t.developer_assigned_id = assignee.staff_id;

--
-- INSERT STATEMENTS
--

-- creates user via admin input

-- staff
INSERT INTO staff (username, email, user_password, first_name, last_name)
VALUES ('${new_username}', '${new_email@example.com}', '${new_password}', '${John}', '${Doe}');

INSERT INTO staff (username, email, user_password, first_name, last_name)
VALUES ('billsmith', 'billsmith@codebeetle.com', '123pass', 'Bill', 'Smith');

-- developers
SELECT COUNT(*) + 1 INTO @developer_id FROM developers;

INSERT INTO developers (developer_id)
VALUES (@developer_id);

INSERT INTO staff (username, email, user_password, first_name, last_name, developer_id)
VALUES ('${new_username}', '${new_email@example.com}', '${new_password}', '${John}', '${Doe}', @developer_id);

INSERT INTO staff (username, email, user_password, first_name, last_name, developer_id)
VALUES ('janedoe', 'janedoe@gmail.com', 'pass321', 'Jane', 'Doe', @developer_id);

-- admin
SELECT COUNT(*) + 1 INTO @admin_id FROM admins;

INSERT INTO admins (admin_id)
VALUES (@admin_id);

INSERT INTO staff (username, email, user_password, first_name, last_name, admin_id)
VALUES ('${new_username}', '${new_email@example.com}', '${new_password}', '${John}', '${Doe}', @admin_id);

INSERT INTO staff (username, email, user_password, first_name, last_name, admin_id)
VALUES ('johndoe', 'johndoe@gmail.com', 'pass123', 'John', 'Doe', @admin_id);



-- creates tickets via admin input (REVIEW ID'S)
INSERT INTO tickets (title, summary, category, size, due_date, priority, progress, isapproved, escalated, developer_assigned_id, staff_id, admin_assignor_id) 
    VALUES ('${ticketData.title}', '${ticketData.description}', '${ticketData.category}', '${ticketData.size}', '${ticketData.due_date}', '${ticketData.priority}', '${ticketData.progress}', ${ticketData.isapproved}, ${ticketData.escalated}, ${ticketData.developer_assigned_id}, ${ticketData.staff_id}, ${ticketData.admin_assignor_id})

-- creates reports via staff input
INSERT INTO reports (title, summary, category, priority, due_date, staff_id) 
    VALUES ('${reportData.title}', '${reportData.description}', '${reportData.category}', '${reportData.priority}', '${reportData.due_date}', ${reportData.staff_id});

--
-- UPDATE STATEMENTS
--

-- update the status of a ticket via developer input
UPDATE tickets 
SET progress = 'in progress' 
WHERE ticket_id = ${ticket_id};

-- update the approval status of a ticket via admin input
UPDATE tickets 
SET isapproved = 1 
WHERE ticket_id = ${ticket_id};

--
-- DELETE STATEMENTS
--

-- deletes staff member
DELETE FROM staff WHERE username = ${username};

-- deletes report
DELETE FROM reports WHERE report_id = ${report_id};


## Front-End Repository

Front-End Repository If you'd like to integrate the Back-End with the Front-End, you'll need to set up and run the Front-End server separately. The front-End repository for this project can be found at: [Code Beetle/Front-End Repo](git@github.com:reggiecheston/capstone-front-end.git)

Clone the backend repository and follow the instructions in its README to set up and run the backend server. Once the backend server is running, you can configure the frontend to communicate with it by updating the relevant configuration settings.