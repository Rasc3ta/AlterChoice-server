const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express());









app.get('/', (req,res)=>{
    res.send("AlterChoice server running");
})

app.listen(port, ()=>{
    console.log("AlterChoice server port: ", port);
})