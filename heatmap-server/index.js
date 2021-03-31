const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// const routes = require("./routes/emp.js");
//connect

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "123456789@@@sid",
    database : "heatmap_db"
});

db.connect((err)=>{

   if(err){
       throw err;
   }
   console.log('connected');

})

const app = express();

app.use(bodyParser.json());
console.log("above get");
app.get("/", (req, res)=>{
console.log("above db_query");
    db.query("SELECT employee.Date, COUNT(employee.Checklists) AS Checklists FROM employee GROUP BY employee.Date", (err, rows, fields)=>{
        console.log("callback");
       
        if(!err){
           res.send(rows);
        }
        else{
            throw err;
        }
    })
    console.log("db-query");
})
console.log("hello");
// sql queries 



app.listen('3000', ()=>{

    console.log('server up at 3000');
})

// above get->above-dquery -> db-query->callback->hello  