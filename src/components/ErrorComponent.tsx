import React, { Component, type ReactNode } from "react";
import { Button, Typography, Box } from "@mui/material";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI de respaldo
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            Algo salió mal
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {this.state.error?.message || "Ocurrió un error inesperado."}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Volver a iniciar sesión
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
