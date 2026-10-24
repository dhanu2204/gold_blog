import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import { useWishList } from './WishListContext.jsx';

const Navbar = () => {
    const nav = useNavigate();
    const { cart } = useCart();
    const { wishlist } = useWishList();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("jwttoken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        nav("/login");
    }

    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
        return null;
    }

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '20px 50px', 
            backgroundColor: '#fff', 
            boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
            position: 'sticky', 
            top: 0,
            zIndex: 1000 
        }}>
            <div 
                onClick={() => nav('/home')} 
                style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', color: '#222' }}
            >
                BASAVESHWARA <span style={{ color: '#d4af37' }}>JEWELS</span>
            </div>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '0.9rem', color: '#333', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
                
                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Search feature coming soon!')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    Search
                </span>
                
                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Store Locator coming soon!')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Stores
                </span>

                <div onClick={() => nav('/wishlist')} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    Wishlist
                    {wishlist.length > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#d4af37', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '0.7rem' }}>
                            {wishlist.length}
                        </span>
                    )}
                </div>

                <div onClick={() => nav('/cart')} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Cart
                    {cart.length > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#222', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '0.7rem' }}>
                            {cart.length}
                        </span>
                    )}
                </div>

                <span onClick={() => nav('/orders')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    Orders
                </span>
                {localStorage.getItem('userRole') === 'ROLE_ADMIN' && (
    <span onClick={() => nav('/admin')} style={{ cursor: 'pointer', color: '#d4af37', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        Admin
    </span>
)}
                <span onClick={handleLogout} style={{ cursor: 'pointer', color: '#c0392b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                </span>
            </div>
        </nav>
    );
};

export default Navbar;
