import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AllProducts = () => {
    const nav = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch all products from Spring Boot product-service
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
                setCategories(uniqueCategories);
            } else {
                toast.error('Could not fetch products from server');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Network error connecting to product service');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(`Are you sure you want to permanently delete "${name}" (ID: ${id})?`);
        if (!confirmed) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success(`Deleted "${name}" successfully!`);
                setProducts(prev => prev.filter(p => p.id !== id));
            } else {
                toast.error('Server failed to delete this product');
            }
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Error connecting to backend');
        }
    };

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const searchMatch = !searchQuery || 
            (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.id && product.id.toString() === searchQuery.trim());
        return categoryMatch && searchMatch;
    });

    const handleUpdate = async(id) => {
        const selectedProduct = await fetch()
    }

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '40px 6%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '35px' }}>
                <div>
                    <button 
                        onClick={() => nav('/admin')} 
                        style={{ 
                            padding: '10px 18px', 
                            background: '#fff', 
                            color: '#444', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#d4af37'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        &larr; Back to Admin Panel
                    </button>
                    <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.4rem', color: '#1a1a1a', marginTop: '15px', marginBottom: '4px' }}>
                        Product Inventory Management
                    </h1>
                    <p style={{ color: '#777', fontSize: '0.95rem' }}>
                        Browse, inspect, and manage all jewelry items currently in your catalog.
                    </p>
                </div>

                <button 
                    onClick={() => nav('/additem')}
                    style={{ 
                        padding: '12px 24px', 
                        background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    + Add New Jewel
                </button>
            </div>

            <div style={{ 
                backgroundColor: '#fff', 
                padding: '20px 25px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                border: '1px solid #eaeaea',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '20px',
                marginBottom: '35px'
            }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input 
                        type="text"
                        placeholder="Search by name or product ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            padding: '10px 15px', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd', 
                            width: '280px',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />

                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ 
                            padding: '10px 15px', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd', 
                            backgroundColor: '#fff',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="All">All Categories ({products.length})</option>
                        {categories.map((cat, idx) => (
                            <option value={cat} key={idx}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div style={{ color: '#888', fontSize: '0.9rem', fontWeight: '500' }}>
                    Showing <strong style={{ color: '#d4af37' }}>{filteredProducts.length}</strong> of {products.length} products
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#d4af37', fontSize: '1.2rem' }}>
                    ✨ Loading catalog items...
                </div>
            ) : filteredProducts.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '80px 20px', 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px dashed #ccc' 
                }}>
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '15px' }}>No products found matching your filter.</p>
                    <button 
                        onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                        style={{ padding: '8px 18px', background: '#d4af37', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '30px' 
                }}>
                    {filteredProducts.map((product) => (
                        <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ 
                                backgroundColor: '#fff', 
                                borderRadius: '14px', 
                                overflow: 'hidden', 
                                border: '1px solid #eaeaea',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 12px 25px rgba(212, 175, 55, 0.15)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.04)';
                            }}
                        >
                            <div style={{ position: 'relative', height: '240px', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                                <img 
                                    src={product.imageUrl && product.imageUrl !== 'image' ? product.imageUrl : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500';
                                    }}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }} 
                                />
                                
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '12px', 
                                    left: '12px', 
                                    backgroundColor: 'rgba(0,0,0,0.7)', 
                                    backdropFilter: 'blur(5px)',
                                    color: '#ffd700', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '700', 
                                    letterSpacing: '1px', 
                                    textTransform: 'uppercase', 
                                    padding: '4px 10px', 
                                    borderRadius: '20px' 
                                }}>
                                    {product.category || 'Jewelry'}
                                </div>

                                <div style={{ 
                                    position: 'absolute', 
                                    top: '12px', 
                                    right: '12px', 
                                    backgroundColor: '#d4af37', 
                                    color: '#fff', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '700', 
                                    padding: '4px 10px', 
                                    borderRadius: '20px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)' 
                                }}>
                                    {product.karat}K Gold
                                </div>

                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: '10px', 
                                    right: '12px', 
                                    backgroundColor: 'rgba(255,255,255,0.85)', 
                                    backdropFilter: 'blur(4px)',
                                    color: '#333', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '600', 
                                    padding: '3px 8px', 
                                    borderRadius: '6px' 
                                }}>
                                    ID: #{product.id}
                                </div>
                            </div>

                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ 
                                    fontFamily: '"Cormorant Garamond", serif', 
                                    fontSize: '1.4rem', 
                                    color: '#1a1a1a', 
                                    margin: '0 0 10px 0',
                                    fontWeight: '700',
                                    lineHeight: '1.2'
                                }}>
                                    {product.name}
                                </h3>

                                {/* Specifications Table / Grid */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr', 
                                    gap: '8px', 
                                    backgroundColor: '#fbfbfb', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #f0f0f0',
                                    marginBottom: '15px',
                                    fontSize: '0.85rem'
                                }}>
                                    <div>
                                        <span style={{ color: '#888', display: 'block', fontSize: '0.75rem' }}>Weight</span>
                                        <strong style={{ color: '#222' }}>{product.weightInGrams} g</strong>
                                    </div>
                                    <div>
                                        <span style={{ color: '#888', display: 'block', fontSize: '0.75rem' }}>Purity</span>
                                        <strong style={{ color: '#d4af37' }}>{product.karat} Karat</strong>
                                    </div>
                                    <div>
                                        <span style={{ color: '#888', display: 'block', fontSize: '0.75rem' }}>Making Charges</span>
                                        <strong style={{ color: '#222' }}>{product.makingChargePercentage}%</strong>
                                    </div>
                                    <div>
                                        <span style={{ color: '#888', display: 'block', fontSize: '0.75rem' }}>3D Preview</span>
                                        <strong style={{ color: product.model3dUrl && product.model3dUrl !== 'scwse' ? '#2e7d32' : '#999' }}>
                                            {product.model3dUrl && product.model3dUrl !== 'scwse' ? '✓ Available' : '— None'}
                                        </strong>
                                    </div>
                                </div>

                                {/* Description */}
                                <div style={{ marginBottom: '20px', flex: 1 }}>
                                    <span style={{ color: '#888', display: 'block', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Description
                                    </span>
                                    <p style={{ 
                                        color: '#555', 
                                        fontSize: '0.88rem', 
                                        lineHeight: '1.5', 
                                        margin: 0,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {product.description || 'No description provided for this item.'}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                                    <button 
                                        onClick={() => nav(`/products/${product.id}`)}
                                        style={{ 
                                            flex: 1, 
                                            padding: '9px 0', 
                                            backgroundColor: '#fff', 
                                            color: '#d4af37', 
                                            border: '1px solid #d4af37', 
                                            borderRadius: '6px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '600', 
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#d4af37'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#d4af37'; }}
                                    >
                                        View in Store
                                    </button>

                                    <button 
                                        onClick={() => handleDelete(product.id, product.name)}
                                        style={{ 
                                            padding: '9px 15px', 
                                            backgroundColor: '#fff', 
                                            color: '#e53935', 
                                            border: '1px solid #ffcdd2', 
                                            borderRadius: '6px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '600', 
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#ffebee'; e.currentTarget.style.borderColor = '#e53935'; }}
                                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#ffcdd2'; }}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => nav('/update/', {state: {product}})}
                                        style={{ 
                                            padding: '9px 15px', 
                                            backgroundColor: '#ffffffff', 
                                            color: '#55e535ff', 
                                            border: '1px solid #cfffcdff', 
                                            borderRadius: '6px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '600', 
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f4ffebff'; e.currentTarget.style.borderColor = '#35e555ff'; }}
                                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#ffffffff'; e.currentTarget.style.borderColor = '#cdffceff'; }}
                                    >
                                        Update
                                    </button>
                                    
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllProducts;