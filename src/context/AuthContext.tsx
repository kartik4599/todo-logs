import { useState, useEffect, type ReactNode } from "react";
import {
  googleLogout,
  useGoogleLogin,
  type TokenResponse,
} from "@react-oauth/google";
import { AuthContext } from "./authTypes";

const TOKEN_KEY = "gmail_access_token";
const TOKEN_EXPIRY_KEY = "gmail_token_expiry";
const USER_EMAIL_KEY = "gmail_user_email";
const SCOPES =
  "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email";

// Helper to get initial token from localStorage
const getInitialToken = (): string | null => {
  const savedToken = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (savedToken && expiry) {
    const expiryTime = parseInt(expiry, 10);
    if (Date.now() < expiryTime) {
      return savedToken;
    } else {
      // Token expired, clear it
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(USER_EMAIL_KEY);
    }
  }
  return null;
};

// Helper to get initial email from localStorage
const getInitialEmail = (): string | null => {
  return localStorage.getItem(USER_EMAIL_KEY);
};

// Fetch user email from Google
const fetchUserEmail = async (accessToken: string): Promise<string | null> => {
  try {
    const res = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo?fields=email",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (res.ok) {
      const data = await res.json();
      return data.email || null;
    }
  } catch (e) {
    console.error("Failed to fetch user email:", e);
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getInitialToken());
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    getInitialEmail(),
  );
  const [status, setStatus] = useState(() =>
    getInitialToken() ? "Logged in ✓" : "",
  );

  // Fetch email if we have a token but no email (e.g., page reload with valid token)
  useEffect(() => {
    if (token && !userEmail) {
      fetchUserEmail(token).then((email) => {
        if (email) {
          localStorage.setItem(USER_EMAIL_KEY, email);
          setUserEmail(email);
        }
      });
    }
  }, [token, userEmail]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      const accessToken = tokenResponse.access_token;
      // Token typically expires in 1 hour (3600 seconds)
      const expiresIn = tokenResponse.expires_in || 3600;
      const expiryTime = Date.now() + expiresIn * 1000;

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

      setToken(accessToken);
      setStatus("Logged in ✓");

      // Fetch and store user email
      const email = await fetchUserEmail(accessToken);
      if (email) {
        localStorage.setItem(USER_EMAIL_KEY, email);
        setUserEmail(email);
      }
    },
    onError: () => setStatus("Login failed"),
    scope: SCOPES,
    flow: "implicit",
  });

  const logout = () => {
    googleLogout();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    setToken(null);
    setUserEmail(null);
    setStatus("");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userEmail,
        isAuthenticated: !!token,
        isLoading: false,
        login: googleLogin,
        logout,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
