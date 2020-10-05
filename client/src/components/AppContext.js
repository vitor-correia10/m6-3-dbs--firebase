import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext(null);

var firebaseConfig = {
  apiKey: "AIzaSyD__mIfZQKrMu7Ojtl53zAxJEphrsbbfbY",
  authDomain: "m6-3-38e7b.firebaseapp.com",
  databaseURL: "https://m6-3-38e7b.firebaseio.com",
  projectId: "m6-3-38e7b",
  storageBucket: "m6-3-38e7b.appspot.com",
  messagingSenderId: "796575733148",
  appId: "1:796575733148:web:fd9798eeaaa5737edd6459"
};

const AppProvider = ({ children }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default AppProvider;
