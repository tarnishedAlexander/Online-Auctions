import { create } from "zustand";
import type { Product } from "../interfaces/productInterface";
import { createProduct, editProduct, getAllProducts, deleteProduct, getProduct } from "../services/productService";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProduct: (productId: string) => Promise<Product | null>;
  createProduct: (product: Product) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getAllProducts();
      if (Array.isArray(response)) {
      set({ products: response });
      } else {
        console.error("API response is not an array:", response);
        set({ error: "Invalid data format received from server." });
        set({ products: [] });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch products";
      set({ error: errorMessage, products: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createProduct(product);
      set((state) => ({
        products: [...state.products, response],
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create product";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  editProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      const response = await editProduct(product);
      set((state) => ({
        products: state.products.map((p) => (p.id === product.id ? response : p)),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to edit product";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete product";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchProduct: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const product = await getProduct(productId);
      return product;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch product";
      set({ error: errorMessage });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));