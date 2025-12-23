// Reusable API service layer
import { getApiUrl, getAuthToken } from "@/lib/config/api";

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Create a custom error class for API errors
export class ApiException extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.data = data;
  }
}

// Base fetch function with authentication
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses (like file downloads)
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      if (!response.ok) {
        throw new ApiException(
          `Request failed with status ${response.status}`,
          response.status
        );
      }
      return response as unknown as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiException(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(
      error instanceof Error ? error.message : "Network error occurred",
      0
    );
  }
}

// Generic CRUD operations
export const apiService = {
  // GET - Fetch all or by query params
  getAll: <T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> => {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return fetchApi<T>(`${endpoint}${queryString}`);
  },

  // GET - Fetch by ID
  getById: <T>(endpoint: string, id: string): Promise<T> => {
    return fetchApi<T>(`${endpoint}/${id}`);
  },

  // POST - Create
  create: <T>(endpoint: string, data: any): Promise<T> => {
    return fetchApi<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT - Update
  update: <T>(endpoint: string, id: string, data: any): Promise<T> => {
    return fetchApi<T>(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // PATCH - Partial update
  patch: <T>(endpoint: string, id: string, data: any): Promise<T> => {
    return fetchApi<T>(`${endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // DELETE
  delete: <T>(endpoint: string, id: string): Promise<T> => {
    return fetchApi<T>(`${endpoint}/${id}`, {
      method: "DELETE",
    });
  },

  // POST with FormData (for file uploads)
  upload: <T>(endpoint: string, formData: FormData): Promise<T> => {
    const url = getApiUrl(endpoint);
    const token = getAuthToken();

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new ApiException(
            data.message || `Request failed with status ${response.status}`,
            response.status,
            data
          );
        }
        return data;
      })
      .catch((error) => {
        if (error instanceof ApiException) {
          throw error;
        }
        throw new ApiException(
          error instanceof Error ? error.message : "Network error occurred",
          0
        );
      });
  },

  // PUT with FormData (for file uploads)
  updateWithFile: <T>(
    endpoint: string,
    id: string,
    formData: FormData
  ): Promise<T> => {
    const url = getApiUrl(`${endpoint}/${id}`);
    const token = getAuthToken();

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(url, {
      method: "PUT",
      headers,
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new ApiException(
            data.message || `Request failed with status ${response.status}`,
            response.status,
            data
          );
        }
        return data;
      })
      .catch((error) => {
        if (error instanceof ApiException) {
          throw error;
        }
        throw new ApiException(
          error instanceof Error ? error.message : "Network error occurred",
          0
        );
      });
  },
};
