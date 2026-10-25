import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddItem = () => {
    const nav = useNavigate();
    const [image, setImage] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [category, setCategory] = useState('Necklaces');
    const [name, setName] = useState('');
    const [karat, setKarat] = useState('22');
    const [makingCharges, setMakingCharges] = useState('12');
    const [weight, setWeight] = useState('');

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64data = reader.result.split(',')[1];
                resolve(base64data);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImage = async (e) => {
        const selectedImage = e.target.files[0];
        if (!selectedImage) return;

        const localPreview = URL.createObjectURL(selectedImage);
        setImage(localPreview);
        setLoading(true);

        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedImage);
        fetch(`${import.meta.env.VITE_PRODUCTURL}api/products/upload`, {
            method: 'POST',
            body: uploadFormData
        })
        .then(res => res.json())
        .then(data => {
            if (data.imageUrl) {
                setImageUrlInput(data.imageUrl);
                toast.success('☁️ Uploaded to AWS S3!');
            }
        })
        .catch(err => {
            console.error('S3 upload error:', err);
            toast.error('Could not upload to S3');
        });

        try {
            const base64Data = await convertBase64(selectedImage);
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const payload = {
                contents: [
                    {
                        parts: [
                            {
                                text: "You are an expert luxury jewelry appraiser. Look at this jewelry piece in detail and write an elegant 2-to-3 sentence product description for an e-commerce catalog. Mention the jewelry type, metal color/karat, patterns, and stone settings if visible."
                            },
                            {
                                inline_data: {
                                    mime_type: selectedImage.type,
                                    data: base64Data
                                }
                            }
                        ]
                    }
                ]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                const aiDescription = data.candidates[0].content.parts[0].text;
                setDescription(aiDescription);
                toast.success('✨ AI Description generated!');
            } else {
                console.error("Gemini error:", data);
                toast.error('AI could not analyze image. You can type description manually.');
            }
        } catch (error) {
            console.error("Error analyzing image:", error);
            toast.error('Network error communicating with Gemini AI.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);


        const finalImageUrl = imageUrlInput.trim() || image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';

        const productPayload = {
            name: name,
            category: category,
            karat: parseInt(karat) || 22,
            weightInGrams: parseFloat(weight) || 0.0,
            makingChargePercentage: parseFloat(makingCharges) || 0.0,
            description: description,
            imageUrl: finalImageUrl,
            model3dUrl: 'none'
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productPayload)
            });

            if (res.ok) {
                toast.success('🎉 Jewel added to catalog successfully!');
                // Reset form
                setName('');
                setCategory('Necklaces');
                setKarat('22');
                setWeight('');
                setMakingCharges('12');
                setDescription('');
                setImage(null);
                setImageUrlInput('');
                
                // Redirect to all products view after 1 second
                setTimeout(() => nav('/getall'), 1200);
            } else {
                toast.error('Failed to save product. Server error (500).');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Network error connecting to backend.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '40px 6%' }}>
            
            {/* Header */}
            <div style={{ maxWidth: '850px', margin: '0 auto 25px auto' }}>
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
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        marginBottom: '15px'
                    }}
                >
                    &larr; Back to Admin Panel
                </button>
                <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.6rem', color: '#1a1a1a', margin: '5px 0' }}>
                    Add New Jewelry Item
                </h1>
                <p style={{ color: '#777', fontSize: '0.95rem' }}>
                    Upload an image for automatic AI description scanning, specify karat and weight, and add to your live catalog.
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
                <form onSubmit={handleSubmit}>
                    
                    <div style={{ 
                        backgroundColor: '#fafafa', 
                        padding: '25px', 
                        borderRadius: '12px', 
                        border: '1px solid #f0f0f0',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#222', marginTop: 0, marginBottom: '8px' }}>
                            1. Image & AI Description Scanner
                        </h3>
                        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '15px' }}>
                            Pick a jewelry photo from your computer. Google Gemini will scan the design, stones, and craftsmanship to write a description automatically.
                        </p>

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImage} 
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px dashed #d4af37',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer'
                                }}
                            />

                        </div>

                        {loading && (
                            <p style={{ color: '#d4af37', fontWeight: '600', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ✨ AI is scanning your jewelry image, please wait...
                            </p>
                        )}

                        {image && (
                            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <img 
                                    src={image} 
                                    alt="Jewelry Preview" 
                                    style={{ 
                                        width: '150px', 
                                        height: '150px', 
                                        objectFit: 'cover', 
                                        borderRadius: '10px',
                                        border: '1px solid #ddd',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }} 
                                />

                                <div style={{ flex: 1, minWidth: '260px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                                        Product Description (Editable):
                                    </label>
                                    <textarea 
                                        rows="5" 
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #ccc',
                                            fontSize: '0.9rem',
                                            fontFamily: 'inherit',
                                            lineHeight: '1.4'
                                        }}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="AI generated description will appear here..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Product Specifications */}
                    <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#222', marginBottom: '15px' }}>
                        2. Product Details & Specifications
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#333' }}>
                                Product Name *
                            </label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. Traditional Peacock Gold Necklace"
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
                                placeholder="e.g. 15.45"
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)}
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
                                placeholder="e.g. 12"
                                value={makingCharges} 
                                onChange={(e) => setMakingCharges(e.target.value)}
                                style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ textAlign: 'right', marginTop: '30px' }}>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            style={{ 
                                padding: '14px 35px', 
                                background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                fontSize: '1rem', 
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
                                opacity: submitting ? 0.7 : 1
                            }}
                        >
                            {submitting ? 'Adding Product...' : '+ Save & Add to Catalog'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddItem;
