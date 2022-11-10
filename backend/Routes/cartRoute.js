const express = require("express");
const jwt = require("jsonwebtoken");
const cart_model = require("../Modules/cart");

const router = express.Router();

//order place route
router.post("/add-item-cart", (req, res)=> {
    console.log(req.headers.authorization, req.body);
    //check if user is exist or not
    try {
        const username = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        cart_model.create({
            username: username,
            item_id: req.body.item_id,
            quantity: req.body.quantity,
            }).then((data)=> {
            res.status(200).send(data)
        }).catch((err)=> {
            res.status(400).send(err)
        });
    } catch(err) {
        res.status(400).send(err.message)
    }
    
});

//get product details
router.get("/get-cart-items", (req, res)=> {
    //check the authorized user
    try {
        const username = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        cart_model.find({username: username}).then((cart)=> {
            res.status(200).send({cart: cart})
        })
    } catch(err) {
        res.status(400).send(err.message)
    }
})

//to update quantity of the cart item
router.put("/update-item-quantity", (req, res)=>{
    try {
        const username = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        cart_model.find({username: username, item_id:req.body.item_id}).then(()=> {
           cart_model.updateOne({quantity: req.body.quantity}).then((data)=>{
            res.status(200).send(data)
           }).catch((err)=>{
            res.status(200).send(err.message)
           })
        }).catch((err)=>{
            res.status(200).send(err.message)
        })
    } catch(err) {
        res.status(400).send(err.message)
    }
})

router.delete("/del-item-cart/:id", (req, res)=> {
    try{
        const username = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        cart_model.find({username: username, item_id:req.body.item_id}).then(()=> {
            cart_model.deleteOne({item_id: req.params.id}).then(()=> {
                res.status(200).send("Item removed from cart Sucessfully")
            }).catch((err)=> {
                res.status(400).send(err)
            })
        }).catch((err)=>{
            res.status(400).send(err)
        })
} catch{
    res.status(400).send(err.message)
}
   
});

module.exports = router