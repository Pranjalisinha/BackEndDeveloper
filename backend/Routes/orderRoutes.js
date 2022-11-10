const express = require("express");
const order_model = require("../Modules/order");
const inventory_model = require("../Modules/inventory")
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/get-user-order-list", (req, res)=> {
    try {
        const user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY );
        if(user.length){
            order_model.find().then((data)=>{
                res.status(200).send({order: data});
            })
        } else {
            res.status(400).send("Invalid User")
        }
    } catch(err) {
        res.status(403).send("User Not Authorized", err)
    }
    
    
});
router.post("/placed-order", (req, res)=> {
    try {
        const username = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        inventory_model.find({ item_id: req.body.item_id }).then((data) => {
            if (data.length) {
                const available = data[0].available_quantity
                if (available > req.body.quantity) {
                    order_model.create({
                        username: username,
                        item_id: req.body.item_id,
                        item_name: req.body.item_name,
                        quantity: req.body.quantity
                    }).then(() => {
                        const setquantity = available - req.body.quantity
                        inventory_model.updateOne({ item_id: req.body.item_id }, { $set: { available_quantity: setquantity } }).then((data) => {
                            res.status(200).send( data )
                        }).catch((err) => {
                            res.status(400).send(err.message)
                        })
                    }).catch((err) => {
                        res.status(400).send(err.message)
                    })
                } else {
                    res.status(400).send("Given quantity greater than the available quantity")
                }
            } else {
                res.status(400).send("No such Inventory")
            }
        }).catch((err) => {
            res.status(400).send(err.message)
        })
    } catch(err) {
        res.status(400).send(err.message)
    }
   
});


module.exports = router;