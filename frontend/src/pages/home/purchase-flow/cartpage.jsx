import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
} from '@mui/material';

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

    const handleClearCart = () => {
        setCartItems([]);
    };

    const handleCheckout = () => {
        navigate('/paymentpage', { state: cartItems });
    };

    return (
        <Container sx={{ paddingTop: 4,paddingBottom: 4 }}>
            <Typography variant="h4" gutterBottom>
                Shopping Cart
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart.
            </Typography>
            {cartItems.length === 0 ? (
                <Typography variant="h6" color="text.secondary">
                    Your cart is empty.
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {cartItems.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': { transform: 'scale(1.03)' },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Price: ${item.price.toFixed(2)}
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
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleClearCart}
                        >
                            Clear Cart
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default CartPage;
