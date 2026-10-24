import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css';

const CATEGORY_DATA = [
  { name: 'Necklaces', cover: '/designs/gold necklace/030904ba-3f56-4c87-aa39-cd5d0f4520be.jpeg', tagline: 'Chokers, Bridal Sets & Royal Haars' },
  { name: 'Bangles', cover: '/designs/bangles womens/03b20c36e716a617fd3e70267f6da0e8.jpg', tagline: 'Kadas, Filigree & Daily Bangles' },
  { name: 'Earrings', cover: '/designs/womens earrings/006bbbb22c6e609027e12e088b29b77c.jpg', tagline: 'Jhumkas, Chandbalis & Daily Studs' },
  { name: 'Rings', cover: '/designs/womens ring/0343a9f0e8f0b7c191316499a224a180.jpg', tagline: 'Cocktail, Couple Bands & Solitaires' },
  { name: 'Pendants', cover: '/designs/womens pendant/02ae2b1e19487c5c0dbebb5083fc96eb.jpg', tagline: 'Temple, Lotus & Spiritual Lockets' },
  { name: 'Bracelets', cover: '/designs/womens bracelets/06af781f5b666174f281f7f8b015f2e3.jpg', tagline: 'Delicate Charms & Men\'s Kadas' },
  { name: 'Chains', cover: '/designs/mens neckchain/007a1aa4-33b5-4702-861f-c0c524b07cf0.jpeg', tagline: 'Solid Curb, Figaro & Classic Chains' },
  { name: 'Nose Pins', cover: '/designs/womens nose pin/03445b6d068c12ff18e4ddb290464784.jpg', tagline: 'Dainty Floral & Single Stone Accents' }
];

