import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Product } from "../interfaces/productInterface";
import TimerDisplay from "./TimerDisplay";

interface ProductDetailsProps {
  product: Product;
  bids: { userId: string; bid: number; timestamp: string }[];
  getUserName: (userId: string) => string;
  onTimerEnd?: () => Promise<void>;
}

function ProductDetails({
  product,
  getUserName,
  onTimerEnd,
}: ProductDetailsProps) {
  const [timeUntilStart, setTimeUntilStart] = useState<string | null>(null);

  // Countdown for "upcoming" products
  useEffect(() => {
    if (product.status !== "upcoming" || !product.startTime) {
      setTimeUntilStart(null);
      return;
    }

    const start = new Date(product.startTime).getTime();

    const updateStartTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((start - now) / 1000));
      if (remaining <= 0) {
        setTimeUntilStart(null);
      } else {
        const days = Math.floor(remaining / (3600 * 24));
        const hours = Math.floor((remaining % (3600 * 24)) / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const secs = Math.floor(remaining % 60);
        setTimeUntilStart(`${days}d ${hours}h ${minutes}m ${secs}s`);
      }
    };

    updateStartTimer(); // Initial call
    const interval = setInterval(updateStartTimer, 1000);

    return () => clearInterval(interval);
  }, [product.status, product.startTime]);

  const endTime = product.endTime
    ? new Date(product.endTime).toUTCString()
    : "Not specified";
  const startTime = product.startTime
    ? new Date(product.startTime).toUTCString()
    : "Not specified";

  return (
    <>
      {product.status === "active" && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {product.title}
          </Typography>
          <TimerDisplay
            startTime={product.startTime}
            duration={product.duration}
            status={product.status}
            onTimerEnd={onTimerEnd} // Pass onTimerEnd to TimerDisplay
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, mb: 1 }}
          >
            Auction ends: {endTime}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            This auction is {product.status}.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            Minimum bid for this auction is ${product.basePrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Current bid: ${product.currentPrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Winner ID: {product.winnerId || "None"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Description: {product.description}
          </Typography>
        </Box>
      )}
      {product.status === "upcoming" && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {product.title}
          </Typography>
          {timeUntilStart && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Time until start: {timeUntilStart}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Description: {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            This auction is upcoming and will start on {startTime}.
          </Typography>
        </Box>
      )}
      {product.status === "past" && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Description: {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Sold for: ${product.currentPrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            Winner: {getUserName(product.winnerId || "Not available")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Sale date: {endTime}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default ProductDetails;
