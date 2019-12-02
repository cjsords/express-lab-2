const express = require("express");
const pool = require("./pg-connection-pool");
const cartRoutes = express.Router();

cartRoutes.get("/", (req, res) => {
  res.send("It's working");
});

//get
cartRoutes.get("/cart-items", (req, res) => {
  let sql = "SELECT * FROM shopping_cart";
  pool.query(sql).then(result => {
    console.log(result.rows);
    res.json(result.rows);
  });
});

//get by id
cartRoutes.get("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let sql = "SELECT * FROM shopping_cart WHERE id = $1::int";
  let params = [id];
  pool.query(sql, params).then(result => {
    if (result.rows.length !== 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404);
      res.send("No such item.");
    }
  });
});

//post cart item
cartRoutes.post("/cart-items", (req, res) => {
  const item = req.body;
  let sql = `INSERT INTO shopping_cart (product, price, quantity)
  VALUES ($1::TEXT, $2::INT, $3::INT) RETURNING *`;
  let params = [item.product, item.price, item.quantity];
  pool.query(sql, params).then(result => {
    res.status(201);
    res.json(result.rows[0]);
  });
});

cartRoutes.put("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = req.body;
  const sql = `UPDATE shopping_cart
               SET product=$1::TEXT, price=$2::INT, quantity=$3::INT
               WHERE id = $4::INT RETURNING *`;
  const params = [item.product, item.price, item.quantity, id];
  pool.query(sql, params).then(result => {
    res.json(result.rows[0]);
  });
});

//delete cart item
cartRoutes.delete("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const sql = `DELETE FROM shopping_cart
               WHERE id = $1::INT`;
  const params = [id];
  pool.query(sql, params).then(result => {
    res.sendStatus(204);
  });
});

module.exports = cartRoutes;
