import React from 'react';
import { useCart } from './CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const nav = useNavigate();

    const cartTotal = cart.reduce((total, item) => total + parseFloat(item.estimatedPrice), 0).toFixed(2);

            const handleOrders = async () => {
        const phone = localStorage.getItem("userPhone");
        if (!phone) {
            toast.error("Please log in to checkout!");
            nav("/login");
            return;
        }

        const orderPayload = cart.map(item => ({
            userPhone: phone,
            productId: item.id,
            productName: item.name,
            karat: item.karat,
            weightInGrams: item.weightInGrams,
            totalAmount: item.estimatedPrice
        }));

        try {
            const response = await fetch(`${import.meta.env.VITE_ORDERSURL}api/orders/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok) {
                toast.success("Checkout Successful! Your order has been placed. 🎉");
                clearCart();
                nav("/home"); 
            } else {
                toast.error("Checkout failed. Please try again.");
            }
        } catch (error) {
            toast.error("Server is down! Is order-service running?");
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#fafafa', minHeight: '100vh', color: '#333', fontFamily: 'sans-serif' }}>
            
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#222' }}>Your Shopping Cart</h1>
                    <button onClick={() => nav('/home')} style={{ padding: '10px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Continue Shopping
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                        <h2>Your cart is empty.</h2>
                        <p>Looks like you haven't added any jewelry yet!</p>
                    </div>
                ) : (
                    <div>
                        {cart.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderBottom: '1px solid #eee' }}>
                                <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                                
                                <div style={{ flex: '1' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#222' }}>{item.name}</h3>
                                    <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>{item.karat}k Gold • {item.weightInGrams}g</p>
                                </div>

                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d4af37' }}>
                                    ₹{item.estimatedPrice}
                                </div>

                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ padding: '8px 15px', background: '#fff', color: 'red', border: '1px solid #ffcccc', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '20px' }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', padding: '30px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
                            <div>
                                <p style={{ margin: 0, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Estimated Total</p>
                                <h2 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', color: '#222' }}>₹{cartTotal}</h2>
                            </div>

                            <button 
                                onClick={handleOrders}
                                style={{ padding: '15px 40px', fontSize: '1.2rem', background: '#222', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
