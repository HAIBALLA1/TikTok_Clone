import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const AuthContext = createContext(null);

// Provider qui va envelopper notre application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction de connexion
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Vous pouvez ajouter ici la logique pour sauvegarder le token dans localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Nettoyage du localStorage
    localStorage.removeItem('user');
  };

  // Vérification du statut de connexion au chargement
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};