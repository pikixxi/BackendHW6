const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ' ',
    database: 'test',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all employees
app.get('/jay', (req, res) => {
    mysqlConnection.query('SELECT * FROM jay', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/jay/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM jay WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an employees
app.post('/jay', (req, res) => {
    let emp = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @password = ?; \
    CALL EmployeeAddOrEdit(@id,@name,@password);";
    mysqlConnection.query(sql, [emp.id, emp.name, emp.password], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].id);
            });
        else
            console.log(err);
    })
});

//Update an employees
app.put('/jay', (req, res) => {
    let emp = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @password = ?;SET \
    CALL EmployeeAddOrEdit(@id,@name,@password);";
    mysqlConnection.query(sql, [emp.id, emp.name, emp.password], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});