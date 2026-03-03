import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import WelcomeScreen from "./components/WelcomeScreen";
import ServicesDashboard from "./components/ServicesDashboard";
import "./App.css";
import { useAuth } from "./context";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <ServicesDashboard /> : <WelcomeScreen />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
