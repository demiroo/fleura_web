'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Customer, CustomerAccessToken, CustomerAddress, Order } from '@/lib/shopify/types';
import {
  getCustomer,
  loginCustomer,
  logoutCustomer,
  createCustomer,
  updateCustomer,
  getCustomerOrders,
  getCustomerAddresses,
  createCustomerAddress,
  recoverCustomerPassword,
} from '@/lib/shopify/customer';

type CustomerState = {
  customer: Customer | null;
  customerAccessToken: string | null;
  orders: Order[];
  addresses: CustomerAddress[];
  defaultAddress?: CustomerAddress;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

type CustomerAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIALIZING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CUSTOMER'; payload: Customer | null }
  | { type: 'SET_ACCESS_TOKEN'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_ADDRESSES'; payload: { addresses: CustomerAddress[]; defaultAddress?: CustomerAddress } }
  | { type: 'LOGIN_SUCCESS'; payload: { customer: Customer; accessToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: CustomerState = {
  customer: null,
  customerAccessToken: null,
  orders: [],
  addresses: [],
  defaultAddress: undefined,
  isLoading: false,
  isInitializing: true,
  error: null,
  isAuthenticated: false,
};

function customerReducer(state: CustomerState, action: CustomerAction): CustomerState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_INITIALIZING':
      return { ...state, isInitializing: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CUSTOMER':
      return { 
        ...state, 
        customer: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      };
    case 'SET_ACCESS_TOKEN':
      return { 
        ...state, 
        customerAccessToken: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_ADDRESSES':
      return { 
        ...state, 
        addresses: action.payload.addresses,
        defaultAddress: action.payload.defaultAddress
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        customer: action.payload.customer,
        customerAccessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

type CustomerContextType = {
  state: CustomerState;
  login: (email: string, password: string) => Promise<{ success: boolean; errors: any[] }>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }) => Promise<{ success: boolean; errors: any[] }>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }) => Promise<{ success: boolean; errors: any[] }>;
  loadOrders: () => Promise<void>;
  loadAddresses: () => Promise<void>;
  addAddress: (address: {
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
  }) => Promise<{ success: boolean; errors: any[] }>;
  recoverPassword: (email: string) => Promise<{ success: boolean; errors: any[] }>;
  clearError: () => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const CUSTOMER_TOKEN_KEY = 'customerAccessToken';

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  // Load customer data on mount if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem(CUSTOMER_TOKEN_KEY);
    if (savedToken) {
      dispatch({ type: 'SET_ACCESS_TOKEN', payload: savedToken });
      loadCustomerData(savedToken);
    } else {
      // No token found, not authenticated
      dispatch({ type: 'SET_INITIALIZING', payload: false });
    }
  }, []);

  const loadCustomerData = async (token: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const customer = await getCustomer(token);
      if (customer) {
        dispatch({ type: 'SET_CUSTOMER', payload: customer });
        dispatch({ type: 'SET_ACCESS_TOKEN', payload: token });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZING', payload: false });
        
        // Load additional customer data
        await Promise.all([
          loadCustomerOrders(token),
          loadCustomerAddresses(token)
        ]);
      } else {
        // Token might be expired, remove it
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        dispatch({ type: 'SET_ACCESS_TOKEN', payload: null });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZING', payload: false });
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      dispatch({ type: 'SET_ACCESS_TOKEN', payload: null });
      dispatch({ type: 'SET_ERROR', payload: 'Session expired. Please log in again.' });
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_INITIALIZING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await loginCustomer({ email, password });
      
      if (result.customerAccessToken) {
        const token = result.customerAccessToken.accessToken;
        localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
        
        const customer = await getCustomer(token);
        if (customer) {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { customer, accessToken: token } 
          });
          
          // Load additional customer data after successful login
          await Promise.all([
            loadCustomerOrders(token),
            loadCustomerAddresses(token)
          ]);
          
          return { success: true, errors: [] };
        }
      }

      return { success: false, errors: result.errors };
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' });
      return { success: false, errors: [{ message: 'Login failed. Please try again.' }] };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await createCustomer(data);
      
      if (result.customer && result.errors.length === 0) {
        // Auto-login after successful registration
        const loginResult = await login(data.email, data.password);
        return loginResult;
      }

      return { success: false, errors: result.errors };
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please try again.' });
      return { success: false, errors: [{ message: 'Registration failed. Please try again.' }] };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      if (state.customerAccessToken) {
        const result = await logoutCustomer(state.customerAccessToken);
        // No need to log anything - errors are already handled gracefully
      }
    } catch (error) {
      // This should rarely happen now, but just in case
      console.debug('Logout API error (continuing with local logout):', error);
    } finally {
      // Always clear local state regardless of API success
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }) => {
    if (!state.customerAccessToken) {
      return { success: false, errors: [{ message: 'Not authenticated' }] };
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await updateCustomer(state.customerAccessToken, data);
      
      if (result.customer) {
        dispatch({ type: 'SET_CUSTOMER', payload: result.customer });
        
        // Update token if it was refreshed
        if (result.customerAccessToken) {
          const newToken = result.customerAccessToken.accessToken;
          localStorage.setItem(CUSTOMER_TOKEN_KEY, newToken);
          dispatch({ type: 'SET_ACCESS_TOKEN', payload: newToken });
        }
        
        return { success: true, errors: [] };
      }

      return { success: false, errors: result.errors };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, errors: [{ message: 'Update failed. Please try again.' }] };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadOrders = async () => {
    if (!state.customerAccessToken) return;

    try {
      const orders = await getCustomerOrders(state.customerAccessToken);
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadCustomerOrders = async (token: string) => {
    try {
      const orders = await getCustomerOrders(token);
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadCustomerAddresses = async (token: string) => {
    try {
      const result = await getCustomerAddresses(token);
      dispatch({ type: 'SET_ADDRESSES', payload: result });
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const loadAddresses = async () => {
    if (!state.customerAccessToken) return;
    await loadCustomerAddresses(state.customerAccessToken);
  };

  const addAddress = async (address: {
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
  }) => {
    if (!state.customerAccessToken) {
      return { success: false, errors: [{ message: 'Not authenticated' }] };
    }

    try {
      const result = await createCustomerAddress(state.customerAccessToken, address);
      
      if (result.customerAddress) {
        // Reload addresses
        await loadAddresses();
        return { success: true, errors: [] };
      }

      return { success: false, errors: result.errors };
    } catch (error) {
      console.error('Add address error:', error);
      return { success: false, errors: [{ message: 'Failed to add address. Please try again.' }] };
    }
  };

  const recoverPassword = async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await recoverCustomerPassword(email);
      
      if (result.errors.length === 0) {
        return { success: true, errors: [] };
      }

      return { success: false, errors: result.errors };
    } catch (error) {
      console.error('Password recovery error:', error);
      return { success: false, errors: [{ message: 'Password recovery failed. Please try again.' }] };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: CustomerContextType = {
    state,
    login,
    register,
    logout,
    updateProfile,
    loadOrders,
    loadAddresses,
    addAddress,
    recoverPassword,
    clearError,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}

export { CustomerContext };
