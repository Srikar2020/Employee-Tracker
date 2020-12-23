INSERT INTO department (name)
VALUES ('Marketing'), ('Finance'), ('Operations Management'), ('Human Resources'), ('IT');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Marketing Lead', 87800, 1),
    ('Community Manager', 50990, 1),
    ('Chief Financial Officer', 519692, 2),
    ('Accountant', 78820, 2),
    ('Operations Manager', 65813, 3),
    ('Purchasing Manager', 117927, 3),
    ('Director of Human Resources', 97777, 4),
    ('Human Resources Specialist', 49149, 4),
    ('Software Engineer', 105090, 5),
    ('IT Technician', 74664, 5),
    ('IT Director', 123900, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Liam', 'Williams', 1, NULL),
    ('Marian', 'Webber', 2, 1),
    ('Cameron', 'Norton', 3, NULL),
    ('Everett', 'Adams', 4, 3),
    ('Daniela', 'Carver', 4, 3),
    ('Doris', 'Atkins', 5, NULL),
    ('Noah', 'Boyle', 6, NULL),
    ('Jamal', 'Mcpherson', 7, NULL),
    ('Wilfred', 'Coles', 8, 8),
    ('Mark', 'Redman', 8, 8),
    ('Yating', 'Tai', 11, NULL),
    ('Dong', 'Mei', 9, 11),
    ('Rupinder', 'Ajeet', 9, 11),
    ('Lalit', 'Nalini', 10, 11);