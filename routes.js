const express = require("express");

const cartRoutes = express.Router();

cartRoutes.get("/", (req, res) => {
  res.send("It's working");
});

const cartItems = [
  { id: 1, product: "Frozen Pizza", price: 5, quantity: 1 },
  { id: 2, product: "T-Shirt", price: 10, quantity: 1 }
];
let nextId = 3;

//get
cartRoutes.get("/cart-items", (req, res) => {
  res.json(cartItems);
});

//get by id
cartRoutes.get("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  let foundItem = cartItems.find(item => item.id === id);
  if (foundItem) {
    res.json(foundItem);
  } else {
    res.status(404); //not found
    res.send(`No item with id ${id}`);
  }
});

//post cart item
cartRoutes.post("/cart-items", (req, res) => {
  const item = req.body;
  cartItems.push(item);
  item.id = nextId;
  nextId++;
  res.status(201);
  res.json(item);
});

//update cart item
cartRoutes.put("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = req.body;
  item.id = id;
  const index = cartItems.findIndex(i => i.id === id);
  cartItems.splice(index, 1, item);
  res.json(item);
});

//delete cart item
cartRoutes.delete("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cartItems.findIndex(i => i.id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  res.sendStatus(204);
});

module.exports = cartRoutes;
