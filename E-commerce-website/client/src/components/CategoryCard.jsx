import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`} className="block">
      <div 
      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gray-900"
    >
      <div className="aspect-w-3 aspect-h-4 h-64 w-full bg-gray-200">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Image+Unavailable'; }}
        />
      </div>
      
      {/* Dark gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Content Container */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 ease-in-out">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors duration-300 line-clamp-1">
            {category.name}
          </h3>
          <p className="text-sm font-semibold text-indigo-400">
            Starting at ${category.price}
          </p>
          
          {/* Description that reveals on hover */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
            <div className="overflow-hidden">
              <p className="text-xs text-gray-300 line-clamp-3 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out delay-75">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
