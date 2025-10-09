import React, { createContext, useContext, useState, useEffect } from 'react'

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    // localStorage'dan başlangıç değeri al
    const [favorites, setFavorites] = useState(() => {
        try {
            const savedFavorites = localStorage.getItem('movieFavorites');
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        } catch (error) {
            console.error('localStorage okuma hatası:', error);
            return [];
        }
    });

    // favorites değiştiğinde localStorage'a kaydet
    useEffect(() => {
        try {
            localStorage.setItem('movieFavorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('localStorage yazma hatası:', error);
        }
    }, [favorites]);

    const addToFavorites = (movie) => {
        setFavorites(prev => {
            const exists = prev.find(fav => fav.id === movie.id);
            if (exists) return prev;
            const newFavorites = [...prev, movie];
            console.log('Film favorilere eklendi:', movie.title);
            return newFavorites;
        });
    };

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => {
            const newFavorites = prev.filter(fav => fav.id !== movieId);
            const removedMovie = prev.find(fav => fav.id === movieId);
            if (removedMovie) {
                console.log('Film favorilerden çıkarıldı:', removedMovie.title);
            }
            return newFavorites;
        });
    };

    const isInFavorites = (movieId) => {
        return favorites.some(fav => fav.id === movieId);
    };

    const clearFavorites = () => {
        setFavorites([]);
        console.log('Tüm favoriler temizlendi');
    };

    return (
        <FavoriteContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            isInFavorites,
            clearFavorites
        }}>
            {children}
        </FavoriteContext.Provider>
    );
};

// Custom hook
export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoriteProvider');
    }
    return context;
};