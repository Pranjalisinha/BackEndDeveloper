const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    item_name: String,
    date: String,
    available_quantity: Number
});

const inventory_model = mongoose.model("product", inventorySchema);

module.exports = inventory_model;