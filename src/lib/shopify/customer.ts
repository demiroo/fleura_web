import { SHOPIFY_GRAPHQL_API_ENDPOINT } from "../constants";
import { isShopifyError } from "../type-guards";
import { ensureStartWith } from "../utils";
import {
  customerCreateMutation,
  customerAccessTokenCreateMutation,
  customerAccessTokenDeleteMutation,
  customerUpdateMutation,
  customerAddressCreateMutation,
  customerPasswordResetMutation,
} from "./mutations/customer";
import {
  getCustomerQuery,
  getCustomerOrdersQuery,
  getCustomerAddressesQuery,
} from "./queries/customer";
import {
  Customer,
  CustomerAddress,
  CustomerAccessToken,
  Order,
  ShopifyCustomerCreateOperation,
  ShopifyCustomerAccessTokenCreateOperation,
  ShopifyCustomerAccessTokenDeleteOperation,
  ShopifyCustomerOperation,
  ShopifyCustomerUpdateOperation,
  ShopifyCustomerAddressCreateOperation,
  ShopifyCustomerPasswordResetOperation,
  Connection,
} from "./types";

const domain = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN)
  ? ensureStartWith(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN!, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetchClient<T>({
  cache = "no-store",
  headers,
  query,
  variables,
  suppressErrorLogging = false,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
  suppressErrorLogging?: boolean;
}): Promise<{ status: number; body: T } | never> {
  // Validation
  if (!domain || !key) {
    throw new Error(
      'Missing Shopify configuration. Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.'
    );
  }

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    if (!suppressErrorLogging) {
      console.error('Shopify API Error:', error);
      console.error('Endpoint:', endpoint);
      console.error('Has Key:', !!key);
    }
    
    if (isShopifyError(error)) {
      throw {
        cause: error.cause?.toString() || "unknown",
        status: error.status || 500,
        message: error.message,
        query,
      };
    }

    throw {
      error: error instanceof Error ? error.message : 'Unknown error',
      query,
    };
  }
}

function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
  return array.edges.map((edge) => edge?.node);
}

// Customer Management Functions
function reshapeCustomer(customer: any): Customer {
  if (!customer) return customer;

  return {
    ...customer,
    addresses: customer.addresses ? removeEdgesAndNodes(customer.addresses) : [],
    orders: customer.orders ? removeEdgesAndNodes(customer.orders) : [],
  };
}

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}): Promise<{ customer?: Customer; errors: any[] }> {
  const res = await shopifyFetchClient<ShopifyCustomerCreateOperation>({
    query: customerCreateMutation,
    variables: { input },
    cache: "no-store",
  });

  return {
    customer: res.body.data.customerCreate.customer ? reshapeCustomer(res.body.data.customerCreate.customer) : undefined,
    errors: res.body.data.customerCreate.customerUserErrors,
  };
}

export async function loginCustomer(input: {
  email: string;
  password: string;
}): Promise<{ customerAccessToken?: CustomerAccessToken; errors: any[] }> {
  const res = await shopifyFetchClient<ShopifyCustomerAccessTokenCreateOperation>({
    query: customerAccessTokenCreateMutation,
    variables: { input },
    cache: "no-store",
  });

  return {
    customerAccessToken: res.body.data.customerAccessTokenCreate.customerAccessToken,
    errors: res.body.data.customerAccessTokenCreate.customerUserErrors,
  };
}

export async function logoutCustomer(customerAccessToken: string): Promise<{ success: boolean; errors: any[] }> {
  try {
    const res = await shopifyFetchClient<ShopifyCustomerAccessTokenDeleteOperation>({
      query: customerAccessTokenDeleteMutation,
      variables: { customerAccessToken },
      cache: "no-store",
      suppressErrorLogging: true, // Suppress errors since logout should work locally anyway
    });

    return {
      success: !!res.body.data.customerAccessTokenDelete.deletedAccessToken,
      errors: res.body.data.customerAccessTokenDelete.userErrors,
    };
  } catch (error) {
    // Silently fail - logout should work locally even if API fails
    return {
      success: false,
      errors: [{ message: 'API logout failed', code: 'API_ERROR' }],
    };
  }
}

export async function getCustomer(customerAccessToken: string): Promise<Customer | undefined> {
  if (!customerAccessToken) return undefined;

  try {
    const res = await shopifyFetchClient<ShopifyCustomerOperation>({
      query: getCustomerQuery,
      variables: { customerAccessToken },
      cache: "no-store",
    });

    return reshapeCustomer(res.body.data.customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return undefined;
  }
}

export async function updateCustomer(
  customerAccessToken: string,
  customer: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }
): Promise<{ customer?: Customer; customerAccessToken?: CustomerAccessToken; errors: any[] }> {
  const res = await shopifyFetchClient<ShopifyCustomerUpdateOperation>({
    query: customerUpdateMutation,
    variables: { customerAccessToken, customer },
    cache: "no-store",
  });

  return {
    customer: res.body.data.customerUpdate.customer ? reshapeCustomer(res.body.data.customerUpdate.customer) : undefined,
    customerAccessToken: res.body.data.customerUpdate.customerAccessToken,
    errors: res.body.data.customerUpdate.customerUserErrors,
  };
}

export async function getCustomerOrders(
  customerAccessToken: string,
  first: number = 20
): Promise<Order[]> {
  if (!customerAccessToken) return [];

  try {
    const res = await shopifyFetchClient({
      query: getCustomerOrdersQuery,
      variables: { customerAccessToken, first },
      cache: "no-store",
    });

    const customer = res.body.data.customer;
    if (!customer?.orders) return [];

    return removeEdgesAndNodes(customer.orders).map((order: any) => ({
      ...order,
      lineItems: removeEdgesAndNodes(order.lineItems),
    }));
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
}

export async function createCustomerAddress(
  customerAccessToken: string,
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
  }
): Promise<{ customerAddress?: CustomerAddress; errors: any[] }> {
  const res = await shopifyFetchClient<ShopifyCustomerAddressCreateOperation>({
    query: customerAddressCreateMutation,
    variables: { customerAccessToken, address },
    cache: "no-store",
  });

  return {
    customerAddress: res.body.data.customerAddressCreate.customerAddress,
    errors: res.body.data.customerAddressCreate.customerUserErrors,
  };
}

export async function getCustomerAddresses(customerAccessToken: string): Promise<{
  addresses: CustomerAddress[];
  defaultAddress?: CustomerAddress;
}> {
  if (!customerAccessToken) return { addresses: [] };

  try {
    const res = await shopifyFetchClient({
      query: getCustomerAddressesQuery,
      variables: { customerAccessToken },
      cache: "no-store",
    });

    const customer = res.body.data.customer;
    if (!customer) return { addresses: [] };

    return {
      addresses: removeEdgesAndNodes(customer.addresses),
      defaultAddress: customer.defaultAddress,
    };
  } catch (error) {
    console.error('Error fetching customer addresses:', error);
    return { addresses: [] };
  }
}

export async function recoverCustomerPassword(email: string): Promise<{ errors: any[] }> {
  const res = await shopifyFetchClient<ShopifyCustomerPasswordResetOperation>({
    query: customerPasswordResetMutation,
    variables: { email },
    cache: "no-store",
  });

  return {
    errors: res.body.data.customerRecover.customerUserErrors,
  };
}
