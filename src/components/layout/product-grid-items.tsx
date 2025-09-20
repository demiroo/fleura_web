import { Product } from "@/lib/shopify/types";
import ProductGrid from "../product/product-grid";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <ProductGrid 
      products={products}
      columns={{
        default: 1,
        sm: 2,
        md: 3,
        lg: 4
      }}
      showQuickActions={true}
    />
  );
}
