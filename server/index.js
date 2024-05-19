const express = require('express');
const razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();


const app = express();
const port = process.env.port;
// console.log(process.env.PORT)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.post("/order", async (req, res) => {
    try {
        const payment = new razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        })
        const option = req.body;
        console.log(req.body);
        const order = await payment.orders.create(option)
        res.json({
            statusCode: 200,
            body: order
        })
    } catch (e) {
        res.json({
            statusCode: 500,
            body: e.message
        })
    }
})

app.post("/order/validate",(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}= req.body;
    console.log(req.body);
    const sha = crypto.createHmac("sha256",process.env.key_secret);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if(digest !==razorpay_signature){
        res.json({
            statusCode:400,
            body:"payment fail"
        })
    }else{
        res.json({
            statusCode:200,
            body:"payment success"
        })
    }
})


app.listen(port, () => console.log("Server Started at ", port));