import { useEffect, useState } from "react";
import { useUsersStore } from "../store/useUserStore";
import { useFormik } from "formik";
import type { User } from "../interfaces/userInterface";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export const useUsers = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { users, isLoading, error, fetchUsers, createUser, editUser, deleteUser, fetchUser } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const formik = useFormik({
    initialValues: selectedUser
      ? { ...selectedUser }
      : {
          id: "",
          username: "",
          email: "",
          password: "",
          avatar: "",
          role: "user" as const,
          createdAt: "",
        },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string().required("Requerido"),
      email: Yup.string().email("Correo inválido").required("Requerido"),
      password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
      role: Yup.string().required("Requerido").oneOf(["user", "admin"]),
      avatar: Yup.string().optional(),
      createdAt: Yup.string().optional(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append("id", values.id || crypto.randomUUID());
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("role", values.role);
        if (values.avatar) formData.append("avatar", values.avatar);
        if (values.createdAt) formData.append("createdAt", values.createdAt);
        if (selectedFile) formData.append("avatar", selectedFile);

        if (selectedUser?.id) {
          await editUser({
              ...values, id: selectedUser.id,
              token: ""
          }, selectedFile ?? undefined);
        } else {
          await createUser(formData);
        }

        formik.resetForm();
        setSelectedUser(null);
        setSelectedFile(null);
        setOpenDialog(false);
        navigate("/app/adminPanel");
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const editUserHandler = (user: User) => {
    setSelectedUser(user);
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const openDialogHandler = () => {
    formik.resetForm();
    setSelectedUser(null);
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const closeDialogHandler = () => {
    formik.resetForm();
    setSelectedUser(null);
    setSelectedFile(null);
    setOpenDialog(false);
  };

  return {
    users,
    isLoading,
    error,
    formik,
    editUserHandler,
    deleteUser,
    fetchUser,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
    setSelectedFile,
  };
};