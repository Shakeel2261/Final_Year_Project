import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface Product {
  _id: string;
  productName: string;
  productCode: string;
  category: string | { _id: string; name: string; discount?: number };
  price: number;
  description?: string;
  stockQuantity: number;
  reservedStock?: number;
  imageUrl?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalRecords?: number;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  totalRecords: 0,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        totalRecords: number;
        data: Product[];
      }>(API_ENDPOINTS.PRODUCTS.LIST);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getById<Product>(
        API_ENDPOINTS.PRODUCTS.LIST,
        id
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch product");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData: FormData | Partial<Product>, { rejectWithValue }) => {
    try {
      let response;
      if (productData instanceof FormData) {
        response = await apiService.upload<{
          success: boolean;
          message: string;
          data: Product;
        }>(API_ENDPOINTS.PRODUCTS.CREATE, productData);
      } else {
        response = await apiService.create<{
          success: boolean;
          message: string;
          data: Product;
        }>(API_ENDPOINTS.PRODUCTS.CREATE, productData);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (
    { id, data }: { id: string; data: FormData | Partial<Product> },
    { rejectWithValue }
  ) => {
    try {
      let response;
      if (data instanceof FormData) {
        response = await apiService.updateWithFile<Product>(
          API_ENDPOINTS.PRODUCTS.LIST,
          id,
          data
        );
      } else {
        response = await apiService.update<Product>(
          API_ENDPOINTS.PRODUCTS.LIST,
          id,
          data
        );
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete<{ message: string }>(
        API_ENDPOINTS.PRODUCTS.LIST,
        id
      );
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalRecords = (state.totalRecords || 0) + 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
        state.totalRecords = (state.totalRecords || 0) - 1;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
