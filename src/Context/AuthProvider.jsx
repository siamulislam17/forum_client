import React, { useEffect, useState } from 'react';


import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { auth } from '../FireBaseFunctionality/firebase.config';

const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const provider = new GoogleAuthProvider(auth);


    const CreateAccountWithEmail = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const GoogleLogIn = () => {
        setLoading(true);
        
        return signInWithPopup(auth, provider);
    }

    const SignIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
            console.log('Auth State Changed', currentUser);
        })
        
        return () => unsubscribe();
    }, [])

    // Update User Profile
    const UserUpdate = (name, profileImg) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: profileImg
        })
    }

    
    // User Log Out
    const userLogOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const logOutUser = () => {
        setLoading(true);
        return signOut(auth);
    }

     // Dark mode toggle
    const [toggleDarkMode, setToggleDarkMode] = useState(false);

    const AuthInfo = {
        CreateAccountWithEmail,
        SignIn,
        user,
        loading,
        setUser,
        setLoading,
        userLogOut,
        GoogleLogIn,
        UserUpdate,
        logOutUser,
        toggleDarkMode,
        setToggleDarkMode
    }
    return (
       <AuthContext value={AuthInfo}>
            {children}
       </AuthContext>
    );
};

export default AuthProvider;