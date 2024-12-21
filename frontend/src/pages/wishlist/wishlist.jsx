import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const WishList = () => {
    const navigate = useNavigate(); 
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState([]); 

    useEffect(() => {
        const fakeWishlist = [
            { id: 1, name: 'Product 1', price: '$100' },
            { id: 2, name: 'Product 2', price: '$150' },
            { id: 3, name: 'Product 3', price: '$200' },
        ];
        setWishlist(fakeWishlist);
    }, []);

    const handleRemoveItem = (itemId) => {
        const updatedWishlist = wishlist.filter((item) => item.id !== itemId);
        setWishlist(updatedWishlist);
    };

    const handleAddToCart = (item) => {
        setCart([...cart, item]); 
        navigate('/cart', { state: [...cart, item] }); 
    };
 
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Wishlist
            </Typography>
            {wishlist.length === 0 ? (
                <Typography>No items in wishlist.</Typography>
            ) : (
                <List>
                    {wishlist.map((item) => (
                        <ListItem key={item.id} sx={{ borderBottom: '1px solid #ccc' }}>
                            <ListItemText primary={item.name} secondary={`Price: ${item.price}`} />
                            <IconButton onClick={() => handleRemoveItem(item.id)} edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                            <IconButton 
                                onClick={() => handleAddToCart(item)} 
                                edge="end" 
                                aria-label="add to cart"
                                sx={{ marginLeft: 1 }}
                            >
                                <ShoppingCartIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default WishList;
