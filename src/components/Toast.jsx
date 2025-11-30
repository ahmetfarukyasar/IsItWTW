import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-8 py-4 rounded-xl shadow-lg animate-slide-in`}>
            {message}
        </div>
    );
}
