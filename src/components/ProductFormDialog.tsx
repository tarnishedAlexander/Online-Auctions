import { useCallback } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { FormikProps } from "formik";
import type { Product } from "../interfaces/productInterface";
import type { RefObject } from "react";

interface ProductFormDialogProps {
  openDialog: boolean;
  closeDialogHandler: () => void;
  formik: FormikProps<Product>;
  imagePreview: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  isEditing: boolean;
}

function ProductFormDialog({
  openDialog,
  closeDialogHandler,
  formik,
  imagePreview,
  handleImageUpload,
  handleImageClick,
  fileInputRef,
  isEditing,
}: ProductFormDialogProps) {
  const handleSubmit = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <Dialog fullScreen open={openDialog} onClose={closeDialogHandler}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeDialogHandler}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {isEditing ? "Editar Producto" : "Crear Producto"}
          </Typography>
          <Button
            autoFocus
            color="inherit"
            disabled={formik.isSubmitting || !formik.isValid}
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Grid container spacing={2} sx={{ maxWidth: 800 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
            >
              {!formik.isValid && formik.submitCount > 0 && (
                <Alert severity="error">
                  {Object.values(formik.errors).map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </Alert>
              )}
              <TextField
                label="Título"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                fullWidth
              />
              <TextField
                label="Descripción"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Precio Base"
                name="basePrice"
                type="number"
                value={formik.values.basePrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.basePrice && Boolean(formik.errors.basePrice)
                }
                helperText={formik.touched.basePrice && formik.errors.basePrice}
                fullWidth
              />
              <TextField
                label="Precio Actual"
                name="currentPrice"
                type="number"
                value={formik.values.currentPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.currentPrice &&
                  Boolean(formik.errors.currentPrice)
                }
                helperText={
                  formik.touched.currentPrice && formik.errors.currentPrice
                }
                fullWidth
              />
              <TextField
                label="Duración (segundos)"
                name="duration"
                type="number"
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.duration && Boolean(formik.errors.duration)
                }
                helperText={formik.touched.duration && formik.errors.duration}
                fullWidth
              />
              <TextField
                label="Fecha de Inicio"
                name="startTime"
                type="datetime-local"
                value={formik.values.startTime || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.startTime && Boolean(formik.errors.startTime)
                }
                helperText={formik.touched.startTime && formik.errors.startTime}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Fecha de Fin"
                name="endTime"
                type="datetime-local"
                value={formik.values.endTime || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Estado"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="past">Past</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
                border: "2px dashed grey",
                borderRadius: 2,
                bgcolor: "grey.100",
                cursor: "pointer",
              }}
              onClick={handleImageClick}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Inserte imagen aquí
                </Typography>
              )}
            </Box>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default ProductFormDialog;
