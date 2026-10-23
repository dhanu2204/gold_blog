import React,{createContext,useState,useEffect,useContext} from 'react'
import toast from 'react-hot-toast';

const WishListContext = createContext();

export const WishListProvider = ({children}) => {
    const [wishlist, setWishlist] = useState(()=>{
        const saved = localStorage.getItem('jewelry_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(()=>{
        localStorage.setItem('jewelry_wishlist', JSON.stringify(wishlist))
    },[wishlist])

    const addToWishlist = (product) => {
        const exists = wishlist.find(item => item.id === product.id);
        if(exists)
        {
            toast.error('this item is already liked by you!');
            return;
        }
        toast.success(`${product.name} added to Wishlist! ❤️`);
        setWishlist((prev)=> [...prev, product]);
    };
     const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter(item => item.id !== productId));
    };
    return (
        <WishListContext.Provider value={{wishlist, addToWishlist, removeFromWishlist}}>
            {children}
        </WishListContext.Provider>
    );
};

export const useWishList = () =>{
    return useContext(WishListContext)
}