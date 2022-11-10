const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    username: String,
    item_id: String,
    quantity: Number
});

const cart_model = mongoose.model("cart", cartSchema);

module.exports = cart_model;