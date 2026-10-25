import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Catalog = () => {
  const { categoryName } = useParams();
  const nav = useNavigate();

  // Instant Cache initialization: load from sessionStorage if available for 0ms delay
  const [product, setProduct] = useState(() => {
    try {
      const cached = sessionStorage.getItem("basaveshwara_products");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = sessionStorage.getItem("basaveshwara_products");
      if (!cached) return true;
      const list = JSON.parse(cached);
      return !Array.isArray(list) || list.length === 0;
    } catch {
      return true;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      // 1. Try fast category-specific endpoint first
      try {
        const catRes = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products/category/${encodeURIComponent(categoryName)}`);
        if (catRes.ok) {
          const catData = await catRes.json();
          if (isMounted && Array.isArray(catData) && catData.length > 0) {
            setProduct(prev => {
              const others = prev.filter(p => (p.category || '').toLowerCase().trim() !== (categoryName || '').toLowerCase().trim());
              const updated = [...others, ...catData];
              try { sessionStorage.setItem("basaveshwara_products", JSON.stringify(updated)); } catch {}
              return updated;
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to all products
      }

      // 2. Fallback: fetch all products
      try {
        const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products`);
        if (res.ok) {
          const allData = await res.json();
          if (isMounted) {
            setProduct(allData);
            try { sessionStorage.setItem("basaveshwara_products", JSON.stringify(allData)); } catch {}
          }
        }
      } catch (err) {
        console.error("Failed to load catalog products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();
    return () => { isMounted = false; };
  }, [categoryName]);

  const filteredProducts = product.filter((p) => {
    const categoryMatch = !categoryName || (p.category || '').toLowerCase().trim() === (categoryName || '').toLowerCase().trim();
    const searchMatch = !searchQuery || (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isWomens = (p.name || '').toLowerCase().includes("women") || p.category === "Bangles" || p.category === "Earrings" || p.category === "Nose Pins";
    const isMens = (p.name || '').toLowerCase().includes("men") && !(p.name || '').toLowerCase().includes("women");

    let genderMatch = true;
    if (genderFilter === "Mens") genderMatch = isMens;
    if (genderFilter === "Womens") genderMatch = isWomens;

    return categoryMatch && searchMatch && genderMatch;
  });

  return (
    <div className="home-container" style={{ minHeight: '90vh' }}>
      <section className="catalog-section" style={{ padding: 'clamp(20px, 4vw, 50px) clamp(12px, 4vw, 5%)' }}>
        <div>
          <button 
            onClick={() => nav(-1)} 
            style={{ 
              padding: '9px 18px', 
              background: '#fff', 
              color: '#333', 
              border: '1px solid #ddd', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              marginBottom: '20px', 
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            &larr; Back to Collections
          </button>
        </div>

        <h1 style={{ color: '#d4af37', textAlign: 'center', marginBottom: '25px', fontSize: 'clamp(1.4rem, 4.5vw, 2.3rem)', padding: '0 10px', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          Explore Our {categoryName} Collection
        </h1>

        {/* Search & Gender Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', alignItems: 'center', marginBottom: '35px', padding: '0 10px' }}>
          <input 
            type="text" 
            placeholder={`Search ${categoryName}...`} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d4af37', background: '#1a1a1a', color: '#fff', width: 'min(100%, 320px)', outline: 'none' }}
          />
          <select 
            value={genderFilter} 
            onChange={(e) => setGenderFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d4af37', background: '#1a1a1a', color: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="All">All Genders</option>
            <option value="Mens">Men's</option>
            <option value="Womens">Women's</option>
          </select>
        </div>

        {/* LOADING STATE WITH GOLD SPINNER & SHIMMER SKELETONS */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '30px 15px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              border: '3px solid rgba(212, 175, 55, 0.2)',
              borderTop: '3px solid #d4af37',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 15px auto'
            }} />
            <p style={{ color: '#666', fontSize: '0.95rem', fontWeight: '500', margin: '0 0 25px 0' }}>
              Curating handcrafted {categoryName} designs...
            </p>

            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div 
                  key={idx}
                  style={{
                    height: '280px',
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e2e2e2 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* LOADED PRODUCT GRID */}
        {!loading && (
          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '45px 20px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #eee',
                maxWidth: '520px',
                margin: '20px auto',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✨</div>
                <h3 style={{ color: '#222', margin: '0 0 8px 0', fontSize: '1.2rem' }}>
                  No {categoryName} Designs Found
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 18px 0', lineHeight: '1.5' }}>
                  {searchQuery || genderFilter !== 'All' 
                    ? 'No products matched your active search term or gender filter.' 
                    : 'We are currently adding brand new designs to this collection. Check back shortly!'}
                </p>
                {(searchQuery || genderFilter !== 'All') && (
                  <button 
                    onClick={() => { setSearchQuery(''); setGenderFilter('All'); }}
                    style={{
                      padding: '10px 22px',
                      backgroundColor: '#d4af37',
                      color: '#111',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              filteredProducts.map((p) => (
                <motion.div 
                  key={p.id} 
                  className="product-card" 
                  onClick={() => nav(`/products/${p.id}`)} 
                  style={{ cursor: 'pointer' }} 
                  initial={{ opacity: 0, y: 15 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="product-image" 
                    loading="lazy" 
                    onError={(e) => { e.currentTarget.src = '/designs/gold necklace/030904ba-3f56-4c87-aa39-cd5d0f4520be.jpeg'; }}
                  />
                  <div className="product-info">
                    <div className="product-category">{p.category}</div>
                    <div className="product-name" style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1a1a1a', margin: '4px 0' }}>{p.name}</div>
                    <div className="product-specs" style={{ color: '#666', fontSize: '0.85rem' }}>{p.karat}k Gold • {p.weightInGrams}g</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalog;