const express = require("express");
const inventory_model = require("../Modules/inventory");
const customer_model = require("../Modules/RegisterPage")
const router = express.Router();


router.post("/add-item-inventory", (req, res) => {
    //to save the date
    const date = new Date()
    let today = date + ""
    today = today.split(" ");
    today = today.splice(1, 3).join(" ");
    //check if item is already present in inventory or not
    customer_model.find({email:req.body.email}).then((data)=>{
        if(data.length){
            let res = data[0].email.indexOf('@');
            let host = data[0].email.slice(res);
            console.log(res)
            console.log(host)
            if(host === "@techeagle.in"){
                inventory_model.find({
                    item_name: req.body.item_name
                }).then((data) => {
                    //if item is already present then add the quantity
                    if (data.length) {
                        const quantity = (data[0].available_quantity) + (req.body.available_quantity)
                        inventory_model.updateOne({ inventory_id: req.body.inventory_id }, { $set: { available_quantity: quantity } }).then((data) => {
                            res.status(200).send(data)
                        }).catch((err) => {
                            res.status(401).send(err.message)
                        })
                    } else {
                        //if item is not present then add new item to inventory
                        inventory_model.create({
                            item_name: req.body.item_name,
                            date: today,
                            available_quantity: req.body.available_quantity
                        }).then((data) => {
                            res.status(200).send(data)
                        }).catch((err) => {
                            res.status(401).send(err.message)
                        })
                    }
                }).catch((err) => {
                    res.status(400).send(err.message)
                })

            } else {
               console.log("Unauthorized user")
            }
        } else {
            res.status(400).send("Plese provide email")
        }
    })
    
});

// get all the items present in inventory
router.get("/get-all-items", (req, res) => {
    inventory_model.find().then((data) => {
        res.status(200).send(data);
    }).catch((err)=>{
        res.status(400).send(err)
    })
})
//delet inventory item using item id
router.delete("/del-item-inventory/:id", (req, res)=>{
    customer_model.find({email:req.body.email}).then((data)=>{
        if(data.length){
            const Email = data;
            const res = Email.split("@")[1];
            if(res === "@techeagle.in"){
    inventory_model.find({_id: req.params._id}).then(()=> {
        res.status(200).send("Item deleted from inventory Sucessfully")
    }).catch((err)=> {
        res.status(400).send(err) 
    });
} else {
    res.status(400).send("Your are not authorized to Delete item")
}
 } else {
    res.status(400).send("Plese provide email")
}
})
})
module.exports = router;