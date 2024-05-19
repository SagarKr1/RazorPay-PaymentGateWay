import React from 'react';
import img1 from "./assets/img1.jpg"
import img2 from "./assets/img2.jpg"
import img3 from "./assets/img3.jpg"
import img4 from "./assets/img4.jpg"
import img5 from "./assets/img5.jpg"
import img6 from "./assets/img6.jpg"


const ProductList = [
    {
        "id": "01",
        "name": "washing Dawn",
        "image": img1,
        "price": 65
    },
    {
        "id": "02",
        "name": "Tata Tea",
        "image": img2,
        "price": 75
    },
    {
        "id": "03",
        "name": "Tata Salt",
        "image": img3,
        "price": 30
    },
    {
        "id": "04",
        "name": "NesCafe Gold Coffee",
        "image": img4,
        "price": 120
    },
    {
        "id": "05",
        "name": "Surf Excel Matic",
        "image": img5,
        "price": 180
    },
    {
        "id": "06",
        "name": "Fitness Dry Fruit",
        "image": img6,
        "price": 350
    }
]

export default function Product() {
    const [Product,setProduct] = React.useState({});
    
    const paymentHandler = async (e,item) => {
        console.log(item.price);
        console.log(e);
        console.log("Clicked");
        const price = item.price*100
        const option = {
            "amount": price,
            "currency": "INR",
            "receipt": "qwsaq1"
        }

        const Order = await fetch("http://localhost:5500/order", {
            method: "POST",
            body: JSON.stringify(option),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const orderRes = await Order.json();
        console.log(orderRes);

        if(orderRes.statusCode!==200){
            alert("Got Some error");
            return ;
        }

        var optionRazor = {
            "key": "rzp_test_yO9YTGR9dAmVv3",
            "amount": price,
            "currency": "INR",
            "name": "Dj Al",
            "description": "Hello this for testing",
            "image": "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/img/start.png",
            "order_id": orderRes.body.id,
            "handler": async function (response) {
                console.log(response);
                const data = {
                    ...response
                }
                const validation = await fetch("http://localhost:5500/order/validate", {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const validateRes = await validation.json();
                console.log(validateRes);
                if(validateRes.statusCode==200){
                    alert("Success")
                }else{
                    alert("Fail")
                }
            },
            "prefill": {
                name: "Haku",
                email: "haku@gmail.com",
                contact: "9000000000"
            },
            "notes": {
                address: "Razorpay Corporate Office"
            },
            "theme": {
                color: "#3399cc"
            }
        }
        var rzp1 = new window.Razorpay(optionRazor);

        rzp1.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });

        rzp1.open();
        e.preventDefault();
    }
    return (
        <div style={{ display: "grid" }}>
            {
                ProductList.map((item) => {
                    return (
                        <div key={item.id} style={{ marginBottom: 20 }}>
                            <img src={item.image} style={{ height: 200 }} alt={item.name}></img>
                            <div>
                                Name :{item.name}<br />
                                Price :{item.price}
                            </div>
                            <button onClick={(e)=>paymentHandler(e,item)}>Pay</button>
                        </div>
                    )
                })
            }
        </div>
    )
}
