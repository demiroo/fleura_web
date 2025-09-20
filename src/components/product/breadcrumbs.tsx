import { Product } from "@/lib/shopify/types";
import { ChevronRightIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

interface BreadcrumbsProps {
  product: Product;
}

export function Breadcrumbs({ product }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <HomeIcon className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      <ChevronRightIcon className="h-4 w-4" />
      
      <Link 
        href="/search" 
        className="hover:text-foreground transition-colors"
      >
        Products
      </Link>
      
      {product.tags.length > 0 && (
        <>
          <ChevronRightIcon className="h-4 w-4" />
          <Link 
            href={`/search/${product.tags[0]}`}
            className="hover:text-foreground transition-colors capitalize"
          >
            {product.tags[0]}
          </Link>
        </>
      )}
      
      <ChevronRightIcon className="h-4 w-4" />
      
      <span className="text-foreground font-medium truncate max-w-[200px]">
        {product.title}
      </span>
    </nav>
  );
}
