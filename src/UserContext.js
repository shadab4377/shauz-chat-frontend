import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [isAuthenticated,setIsUserAuthenticated] = useState(false);

  return (
    <UserContext.Provider value={{ username, setUsername ,isAuthenticated, setIsUserAuthenticated}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
