// product.js
import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    AppBar,
    Toolbar,
    IconButton,
    Badge
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";
import img4 from "./assets/img4.jpg";
import img5 from "./assets/img5.jpg";
import img6 from "./assets/img6.jpg";

const ProductList = [
    { id: "01", name: "Washing Dawn", image: img1, price: 65 },
    { id: "02", name: "Tata Tea", image: img2, price: 75 },
    { id: "03", name: "Tata Salt", image: img3, price: 30 },
    { id: "04", name: "Nescafe Gold Coffee", image: img4, price: 120 },
    { id: "05", name: "Surf Excel Matic", image: img5, price: 180 },
    { id: "06", name: "Fitness Dry Fruit", image: img6, price: 350 },
    { id: "07", name: "Washing Dawn", image: img1, price: 65 },
    { id: "08", name: "Tata Tea", image: img2, price: 75 },
    { id: "09", name: "Tata Salt", image: img3, price: 30 },
    { id: "10", name: "Nescafe Gold Coffee", image: img4, price: 120 },
    { id: "11", name: "Surf Excel Matic", image: img5, price: 180 },
    { id: "12", name: "Fitness Dry Fruit", image: img6, price: 350 },

];

export default function Product() {
    const [cartCount, setCartCount] = React.useState(0);
    const [loadingOrder, setLoadingOrder] = React.useState(false);

    // Payment handler using your backend endpoints
    const paymentHandler = async (e, item) => {
        e.preventDefault();
        try {
            setLoadingOrder(true);
            const pricePaise = item.price * 100;

            const option = {
                amount: pricePaise,
                currency: "INR",
                receipt: `rcpt_${Date.now()}`
            };

            // 1) create order on backend
            const orderResp = await fetch("http://localhost:5500/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(option),
            });
            const orderRes = await orderResp.json();

            // If your backend uses { success: true } style, adjust checks accordingly.
            if (!orderRes || orderRes.statusCode !== 200) {
                alert("Error creating order. Check backend logs.");
                setLoadingOrder(false);
                return;
            }

            // 2) prepare Razorpay options
            const rzpOptions = {
                key: "rzp_test_RdysQNuzfz5Z3F", // replace with your test key or load from env in real app
                amount: pricePaise,
                currency: "INR",
                name: "My Store",
                description: item.name,
                image: item.image,
                order_id: orderRes.body.id,
                handler: async function (response) {
                    // 3) validate payment with backend
                    try {
                        const validation = await fetch("http://localhost:5500/order/validate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });
                        const validateRes = await validation.json();
                        if (validateRes && validateRes.statusCode === 200) {
                            alert(`Payment Successful ✅\nProduct: ${item.name}\nAmount: ₹${item.price}`);
                            // optionally update UI, save order to DB, etc.
                        } else {
                            alert("Payment verification failed on server.");
                        }
                    } catch (err) {
                        console.error("Validation error:", err);
                        alert("Payment validation error.");
                    }
                },
                prefill: {
                    name: "Sr Kr",//Customer Name
                    email: "sag@gmail.com",//customer@example.com
                    contact: "9999999999",// customer phone no
                },
                notes: {
                    product_id: item.id,
                },
                theme: {
                    color: "#1976d2",
                },
            };

            // 4) open Razorpay checkout
            const rzp = new window.Razorpay(rzpOptions);
            rzp.on('payment.failed', function (response) {
                // show friendly error
                console.error("Payment failed:", response);
                alert(`Payment failed: ${response.error.reason || response.error.description}`);
            });
            rzp.open();
        } catch (err) {
            console.error("Payment flow error:", err);
            alert("Something went wrong with payment.");
        } finally {
            setLoadingOrder(false);
        }
    };

    const addToCart = (item) => {
        // simple cart counter - you can expand to real cart logic
        setCartCount((c) => c + 1);
        // optionally show toast/snackbar
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f6f7fb' }}>
            {/* Top Bar */}
            <AppBar position="sticky" color="default" elevation={1}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                            My Store
                        </Typography>
                        <Chip label="Free Delivery > ₹499" color="primary" />
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton aria-label="cart" size="large">
                            <Badge badgeContent={cartCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Page header */}
            <Box sx={{ py: 4, px: { xs: 2, md: 6 }, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    Featured & Best Selling
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Handpicked essentials — quality guaranteed. Secure payments via Razorpay.
                </Typography>
            </Box>

            {/* Product Grid */}
            <Box sx={{ px: { xs: 2, md: 6 }, pb: 6 }}>
                <Grid container spacing={3}>
                    {ProductList.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
                                    transition: 'transform .18s ease, box-shadow .18s ease',
                                    '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 10px 30px rgba(15,23,42,0.12)' },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.name}
                                    sx={{ height: 220, objectFit: 'contain', backgroundColor: '#fff' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 800 }}>
                                        ₹{item.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Great quality. Fast shipping. 7-day returns.
                                    </Typography>
                                </CardContent>

                                <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={(e) => paymentHandler(e, item)}
                                                disabled={loadingOrder}
                                                sx={{ textTransform: 'none', borderRadius: '10px' }}
                                            >
                                                Buy Now
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                onClick={() => addToCart(item)}
                                                sx={{ textTransform: 'none', borderRadius: '10px' }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ py: 3, textAlign: 'center', backgroundColor: '#fff' }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} My Store. Secure payments powered by Razorpay.
                </Typography>
            </Box>
        </Box>
    );
}
