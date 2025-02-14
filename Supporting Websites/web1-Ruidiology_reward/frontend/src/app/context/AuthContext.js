import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  user: { username: "", low_index: -1, high_index: -1, sex: "", position: "" },
  setUser: () => {}, // Placeholder setter method
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          username: "",
          low_index: -1,
          high_index: -1,
          sex: "",
          position: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
