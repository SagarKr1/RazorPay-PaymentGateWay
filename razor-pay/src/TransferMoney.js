import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Stack,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import razorpayLogo from "./assets/razorpay-logo.jpg"; // put your logo in src/assets

export default function TransferMoney() {
    const [form, setForm] = useState({
        account_number: "",
        ifsc: "",
        name: "",
        amount: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5500/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            console.log("Transfer Response:", data);

            if (data.statusCode === 200) {
                alert("✅ Transfer successful via RazorpayX!");
            } else {
                alert("❌ Transfer failed: " + (data.body || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Server error or invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}
        >
            <Card
                sx={{
                    width: 420,
                    borderRadius: 3,
                    boxShadow: 5,
                    backgroundColor: "white",
                }}
            >
                <CardContent>
                    <Stack alignItems="center" mb={3}>
                        <AccountBalanceWalletIcon
                            sx={{ fontSize: 50, color: "#1976d2", mb: 1 }}
                        />
                        <Typography variant="h5" fontWeight="bold">
                            RazorpayX Money Transfer
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Secure Instant Bank Transfers
                        </Typography>
                        <img
                            src={razorpayLogo}
                            alt="Razorpay"
                            style={{ width: 120, marginTop: 10 }}
                        />
                    </Stack>

                    <form onSubmit={handleTransfer}>
                        <TextField
                            label="Account Number"
                            variant="outlined"
                            fullWidth
                            name="account_number"
                            value={form.account_number}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="IFSC Code"
                            variant="outlined"
                            fullWidth
                            name="ifsc"
                            value={form.ifsc}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Account Holder Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Amount (INR)"
                            variant="outlined"
                            fullWidth
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            margin="normal"
                            required
                            type="number"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 2,
                                py: 1.2,
                                backgroundColor: "#1976d2",
                                "&:hover": { backgroundColor: "#1565c0" },
                            }}
                        >
                            {loading ? "Processing..." : "Transfer Money"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
