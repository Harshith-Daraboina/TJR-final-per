import React, { createContext, useState } from 'react';

// Create Context
export const LocationContext = createContext();

// Context Provider
export const LocationProvider = ({ children }) => {
  const [isInside, setIsInside] = useState(false);

  return (
    <LocationContext.Provider value={{ isInside, setIsInside }}>
      {children}
    </LocationContext.Provider>
  );
};
