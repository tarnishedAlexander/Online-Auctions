import {
  useRef,
  useState,
  useCallback,
  useContext,
  createContext,
} from "react";
import { useUsers } from "../hooks/useUser";
import UserFormDialog from "../components/UserFormDialog";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { User } from "../interfaces/userInterface";
import { useEffect } from "react";

// Simulated Auth Context (replace with your actual auth solution)
const AuthContext = createContext<{ user?: User }>({ user: undefined });

function AdminPanel() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const {
    users,
    isLoading,
    error,
    formik,
    editUserHandler,
    deleteUser,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
    setSelectedFile,
  } = useUsers();

  const handleCreateUser = useCallback(() => {
    setImagePreview(null);
    formik.resetForm();
    setSelectedFile(null);
    openDialogHandler();
  }, [formik, openDialogHandler, setSelectedFile]);

  const handleEditUser = useCallback(
    (user: User) => {
      setImagePreview(user.avatar || null);
      editUserHandler(user);
    },
    [editUserHandler]
  );

  const handleCloseDialog = useCallback(() => {
    setImagePreview(null);
    closeDialogHandler();
  }, [closeDialogHandler]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
        setSelectedFile(file);
        formik.setFieldValue("avatar", imageUrl);
      }
    },
    [formik, setSelectedFile]
  );

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDeleteUser = useCallback(
    (id: string) => {
      if (
        window.confirm("¿Estás seguro de que deseas eliminar este usuario?")
      ) {
        deleteUser(id);
      }
    },
    [deleteUser]
  );

  if (!isAdmin) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          Acceso denegado. Solo administradores pueden ver esta página.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración - Usuarios
      </Typography>
      <Button
        variant="contained"
        onClick={handleCreateUser}
        sx={{ mb: 3 }}
        disabled={!isAdmin}
      >
        Crear Usuario
      </Button>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de usuario</TableCell>
              <TableCell>Correo electrónico</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? "Admin" : "Usuario"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditUser(user)}
                      disabled={!isAdmin}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={!isAdmin}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography>No hay usuarios disponibles.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <UserFormDialog
        openDialog={openDialog}
        closeDialogHandler={handleCloseDialog}
        formik={formik}
        imagePreview={imagePreview}
        handleImageUpload={handleImageUpload}
        handleImageClick={handleImageClick}
        fileInputRef={fileInputRef}
        isEditing={!!formik.values.id}
      />
    </Box>
  );
}

// Simulated Auth Provider (replace with your actual auth setup)
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    // Simulate fetching user from auth service or local storage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Example: Set a default user for testing
      setUser({
        id: "1",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
        avatar: null,
      });
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: "1",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          createdAt: new Date().toISOString(),
          avatar: null,
        })
      );
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

// Wrap your app or this component with AuthProvider
export default function AppWithAuth() {
  return (
    <AuthProvider>
      <AdminPanel />
    </AuthProvider>
  );
}
