import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { categoryProductMap } from '../assets/productsData';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const [results, setResults] = useState([]);

    useEffect(() => {
        // Flatten all products from all categories
        const allProducts = Object.values(categoryProductMap).flat();
        
        // Remove duplicates (by ID) if a product appears in multiple categories
        const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());

        const searchTerms = query.split(/\s+/).filter(term => term.length > 0);

        const filtered = uniqueProducts.filter(product => {
            const name = product.name.toLowerCase();
            const desc = product.description.toLowerCase();
            
            // Check for partial matches: does the name or description include the full query?
            if (name.includes(query) || desc.includes(query)) return true;

            // Check for word-based fuzzy matches: do any of the search terms appear in the title?
            return searchTerms.some(term => name.includes(term) || desc.includes(term));
        });

        setResults(filtered);
        window.scrollTo(0, 0);
    }, [query]);

    return (
        <div className="bg-mbg min-h-screen flex flex-col font-sans">
            <Navbar />
            
            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white">
                        Search Results for "{query}"
                    </h1>
                    <p className="text-gray-400 mt-2">Found {results.length} products</p>
                </div>

                {results.length === 0 ? (
                    <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">No products found</h2>
                        <p className="text-gray-400 mb-8">Try adjusting your search terms or browse our categories.</p>
                        <Link to="/" className="inline-flex px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-colors">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                        {results.map(product => (
                            <div key={product.id} className="flex">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SearchResultsPage;