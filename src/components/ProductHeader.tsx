import {
  Box,
  Button,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import ListIcon from "@mui/icons-material/List";

interface ProductHeaderProps {
  openDialogHandler: () => void;
  value: number;
  setValue: (value: number) => void;
}

function ProductHeader({
  openDialogHandler,
  value,
  setValue,
}: ProductHeaderProps) {
  const isAdmin = true;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={4}
      mb={4}
    >
      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openDialogHandler}
        >
          Agregar producto
        </Button>
      )}

      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ width: 500 }}
      >
        <BottomNavigationAction
          label="Todos los productos"
          icon={<ListIcon />}
        />
        <BottomNavigationAction
          label="Historial de productos"
          icon={<HistoryIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}

export default ProductHeader;
