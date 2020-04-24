# Tutorial 1

This tutorial walk you through the creation of an app that will

1. sign user into app via Google Authentication.

## Part 1 - Set up a Firebase app

Before we write a single line of code, we need to create a firebase project. This project will contain both our database and our authentication.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click `Create a project` or `Add a project` if you already have projects in our account.

- Project name: `user-app`
- Disable Google Analytics on the following screen
- Continue

### [👀 View GIF of "Create Firebase app"](assets/1-create-firebase-app.gif)

## Authentication

You need to enable authentication inside of your Firebase project.

1. From the project overview, select `Authentication`.
2. Click `Set up sign-in method`
3. Select the Google Provider
4. Enable it via the toggle
5. If `Project support email` is empty, click on it. It will add your email by default.
6. Save!

### [👀 View GIF of "Enable Authentication"](assets/2-enable-authentication.gif)

Next, we need to add an app to our firebase Project.

7. Add a webapp by clicking on the `</>` icon in the banner.
8. give the app a nickname: `web-app` _(or anything you like)_
9. Register App!
10. You will be provided with a snippet once the setup is complete.

Because we are using React, all that really interests us the `firebaseConfig` object. It looks something like this:

```js
var firebaseConfig = {
  apiKey: '.......................................',
  authDomain: '...............................',
  databaseURL: '.....................................',
  projectId: '...............',
  storageBucket: '..........................',
  messagingSenderId: '............',
  appId: '..........................................',
};
```

### [👀 View GIF of "Add Webapp"](assets/3-add-webapp.gif)

11. Copy the contents of that object to the `AppContext.js` file.

## Part 2 - Set up Google Sign in w/ React

1. Add the firebase dependencies to the `AppProvider` file. _They've already installed via the package.json file._

```js
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase';
import 'firebase/auth';
```

2. Initialize the Firebase app below your `firebaseConfig` declaration, as well as the `firebaseAppAuth` item.

```js
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
```

3. Create a `providers` variable that will contain the `googleProvider`. This is where you can add alternative sign-in methods, but that is out of scope for this tutorial.

```js
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
```

4. We need to wrap our component export inside of `withFirebaseAuth` for our app to receive the auth methods from firebase.

```diff
- export default AppProvider;
+ export default withFirebaseAuth({
+   providers,
+   firebaseAppAuth,
+ })(AppProvider);
```

Now we have access to all that we need to implement signin/signout with Google Auth.

Firebase provides us with some methods that we can call to trigger `Signin` and `signup`. They are passed as props to the AppProvider. Let's receive them and add them to the AppProvider.

```diff
- const AppProvider = ({ children }) => {
+ const AppProvider = ({ children, signInWithGoogle }) => {
-   return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
+   return (
+     <AppContext.Provider value={{ signInWithGoogle }}>
+       {children}
+     </AppContext.Provider>
+   );
};
```

5. In `App.js`, get the values we just added to the AppProvider.

```diff
  const App = () => {
+    const { signInWithGoogle } = useContext(AppContext);

    return (
      <StyledPageWrapper>
        <StyledNav>
-         <button>Sign In</button>
+         <button onClick={signInWithGoogle}>Sign In</button>
        </StyledNav>
        <StyledContainer>Content</StyledContainer>
      </StyledPageWrapper>
    );
};
```

Users can now sign in with Google!

Google provides us with information on a user once they sign in. In order, ot access it we need to receive it as props. Let's do that and then console.log it. We'll do this inside of a `useEffect` because chances are that we'll have to wait for that data to be available.

6. Add `user` and console the contents.

```diff
- const AppProvider = ({ children, signInWithGoogle }) => {
+ const AppProvider = ({ children, signInWithGoogle, user }) => {
+   useEffect(() => {
+     if (user) console.log(user);
+   }, [user]);

    return (
      <AppContext.Provider value={{ signInWithGoogle }}>
        {children}
      </AppContext.Provider>
    );
  };
```

Take a look at what we have on the `user`. We've got tons of data! Let's pick out the most relevant to us and add it to state.

7. Create a new `useState` in the AppProvider.

```diff
  const AppProvider = ({ children, signInWithGoogle, user }) => {
+   const [appUser, setAppUser] = useState({});

    useEffect(() => {
-    if (user) console.log(user);
+     if (user) {
+       setAppUser({
+         displayName: user.displayName,
+         email: user.email,
+         photoURL: user.photoURL,
+       });
+     }
    }, [user]);

    return (
-     <AppContext.Provider value={{ signInWithGoogle }}>
+     <AppContext.Provider value={{ appUser, signInWithGoogle }}>
        {children}
      </AppContext.Provider>
    );
  };
```

8. Get the `appUser` from the context in the App component.

```diff
  const App = () => {
-   const { signInWithGoogle } = useContext(AppContext);
+   const { appUser, signInWithGoogle } = useContext(AppContext);

  ...
```

9. Let's use that data to render the info on the current user in the header.
10. We should also only show the sign in button if the user is _not_ signed in. (we will know whether or not they are signed in, by whether or not we have data in the appUser object.)

```diff
    return (
      <StyledPageWrapper>
+       <StyledHeader>
+         {appUser && appUser.email ? (
+           <StyledUserContainer>
+             <Avatar src={appUser.photoURL} />
+             <p>
+               {appUser.displayName} ({appUser.email})
+             </p>
+           </StyledUserContainer>
+         ) : (
            <button onClick={signInWithGoogle}>Sign In</button>
+         )}
        </StyledHeader>
        <StyledContainer>Content</StyledContainer>
      </StyledPageWrapper>
    );
  };
```

11. Now let's add a signout button. Google provides us with a `signOut` method. We will wrap this inside of a `handleSignOut` function and add that to the Provider. So that `App` can call it.

In `AppContext.js`,

```diff
- const AppProvider = ({ children, signInWithGoogle, user }) => {
+ const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
    const [appUser, setAppUser] = useState({});

+  const handleSignOut = () => {
+     signOut();
+     setAppUser({});
+   };

    useEffect(() => {
      if (user) {
        setAppUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
    }, [user]);

    return (
-     <AppContext.Provider value={{ appUser, signInWithGoogle }}>
+     <AppContext.Provider value={{ appUser, signInWithGoogle, handleSignOut }}>
        {children}
      </AppContext.Provider>
    );
  };
```

You should, at this point, have something like this.

### [👀 View GIF of "Auth Completed"](assets/2-enable-authentication.gif)
