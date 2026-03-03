import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import WelcomeScreen from "./components/WelcomeScreen";
import ServicesDashboard from "./components/ServicesDashboard";
import "./App.css";
import { useAuth } from "./context";

const CLIENT_ID =
  "443701407017-o6ftoehhbmcc2gng1h3pkanl4sh6ifkp.apps.googleusercontent.com";

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
