import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(AppContext);
  
  const cartItem = cart.find(item => item.id === product.id);
  const isAdded = !!cartItem;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (id, delta, name) => {
    const item = cart.find(i => i.id === id);
    if (item.quantity === 1 && delta === -1) {
      toast.error(`${name} removed from cart`);
    } else if (delta === 1) {
      toast.info(`Increased ${name} quantity`);
    } else {
      toast.info(`Decreased ${name} quantity`);
    }
    updateQuantity(id, delta);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col w-full group">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative h-60 w-full bg-gray-100 overflow-hidden block">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
        />
        <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="mb-2 block hover:text-indigo-600 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">{product.name}</h3>
          <p className="text-xl font-extrabold text-indigo-600">${product.price.toFixed(2)}</p>
        </Link>
        
        {/* Ratings */}
        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          {!isAdded ? (
            <button 
              onClick={handleAddToCart}
              className="w-full py-2.5 rounded-lg font-semibold bg-gray-900 hover:bg-indigo-600 text-white transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 rounded-lg border border-gray-200 p-1">
              <button 
                onClick={() => handleUpdateQuantity(product.id, -1, product.name)}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all font-bold shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center flex-grow">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-tighter">In Cart</span>
                <span className="text-lg font-bold text-gray-900 leading-none">{cartItem.quantity}</span>
              </div>

              <button 
                onClick={() => handleUpdateQuantity(product.id, 1, product.name)}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-bold shadow-sm shadow-indigo-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
