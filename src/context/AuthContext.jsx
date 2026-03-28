/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext({
    currentUser: null,
    userRole: null,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    resetPassword: () => Promise.resolve(),
    isAdmin: false,
    isComms: false,
    isPastor: false,
    loading: true
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserRole(data.role || 'user');
                        setUserData(data);
                    } else {
                        setUserRole('user');
                        setUserData(null);
                    }
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                    setUserRole(null);
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error in AuthProvider:", error);
                setUserRole('user');
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        userData,
        login,
        logout,
        resetPassword,
        isAdmin: userRole === 'admin',
        isComms: userRole === 'admin' || userRole === 'comunicaciones',
        isPastor: userRole === 'pastor' || userRole === 'admin',
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-text-muted font-medium">Cargando aplicación...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
}
