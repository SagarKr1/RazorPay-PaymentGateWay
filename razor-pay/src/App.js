// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import Product from "./product";
import TransferMoney from "./TransferMoney";

function App() {
  return (
    <Router>
      <Box sx={{ backgroundColor: "#f6f7fb", minHeight: "100vh" }}>
        <AppBar position="sticky" color="primary" sx={{ boxShadow: 3 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              🛍️ SmartMart
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Products
              </Button>
              <Button
                component={Link}
                to="/transfer"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Transfer Money
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/transfer" element={<TransferMoney />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
