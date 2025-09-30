import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  token: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, autoSignIn?: boolean) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps { children: ReactNode; }

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_BASE = "http://localhost:8000"; // API base URL

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, autoSignIn = true) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      try { data = await res.json(); } catch { data = {}; }

      if (res.ok && data.user_id) {
        toast({ title: "Sign Up Successful", description: "You can now log in." });

        // Automatically sign in if flag is true
        if (autoSignIn) {
          await signIn(email, password);
        } else {
          navigate("/login", { state: { email, password } });
        }
      } else {
        toast({
          title: "Sign Up Failed",
          description: data?.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      try { data = await res.json(); } catch { data = {}; }

      if (res.ok && data.token && data.user_id) {
        const newUser: User = { email, token: data.token, id: data.user_id };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast({ title: "Welcome!", description: "Logged in successfully." });
      } else {
        toast({
          title: "Login Failed",
          description: data?.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({ title: "Signed Out", description: "You have been signed out." });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
