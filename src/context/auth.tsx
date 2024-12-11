/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types/schema";

// Tipagem do Contexto de Autenticação
type AuthContextType = {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  user: User | null;
};

// Tipagem das Props do Provider
type AuthProviderProps = {
  children: ReactNode;
};

// Criação do contexto com valor inicial tipado
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para validar o token (exemplo com JWT)
const validateToken = (token: string | null): boolean => {
  try {
    if (!token) return false;

    const decodedToken = jwtDecode<User>(token);
    const currentTime = Date.now() / 1000; // Em segundos

    // Verifica se o token tem a chave exp e se a data de expiração é maior que a hora atual
    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    } else {
      console.error("Token expirado");
      return false;
    }
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return false;
  }
};

// Provider para encapsular a lógica de autenticação
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      return validateToken(storedToken) ? storedToken : null;
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token); // Salva o token válido
    } else {
      localStorage.removeItem("authToken"); // Remove token inválido
    }
  }, [token]);

  // Função de login
  const login = (newToken: string) => {
    if (validateToken(newToken)) {
      setToken(newToken);
    } else {
      console.error("Token recebido no login é inválido.");
    }
  };

  // Função de logout
  const logout = () => {
    setToken(null);
  };

  // Estado de autenticação
  const isLoggedIn = !!token;
  const user = token ? jwtDecode<User>(token) : null;

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto facilmente
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
