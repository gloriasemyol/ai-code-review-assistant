"use client";
   import { createContext, useContext, useState, useEffect } from "react";

   const AuthContext = createContext();

   export function AuthProvider({ children }) {
     const [user, setUser] = useState(null);
     const [token, setToken] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const storedUser = localStorage.getItem("user");
       const storedToken = localStorage.getItem("access_token");
       if (storedUser && storedToken) {
         setUser(JSON.parse(storedUser));
         setToken(storedToken);
       }
       setLoading(false);
     }, []);

     const login = (userData, accessToken) => {
       setUser(userData);
       setToken(accessToken);
       localStorage.setItem("user", JSON.stringify(userData));
       localStorage.setItem("access_token", accessToken);
     };

     const logout = () => {
       setUser(null);
       setToken(null);
       localStorage.removeItem("user");
       localStorage.removeItem("access_token");
     };

     return (
       <AuthContext.Provider value={{ user, token, login, logout, loading }}>
         {children}
       </AuthContext.Provider>
     );
   }

   export function useAuth() {
     return useContext(AuthContext);
   }