const Home = () => {
  const [message, setMessage] = useState("");
  const [goldPrice, setGoldPrice] = useState(null);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videos = ['/designs/videos/vid1.mp4', '/designs/videos/vid2.mp4'];

  const nav = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("jwttoken");
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKENDURL}api/home`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          setMessage(await res.text());
        }
      } catch (e) {
        console.error(e);
      }
    };

    const fetchGoldPrice = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_PRICEURL}api/prices/liveprice`);
        if (res.ok) {
          setGoldPrice(await res.text());
        }
      } catch (e) {
        console.error("Failed to fetch price:", e);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products`);
        if (res.ok) {
          setProduct(await res.json());
        }
      } catch (e) {
        console.error("failed to fetch products", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
    fetchGoldPrice();
    fetchProducts();
  }, []);

  return (
    <div className="home-container" style={{ overflowX: 'hidden', width: '100%' }}>
      
      {/* HERO SECTION */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 15px' }}>
        <video 
          ref={videoRef}
          src={videos[currentVideoIndex]} 
          autoPlay 
          muted 
          playsInline
          onEnded={handleVideoEnd} 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            top: 0,
            left: 0,
            zIndex: 0
          }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 1 }} />
        
        <motion.div
          style={{ position: 'relative', zIndex: 3, textAlign: 'center', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '850px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ 
            width: 'min(92%, 650px)', 
            backgroundColor: 'rgba(255, 255, 255, 0.22)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '50px', 
            border: '1px solid rgba(255, 255, 255, 0.45)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '12px 24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            <h1 style={{ color: '#ffffff', margin: 0, fontSize: 'clamp(1.15rem, 4vw, 2.1rem)', textAlign: 'center', fontWeight: '700', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              Exquisite Designs, Real-Time Value
            </h1>
          </div>

          <p style={{ color: '#f0f0f0', padding: '15px 15px 0 15px', margin: 0, textAlign: 'center', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
            {message ? message : "Welcome to Mysuru's Premier Gold & Jewelry House"}
          </p>
        </motion.div>
      </section>

      {/* LIVE GOLD PRICE TICKER */}
      <section style={{ backgroundColor: '#fff', padding: '20px 15px', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <motion.div 
          className="price-ticker"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <span className="price-label">Live 24k Gold</span>
          <span className="price-value" style={{ margin: '0 8px' }}>
            {goldPrice ? goldPrice : "---"}
          </span>
          <span className="price-currency">INR / gram</span>
        </motion.div> 
      </section>

      {/* QUALITY GUARANTEES (RESPONSIVE GRID) */}
      <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '15px',
          backgroundColor: '#fafafa', 
          padding: '30px clamp(15px, 5vw, 50px)', 
          borderBottom: '1px solid #eaeaea',
          textAlign: 'center'
      }}>
          <div style={{ padding: '8px' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#222', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8l-2 4h4l-2 4"></path></svg>
                  100% BIS Hallmarked
              </h3>
              <p style={{ margin: 0, color: '#777', fontSize: '0.8rem' }}>Guaranteed Purity</p>
          </div>
          
          <div style={{ padding: '8px' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#222', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)' }}>Certified Diamonds</h3>
              <p style={{ margin: 0, color: '#777', fontSize: '0.8rem' }}>Ethically Sourced</p>
          </div>
          
          <div style={{ padding: '8px' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#222', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)' }}>Bespoke Designs</h3>
              <p style={{ margin: 0, color: '#777', fontSize: '0.8rem' }}>Custom Craftsmanship</p>
          </div>
          
          <div style={{ padding: '8px' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#222', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)' }}>Clear Pricing</h3>
              <p style={{ margin: 0, color: '#777', fontSize: '0.8rem' }}>Transparent Making</p>
          </div>
      </section>

      {/* SHOP BY CATEGORY SECTION (INSTANT LOAD) */}
      <section className="catalog-section" style={{ padding: 'clamp(25px, 5vw, 60px) clamp(12px, 4vw, 40px)' }}>
        <h2 className="catalog-title" style={{ textAlign: 'center', marginBottom: '25px', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', color: '#222' }}>
          Shop by Category
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {CATEGORY_DATA.map((cat) => {
            const count = product.filter(p => (p.category || '').toLowerCase().trim() === cat.name.toLowerCase().trim()).length;
            const categoryCover = product.find(p => (p.category || '').toLowerCase().trim() === cat.name.toLowerCase().trim() && p.imageUrl)?.imageUrl || cat.cover;

            return (
              <motion.div 
                key={cat.name}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => nav(`/category/${cat.name}`)}
                style={{
                  height: 'clamp(200px, 28vh, 320px)',
                  width: '100%',
                  borderRadius: '16px',
                  backgroundColor: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Crisp Background Cover Image */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%',
                  backgroundImage: `url(${categoryCover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.7)'
                }}></div>

                {/* Luxury Gradient Overlay */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                  transition: 'background 0.3s'
                }}></div>

                {/* Center Content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 15px', maxWidth: '90%' }}>
                  <h3 style={{ 
                    color: '#ffd700', 
                    fontSize: 'clamp(1.4rem, 4.5vw, 2.4rem)', 
                    letterSpacing: 'clamp(2px, 0.8vw, 6px)', 
                    textTransform: 'uppercase', 
                    textShadow: '0 4px 15px rgba(0,0,0,0.9)', 
                    padding: '8px 22px', 
                    backgroundColor: 'rgba(0,0,0,0.55)', 
                    backdropFilter: 'blur(8px)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,215,0,0.4)', 
                    display: 'inline-block',
                    margin: '0 0 10px 0'
                  }}>
                    {cat.name}
                  </h3>
                  <p style={{ margin: 0, color: '#f0f0f0', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {cat.tagline} {count > 0 && <span style={{ color: '#ffd700', fontWeight: 'bold' }}>• {count} Designs</span>}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FOOTER (RESPONSIVE) */}
      <footer style={{ backgroundColor: '#1f1f1f', color: '#fff', padding: 'clamp(35px, 6vw, 65px) clamp(16px, 6vw, 10%)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px', borderBottom: '1px solid #333', paddingBottom: '30px', marginBottom: '30px' }}>
              
              <div style={{ flex: '1 1 280px' }}>
                  <h3 style={{ color: '#d4af37', marginBottom: '14px', letterSpacing: '1px', fontSize: '1.25rem' }}>Visit Us</h3>
                  <p style={{ color: '#aaa', margin: '8px 0', lineHeight: '1.7', fontSize: '0.9rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>  
                    1237, Halladakeri, Mandi Mohalla, Mysuru, Karnataka 570001
                  </p>
                  <p style={{ color: '#aaa', margin: '8px 0', lineHeight: '1.7', fontSize: '0.9rem' }}>
                    <strong>Hours:</strong> 12:00 PM to 9:30 PM (Sunday Closed)
                  </p>
                  <p style={{ color: '#aaa', margin: '8px 0', lineHeight: '1.7', fontSize: '0.9rem' }}>
                    <strong>Contact:</strong> <a href="tel:+919448189363" style={{ color: '#d4af37', textDecoration: 'none' }}>9448189363</a> • <a href="tel:+919740139251" style={{ color: '#d4af37', textDecoration: 'none' }}>9740139251</a>
                  </p>
              </div>

              <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ color: '#d4af37', marginBottom: '14px', letterSpacing: '1px', fontSize: '1.25rem' }}>Basaveshwara Club</h3>
                  <p style={{ color: '#aaa', marginBottom: '15px', lineHeight: '1.6', fontSize: '0.9rem' }}>
                    Join the exclusive club for preview launches, bespoke design ideas, and daily gold rate updates.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <input 
                        type="tel" 
                        maxLength={10}
                        pattern="[0-9]{10}"
                        placeholder="10-digit phone number" 
                        style={{ padding: '12px 14px', flex: '1 1 180px', border: '1px solid #444', borderRadius: '6px', outline: 'none', background: '#2c2c2c', color: '#fff', fontSize: '0.9rem' }} 
                      />
                      <button style={{ padding: '12px 22px', backgroundColor: '#d4af37', color: '#111', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '0.5px', fontSize: '0.9rem' }}>
                        Join Club
                      </button>
                  </div>
              </div>
          </div>
          <div style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} Basaveshwara Jewels. All rights reserved.
          </div>
      </footer>

      {/* FLOATING WHATSAPP WIDGET */}
      <a href="https://wa.me/9448189363" target="_blank" rel="noreferrer" style={{ position: 'fixed', bottom: '25px', right: '25px', backgroundColor: '#25D366', color: '#fff', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 1000, transition: 'transform 0.3s ease' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
      </a>
    </div>
  )
}

export default Home
