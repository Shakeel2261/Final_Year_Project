// Centralized API endpoints configuration for Web Frontend
export const API_ENDPOINTS = {
  // Customer Authentication
  CUSTOMER_AUTH: {
    LOGIN: "/customer-auth/login",
    FORGOT_PASSWORD: "/customer-auth/forgot-password",
    RESET_PASSWORD: (token: string) => `/customer-auth/reset-password/${token}`,
  },

  // Products (public)
  PRODUCTS: {
    LIST: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
  },

  // Categories (public)
  CATEGORIES: {
    LIST: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
  },

  // Orders (customer)
  ORDERS: {
    LIST: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
  },

  // Transactions (customer)
  TRANSACTIONS: {
    CREATE: "/transactions",
  },

  // Stripe Payments
  STRIPE: {
    CREATE_PAYMENT_INTENT: "/stripe/create-payment-intent",
    CONFIRM_PAYMENT: "/stripe/confirm-payment",
    PAYMENT_STATUS: (paymentIntentId: string) =>
      `/stripe/payment-status/${paymentIntentId}`,
  },
} as const;
