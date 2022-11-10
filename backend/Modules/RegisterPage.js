const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const customer_model = mongoose.model("User", customerSchema);

module.exports = customer_model;