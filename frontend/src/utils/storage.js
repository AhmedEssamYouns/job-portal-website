export const getCartItems = () => JSON.parse(localStorage.getItem('cartItems')) || [];
export const saveCartItems = (items) => localStorage.setItem('cartItems', JSON.stringify(items));
export const getCartItemsLength = () => getCartItems().length;
export const clearCartItems = () => localStorage.removeItem('cartItems');
export const removeCartItem = (itemId) => {
    const cartItems = getCartItems();
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    saveCartItems(updatedCartItems);
    return updatedCartItems; 
};