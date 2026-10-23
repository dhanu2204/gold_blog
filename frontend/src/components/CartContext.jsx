import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('jewelry_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('jewelry_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, estimatedPrice) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            toast.error('item alread exists in the cart!')
            console.log('This item is already in your cart.');
            return ;
        }
        toast.success('added to cart')
        console.log(`${product.name} added to cart.`);
        setCart((prevCart) => {
            return [...prevCart, { ...product, estimatedPrice }];
        });
    };
    
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    }
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
