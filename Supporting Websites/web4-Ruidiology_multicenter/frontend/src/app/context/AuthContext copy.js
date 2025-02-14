// import React from "react";

// let AuthContext = React.createContext({
//   user: { username: "", low_index: -1, high_index: -1, sex: "", position: "" },
// });

// export default AuthContext;

import React, { useState } from "react";

const AuthContext = React.createContext({
  user: { username: "", low_index: -1, high_index: -1, sex: "", position: "" },
  setUser: () => {}, // Placeholder setter method
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    low_index: -1,
    high_index: -1,
    sex: "",
    position: "",
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
