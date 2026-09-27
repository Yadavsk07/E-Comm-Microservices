import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { productApi } from '../api/productApi';
import ProductGrid from '../components/product/ProductGrid';
import ErrorState from '../components/common/ErrorState';
import { getApiErrorMessage } from '../utils/errorHandler';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setInputVal(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let isMounted = true;
    async function executeSearch() {
      setLoading(true);
      setError(null);
      try {
        const data = await productApi.searchProducts(query.trim());
        if (isMounted) {
          setResults(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    executeSearch();
    return () => {
      isMounted = false;
    };
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Search Results
        </span>
      </nav>

      {/* Search Header Bar (Flipkart Style) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {query ? (
              <>
                Results for <span className="text-blue-600 dark:text-blue-400">"{query}"</span>
              </>
            ) : (
              'Search Products'
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {loading
              ? 'Searching microservice product catalog...'
              : `${results.length} ${results.length === 1 ? 'product' : 'products'} found`}
          </p>
        </div>

        {/* Compact search bar */}
        <form onSubmit={handleSubmit} className="flex items-center max-w-md w-full">
          <div className="relative w-full">
            <input
              type="search"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search products, categories..."
              className="w-full pl-3 pr-20 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {error ? (
        <ErrorState
          title="Search Failed"
          message={error}
          onRetry={() => setSearchParams({ q: query })}
        />
      ) : (
        <ProductGrid
          products={results}
          isLoading={loading}
          emptyTitle={`No products found for "${query}"`}
          emptyDescription="Try checking your spelling or use more generic keywords like 'phone', 'shirt', 'lamp'."
        />
      )}
    </div>
  );
}
