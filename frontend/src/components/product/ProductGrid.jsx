import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { PackageOpen } from 'lucide-react';

export default function ProductGrid({
  products = [],
  isLoading = false,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search or category filters.',
  className = '',
  gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
}) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div
      className={`grid ${gridCols} gap-2.5 sm:gap-3.5 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
