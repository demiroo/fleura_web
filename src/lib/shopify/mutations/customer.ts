import { customerFragment, customerAccessTokenFragment, customerUserErrorFragment } from '../fragments/customer';

export const customerCreateMutation = /* GraphQL */ `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ...customer
      }
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerFragment}
  ${customerUserErrorFragment}
`;

export const customerAccessTokenCreateMutation = /* GraphQL */ `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        ...customerAccessToken
      }
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerAccessTokenFragment}
  ${customerUserErrorFragment}
`;

export const customerAccessTokenDeleteMutation = /* GraphQL */ `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        ...customerUserError
      }
    }
  }
  ${customerUserErrorFragment}
`;

export const customerUpdateMutation = /* GraphQL */ `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        ...customer
      }
      customerAccessToken {
        ...customerAccessToken
      }
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerFragment}
  ${customerAccessTokenFragment}
  ${customerUserErrorFragment}
`;

export const customerAddressCreateMutation = /* GraphQL */ `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
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
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerUserErrorFragment}
`;

export const customerAddressUpdateMutation = /* GraphQL */ `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
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
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerUserErrorFragment}
`;

export const customerAddressDeleteMutation = /* GraphQL */ `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerUserErrorFragment}
`;

export const customerDefaultAddressUpdateMutation = /* GraphQL */ `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerUserErrorFragment}
`;

export const customerPasswordResetMutation = /* GraphQL */ `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerUserErrorFragment}
`;

export const customerPasswordResetByUrlMutation = /* GraphQL */ `
  mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
    customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      customer {
        id
      }
      customerAccessToken {
        ...customerAccessToken
      }
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerAccessTokenFragment}
  ${customerUserErrorFragment}
`;

export const customerActivateMutation = /* GraphQL */ `
  mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
    customerActivate(id: $id, input: $input) {
      customer {
        ...customer
      }
      customerAccessToken {
        ...customerAccessToken
      }
      customerUserErrors {
        ...customerUserError
      }
    }
  }
  ${customerFragment}
  ${customerAccessTokenFragment}
  ${customerUserErrorFragment}
`;
