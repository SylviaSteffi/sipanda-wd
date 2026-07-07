import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function getInitialAuthState() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId"),
    userEmail: localStorage.getItem("userEmail"),
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  const login = ({ token, role, userId, userEmail }) => {
    const nextState = {
      token: token || null,
      role: role || null,
      userId: userId ? String(userId) : null,
      userEmail: userEmail || null,
    };

    if (nextState.token) localStorage.setItem("token", nextState.token);
    else localStorage.removeItem("token");

    if (nextState.role) localStorage.setItem("role", nextState.role);
    else localStorage.removeItem("role");

    if (nextState.userId) localStorage.setItem("userId", nextState.userId);
    else localStorage.removeItem("userId");

    if (nextState.userEmail) {
      localStorage.setItem("userEmail", nextState.userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }

    setAuthState(nextState);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    setAuthState({
      token: null,
      role: null,
      userId: null,
      userEmail: null,
    });
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      role: authState.role,
      userId: authState.userId,
      userEmail: authState.userEmail,
      login,
      logout,
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}