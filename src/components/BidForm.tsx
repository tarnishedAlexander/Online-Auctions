import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { User } from "../interfaces/userInterface";

interface BidFormProps {
  productId: string;
  currentPrice: number;
  setAlertMessage: (message: string) => void;
  setAlertSeverity: (severity: "success" | "error") => void;
  setAlertOpen: (open: boolean) => void;
  setBids: React.Dispatch<
    React.SetStateAction<{ userId: string; bid: number; timestamp: string }[]>
  >;
  getUserName: (userId: string) => string;
  user: User;
}

function BidForm({
  productId,
  currentPrice,
  setAlertMessage,
  setAlertSeverity,
  setAlertOpen,
  getUserName,
  user,
}: BidFormProps) {
  console.log("BidForm rendered with user:", getUserName(user.id));
  const formik = useFormik({
    initialValues: {
      bid: "",
      userId: user.id,
    },
    validate: (values) => {
      const schema = Yup.object({
        bid: Yup.number()
          .required("Debes ingresar una puja")
          .min(
            currentPrice,
            `La puja debe ser al menos $${currentPrice.toFixed(2)}`
          )
          .positive("La puja no puede ser negativa")
          .typeError("La puja debe ser un número"),
      });
      try {
        schema.validateSync(values, { abortEarly: false });
        return {};
      } catch (error: any) {
        return error.inner.reduce((acc: any, err: any) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
      }
    },
    onSubmit: async (values) => {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length === 0) {
        try {
          const response = await fetch(
            `http://localhost:5010/bid/${productId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bid: Number(values.bid),
                userId: values.userId,
              }),
            }
          );
          const result = await response.json();
          if (response.ok) {
            setAlertMessage("¡Se subió tu monto correctamente!");
            setAlertSeverity("success");
            await fetch(`http://localhost:3000/bids`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId,
                userId: values.userId,
                bid: Number(values.bid),
                timestamp: new Date().toISOString(),
              }),
            });
          } else {
            setAlertMessage(result.error || "Error al subir la puja.");
            setAlertSeverity("error");
          }
          setAlertOpen(true);
        } catch (error) {
          console.error("Fetch error:", error);
          setAlertMessage("Error al subir la puja!");
          setAlertSeverity("error");
          setAlertOpen(true);
        }
      } else {
        setAlertMessage(errors.bid || "Debes ingresar un valor válido.");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    },
  });

  useEffect(() => {
    formik.validateForm();
  }, [currentPrice, formik.validateForm]);

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="bid"
          name="bid"
          label="Ingrese su puja"
          type="number"
          value={formik.values.bid}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" type="submit">
          Enviar Puja
        </Button>
      </form>
    </Box>
  );
}

export default BidForm;
