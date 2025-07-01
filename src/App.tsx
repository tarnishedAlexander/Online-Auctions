import { AppRoutes } from "./routes/routes";
import { UserProvider } from "./contexts/UserContext";
import "./App.css";
import ErrorBoundary from "./components/ErrorComponent";

function App() {
  return (
    <>
      <ErrorBoundary>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
