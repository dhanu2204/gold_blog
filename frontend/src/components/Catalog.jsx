import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {motion} from 'framer-motion'

const Catalog = () => {

    const {categoryName} = useParams();
    const nav = useNavigate();
    const [goldPrice,setGoldPrice] = useState(null);
    const [product,setProduct] = useState([])
    const [searchQuery,setSearchQuery] = useState('')
    const [genderFilter, setGenderFilter] = useState('All');

    useEffect(() => {
      const fetchGoldPrice = async()=>{
        try{
            const res = await fetch(`${import.meta.env.VITE_PRICEURL}api/prices/liveprice`)
            if(res.ok)
            {
                setGoldPrice(await res.text())
            }
        }
        catch (e){
            console.error(e)
        }
      };
      
      const fetchProducts = async()=>{
        try {
            const res = await fetch(`${import.meta.env.VITE_PRODUCTURL}api/products`)
            if(res.ok) setProduct(await res.json())
        } catch (e) {
            console.error(e)
        }
      }

      
      fetchGoldPrice();
      fetchProducts();
    }, [])
    const filteredProducts = product.filter((p)=>{
      const categoryMatch = p.category === categoryName;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      //const isMens = p.name.includes("MENS");
      const isWomens = p.name.toLowerCase().includes("womens");
      const isMens = !p.name.toLowerCase().includes("womens") && p.name.toLowerCase().includes("mens")

      let genderMatch = true;
      if(genderFilter === "Mens") genderMatch = isMens
      if(genderFilter === "Womens") genderMatch = isWomens;

      return categoryMatch && searchMatch && genderMatch;
    })
    
  return (
    <div className="home-container">
        <section className="catalog-section" >
          <div>
            <button onClick={() => nav(-1)} style={{ padding: '10px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>
                &larr; Back to Catalog
            </button>
          </div>
            <h1 style={{ color: '#ffd700', textAlign: 'center', marginBottom: '30px' }}>
          Explore Our {categoryName} Collection
            </h1>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder={`Search ${categoryName}...`} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ffd700', background: 'black', color: 'white', width: '300px' }}
          />
        <select 
            value={genderFilter} 
            onChange={(e) => setGenderFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ffd700', background: 'black', color: 'white' }}
          >
            <option value="All">All Genders</option>
            <option value="Mens">Men's</option>
            <option value="Womens">Women's</option>
          </select>
        </div>
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p style={{ color: 'white', textAlign: 'center', gridColumn: '1 / -1' }}>No products found in this category.</p>
          ) : (
            filteredProducts.map((product) => (
              <motion.div key={product.id} className="product-card" onClick={() => nav(`/products/${product.id}`)} style={{ cursor: 'pointer' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.05, boxShadow: ' 0px 0 30px rgba(74, 234, 255, 1)' }}
              whileTap={{ scale: 0.95 }}>
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-specs">{product.karat}k Gold • {product.weightInGrams}g</div>
                  </div>
              </motion.div>
            ))
          )}
        </div>
        </section>
    </div>
  )
}

export default Catalog