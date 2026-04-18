import React, { useContext, useState } from 'react'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ZenithNavIcon } from '../assets/ZenithNavIcon';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { cart, user, logoutUser, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [open, setOpen] = React.useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  const navLinks=[
    {name:"Home" , path:'/'},
    {name:"Products" , path:'/products'},
    {name:"About Us" , path:'/'},
     {name:"Contacts" , path:'/'},
  ]
    return (
        <nav className="flex items-center justify-between px-6  py-4 border-dbg  bg-cbg relative transition-all">

            <ZenithNavIcon/>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8 text-primary-text ">
                <nav className= ' flex items-center gap-8 '>
                    {navLinks.map((link)=>(
                        <NavLink
                        key={link.name}
                        to={link.path} 
                        className={({isActive})=>{
                            isActive?"text-primary-text":"hover:text-secondary-text"
                        }}
                        >
                         {link.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 rounded-full transition-all duration-300 group-hover:w-full" />
                        </NavLink>
                    ))}

                </nav>
                
                <form onSubmit={handleSearch} className="hidden lg:flex items-center text-sm gap-2 border border:dbg hover:border-amber-50 px-3 rounded-full">
                    <input 
                      className="py-1.5 w-full bg-transparent outline-none placeholder-secondary-text text-white" 
                      type="text" 
                      placeholder="Search products" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                </form>

                <Link to="/cart" className="relative cursor-pointer group">
                    <AiOutlineShoppingCart className='text-accent group-hover:text-Primary-hover text-3xl' />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-md">
                            {cartItemCount}
                        </span>
                    )}
                </Link>

                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <Link to="/profile" className="flex items-center gap-2 group transform active:scale-95 transition-all">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold group-hover:bg-indigo-500 transition-colors">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-primary-text hidden md:block font-medium group-hover:text-indigo-400 transition-colors">Profile</span>
                    </Link>
                    <button 
                        onClick={logoutUser}
                        className="cursor-pointer px-6 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 transition rounded-full border border-red-600/30 font-bold"
                    >
                        Logout
                    </button>
                  </div>
                ) : (
                  <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="cursor-pointer px-8 py-2 bg-accent hover:bg-Primary-hover transition text-primary-text rounded-full"
                  >
                      Login
                  </button>
                )}
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-cbg py-4 flex-col items-start gap-2 px-5 text-sm md:hidden text-primary-text`}>
                <a href="#" className="block">Home</a>
                <a href="#" className="block">About</a>
                <a href="#" className="block">Contact</a>
                <button className="cursor-pointer px-6 py-2 mt-2 bg-dbg hover:cbg transition text-primarytext rounded-full text-sm">
                    Login
                </button>
            </div>

        </nav>
    )
}

export default Navbar
