const express = require("express");
const app = express();
const mongoose = require("mongoose")
require("dotenv").config();
const port = process.env.PORT || 3001;
const inventoryController = require("./Routes/invertoryRoute")
const userController = require("./Routes/RegisterRoute")
const orderController = require ("./Routes/orderRoutes")
const cartController = require ("./Routes/cartRoute")

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(port, (req, res) => {
    console.log(`server started at ${port}`);
});

mongoose.connect("mongodb://localhost/Backend_developer_assignmnet", (data)=>{
    console.log("Database is connected succesfully")
}, (err)=>{
    console.log(err);
})
app.use("/inventory", inventoryController)
app.use("/user", userController)
app.use("/add", orderController)
app.use("/cart-add", cartController)