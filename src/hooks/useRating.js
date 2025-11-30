import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export function useRating(movieId, userId) {
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!movieId || !userId) {
            setLoading(false);
            return;
        }

        const fetchRating = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('votes')
                    .select('*')
                    .eq('movie_id', movieId)
                    .eq('user_id', userId)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') {
                    throw fetchError;
                }

                setRating(data || null);
                setError(null);
            } catch (err) {
                console.error('Error fetching rating:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRating();
    }, [movieId, userId]);

    const saveRating = async (ratingValue) => {
        if (!movieId || !userId) {
            setError('Movie ID and User ID are required');
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const { data: existingRating, error: fetchError } = await supabase
                .from('votes')
                .select('id')
                .eq('movie_id', movieId)
                .eq('user_id', userId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            let result;

            if (existingRating) {
                result = await supabase
                    .from('votes')
                    .update({
                        rating: ratingValue,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingRating.id)
                    .select()
                    .single();
            } else {
                result = await supabase
                    .from('votes')
                    .insert({
                        movie_id: movieId,
                        user_id: userId,
                        rating: ratingValue,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .select()
                    .single();
            }

            if (result.error) {
                throw result.error;
            }

            setRating(result.data);
            return true;
        } catch (err) {
            console.error('Error saving rating:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteRating = async () => {
        if (!rating?.id) {
            setError('No rating to delete');
            return false;
        }

        try {
            setLoading(true);
            const { error: deleteError } = await supabase
                .from('votes')
                .delete()
                .eq('id', rating.id);

            if (deleteError) {
                throw deleteError;
            }

            setRating(null);
            return true;
        } catch (err) {
            console.error('Error deleting rating:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        rating: rating?.rating || 0,
        ratingId: rating?.id,
        loading,
        error,
        saveRating,
        deleteRating,
    };
}
