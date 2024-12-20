export const getCartItems = () => JSON.parse(localStorage.getItem('cartItems')) || [];
export const saveCartItems = (items) => localStorage.setItem('cartItems', JSON.stringify(items));
export const clearCartItems = () => localStorage.removeItem('cartItems');
