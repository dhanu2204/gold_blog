import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css';

const Home = () => {
  const [message, setMessage] = useState("");
  const [goldPrice, setGoldPrice] = useState(null);
  const [product,setProduct] = useState([]);
  const [loading,setLoading] = useState(true)

  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
const videos = ['/designs/videos/vid1.mp4', '/designs/videos/vid2.mp4'];

  const nav = useNavigate();

   useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8; 
            videoRef.current.play(); 
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
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        });

        if (res.ok) {
          const text = await res.text();
          setMessage(text);
        } else {
          setMessage("Access Denied. Invalid token.");
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

    const fetchProducts = async()=>{
      try{
        const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products`);
        if(res.ok)
        {
          setProduct(await res.json());
        }
      }
      catch (e){
        console.error("failed to fetch products",e)
      }
      finally{
        setLoading(false)
      }
    };
    fetchProducts();
    fetchProtectedData();
    fetchGoldPrice();
  }, []);


  return (
    <div className="home-container">
       
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(91, 86, 86, 0.25)', zIndex: 1 }}>  
        </div>
        <motion.div
        style={{ position: 'relative', zIndex: 3, textAlign: 'center', color: '#ffffffff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
                   <div style={{ width: '65vw', height: '85px', backgroundColor: '#ffffff48', borderRadius: '80px', border: '1px solid grey', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: '#dee8eaff', margin: '0' }}>Exquisite Designs, Real-Time Value</h1>
          </div>

          <p style={{ color: '#dee8eaff', padding: '10px 0 0 0', margin: '0', textAlign: 'center', width: '100%' }}>
            {message ? message : "Loading your secure dashboard..."}
          </p>
          </motion.div>
          </section>

          <section  style={{ backgroundColor:'#2c2c2c1e',position: 'relative', overflow: 'hidden', minHeight: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            className="price-ticker"
            initial={{ opacity: 0, scale: 0.9 }}

            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            >
            <span className="price-label">Live 24k Gold</span>
            <span className="price-value">
              {goldPrice ? goldPrice : "---"}
            </span>
            <span className="price-currency">INR / gram</span>
          </motion.div> 
          </section>
      <section style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'space-around', 
          backgroundColor: '#fff', 
          padding: '50px 5%', 
          borderBottom: '1px solid #eaeaea' 
      }}>
          <div style={{ textAlign: 'center', flex: '1 1 200px', margin: '10px' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#222', letterSpacing: '1px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8l-2 4h4l-2 4"></path></svg>
                  100% BIS Hallmarked
              </h3>
              <p style={{ margin: 0, color: '#777', fontSize: '1rem' }}>Guaranteed Purity</p>
          </div>
          
          <div style={{ textAlign: 'center', flex: '1 1 200px', margin: '10px', borderLeft: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#222', letterSpacing: '1px', fontSize: '1.2rem' }}>Certified Diamonds</h3>
              <p style={{ margin: 0, color: '#777', fontSize: '1rem' }}>Ethically Sourced</p>
          </div>
          
          <div style={{ textAlign: 'center', flex: '1 1 200px', margin: '10px', borderLeft: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#222', letterSpacing: '1px', fontSize: '1.2rem' }}>Bespoke Craftsmanship</h3>
              <p style={{ margin: 0, color: '#777', fontSize: '1rem' }}>Custom Designs</p>
          </div>
          
          <div style={{ textAlign: 'center', flex: '1 1 200px', margin: '10px', borderLeft: '1px solid #eaeaea' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#222', letterSpacing: '1px', fontSize: '1.2rem' }}>Transparent Pricing</h3>
              <p style={{ margin: 0, color: '#777', fontSize: '1rem' }}>Clear Making Charges</p>
          </div>
      </section>

      <section className="catalog-section">
        <h2 className="catalog-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Shop by Category
        </h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#ffd700', fontSize: '1.2rem' }}>
            Loading collections...
          </p>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', padding: '0 20px', width: '100%' }}>
          {[
            'Necklaces','Rings','Bracelets','Earrings','Pendants','Bangles'
          ].map((categoryName) => {

            const categoryProducts = product.filter(p => p.category === categoryName).slice(0, 4);

            return (
              <motion.div 
              key={categoryName}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => nav(`/category/${categoryName}`)}
              style={{
                  height: '400px',
                  width: '100%',
                  borderRadius: '15px',
                  backgroundColor: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Images Collage */}
                <div style={{ display: 'flex', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                   {categoryProducts.map((p, i) => (
                      <div key={i} style={{ 
                          flex: 1, 
                          backgroundImage: `url(${(p.imageUrl || '').replace(/ /g, '%20')})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center', 
                          borderRight: i !== categoryProducts.length - 1 ? '2px solid rgba(255,255,255,0.1)' : 'none' 
                      }}></div>
                   ))}
                </div>

                {/* Cinematic Dark Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', transition: 'background-color 0.3s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}></div>

                {/* Category Title with Glass Pill */}
                <h3 style={{ position: 'relative', zIndex: 2, color: '#ffd700', fontSize: '2.5rem', letterSpacing: '6px', textTransform: 'uppercase', textShadow: '0 4px 15px rgba(0,0,0,0.9)', padding: '15px 40px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '10px', border: '1px solid rgba(255,215,0,0.3)', textAlign: 'center' }}>
                  {categoryName}
                </h3>
              </motion.div>
            );
          })}
        </div>
        )}
      </section>
      <footer style={{ backgroundColor: '#4e4949ff', color: '#fff', padding: '60px 10%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '40px', marginBottom: '40px' }}>
              
              <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#d4af37', marginBottom: '20px', letterSpacing: '1px' }}>Visit Us</h3>
                  <p style={{ color: '#aaa', margin: '20px 0', lineHeight: '1.8' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>  
                  1237, Halladakeri, Mandi Mohalla<br/>Mysuru, Karnataka 570001</p>
                  <p style={{ color: '#aaa', margin: '20px 0', lineHeight: '1.8' }}><strong>Hours:</strong><br/>12:00 PM to 9:30 PM (Sunday Closed)</p>
                  <p style={{ color: '#aaa', margin: '20px 0', lineHeight: '1.8' }}><strong>Contact:</strong>
                  <br />
                  <a href="tel:+919448189363">9448189363</a>
                  <br />
                  <a href="tel:+919740139251">9740139251</a>
                  </p>
                  <p style={{ cursor: 'pointer', color: '#d4af37', margin: '25px 0 10px 0', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '1px' }}>Quality Guarantee &rarr;</p>
              </div>

              <div style={{ flex: '1 1 400px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#d4af37', marginBottom: '20px', letterSpacing: '1px' }}>Basaveshwara Club</h3>
                  <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.6' }}>Join the exclusive club for preview launches, bespoke design ideas, and daily gold rate updates.</p>
                  <div style={{ display: 'flex' }}>
                      <input 
                        type="tel" 
                        maxLength={10}
                        pattern="[0-9]{10}"
                        placeholder="Enter 10-digit phone number" 
                        style={{ padding: '15px', flex: 1, border: 'none', borderRadius: '5px 0 0 5px', outline: 'none' }} 
                      />
                      <button style={{ padding: '15px 30px', backgroundColor: '#d4af37', color: '#111', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}>
                        Join Club
                      </button>
                  </div>
              </div>
          </div>
          <div style={{ textAlign: 'center', color: '#ffffffff', fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} Basava Jewels. All rights reserved.
          </div>
      </footer>

      {/* FLOATING WHATSAPP WIDGET */}
      <a href="https://wa.me/9448189363" target="_blank" rel="noreferrer" style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25D366', color: '#fff', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 1000, transition: 'transform 0.3s ease' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
      </a>
    </div>
  )
}

export default Home
