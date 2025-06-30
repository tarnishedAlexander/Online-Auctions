import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import type { Product } from "../interfaces/productInterface";
import type { User } from "../interfaces/userInterface";
import { useProductsStore } from "../store/useProductsStore";
import ProductDetails from "../components/ProductDetails";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";
import BidChart from "../components/BidChart";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

interface Bid {
  userId: string;
  bid: number;
  timestamp: string;
}

function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "error"
  );
  const { fetchProduct } = useProductsStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        const fetchedProduct = await fetchProduct(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        }
        const bidsResponse = await fetch(
          `http://localhost:3000/bids?productId=${productId}`
        );
        if (bidsResponse.ok) {
          const bidsData = await bidsResponse.json();
          setBids(bidsData);
        }
        const usersResponse = await fetch(`http://localhost:3000/users`);
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }
      }
    };
    loadProduct();

    if (productId) {
      eventSourceRef.current = new EventSource(
        `http://localhost:5010/events/${productId}`
      );
      eventSourceRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                currentPrice: data.currentPrice,
                winnerId: data.winnerId,
              }
            : prev
        );
        const newBid: Bid = {
          userId: data.winnerId,
          bid: data.currentPrice,
          timestamp: new Date().toISOString(),
        };
        setBids((prevBids) => [...prevBids, newBid]);
      };
      eventSourceRef.current.onerror = () => {
        console.log("EventSource failed");
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [productId, fetchProduct]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : `Usuario ${userId}`;
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          mb: 4,
        }}
      >
        <Grid container spacing={2} sx={{ maxWidth: "800px", width: "100%" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Item>
              <img
                src={product.image}
                alt={product.title}
                style={{ width: "100%", height: "auto" }}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Item
              sx={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                p: 2,
              }}
            >
              <ProductDetails
                product={product}
                bids={bids}
                getUserName={getUserName}
              />
              {product.status === "active" && (
                <BidForm
                  productId={productId!}
                  currentPrice={product.currentPrice}
                  setAlertMessage={setAlertMessage}
                  setAlertSeverity={setAlertSeverity}
                  setAlertOpen={setAlertOpen}
                  setBids={setBids}
                />
              )}
              {(product.status === "active" || product.status === "past") &&
                bids.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <BidHistory bids={bids} getUserName={getUserName} />
                    {product.status === "past" && (
                      <BidChart bids={bids} getUserName={getUserName} />
                    )}
                  </Box>
                )}
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleAlertClose}
          variant="filled"
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductPage;
