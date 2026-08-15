import { checkUser } from "@/utils/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null)

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await checkUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Error checking User!")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user, loading, login, logout, refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
   if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}