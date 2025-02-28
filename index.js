const express = require('express');
const { resolve } = require('path');

//dotenv declaration
require('dotenv').config();

//mongoose connection

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {})
.then(()=>{console.log("Mongodb connected sucessfully")})
.catch((err)=>{console.log("Mongodb connection failed")})

const app = express();
const port = 3010;

app.use(express.static('static'));


//importing Schemas

const Menu = require("./menuSchema");
app.use(express.json());

app.post('/menu', async (req,res)=>{
  try {  
    const {name, description, price} = req.body;

    if(!name || !price){
      return res.status(400).json({msg:"Details of the product must be given"});
    }

    const newItem = new Menu({name, description, price});
    await newItem.save();

    return res.status(201).json({msg:"New Item added to Menu"});
  }
  catch (err) {
    return res.status(500).json({msg:"Internal server error", err})
  }
})

app.get('/menu', async(req,res)=>{
  try{
    const menuItems = await Menu.find();
    return res.json(menuItems);
  }catch(err){
    return res.status(500).json({msg:"Internal server error",err})
  }
})


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});