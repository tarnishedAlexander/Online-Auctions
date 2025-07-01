import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/Login";
import ProductPage from "../pages/ProductPage";
import ProtectedRoutes from "../guards/ProtectedRoutes";
import { Layout } from "../layout/Layout";
import AdminPanel from "../pages/adminPanel";

const ErrorPage = () => {
  const badObject: any = null;
  return <div>{badObject.someProperty}</div>;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/app"
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="home/products/:productId" element={<ProductPage />} />
          <Route path="adminPanel" element={<AdminPanel />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};
