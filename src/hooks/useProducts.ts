import { useEffect, useState } from "react";
import { useProductsStore } from "../store/useProductsStore";
import { useFormik } from "formik";
import type { Product } from "../interfaces/productInterface";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export const useProducts = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, isLoading, error, fetchProducts, createProduct, editProduct, deleteProduct, fetchProduct } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  
  const formik = useFormik({
    initialValues: selectedProduct
      ? { ...selectedProduct, currentPrice: selectedProduct.currentPrice || selectedProduct.basePrice }
      : {
          id: "",
          title: "",
          description: "",
          image: "",
          basePrice: 0,
          currentPrice: 0,
          duration: 0,
          startTime: "",
          endTime: "",
          status: "active" as const,
          winnerId: undefined,
        },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      basePrice: Yup.number().required("Required").positive().max(1000000),
      image: Yup.string().optional(),
      currentPrice: Yup.number().required("Required").positive().max(1000000),
      duration: Yup.number().required("Required").positive().max(1000000),
      startTime: Yup.string().required("Required"),
      endTime: Yup.string().required("Required"),
      status: Yup.string().required("Required").oneOf(["active", "upcoming", "past"]),
      winnerId: Yup.string().optional(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (selectedProduct?.id) {
          await editProduct({ ...values, id: selectedProduct.id });
        } else {
          const newProduct = { ...values, id: values.id || crypto.randomUUID() };
          await createProduct(newProduct);
        }
        formik.resetForm();
        setSelectedProduct(null);
        setOpenDialog(false);
        navigate("/app/home");
      } catch (error) {
        console.error("Error saving product:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const editProductHandler = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const openDialogHandler = () => {
    formik.resetForm();
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const closeDialogHandler = () => {
    formik.resetForm();
    setSelectedProduct(null);
    setOpenDialog(false);
  };

  const goToProduct = (productId: string) => {
    console.log("Navigating to:", `/app/home/products/${productId}`);
    navigate(`/app/home/products/${productId}`);
  };

  return {
    products,
    isLoading,
    error,
    formik,
    editProductHandler,
    goToProduct,
    deleteProduct,
    fetchProduct,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
  };
};

