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

app.get("/", (req, res)=>{

    db.query("SELECT Date, COUNT(*) as Checklists FROM employee GROUP BY Date order by Date", (err, rows, fields)=>{
        if(!err){
           res.send(rows);
        }
        else{
            throw err;
        }
    })
})

// sql queries 



app.listen('3000', ()=>{

    console.log('server up at 3000');
})