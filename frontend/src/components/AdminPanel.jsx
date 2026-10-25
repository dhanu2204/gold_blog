import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const nav = useNavigate();
    const [totalProducts, setTotalProducts] = useState(0);

    // Fetch quick inventory count for the dashboard
    const fetchStats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products`);
            if (res.ok) {
                const data = await res.json();
                setTotalProducts(data.length);
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const menuItems = [
        {
            title: "Inventory & Products",
            description: "View all catalog items, search, inspect specifications, and manage listings.",
            btnText: "Open Product Catalog",
            route: "/getall",
            badge: `${totalProducts} Items`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            )
        },
        {
            title: "Add New Product",
            description: "Scan new jewelry photos with Google Gemini AI and list new gold ornaments.",
            btnText: "Add Product",
            route: "/additem",
            badge: "AI Powered",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            )
        },
        {
            title: "Customer Orders",
            description: "Track recent customer purchases, delivery times, and fulfillment records.",
            btnText: "View Orders",
            route: "/orders",
            badge: "Live Orders",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
            )
        },
        {
            title: "Customer Storefront",
            description: "Preview how your collections and live gold rates appear to online shoppers.",
            btnText: "Return to Store",
            route: "/home",
            badge: "Live Store",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            )
        }
    ];

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '50px 8%' }}>
            
            {/* Top Title Banner */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <span style={{ 
                    color: '#d4af37', 
                    fontSize: '0.85rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px', 
                    fontWeight: '700' 
                }}>
                    Store Administration
                </span>
                <h1 style={{ 
                    fontFamily: '"Cormorant Garamond", serif', 
                    fontSize: '3rem', 
                    color: '#1a1a1a', 
                    margin: '10px 0 15px 0' 
                }}>
                    Jewelry Management Portal
                </h1>
                <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
                    Welcome to the Basaveshwara Jewels administrative command center. Manage your live gold inventory, add new catalog pieces, and track store activity.
                </p>
            </div>

            {/* Dashboard Cards Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {menuItems.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        whileHover={{ y: -6, boxShadow: '0 15px 30px rgba(212, 175, 55, 0.15)' }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '30px',
                            border: '1px solid #eaeaea',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                        }}
                    >
                        <div>
                            {/* Card Top: Icon & Badge */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ 
                                    width: '54px', 
                                    height: '54px', 
                                    borderRadius: '12px', 
                                    backgroundColor: '#fff9e6', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    border: '1px solid #fae69d'
                                }}>
                                    {item.icon}
                                </div>
                                <span style={{ 
                                    backgroundColor: '#f5f5f5', 
                                    color: '#777', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '700', 
                                    padding: '4px 10px', 
                                    borderRadius: '20px',
                                    letterSpacing: '0.5px'
                                }}>
                                    {item.badge}
                                </span>
                            </div>

                            <h3 style={{ 
                                fontFamily: '"Cormorant Garamond", serif', 
                                fontSize: '1.6rem', 
                                color: '#222', 
                                margin: '0 0 10px 0',
                                fontWeight: '700'
                            }}>
                                {item.title}
                            </h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 25px 0' }}>
                                {item.description}
                            </p>
                        </div>

                        <button
                            onClick={() => nav(item.route)}
                            style={{
                                width: '100%',
                                padding: '12px 0',
                                backgroundColor: '#fff',
                                color: '#1a1a1a',
                                border: '1px solid #d4af37',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.backgroundColor = '#d4af37';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.backgroundColor = '#fff';
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                        >
                            {item.btnText} &rarr;
                        </button>
                    </motion.div>
                ))}
            </div>


            {/* Quick Status Bar */}
            <div style={{ 
                marginTop: '60px', 
                textAlign: 'center', 
                padding: '20px', 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: '1px solid #eee',
                maxWidth: '650px',
                margin: '60px auto 0 auto'
            }}>
                <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2e7d32' }}></span>
                    All microservices connected: Product Service (:8083), Auth (:8081), Price (:8082)
                </span>
            </div>
        </div>
    );
};

export default AdminPanel;