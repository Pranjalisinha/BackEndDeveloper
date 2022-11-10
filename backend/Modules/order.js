const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    username: String,
    item_id: String,
    item_name: String,
    quantity: Number
});

const order_model = mongoose.model("order", orderSchema);

module.exports = order_model;