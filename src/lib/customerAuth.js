import { shopifyClient } from './shopify';

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_LOGIN_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_GET_QUERY = `
  query getCustomer($token: String!) {
    customer(customerAccessToken: $token) {
      id
      firstName
      lastName
      email
    }
  }
`;

const CUSTOMER_LOGOUT_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors { field message }
    }
  }
`;

export async function registerCustomer({ email, password, firstName, lastName }) {
  const { data } = await shopifyClient.request(CUSTOMER_CREATE_MUTATION, {
    variables: { input: { email, password, firstName, lastName } },
  });
  const errors = data?.customerCreate?.customerUserErrors;
  if (errors?.length) throw new Error(errors[0].message);
  return data.customerCreate.customer;
}

export async function loginCustomer({ email, password }) {
  const { data } = await shopifyClient.request(CUSTOMER_LOGIN_MUTATION, {
    variables: { input: { email, password } },
  });
  const errors = data?.customerAccessTokenCreate?.customerUserErrors;
  if (errors?.length) throw new Error(errors[0].message);
  const token = data.customerAccessTokenCreate.customerAccessToken;
  localStorage.setItem('shopify_customer_token', token.accessToken);
  localStorage.setItem('shopify_customer_expires', token.expiresAt);
  return token;
}

export async function getCustomer() {
  const token = localStorage.getItem('shopify_customer_token');
  if (!token) return null;
  try {
    const { data } = await shopifyClient.request(CUSTOMER_GET_QUERY, {
      variables: { token },
    });
    return data?.customer || null;
  } catch {
    return null;
  }
}

export async function logoutCustomer() {
  const token = localStorage.getItem('shopify_customer_token');
  if (token) {
    try {
      await shopifyClient.request(CUSTOMER_LOGOUT_MUTATION, {
        variables: { customerAccessToken: token },
      });
    } catch { /* ignore */ }
  }
  localStorage.removeItem('shopify_customer_token');
  localStorage.removeItem('shopify_customer_expires');
}
