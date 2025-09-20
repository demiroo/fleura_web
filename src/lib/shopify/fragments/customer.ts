export const customerFragment = /* GraphQL */ `
  fragment customer on Customer {
    id
    email
    firstName
    lastName
    displayName
    phone
    acceptsMarketing
    createdAt
    updatedAt
    numberOfOrders
    defaultAddress {
      id
      address1
      address2
      city
      company
      country
      countryCodeV2
      firstName
      lastName
      phone
      province
      provinceCode
      zip
    }
    addresses(first: 10) {
      edges {
        node {
          id
          address1
          address2
          city
          company
          country
          countryCodeV2
          firstName
          lastName
          phone
          province
          provinceCode
          zip
        }
      }
    }
  }
`;

export const customerAccessTokenFragment = /* GraphQL */ `
  fragment customerAccessToken on CustomerAccessToken {
    accessToken
    expiresAt
  }
`;

export const customerUserErrorFragment = /* GraphQL */ `
  fragment customerUserError on CustomerUserError {
    field
    message
    code
  }
`;

export const orderFragment = /* GraphQL */ `
  fragment order on Order {
    id
    orderNumber
    email
    phone
    createdAt
    updatedAt
    name
    statusUrl
    processedAt
    fulfillmentStatus
    financialStatus
    cancelledAt
    cancelReason
    currencyCode
    totalPrice {
      amount
      currencyCode
    }
    subtotalPrice {
      amount
      currencyCode
    }
    totalTax {
      amount
      currencyCode
    }
    totalShippingPrice {
      amount
      currencyCode
    }
    shippingAddress {
      id
      address1
      address2
      city
      company
      country
      countryCodeV2
      firstName
      lastName
      phone
      province
      provinceCode
      zip
    }
    billingAddress {
      id
      address1
      address2
      city
      company
      country
      countryCodeV2
      firstName
      lastName
      phone
      province
      provinceCode
      zip
    }
    lineItems(first: 50) {
      edges {
        node {
          title
          quantity
          variant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            product {
              id
              handle
              title
            }
          }
          originalTotalPrice {
            amount
            currencyCode
          }
          discountedTotalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
