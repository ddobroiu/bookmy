// /context/ToastContext.jsx (COD COMPLET)

'use client';

import React, { createContext, useState, useContext } from 'react';

// 1. Creează Contextul
export const ToastContext = createContext();

// 2. Creează Hook-ul personalizat pentru a folosi contextul
export const useToast = () => useContext(ToastContext);


// 3. Componenta Toast (pentru afișarea vizuală)
const Toast = ({ message, type, onClose }) => {
    if (!message) return null;

    const bgColor = type === 'success' ? '#1aa858' : type === 'error' ? '#e64c3c' : '#007bff';
    
    // Stiluri inline pentru simplitate
    const toastStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: bgColor,
        color: 'white',
        padding: '15px 25px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '350px',
        animation: 'slideIn 0.3s ease-out', // Poți adăuga animație CSS
    };

    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
        marginLeft: '15px',
    };

    return (
        <div style={toastStyle}>
            <span>{message}</span>
            <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        </div>
    );
};


// 4. Provider-ul Principal
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: 'info' });

    const showToast = (message, type = 'info', duration = 3000) => {
        setToast({ message, type });

        // Ascunde Toast-ul după o durată specificată
        setTimeout(() => {
            setToast({ message: '', type: 'info' });
        }, duration);
    };

    const value = { showToast };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ message: '', type: 'info' })} 
            />
        </ToastContext.Provider>
    );
};