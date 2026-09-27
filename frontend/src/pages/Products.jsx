import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { productApi } from '../api/productApi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters, { ProductSidebarFilter } from '../components/product/ProductFilters';
import ErrorState from '../components/common/ErrorState';
import { getApiErrorMessage } from '../utils/errorHandler';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (selectedCategory && selectedCategory !== 'All') {
        data = await productApi.getProductsByCategory(selectedCategory);
      } else {
        data = await productApi.getAllProducts();
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (cat) => {
    const nextParams = new URLSearchParams(searchParams);
    if (cat && cat !== 'All') {
      nextParams.set('category', cat);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const handleClearAll = () => {
    setPriceRange('all');
    setMinRating(0);
    setInStockOnly(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    setSearchParams(nextParams);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    let list = [...products];

    // Price range filter
    if (priceRange === 'under-1500') {
      list = list.filter((p) => Number(p.price) < 1500);
    } else if (priceRange === '1500-3000') {
      list = list.filter((p) => Number(p.price) >= 1500 && Number(p.price) <= 3000);
    } else if (priceRange === '3000-5000') {
      list = list.filter((p) => Number(p.price) >= 3000 && Number(p.price) <= 5000);
    } else if (priceRange === 'over-5000') {
      list = list.filter((p) => Number(p.price) > 5000);
    }

    // In stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.stockQuantity === undefined || p.stockQuantity > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, sortBy, priceRange, inStockOnly]);

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
        {selectedCategory && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {selectedCategory}
            </span>
          </>
        )}
      </nav>

      {/* Main 2-Column Marketplace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Filter Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-20">
          <ProductSidebarFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedPriceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedRating={minRating}
            onRatingChange={setMinRating}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Right Column: Top Bar & Product Grid */}
        <div className="lg:col-span-9 space-y-3">
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResults={filteredProducts.length}
            onClearAll={handleClearAll}
          />

          {error ? (
            <ErrorState
              title="Failed to load products"
              message={error}
              onRetry={fetchProducts}
            />
          ) : (
            <ProductGrid
              products={filteredProducts}
              isLoading={loading}
              gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
              emptyTitle={
                selectedCategory
                  ? `No products found in "${selectedCategory}"`
                  : 'No products match your filters'
              }
              emptyDescription="Try clearing your filters or select a different category."
            />
          )}
        </div>
      </div>
    </div>
  );
}
