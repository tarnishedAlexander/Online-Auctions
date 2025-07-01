import jsonServerInstance from "../api/jsonInstance";
import type { Product } from "../interfaces/productInterface";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await jsonServerInstance.get("/products");
    return response.data as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProduct = async (prodId: string) => {
  try {
    const response = await jsonServerInstance.get(`/products/${prodId}`);
    return response.data as Product;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await jsonServerInstance.post("/products", product);
    return response.data as Product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const editProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await jsonServerInstance.put(`/products/${product.id}`, product);
    return response.data as Product;
  } catch (error) {
    console.error("Error editing product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await jsonServerInstance.delete(`/products/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const placeBid = async (
  productId: string,
  amount: number,
  userId: string
): Promise<Product> => {
  try {
    const product = await getProduct(productId);
    if (amount <= product.currentPrice) {
      throw new Error("Bid must be higher than current price");
    }
    const response = await jsonServerInstance.patch(`/products/${productId}`, {
      currentPrice: amount,
      winnerId: userId,
    });
    return response.data as Product;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error;
  }
};