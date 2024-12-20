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
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { getCartItems, saveCartItems, clearCartItems as clearCartUtil } from '../../../utils/storage';
import { useTheme } from '@emotion/react';


const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const items = getCartItems();
        setCartItems(items);
    }, []);

    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        saveCartItems(updatedCart);
    };

    const handleClearCart = () => {
        setCartItems([]);
        clearCartUtil();
    };

    const handleCheckout = () => {
        navigate('/paymentpage', { state: cartItems });
    };

    return (
        <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}
>
        <Container
            sx={{
                paddingTop: 4,
                margin:4,
                alignSelf: 'center',
                paddingBottom: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                <ShoppingCartIcon sx={{ fontSize: 40, verticalAlign: 'middle', marginRight: 1 }} />
                Shopping Cart
            </Typography>
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
                You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart.
            </Typography>
            {cartItems.length === 0 ? (
                <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Your cart is empty.
                </Typography>
            ) : (
                <>
                    <Grid
                        container
                        spacing={3}
                        justifyContent={cartItems.length <= 2 ? 'center' : 'flex-start'}
                    >
                        {cartItems.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        border: '1px solid #ddd',
                                        transition: 'transform 0.3s ease-in-out',
                                        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#ffffff',
                                        '&:hover': { transform: 'scale(1.05)', boxShadow: 5 },
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ textAlign: 'center', fontWeight: 'bold' }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textAlign: 'center', marginBottom: 1 }}
                                        >
                                            Price: ${item.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center' }}>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 4,
                            padding: 2,
                            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#ffffff',
                            '&:hover': { boxShadow: 5 },
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<ClearAllIcon />}
                            onClick={handleClearCart}
                        >
                            Clear Cart
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                            sx={{ fontWeight: 'bold' }}
                        >
                            Checkout
                        </Button>
                    </Box>
                </>
            )}
        </Container>
        </Box>
    );
};

export default CartPage;
