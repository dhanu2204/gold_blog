import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useCart} from './CartContext.jsx'
import { useWishList } from './WishListContext.jsx';

const ProductDetails = () => {
    const {addToCart} = useCart();
    const { addToWishlist } = useWishList();

    const { id } = useParams();
    const nav = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [goldPrice, setGoldPrice] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products/${id}`);
                if (res.ok) setProduct(await res.json());
            } catch (e) {
                console.error(e);
            }
        };

        const fetchGoldPrice = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PRICEURL}api/prices/liveprice`);
                if (res.ok) setGoldPrice(await res.text());
            } catch (e) {
                console.error(e);
            }
        };

        fetchProduct();
        fetchGoldPrice();
    }, [id]);

    if (!product) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#555' }}>Loading...</div>;

    const currentPrice = goldPrice ? (parseFloat(goldPrice) * product.weightInGrams).toFixed(2) : "Calculating...";

    return (
        <div style={{ padding: '40px', backgroundColor: '#fafafa', minHeight: '100vh', color: '#333' }}>
            
            <button onClick={() => nav(-1)} style={{ padding: '10px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to Catalog
            </button>

            <div style={{ display: 'flex', gap: '50px', background: '#fff', padding: '50px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                
                <div style={{ flex: '1', position: 'relative' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}  />
                    
                    <a 
                        href={product.imageUrl} 
                        download={product.name}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            background: '#fff',
                            color: '#333',
                            padding: '10px 15px',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            border: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download
                    </a>
                </div>

                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    
                    <p style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '5px' }}>{product.category}</p>
                    <h1 style={{ fontSize: '2.5rem', margin: '0 0 15px 0', color: '#222' }}>{product.name}</h1>
                    
                    <div style={{ margin: '20px 0', padding: '20px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '10px' }}><strong>Purity:</strong> {product.karat}k Gold</p>
                        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '10px' }}><strong>Weight:</strong> {product.weightInGrams}g</p>
                        <p style={{ fontSize: '2.5rem', color: '#d4af37', marginTop: '20px', fontWeight: 'bold' }}>
                            ₹{currentPrice}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button 
                            onClick={() => addToCart(product, currentPrice)}
                            style={{ flex: '1', padding: '15px', fontSize: '1.1rem', background: '#222', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            Add to Cart
                        </button>

                        <button 
                            onClick={() => addToWishlist(product)}
                            style={{ flex: '1', padding: '15px', fontSize: '1.1rem', background: '#fff', color: '#222', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            Wishlist
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
