export type Menu = {
  title: string;
  path: string;
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type Edge<T> = {
  node: T;
};

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};
export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

// Customer Management Types
export type CustomerAddress = {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  company?: string;
  country: string;
  countryCodeV2: string;
  firstName: string;
  lastName: string;
  phone?: string;
  province?: string;
  provinceCode?: string;
  zip: string;
};

export type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  defaultAddress?: CustomerAddress;
  addresses: Connection<CustomerAddress>;
  orders: Connection<Order>;
  numberOfOrders: number;
};

export type Order = {
  id: string;
  orderNumber: number;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  statusUrl: string;
  processedAt: string;
  fulfillmentStatus?: string;
  financialStatus?: string;
  cancelledAt?: string;
  cancelReason?: string;
  currencyCode: string;
  totalPrice?: Money;
  currentTotalPrice?: Money;
  subtotalPrice?: Money;
  totalTax?: Money;
  totalShippingPrice?: Money;
  shippingAddress?: CustomerAddress;
  billingAddress?: CustomerAddress;
  lineItems: Connection<OrderLineItem>;
};

export type OrderLineItem = {
  title: string;
  quantity: number;
  variant?: {
    id: string;
    title: string;
    price: Money;
    image?: Image;
    product: {
      id: string;
      handle: string;
      title: string;
    };
  };
  originalTotalPrice?: Money;
  discountedTotalPrice?: Money;
};

// Customer Authentication Types
export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

export type CustomerUserError = {
  field?: string[];
  message: string;
  code?: string;
};

// GraphQL Operation Types for Customer Management
export type ShopifyCustomerCreateOperation = {
  data: {
    customerCreate: {
      customer?: Customer;
      customerUserErrors: CustomerUserError[];
    };
  };
  variables: {
    input: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      acceptsMarketing?: boolean;
    };
  };
};

export type ShopifyCustomerAccessTokenCreateOperation = {
  data: {
    customerAccessTokenCreate: {
      customerAccessToken?: CustomerAccessToken;
      customerUserErrors: CustomerUserError[];
    };
  };
  variables: {
    input: {
      email: string;
      password: string;
    };
  };
};

export type ShopifyCustomerAccessTokenDeleteOperation = {
  data: {
    customerAccessTokenDelete: {
      deletedAccessToken?: string;
      deletedCustomerAccessTokenId?: string;
      userErrors: CustomerUserError[];
    };
  };
  variables: {
    customerAccessToken: string;
  };
};

export type ShopifyCustomerOperation = {
  data: {
    customer: Customer;
  };
  variables: {
    customerAccessToken: string;
  };
};

export type ShopifyCustomerUpdateOperation = {
  data: {
    customerUpdate: {
      customer?: Customer;
      customerAccessToken?: CustomerAccessToken;
      customerUserErrors: CustomerUserError[];
    };
  };
  variables: {
    customerAccessToken: string;
    customer: {
      email?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      acceptsMarketing?: boolean;
    };
  };
};

export type ShopifyCustomerAddressCreateOperation = {
  data: {
    customerAddressCreate: {
      customerAddress?: CustomerAddress;
      customerUserErrors: CustomerUserError[];
    };
  };
  variables: {
    customerAccessToken: string;
    address: {
      address1: string;
      address2?: string;
      city: string;
      company?: string;
      country: string;
      firstName: string;
      lastName: string;
      phone?: string;
      province?: string;
      zip: string;
    };
  };
};

export type ShopifyCustomerPasswordResetOperation = {
  data: {
    customerRecover: {
      customerUserErrors: CustomerUserError[];
    };
  };
  variables: {
    email: string;
  };
};

// Wishlist Types (using Shopify metafields)
export type WishlistItem = {
  productId: string;
  variantId?: string;
  addedAt: string;
};

export type Wishlist = {
  id: string;
  items: WishlistItem[];
  updatedAt: string;
};
