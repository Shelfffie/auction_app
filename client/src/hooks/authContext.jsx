import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchDataUser = async (req, res) => {
        try {
          const response = await fetch(`http://localhost:3000/api/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Користувача не знайдено");
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Помилка авторизації:", error);
          setUser(null);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      };

      fetchDataUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, logOut, setUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
