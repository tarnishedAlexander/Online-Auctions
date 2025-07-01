import { useRef, useState, useCallback, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductHeader from "../components/ProductHeader";
import ProductFormDialog from "../components/ProductFormDialog";
import ProductActionsMenu from "../components/ProductActionsMenu";
import ProductCard from "../components/ProductCard";
import type { Product } from "../interfaces/productInterface";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useUser } from "../contexts/UserContextHelper";

function HomePage() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [value, setValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const isAdmin = user?.role === "admin";
  console.log("isAdmin", isAdmin, "user", user);

  const {
    products,
    isLoading,
    error,
    formik,
    editProductHandler,
    deleteProduct,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
    goToProduct,
  } = useProducts();

  // Handlers
  const handleCreateProduct = useCallback(() => {
    setImagePreview(null);
    formik.resetForm();
    openDialogHandler();
  }, [formik, openDialogHandler]);

  const handleEditProduct = useCallback(
    (product: Product) => {
      setImagePreview(product.image || null);
      editProductHandler(product);
    },
    [editProductHandler]
  );

  const handleCloseDialog = useCallback(() => {
    setImagePreview(null);
    closeDialogHandler();
  }, [closeDialogHandler]);

  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>, productId: string) => {
      if (isAdmin) {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedProductId(productId);
      }
    },
    [isAdmin]
  );

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
    setSelectedProductId(null);
  }, []);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
        formik.setFieldValue("image", imageUrl);
      }
    },
    [formik]
  );

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleGoToProduct = useCallback(
    (productId: string) => {
      goToProduct(productId);
    },
    [goToProduct]
  );

  // Filtrar productos con useMemo
  const filteredProducts = useMemo(() => {
    return {
      current: products.filter((product) => product.status === "active"),
      upcoming: products.filter((product) => product.status === "upcoming"),
      past: products.filter(
        (product) => product.status === "past" || product.status === "completed"
      ),
    };
  }, [products]);

  const renderAuctionSection = (
    title: string,
    auctions: Product[],
    emptyMessage: string
  ) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {auctions.length > 0 ? (
          auctions.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <ProductCard
                product={product}
                handleOpenMenu={handleOpenMenu}
                goToProduct={handleGoToProduct}
                isAdmin={isAdmin}
              />
            </Grid>
          ))
        ) : (
          <Typography>{emptyMessage}</Typography>
        )}
      </Grid>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <Box sx={{ py: 4 }}>
      <ProductHeader
        openDialogHandler={isAdmin ? handleCreateProduct : () => {}}
        value={value}
        setValue={setValue}
        isAdmin={isAdmin}
      />
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {value === 0 && (
            <>
              {renderAuctionSection(
                "Subastas Actuales",
                filteredProducts.current,
                "No current auctions available."
              )}
              {renderAuctionSection(
                "Subastas Próximas",
                filteredProducts.upcoming,
                "No upcoming auctions available."
              )}
            </>
          )}
          {value === 1 &&
            renderAuctionSection(
              "Historial de Subastas",
              filteredProducts.past,
              "No past auctions available."
            )}
        </>
      )}
      {isAdmin && selectedProductId && (
        <ProductActionsMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          productId={selectedProductId}
          handleCloseMenu={handleCloseMenu}
          editProductHandler={handleEditProduct}
          deleteProduct={deleteProduct}
          setImagePreview={setImagePreview}
          products={products}
        />
      )}
      <ProductFormDialog
        openDialog={openDialog}
        closeDialogHandler={handleCloseDialog}
        formik={formik}
        imagePreview={imagePreview}
        handleImageUpload={handleImageUpload}
        handleImageClick={handleImageClick}
        fileInputRef={fileInputRef}
        isEditing={!!selectedProductId}
      />
    </Box>
  );
}

export default HomePage;
