// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  createProduct,
  editProduct,
  deleteProduct,
  placeBid,
} from "../services/productService";
import type { Product } from "../interfaces/productInterface";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: "",
      title: "",
      description: "",
      image: "",
      basePrice: 0,
      currentPrice: 0,
      duration: 0,
      startTime: "",
      endTime: "",
      status: "upcoming" as Product["status"],
      winnerId: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      basePrice: Yup.number().min(0, "Must be positive").required("Required"),
      duration: Yup.number().min(1, "Must be at least 1 second").required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.id) {
          await editProduct(values);
          setProducts((prev) =>
            prev.map((p) => (p.id === values.id ? values : p))
          );
        } else {
          const newProduct = await createProduct({
            ...values,
            id: crypto.randomUUID(),
            currentPrice: values.basePrice,
          });
          setProducts((prev) => [...prev, newProduct]);
        }
        resetForm();
        setOpenDialog(false);
      } catch (err) {
        console.error("Error saving product:", err);
        setError("Failed to save product");
      }
    },
  });

  const openDialogHandler = () => {
    setOpenDialog(true);
  };

  const closeDialogHandler = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const editProductHandler = (product: Product) => {
    formik.setValues({
      ...product,
      startTime: product.startTime ?? "",
      endTime: product.endTime ?? "",
      winnerId: product.winnerId ?? "",
      image: product.image ?? "",
      description: product.description ?? "",
      title: product.title ?? "",
      status: product.status ?? "upcoming",
      id: product.id ?? "",
      basePrice: product.basePrice ?? 0,
      currentPrice: product.currentPrice ?? 0,
      duration: product.duration ?? 0,
    });
    setOpenDialog(true);
  };

  const deleteProductHandler = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  };

  const goToProduct = (productId: string) => {
    navigate(`/app/home/products/${productId}`);
  };

  const handleBid = async (productId: string, amount: number, userId: string) => {
    try {
      const updatedProduct = await placeBid(productId, amount, userId);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );
    } catch (err) {
      console.error("Error placing bid:", err);
      setError("Failed to place bid");
    }
  };

  return {
    products,
    isLoading,
    error,
    formik,
    editProductHandler,
    deleteProduct: deleteProductHandler,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
    goToProduct,
    handleBid,
  };
};