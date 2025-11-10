const express = require('express');
const razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
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

app.post("/order/validate", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(req.body);
    const sha = crypto.createHmac("sha256", process.env.key_secret);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
        res.json({
            statusCode: 400,
            body: "payment fail"
        })
    } else {
        res.json({
            statusCode: 200,
            body: "payment success"
        })
    }
})


app.post('/transfer', async (req, res) => {
    try {
        console.log(req.body);
        const { account_number, ifsc, name, amount } = req.body;

        if (!account_number || !ifsc || !name || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // RazorpayX API endpoint
        const url = "https://api.razorpay.com/v1/payouts";

        // Create payout request
        const payoutData = {
            account_number: process.env.RAZORPAYX_ACCOUNT, // Your virtual account no. from RazorpayX
            fund_account: {
                account_type: "bank_account",
                bank_account: {
                    name: name,
                    ifsc: ifsc,
                    account_number: account_number
                },
                contact: {
                    name: name,
                    type: "employee",
                    contact: "9999999999",
                    email: "test@example.com"
                }
            },
            amount: amount * 100, // convert to paise
            currency: "INR",
            mode: "IMPS",
            purpose: "payout",
            queue_if_low_balance: true,
        };

        // API call
        const response = await axios.post(url, payoutData, {
            auth: {
                username: process.env.key_id,
                password: process.env.key_secret
            }
        });

        res.json({ success: true, data: response.data });

    } catch (error) {
        console.error("Payout error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.error?.description || "Transfer failed",
        });
    }
});

// ✅ Validate transfer (optional)
app.get('/transfer/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://api.razorpay.com/v1/payouts/${id}`;

        const response = await axios.get(url, {
            auth: {
                username: process.env.key_id,
                password: process.env.key_secret
            }
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch transfer status"
        });
    }
});



app.listen(port, () => console.log("Server Started at ", port));