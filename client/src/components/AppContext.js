import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default AppProvider;
