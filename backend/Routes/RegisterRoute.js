const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const jwt = require("jsonwebtoken")

const customer_model = require('../Modules/RegisterPage')

const salt = 10

router.post("/Register", async (req, res) => {
  //checking email is unique or not
  const Email = await customer_model.find({ email: req.body.email })
  if (Email.length) {
    res.status(400).send("EmailExist")
  }
  else {
    // generating salt        
    bcrypt.genSalt(salt, (salterr, saltval) => {
      if (!salterr) {
        // generating hashvalue
        bcrypt.hash(req.body.password, saltval, (hasherr, hasval) => {
          if (!hasherr) {
            // creating user
            customer_model.create({
              username: req.body.username,
              email: req.body.email,
              password: hasval,
            }).then((data) => {
              res.status(200).send(data)
            }).catch((err) => {
              res.status(400).send(err)
            })
          }
          else {
            res.status(400).send("hasherr")
          }
        })
      } else {
        res.status(400).send("salterr")
      }
    }) // saltclosing 
  }
}) // registerclosing


//Login

router.post("/login", async(req, res) => {
    // check the user email
  const signindata = await customer_model.find({email:req.body.email})
  // console.log(signindata)
     if(signindata.length){
       const data = await bcrypt.compare(req.body.password,signindata[0].password)
         if(data){
          //generating token
             const Authtoken=jwt.sign(signindata[0].email, process.env.SECRET_KEY)
             res.status(200).send({Authtoken: Authtoken})
          }
          else{
             res.status(400).send("Invalid password")
          }
      }
      else{
        res.status(400).send(`Invalid User`)
      }
})
// to get user data
router.get("/user", (req, res) => {
  try {
    const user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    customer_model.find({ email: user }).then((data) => {
      // if user is authorized then we get user data
      res.status(200).send({ user: data });
    }).catch((err) => {
      res.status(400).send(err);
    })
  } catch (err) {
    //if user is not authorized err message will be displaied
    res.status(400).send("Unauthorize user", err)
  }

})

module.exports = router