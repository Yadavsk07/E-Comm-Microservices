import { ArrowUpDown, Star, Filter, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Beauty',
  'Grocery',
  'Toys',
  'Automotive',
  'Furniture',
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-1500', label: 'Under ₹1,500', max: 1500 },
  { id: '1500-3000', label: '₹1,500 to ₹3,000', min: 1500, max: 3000 },
  { id: '3000-5000', label: '₹3,000 to ₹5,000', min: 3000, max: 5000 },
  { id: 'over-5000', label: 'Over ₹5,000', min: 5000 },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalResults,
}) {
  return (
    <div className="space-y-3">
      {/* Top Bar (Results count & Sort dropdown) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white">
            {totalResults !== undefined ? `${totalResults} ${totalResults === 1 ? 'item' : 'items'}` : ''}
          </span>
          {selectedCategory && (
            <>
              <span>in</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                "{selectedCategory}"
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Sort by:
          </span>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 outline-none focus:border-blue-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills (Quick scrollable rail for mobile & tablet) */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isActive =
            cat === 'All'
              ? !selectedCategory || selectedCategory === 'All'
              : selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Dedicated Amazon / Flipkart style Filter Sidebar Component
export function ProductSidebarFilter({
  selectedCategory,
  onCategoryChange,
  selectedPriceRange = 'all',
  onPriceRangeChange,
  selectedRating = 0,
  onRatingChange,
  inStockOnly = false,
  onInStockChange,
  onClearAll,
}) {
  const hasActiveFilters =
    Boolean(selectedCategory) ||
    selectedPriceRange !== 'all' ||
    selectedRating > 0 ||
    inStockOnly;

  return (
    <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-5 text-xs">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filters</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
          Department
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => {
            const isSelected =
              cat === 'All'
                ? !selectedCategory || selectedCategory === 'All'
                : selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                className={`w-full text-left py-1 px-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
          Price Range
        </h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.id}
              className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-blue-600"
            >
              <input
                type="radio"
                name="price_range"
                checked={selectedPriceRange === range.id}
                onChange={() => onPriceRangeChange && onPriceRangeChange(range.id)}
                className="text-blue-600 focus:ring-blue-500 rounded cursor-pointer"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Customer Rating Filter (Amazon Style) */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => onRatingChange && onRatingChange(selectedRating === stars ? 0 : stars)}
              className={`flex items-center gap-1.5 text-left w-full py-0.5 px-1 rounded cursor-pointer ${
                selectedRating === stars
                  ? 'font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-blue-600">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange && onInStockChange(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}
