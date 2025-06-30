import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { Product } from "../interfaces/productInterface";
import Timer from "../components/Timer";

interface ProductCardProps {
  product: Product;
  handleOpenMenu: (
    event: React.MouseEvent<HTMLElement>,
    productId: string
  ) => void;
  goToProduct: (productId: string) => void;
}

function ProductCard({
  product,
  handleOpenMenu,
  goToProduct,
}: ProductCardProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box position="relative">
          <IconButton
            onClick={(event) => handleOpenMenu(event, product.id)}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <CardMedia
            sx={{ height: 200 }}
            image={product.image || "https://picsum.photos/200/300"}
            title={product.title}
          />
          <Timer
            startTime={product.startTime}
            duration={product.duration}
            status={product.status === "completed" ? "past" : product.status}
          />
          <CardContent sx={{ flexGrow: 1, p: 2, textAlign: "center" }}>
            <Typography gutterBottom variant="h6" component="div">
              {product.title}
            </Typography>
            {product.status === "active" ? (
              <Typography variant="subtitle1" component="div" sx={{ mt: 1 }}>
                Current Bid: ${product.currentPrice.toFixed(2)}
              </Typography>
            ) : null}
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              {product.description}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
            <Button size="small" onClick={() => goToProduct(product.id)}>
              Ver detalles
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );
}

export default ProductCard;
