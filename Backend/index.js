const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./db/Users');
const Product = require("./db/Product");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtKey = 'e-comm'

require('./db/config');

const app = express();
app.use(express.json());
app.use(cors())


app.post("/register", async (req, res) => {

    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        })

        user.save().then(result => {
            result = result.toObject();
            delete result.password
            jwt.sign({result}, jwtKey, {expiresIn:"2h"}, (err, token) => {
                if(err){
                    res.send("Something went wrong");
                }
                res.status(201).send({result, auth:token});
            }) 
        }).catch(err => {
            res.status(500).json({
                message: 'Invalid Authentication Credentials !'
            })
        })
    })

})

app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email){
        let user = await User.findOne({ email: req.body.email });
        // Validate the supplied user password
	    const valid = await bcrypt.compare(req.body.password, user.password);
        if(valid && user){
            jwt.sign({user}, jwtKey, {expiresIn:"2h"}, (err, token) => {
                if(err){
                    res.send("Something went wrong");
                }
                res.send({user, auth:token});
            }) 
        }
        else{
            res.send("Username or Password Incorrect");
        }
    }
    else{
        res.send("Email or Password Missing")
    } 
})

app.post("/add-product", verifyToken, async (req, res) => {
    console.log(req.body);
    let product = new Product(req.body);
    let result = await product.save();

    res.send(result);
})   

app.get("/products", verifyToken, async (req, res) => {
    //let user = JSON.parse(req.headers['user'])
    //const id = user._id
    let products = await Product.find();
    if(products.length>0){
        res.send(products)
    }else{
        res.send({result: "No Products Found"})
    }

})

app.delete("/product/:id", verifyToken, async (req, res) => {
    const id = req.params.id
    const result = await Product.deleteOne({_id: id})
    res.send(result);
})

app.get("/product/:id", verifyToken, async (req, res) => {
    let result = await Product.findOne({_id:req.params.id})
    console.log(req.params.id)
    if(result){
        res.send(result)
    }else{
        res.send({result: "No Product Found"})
    }
})

app.put("/product/:id", verifyToken, async (req, res) => {
    let result = await Product.updateOne(
        {_id:req.params.id},
        {
            $set : req.body
        }
    )
    res.send(result);
})

app.get("/search/:key", verifyToken, async(req, res) => {
    let result = await Product.find({
        "$or":[
            { name: {$regex: req.params.key }},
            { category: {$regex: req.params.key }},
            { company: {$regex: req.params.key }},
        ]
    })
    res.send(result);
})

function verifyToken(req, res, next){
    //console.warn('Middleware')
    let token = req.headers['authorization']
    if(token){
        token = token.split(' ')[1];
        jwt.verify(token, jwtKey, (err, success) => {
            if(err){
                res.status(401).send({result:"Please add valid token"})
            }else{
                next()
            }
        })
    }else{
        res.status(403).send({result:"Please add token with header"})
    }
   
}

app.listen(5000)