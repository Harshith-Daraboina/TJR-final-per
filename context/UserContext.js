import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userIdentity, setUserIdentity] = useState(null);
  
  return (
    <UserContext.Provider value={{ userIdentity, setUserIdentity }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserIdentity = () => useContext(UserContext);
