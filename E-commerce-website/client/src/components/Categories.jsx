import React from 'react';
import CategoryCard from './CategoryCard';
import { categoriesData } from '../assets/categoryData';

const Categories = () => {
    return (
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                        Explore Categories
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 max-w-7xl">
                        Find exactly what you're looking for from our comprehensive selection of top-tier collections.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categoriesData.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
};

export default Categories;
