import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import ordersReducer from "./slices/ordersSlice";
import customersReducer from "./slices/customersSlice";
import transactionsReducer from "./slices/transactionsSlice";
import invoicesReducer from "./slices/invoicesSlice";
import ledgerReducer from "./slices/ledgerSlice";
import reportsReducer from "./slices/reportsSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    customers: customersReducer,
    transactions: transactionsReducer,
    invoices: invoicesReducer,
    ledger: ledgerReducer,
    reports: reportsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
