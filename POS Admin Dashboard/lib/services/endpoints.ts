// Centralized API endpoints configuration
export const API_ENDPOINTS = {
  // Admin Authentication
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
  },

  // Customers
  CUSTOMERS: {
    LIST: "/customers",
    BY_ID: (id: string) => `/customers/${id}`,
    CREATE: "/customers",
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },

  // Categories
  CATEGORIES: {
    LIST: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
    CREATE: "/categories",
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    DELETE: (id: string) => `/orders/${id}`,
  },

  // Transactions
  TRANSACTIONS: {
    LIST: "/transactions",
    RECEIVABLES: "/transactions/receivables",
    CREATE: "/transactions",
    PAY: (id: string) => `/transactions/pay/${id}`,
    DELETE: (id: string) => `/transactions/${id}`,
  },

  // Invoices
  INVOICES: {
    LIST: "/invoices",
    SUMMARY: "/invoices/summary",
    BY_ID: (id: string) => `/invoices/${id}`,
    DOWNLOAD: (id: string) => `/invoices/${id}/download`,
    BY_TRANSACTION: (transactionId: string) =>
      `/invoices/transaction/${transactionId}`,
    BY_CUSTOMER: (customerId: string) => `/invoices/customer/${customerId}`,
    GENERATE: (transactionId: string) => `/invoices/generate/${transactionId}`,
    UPDATE_PAYMENT: (id: string) => `/invoices/${id}/payment`,
    DELETE: (id: string) => `/invoices/${id}`,
  },

  // Ledger
  LEDGER: {
    LIST: "/ledger",
    BY_ID: (id: string) => `/ledger/${id}`,
    ACCOUNT_BALANCE: "/ledger/account/balance",
    TRIAL_BALANCE: "/ledger/reports/trial-balance",
    PROFIT_LOSS: "/ledger/reports/profit-loss",
    BALANCE_SHEET: "/ledger/reports/balance-sheet",
    CREATE: "/ledger",
    UPDATE: (id: string) => `/ledger/${id}`,
    DELETE: (id: string) => `/ledger/${id}`,
  },

  // Reports
  REPORTS: {
    SALES: "/reports/sales",
    PURCHASES: "/reports/purchases",
    DASHBOARD: "/reports/dashboard",
    REVENUE: "/reports/revenue",
  },
} as const;
