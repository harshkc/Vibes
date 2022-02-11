import * as React from "react";

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider({children}) {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("BoostUser") || null));
  return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export {AuthProvider, useAuth};
