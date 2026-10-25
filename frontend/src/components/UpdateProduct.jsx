import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UpdateProduct = () => {
    const location = useLocation();
    const nav = useNavigate();
    const product = location.state?.product;

    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [karat, setKarat] = useState(product?.karat || '22');
    const [weightInGrams, setWeightInGrams] = useState(product?.weightInGrams || '');
    const [makingCharges, setMakingCharges] = useState(product?.makingChargePercentage || '12');
    const [category, setCategory] = useState(product?.category || 'Necklaces');
    const [loading, setLoading] = useState(false);

    if (!product) {
        return (
            <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '14px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#222', marginBottom: '10px' }}>
                        No Product Selected
                    </h2>
                    <p style={{ color: '#777', fontSize: '0.95rem', marginBottom: '25px' }}>
                        Please choose a product from the inventory catalog to edit its details.
                    </p>
                    <button 
                        onClick={() => nav('/getall')}
                        style={{ padding: '10px 24px', backgroundColor: '#d4af37', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Go to Products Catalog
                    </button>
                </div>
            </div>
        );
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products/${product.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    category,
                    description,
                    imageUrl: product.imageUrl,
                    weightInGrams: parseFloat(weightInGrams) || 0.0,
                    makingChargePercentage: parseFloat(makingCharges) || 12.0,
                    karat: parseInt(karat) || 22
                })
            });

            if (res.ok) {
                toast.success('🎉 Product updated successfully!');
                nav('/getall');
            } else {
                toast.error('Failed to update product. Server returned error.');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Network error connecting to product service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '40px 6%' }}>
            
            {/* Header */}
            <div style={{ maxWidth: '850px', margin: '0 auto 25px auto' }}>
                <button 
                    onClick={() => nav('/getall')} 
                    style={{ 
                        padding: '10px 18px', 
                        background: '#fff', 
                        color: '#444', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: '600',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    &larr; Back to Inventory
                </button>
                <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.6rem', color: '#1a1a1a', margin: '5px 0' }}>
                    Edit Jewel #{product.id}
                </h1>
                <p style={{ color: '#777', fontSize: '0.95rem' }}>
                    Update product specifications, weight, karat purity, and description.
                </p>
            </div>

            {/* Form Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    maxWidth: '850px', 
                    margin: '0 auto', 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    padding: '40px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid #eaeaea' 
                }}
            >
                {/* Product Snapshot Banner */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px', 
                    backgroundColor: '#fafafa', 
                    padding: '18px 22px', 
                    borderRadius: '12px', 
                    border: '1px solid #f0f0f0',
                    marginBottom: '30px'
                }}>
                    <img 
                        src={product.imageUrl && product.imageUrl !== 'image' ? product.imageUrl : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'}
                        alt={product.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500';
                        }}
                        style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #eee' }}
                    />
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Editing Product #{product.id}
                        </span>
                        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#222', margin: '2px 0' }}>
                            {product.name}
                        </h3>
                        <span style={{ color: '#888', fontSize: '0.85rem' }}>
                            Category: <strong>{product.category}</strong> • Current Purity: <strong>{product.karat}K</strong>
                        </span>
                    </div>
                </div>

                <form onSubmit={handleUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#333' }}>
                                Product Name *
                            </label>
                            <input 
                                type="text" 
                                required
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#333' }}>
                                Category *
                            </label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '0.9rem' }}
                            >
                                <option value="Necklaces">Necklaces</option>
                                <option value="Rings">Rings</option>
                                <option value="Bracelets">Bracelets</option>
                                <option value="Earrings">Earrings</option>
                                <option value="Pendants">Pendants</option>
                                <option value="Bangles">Bangles</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#333' }}>
                                Karat Purity *
                            </label>
                            <select 
                                value={karat} 
                                onChange={(e) => setKarat(e.target.value)}
                                style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '0.9rem' }}
                            >
                                <option value="22">22 Karat (916 BIS Hallmark)</option>
                                <option value="24">24 Karat (999 Pure Gold)</option>
                                <option value="18">18 Karat (750 Diamond Gold)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#333' }}>
                                Weight in Grams *
                            </label>
                            <input 
                                type="number" 
                                step="0.01"
                                required
                                value={weightInGrams} 
                                onChange={(e) => setWeightInGrams(e.target.value)}
                                style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#333' }}>
                                Making Charges (%) *
                            </label>
                            <input 
                                type="number" 
                                step="0.1"
                                required
                                value={makingCharges} 
                                onChange={(e) => setMakingCharges(e.target.value)}
                                style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#333' }}>
                            Description:
                        </label>
                        <textarea 
                            rows="5"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '8px', 
                                border: '1px solid #ddd', 
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                lineHeight: '1.4'
                            }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button 
                            type="button"
                            onClick={() => nav('/getall')}
                            style={{ 
                                padding: '12px 25px', 
                                backgroundColor: '#fff', 
                                color: '#555', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px', 
                                fontSize: '0.95rem', 
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                padding: '12px 35px', 
                                background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                fontSize: '0.95rem', 
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Saving Changes...' : 'Save & Update Jewel'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateProduct;