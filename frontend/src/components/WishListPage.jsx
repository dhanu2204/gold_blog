import React from 'react';
import { useWishList } from './WishListContext.jsx';
import { useNavigate } from 'react-router-dom';

const WishListPage = () => {
    const { wishlist, removeFromWishlist } = useWishList();
    const nav = useNavigate();

    return (
        <div style={{ padding: '40px', backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#222' }}>❤️ My Wishlist</h1>
                    <button onClick={() => nav('/home')} style={{ padding: '10px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Continue Shopping
                    </button>
                </div>

                {wishlist.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                        <h2>Your wishlist is empty.</h2>
                        <p>Click the ❤️ button on any product to save it here!</p>
                    </div>
                ) : (
                    <div>
                        {wishlist.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderBottom: '1px solid #eee' }}>
                                <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />

                                <div style={{ flex: '1' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#222' }}>{item.name}</h3>
                                    <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>{item.karat}k Gold • {item.weightInGrams}g</p>
                                </div>

                                <button
                                    onClick={() => nav(`/products/${item.id}`)}
                                    style={{ padding: '8px 15px', background: '#222', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    View
                                </button>

                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    style={{ padding: '8px 15px', background: '#fff', color: 'red', border: '1px solid #ffcccc', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishListPage;
