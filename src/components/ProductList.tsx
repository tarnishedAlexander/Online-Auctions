import { Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../interfaces/productInterface";

interface ProductListProps {
  filteredProducts: Product[];
  handleOpenMenu: (
    event: React.MouseEvent<HTMLElement>,
    productId: string
  ) => void;
  goToProduct: (productId: string) => void;
}

function ProductList({
  filteredProducts,
  handleOpenMenu,
  goToProduct,
}: ProductListProps) {
  return (
    <Grid container spacing={2} sx={{ marginTop: 2 }}>
      {Array.isArray(filteredProducts) ? (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleOpenMenu={handleOpenMenu}
            goToProduct={goToProduct}
          />
        ))
      ) : (
        <Typography>No se encontraron productos.</Typography>
      )}
    </Grid>
  );
}

export default ProductList;
