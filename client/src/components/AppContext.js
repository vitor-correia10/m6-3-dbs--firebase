import React, { createContext, useEffect, useState } from 'react';
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

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

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
  const [appUser, setAppUser] = useState({});

  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };

  useEffect(() => {
    if (user) {
      setAppUser({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  }, [user]);

  return <AppContext.Provider value={{
    appUser, signInWithGoogle, handleSignOut
  }}>{children}
  </AppContext.Provider>;
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AppProvider);
