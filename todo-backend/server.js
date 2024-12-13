const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");


app.use(express.json()); //Decode json document.It is worked as middle ware.
app.use(cors());




//memory storage for todo items
//const todos = []; this is work as temporary database, if refresh/reconnect the command will clear

//Connecting MongoDb
mongoose
  .connect("mongodb://localhost:27017/To-Do") //To-Do is a database name

  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

//Create schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true, //Mention it field must required, if there are not that field error will occur.
    type: String,
  },
  description: String,
});

//Create Model

const todoModel = mongoose.model("todo", todoSchema); // todo is a collection

//Create a new todo item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  //const newTodo = {
  //id: todos.length + 1,
  //title,
  //description,
  //};

  //todos.push(newTodo);
  //console.log(todos);

  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Get All Items
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

  //res.json(todos); //send as Json data
});

//Update ToDo Item

app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id; //get id parameter with help of params
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true } //send new data
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo Not fund" });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Delete Item

app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log("server listening to port" + port);
});
