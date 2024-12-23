import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { checkLogin } from "../../../services/users";
import { enrollCourses } from "../../../services/courses"; // Import enrollCourses
import { removeCartItem } from "../../../utils/storage";

const PaymentPage = () => {
  const location = useLocation();
  const user = checkLogin();
  const userId = user.id;
  const cartItems = location.state || [];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);

  const validate = () => {
    const errors = {};
    if (!paymentDetails.cardNumber.match(/^\d{16}$/)) {
      errors.cardNumber = "Card number must be 16 digits.";
    }
    if (!paymentDetails.cardHolder.trim()) {
      errors.cardHolder = "Card holder name is required.";
    }
    if (!paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.expiryDate = "Expiry date must be in MM/YY format.";
    } else {
      const [month, year] = paymentDetails.expiryDate.split("/");
      const expiry = new Date(`20${year}`, month - 1);
    }
    if (!paymentDetails.cvv.match(/^\d{3,4}$/)) {
      errors.cvv = "CVV must be 3 or 4 digits.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  const handleConfirmPayment = async () => {
    if (validate()) {
      setLoading(true);
      try {
        // Simulate payment process
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Enroll user in courses after payment
        const courseIds = cartItems.map((item) => item._id);
        const enrollmentResponse = await enrollCourses(userId, courseIds);
        alert(
          `Payment successful for total: $${totalPrice}!\n${enrollmentResponse.message}`
        );

        cartItems.forEach((item) => removeCartItem(item._id));
        console.log("Cart items removed:", cartItems);
        navigate("/courses");
      } catch (error) {
        alert(`Payment failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Payment Summary
      </Typography>
      <Card sx={{ boxShadow: 3, marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Receipt
          </Typography>
          <Box sx={{ maxHeight: "200px", overflowY: "auto", marginBottom: 2 }}>
            {cartItems.map((item, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                borderBottom="1px solid #ddd"
                paddingY={1}
              >
                <Typography variant="body1">{item.title}</Typography>
                <Typography variant="body1">
                  ${item.price.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="h6" align="right">
            Total: ${totalPrice}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom align="center">
        Choose Payment Method
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant={
              selectedPaymentMethod === "visa" ? "contained" : "outlined"
            }
            color="primary"
            onClick={() => setSelectedPaymentMethod("visa")}
          >
            Visa
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={
              selectedPaymentMethod === "google-pay" ? "contained" : "outlined"
            }
            color="secondary"
            onClick={() => setSelectedPaymentMethod("google-pay")}
          >
            Google Pay
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={
              selectedPaymentMethod === "apple-pay" ? "contained" : "outlined"
            }
            color="success"
            onClick={() => setSelectedPaymentMethod("apple-pay")}
          >
            Apple Pay
          </Button>
        </Grid>
      </Grid>

      {selectedPaymentMethod === "visa" && (
        <Box mt={4}>
          <Cards
            acceptedCards={["visa", "mastercard"]}
            number={paymentDetails.cardNumber}
            name={paymentDetails.cardHolder}
            expiry={paymentDetails.expiryDate.replace("/", "")}
            cvc={paymentDetails.cvv}
            focused={focusedField}
          />
          <Box
            mt={4}
            p={2}
            border={1}
            borderColor="primary.main"
            borderRadius={2}
          >
            <Typography variant="h6" gutterBottom>
              Visa Payment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Card Number"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                  onFocus={() => setFocusedField("number")}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Card Holder"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  name="cardHolder"
                  value={paymentDetails.cardHolder}
                  onChange={handlePaymentChange}
                  onFocus={() => setFocusedField("name")}
                  error={!!errors.cardHolder}
                  helperText={errors.cardHolder}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expiry Date (MM/YY)"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handlePaymentChange}
                  onFocus={() => setFocusedField("expiry")}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentChange}
                  onFocus={() => setFocusedField("cvc")}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleConfirmPayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {selectedPaymentMethod === "google-pay" && (
        <Typography variant="body1" align="center" mt={4}>
          Proceed with Google Pay through your device.
        </Typography>
      )}

      {selectedPaymentMethod === "apple-pay" && (
        <Typography variant="body1" align="center" mt={4}>
          Proceed with Apple Pay through your device.
        </Typography>
      )}
    </Container>
  );
};

export default PaymentPage;
