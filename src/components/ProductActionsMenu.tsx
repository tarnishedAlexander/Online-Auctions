import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Product } from "../interfaces/productInterface";

interface ProductActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  productId: string | null;
  handleCloseMenu: () => void;
  editProductHandler: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  setImagePreview: (url: string | null) => void;
  products: Product[];
}

function ProductActionsMenu({
  anchorEl,
  open,
  productId,
  handleCloseMenu,
  editProductHandler,
  deleteProduct,
  setImagePreview,
  products,
}: ProductActionsMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem
        onClick={(event) => {
          event.stopPropagation();
          const selectedProduct = products.find((p) => p.id === productId);
          if (selectedProduct) {
            editProductHandler(selectedProduct);
            setImagePreview(selectedProduct.image || null);
          }
          handleCloseMenu();
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Editar producto" />
      </MenuItem>
      <MenuItem
        onClick={(event) => {
          event.stopPropagation();
          if (productId !== null) {
            deleteProduct(productId);
          }
          handleCloseMenu();
        }}
        sx={{ color: "error.main" }}
      >
        <ListItemIcon sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Eliminar producto" />
      </MenuItem>
    </Menu>
  );
}

export default ProductActionsMenu;
