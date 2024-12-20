import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Box, Button, TextField } from '@mui/material';

const PaymentPage = () => {
    const location = useLocation();
    const course = location.state; // بيانات الكورس المنقولة

    // حالة لتخزين بيانات الدفع
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });

    // دالة لتحديث بيانات الدفع
    const handlePaymentChange = (e) => {
        setPaymentDetails({
            ...paymentDetails,
            [e.target.name]: e.target.value,
        });
    };

    // دالة لتأكيد الدفع
    const handleConfirmPayment = () => {
        // هنا يمكن تنفيذ عملية الدفع الفعلية (مثل إرسال البيانات إلى السيرفر)
        alert(`Payment successful for ${course.name}!`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Payment Information
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6">Course: {course.name}</Typography>
                    <Typography variant="body1">Price: ${course.price}</Typography>
                </CardContent>
                {/* نموذج بيانات الدفع */}
                <Box mt={3} p={2} border={1} borderColor="primary.main" borderRadius={2}>
                    <Typography variant="h6" gutterBottom>
                        Enter Payment Details
                    </Typography>
                    <TextField
                        label="Card Number"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                    />
                    <TextField
                        label="Card Holder"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="cardHolder"
                        value={paymentDetails.cardHolder}
                        onChange={handlePaymentChange}
                    />
                    <TextField
                        label="Expiry Date"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="expiryDate"
                        value={paymentDetails.expiryDate}
                        onChange={handlePaymentChange}
                    />
                    <TextField
                        label="CVV"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                    />
                </Box>
                <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleConfirmPayment}
                    >
                        Confirm Payment
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default PaymentPage;
