const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'Employee_Tracker',
    //Promise: bluebird
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');

    promptMenu();
});

// gets all departments names in an array
const getDepartments = () => {
    return new Promise(resolve => {
        connection.query('SELECT name FROM department', function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            resolve(res.map(data => data.name));
        });
    });
}

// gets all role names in an array
const getRoles = () => {
    return new Promise(resolve => {
        connection.query('SELECT title FROM role', function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            resolve(res.map(data => data.title));
        });
    });
}

// gets all employee names in an array
const getEmployees = () => {
    return new Promise(resolve => {
        connection.query('SELECT * FROM employee', function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            resolve(res.map(data => data.first_name.concat(" ", data.last_name)));
        });
    });
}

// gets the department id given the name
const getDepartmentID = (department) => {
    return new Promise(resolve => {
        connection.query('SELECT id FROM department WHERE ?',
            {
                name: department
            },
            function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                resolve(res[0].id);
            });
    });
}

// gets the role id given the name
const getRoleID = (role) => {
    return new Promise(resolve => {
        connection.query('SELECT id FROM role WHERE ?',
            {
                title: role
            },
            function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                resolve(res[0].id);
            });
    });
}

// gets the employee id given the name
const getEmployeeID = (employee) => {
    console.log(employee.split(" "));
    return new Promise(resolve => {
        connection.query('SELECT id FROM employee WHERE `first_name` = ? AND `last_name` = ?',
            employee.split(" "),
            function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                resolve(res[0].id);
            });
    });
}

// prompt user to add a department
const addDepartment = () => {

    return new Promise(resolve => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:',
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    }
                    else {
                        console.log("Please enter the department name!");
                        return false;
                    }
                }
            }
        ]).then(data => {
            const query = connection.query(
                'INSERT INTO department SET ?',
                {
                    name: data.name
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' department inserted!\n');

                    resolve({
                        ok: true,
                        message: 'Success!'
                    });
                }
            );
        });
    });

}

// prompt user to add a role
const addRole = () => {
    return new Promise(resolve => {
        getDepartments().then(departments => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the role name:',
                    validate: nameInput => {
                        if (nameInput) {
                            return true;
                        }
                        else {
                            console.log("Please enter the role name!");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the role salary:',
                    validate: salaryInput => {
                        if (salaryInput) {
                            return true;
                        }
                        else {
                            console.log("Please enter the role salary!");
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department of the role:',
                    choices: departments
                }
            ]).then(data => {
                getDepartmentID(data.department).then(id => {
                    const query = connection.query(
                        'INSERT INTO role SET ?',
                        {
                            title: data.name,
                            salary: data.salary,
                            department_id: id
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + ' role inserted!\n');

                            resolve({
                                ok: true,
                                message: 'Success!'
                            });
                        }
                    );
                })
            });
        })
    });
}

// prompt user to add an employee
const addEmployee = () => {
    return new Promise(resolve => {
        getRoles().then(roles => {
            getEmployees().then(employees => {
                employees = ['None'].concat(employees);
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: "Enter the employee's first name:",
                        validate: nameInput => {
                            if (nameInput) {
                                return true;
                            }
                            else {
                                console.log("Please enter the employee's first name");
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: "Enter the employee's last name:",
                        validate: nameInput => {
                            if (nameInput) {
                                return true;
                            }
                            else {
                                console.log("Please enter the employee's last name");
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Select the role of the employee:',
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select the manager of the employee:',
                        choices: employees
                    }
                ]).then(data => {
                    getRoleID(data.role).then(role_id => {
                        if (data.manager === 'None') {
                            const query = connection.query(
                                'INSERT INTO employee SET ?',
                                {
                                    first_name: data.first_name,
                                    last_name: data.last_name,
                                    role_id: role_id,
                                    manager_id: null
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res.affectedRows + ' employee inserted!\n');
                                }
                            );
                        }
                        else {
                            getEmployeeID(data.manager).then(manager_id => {
                                const query = connection.query(
                                    'INSERT INTO employee SET ?',
                                    {
                                        first_name: data.first_name,
                                        last_name: data.last_name,
                                        role_id: role_id,
                                        manager_id: manager_id
                                    },
                                    function (err, res) {
                                        if (err) throw err;
                                        console.log(res.affectedRows + ' employee inserted!\n');
                                    }
                                );
                            })
                        }
                        resolve({
                            ok: true,
                            message: 'Success!'
                        });
                    })
                });
            })
        })
    });
}

// prompt user to update role of an employee
const updateRole = () => {
    return new Promise(resolve => {
        getRoles().then(roles => {
            getEmployees().then(employees => {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select an employee:',
                        choices: employees
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "Select the employee's new role:",
                        choices: roles
                    }
                ]).then(data => {
                    getRoleID(data.role).then(role_id => {
                        getEmployeeID(data.employee).then(employee_id => {
                            connection.query(
                                'UPDATE employee SET ? WHERE ?',
                                [
                                    {
                                        role_id: role_id
                                    },
                                    {
                                        id: employee_id
                                    }
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res.affectedRows + ' employee updated!\n');

                                    resolve({
                                        ok: true,
                                        message: 'Success!'
                                    });
                                }
                            );
                        })
                    })
                });
            })
        })
    });
}

// print department table to console
const viewDepartments = () => {
    return new Promise(resolve => {
        connection.query('SELECT * FROM department', function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.table(res);
            resolve({
                ok: true,
                message: 'Success!'
            });
        });
    });
}

// print role table to console
const viewRoles = () => {
    return new Promise(resolve => {
        const sql = `SELECT role.id, role.title, role.salary, department.name AS department 
        FROM role
        LEFT JOIN department ON role.department_id = department.id`;
        connection.query(sql, function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.table(res);

            resolve({
                ok: true,
                message: 'Success!'
            });
        });
    });
}

// print employee table to console
const viewEmployees = () => {
    return new Promise(resolve => {
        const sql = `SELECT e.id, e.first_name, e.last_name, role.title, role.salary,
        department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role ON e.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee m on m.id = e.manager_id`;
        connection.query(sql, function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.table(res);

            resolve({
                ok: true,
                message: 'Success!'
            });
        });
    });
}

// prompt the menu
const promptMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit']
        }
    ])
        .then(menuData => {
            if (menuData.option === 'View All Departments') {
                viewDepartments().then(message => {
                    promptMenu();
                })
            }
            else if (menuData.option === 'View All Roles') {
                viewRoles().then(message => {
                    promptMenu();
                })
            }
            else if (menuData.option === 'View All Employees') {
                viewEmployees().then(message => {
                    promptMenu();
                })
            }
            else if (menuData.option === 'Add Department') {
                addDepartment().then(message => {
                    promptMenu();
                })
            }
            else if (menuData.option === 'Add Role') {
                addRole().then(message => {
                    promptMenu();
                })
            }
            else if (menuData.option === 'Add Employee') {
                addEmployee().then(message => {
                    promptMenu();
                })
            }
            else if (menuData.option === 'Update Employee Role') {
                updateRole().then(message => {
                    promptMenu();
                })
            }
            else {
                connection.end();
            }
        })
}