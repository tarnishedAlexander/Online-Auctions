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
import type { User } from "../interfaces/userInterface";
import type { RefObject } from "react";

interface UserFormDialogProps {
  openDialog: boolean;
  closeDialogHandler: () => void;
  formik: FormikProps<User>;
  imagePreview: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  isEditing: boolean;
}

function UserFormDialog({
  openDialog,
  closeDialogHandler,
  formik,
  imagePreview,
  handleImageUpload,
  handleImageClick,
  fileInputRef,
  isEditing,
}: UserFormDialogProps) {
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
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
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
                label="Nombre de usuario"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
                fullWidth
              />
              <TextField
                label="Correo electrónico"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
              />
              <TextField
                select
                label="Rol"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
                fullWidth
              >
                <MenuItem value="user">Usuario</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
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
                  Inserte avatar aquí
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

export default UserFormDialog;
