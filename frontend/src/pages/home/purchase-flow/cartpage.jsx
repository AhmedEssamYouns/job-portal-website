import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const fakeCourses = [
    { id: 1, name: 'React for Beginners', price: 29.99 },
    { id: 2, name: 'Advanced JavaScript', price: 49.99 },
    { id: 3, name: 'Node.js and Express', price: 39.99 },
    { id: 4, name: 'Python for Data Science', price: 59.99 },
    { id: 5, name: 'HTML & CSS Basics', price: 19.99 },
];

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCartItems(fakeCourses);
    }, []);

    const handleRemoveItem = (itemId) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
    };

    const handlePayNow = (course) => {
       
        navigate('/paymentpage', { state: course });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Shopping Cart
            </Typography>
            {cartItems.length === 0 ? (
                <Typography variant="h6">Your cart is empty.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {cartItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Price: ${item.price}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        Remove
                                    </Button>
                                    <Button
                                        size="small"
                                        color="primary"
                                        variant="contained"
                                        onClick={() => handlePayNow(item)}
                                    >
                                        Pay Now
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CartPage;
