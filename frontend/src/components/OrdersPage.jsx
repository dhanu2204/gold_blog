import React,{useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'


const OrdersPage = () => {

    const [ordersList,setOrdersList] = useState([])
    const [loading,setLoading] = useState(true)
    const nav = useNavigate()

    useEffect( () => {
        const fetchOrders = async() =>{
            const userPhone = localStorage.getItem("userPhone");
            if (!userPhone) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${import.meta.env.VITE_ORDERSURL}api/orders/history/${userPhone}`,{
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                })
                if(res.ok)
                {
                    const textResponse = await res.text();
                    if(textResponse === "You have not placed any orders")
                    {
                        setOrdersList([])
                    }
                    else{
                        setOrdersList(JSON.parse(textResponse))
                    }
                }
                } catch (error) {
                    console.error("Error fetching orders: ",error);
                }
                finally{
                    setLoading(false);
                }
            }
            fetchOrders();
    },[])
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading your orders...</div>;
    }
  return (
        <div style={{ padding: '40px', backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#222' }}>📦 Order History</h1>
                    <button onClick={() => nav('/home')} style={{ padding: '10px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Back to Shop
                    </button>
                </div>
                {ordersList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                        <h2>You have no past orders.</h2>
                        <p>Time to buy some jewelry!</p>
                    </div>
                ) : (
                    <div>
                        {ordersList.map((order) => (
                            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
                                
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#222' }}>{order.productName}</h3>
                                    <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                                        Order #{order.id} • Placed on: {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d4af37' }}>
                                        ₹{order.totalAmount}
                                    </div>
                                    <span style={{ display: 'inline-block', marginTop: '5px', padding: '3px 10px', backgroundColor: '#e6f7ff', color: '#0050b3', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default OrdersPage;