import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { sort, q: searchValue } = resolvedSearchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";
  
  return (
    <>
      {/* Debug info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800 mb-4">
        <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">🔍 Search Debug</h3>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p><strong>Search Query:</strong> {searchValue || 'None (showing all products)'}</p>
          <p><strong>Sort:</strong> {sort || 'default'}</p>
          <p><strong>Products Found:</strong> {products.length}</p>
          {products.length > 0 && (
            <p><strong>First Product Images:</strong> {products[0]?.images?.length || 0}</p>
          )}
        </div>
      </div>

      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match"
            : `Showing ${products.length} ${resultsText} for `}
          <span>&quot;{searchValue}&quot;</span>
        </p>
      ) : (
        <p className="mb-4 text-muted-foreground">
          {products.length === 0
            ? "No products found"
            : `Showing all ${products.length} products`}
        </p>
      )}
      
      <ProductGridItems products={products} />
    </>
  );
}
