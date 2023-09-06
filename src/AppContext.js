import React, { useState, useContext } from 'react';

// Define the context
const AppContext = React.createContext();

// Create the provider component
const AppProvider = ({ children }) => {
  const [data, setUserData] = useState({});

  // Function to update the state
  const setData = (newValue) => {
    setUserData(newValue);
  };

  return (
    <AppContext.Provider value={{ data, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to access the context
const useAppContext = () => {
  return useContext(AppContext);
};

// Export the provider and the custom hook
export { AppProvider, useAppContext };