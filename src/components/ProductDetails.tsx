import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Product } from "../interfaces/productInterface";
import TimerDisplay from "./TimerDisplay";

interface ProductDetailsProps {
  product: Product;
  getUserName: (userId: string) => string;
  onTimerEnd?: () => Promise<void>;
  user?: { id: string; username: string }; // Ajustamos el tipo para que coincida con la interfaz User
}

function ProductDetails({
  product,
  getUserName,
  onTimerEnd,
  user,
}: ProductDetailsProps) {
  const [timeUntilStart, setTimeUntilStart] = useState<string | null>(null);

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

    updateStartTimer();
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
            onTimerEnd={onTimerEnd}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, mb: 1 }}
          >
            Subasta termina a: {endTime}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Esta subasta está {product.status}.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            La mínima puja para esta subasta es ${product.basePrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Puja actual: ${product.currentPrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Ganador actual:{" "}
            {product.winnerId ? getUserName(product.winnerId) : "Ninguno"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Descripción: {product.description}
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
              Tiempo hasta el inicio: {timeUntilStart}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Descripción: {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Esta subasta está próxima a comenzar el {startTime}.
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Usuario actual: {getUserName(user.id)}
            </Typography>
          )}
        </Box>
      )}
      {product.status === "past" && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Descripción: {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Vendido por: ${product.currentPrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            Ganador: {getUserName(product.winnerId || "No disponible")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Fecha de venta: {endTime}
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Usuario actual: {getUserName(user.id)}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}

export default ProductDetails;
