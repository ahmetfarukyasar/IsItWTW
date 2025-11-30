import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export function useAverageRating(movieId) {
    const [averageRating, setAverageRating] = useState(null);
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!movieId) {
            setLoading(false);
            return;
        }

        const fetchAverageRating = async () => {
            try {
                // Fetch all ratings for this movie
                const { data, error: fetchError } = await supabase
                    .from('votes')
                    .select('rating')
                    .eq('movie_id', movieId);

                if (fetchError) {
                    if (fetchError.status === 406) {
                        setAverageRating(null);
                        setTotalVotes(0);
                        setError(null);
                    } else {
                        throw fetchError;
                    }
                } else if (data && data.length > 0) {
                    // Calculate average
                    const sum = data.reduce((acc, vote) => acc + vote.rating, 0);
                    const average = sum / data.length;
                    setAverageRating(average);
                    setTotalVotes(data.length);
                    setError(null);
                } else {
                    setAverageRating(null);
                    setTotalVotes(0);
                    setError(null);
                }
            } catch (err) {
                console.error('Error fetching average rating:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAverageRating();

        const subscription = supabase
            .channel(`votes:movie_${movieId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'votes',
                    filter: `movie_id=eq.${movieId}`,
                },
                () => {

                    fetchAverageRating();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [movieId]);

    return {
        averageRating,
        totalVotes,
        loading,
        error,
    };
}
