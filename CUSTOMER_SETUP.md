# Customer Authentication Setup

## Required Environment Variables

For the customer authentication system to work, you need to set up the following environment variables in your `.env.local` file:

### 1. Create `.env.local` file

Create a file named `.env.local` in the root directory of your project.

### 2. Add the following variables:

```bash
# Company Information
COMPANY_NAME=Fleura
TWITTER_CREATOR=@fleura
TWITTER_SITE=@fleura  
SITE_NAME=Fleura

# Shopify Configuration (Server-side)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
SHOPIFY_REVALIDATION_SECRET=your_revalidation_secret_here

# Shopify Configuration (Client-side - REQUIRED for Customer Authentication)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

### 3. Replace placeholder values

Replace the following placeholder values with your actual Shopify store details:

- `your-store.myshopify.com` → Your actual Shopify store domain
- `your_storefront_access_token_here` → Your Shopify Storefront Access Token
- `your_revalidation_secret_here` → A secret string for webhook validation

### 4. Shopify Storefront Access Token Setup

1. Go to your Shopify Partner Dashboard
2. Navigate to your app or create a new private app
3. Enable Storefront API access
4. **Important**: Make sure the following permissions are enabled:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collections`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_write_customers` ← **REQUIRED for customer registration**
   - `unauthenticated_read_customer_tags`

### 5. Test the Setup

After setting up the environment variables:

1. Restart your development server: `npm run dev`
2. Try to register a new customer account
3. Check the browser console for any error messages

### Troubleshooting

**Error: "Missing Shopify configuration"**
- Make sure `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` are set

**Error: "404 Not Found"**
- Check that your store domain is correct (without https://)
- Verify your Storefront Access Token is valid

**Error: "Access denied"**
- Ensure customer permissions are enabled in your Storefront Access Token

**Error: "Registration error"**
- Check that `unauthenticated_write_customers` permission is enabled
- Verify the customer data format matches Shopify requirements

### Example .env.local

```bash
COMPANY_NAME=Fleura
TWITTER_CREATOR=@fleura
TWITTER_SITE=@fleura  
SITE_NAME=Fleura
SHOPIFY_STORE_DOMAIN=fleura-demo.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_1234567890abcdef
SHOPIFY_REVALIDATION_SECRET=super_secret_key_123
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=fleura-demo.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_1234567890abcdef
```

### Note

The `NEXT_PUBLIC_` prefixed variables are required because the customer authentication happens on the client-side (in the browser). Without these, the authentication system cannot connect to your Shopify store.
