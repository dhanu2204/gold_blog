import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import { useWishList } from './WishListContext.jsx';

const Navbar = () => {
    const nav = useNavigate();
    const { cart } = useCart();
    const { wishlist } = useWishList();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("jwttoken");
        localStorage.removeItem("userPhone");
        localStorage.removeItem("userRole");
        setMenuOpen(false);
        nav("/login");
    };

    const handleNavigate = (path) => {
        setMenuOpen(false);
        nav(path);
    };

    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
        return null;
    }

    const isAdmin = localStorage.getItem('userRole') === 'ROLE_ADMIN';

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.06)' }}>
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '14px clamp(16px, 4vw, 45px)', 
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%'
            }}>
                <div 
                    onClick={() => handleNavigate('/home')} 
                    style={{ 
                        fontFamily: '"Cormorant Garamond", serif', 
                        fontSize: 'clamp(1.3rem, 3.5vw, 2.1rem)', 
                        fontWeight: '700', 
                        letterSpacing: '1.5px', 
                        cursor: 'pointer', 
                        color: '#222',
                        whiteSpace: 'nowrap'
                    }}
                >
                    BASAVESHWARA <span style={{ color: '#d4af37' }}>JEWELS</span>
                </div>

                <div className="desktop-nav" style={{ 
                    display: 'flex', 
                    gap: 'clamp(15px, 2vw, 30px)', 
                    alignItems: 'center', 
                    fontSize: '0.85rem', 
                    color: '#333', 
                    fontWeight: '600', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px' 
                }}>
                    
                    
                    <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => window.open('https://maps.app.goo.gl/eQbRTCVFSWV64RSo8?g_st=aw', '_blank')}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    Stores
</span>


                    <div onClick={() => handleNavigate('/wishlist')} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        Wishlist
                        {wishlist.length > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#d4af37', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '0.7rem' }}>
                                {wishlist.length}
                            </span>
                        )}
                    </div>

                    <div onClick={() => handleNavigate('/cart')} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        Cart
                        {cart.length > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#222', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '0.7rem' }}>
                                {cart.length}
                            </span>
                        )}
                    </div>

                    <span onClick={() => handleNavigate('/orders')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        Orders
                    </span>

                    {isAdmin && (
                        <span onClick={() => handleNavigate('/admin')} style={{ cursor: 'pointer', color: '#d4af37', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            Admin
                        </span>
                    )}

                    <span onClick={handleLogout} style={{ cursor: 'pointer', color: '#c0392b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Logout
                    </span>
                </div>

                {/* Mobile Quick Action Buttons & Menu Toggle */}
                <div className="mobile-nav-actions" style={{ display: 'none', alignItems: 'center', gap: '15px' }}>
                    <div onClick={() => handleNavigate('/wishlist')} style={{ position: 'relative', cursor: 'pointer', color: '#333' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        {wishlist.length > 0 && (
                            <span style={{ position: 'absolute', top: '-6px', right: '-10px', backgroundColor: '#d4af37', color: 'white', borderRadius: '50%', padding: '1px 5px', fontSize: '0.65rem' }}>
                                {wishlist.length}
                            </span>
                        )}
                    </div>

                    <div onClick={() => handleNavigate('/cart')} style={{ position: 'relative', cursor: 'pointer', color: '#333' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        {cart.length > 0 && (
                            <span style={{ position: 'absolute', top: '-6px', right: '-10px', backgroundColor: '#222', color: 'white', borderRadius: '50%', padding: '1px 5px', fontSize: '0.65rem' }}>
                                {cart.length}
                            </span>
                        )}
                    </div>

                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        aria-label="Toggle navigation menu"
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#222', 
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {menuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Drawer */}
            {menuOpen && (
                <div style={{
                    backgroundColor: '#fff',
                    borderTop: '1px solid #eee',
                    padding: '15px 20px 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
                }}>
                    <div onClick={() => handleNavigate('/orders')} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontWeight: '600', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        📦 My Orders
                    </div>
                    <div onClick={() => { setMenuOpen(false); window.open('https://maps.app.goo.gl/eQbRTCVFSWV64RSo8?g_st=aw', '_blank'); }} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontWeight: '600', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
    📍 Store Location
</div>

                    {isAdmin && (
                        <div onClick={() => handleNavigate('/admin')} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontWeight: '700', color: '#d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            ⚙️ Admin Portal
                        </div>
                    )}
                    <div onClick={handleLogout} style={{ padding: '10px 0', fontWeight: '700', color: '#c0392b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🚪 Sign Out
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
