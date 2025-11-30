import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

export function useComments(movieId) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all comments for this movei
    useEffect(() => {
        if (!movieId) {
            setLoading(false);
            return;
        }

        const fetchComments = async () => {
            try {
                const { data: commentsData, error: fetchError } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('movie_id', movieId)
                    .order('created_at', { ascending: false });

                if (fetchError) {
                    throw fetchError;
                }

                const userIds = [...new Set(commentsData.map(c => c.user_id))];

                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, email')
                    .in('id', userIds);

                const profilesMap = {};
                (profilesData || []).forEach(profile => {
                    profilesMap[profile.id] = profile;
                });

                if (fetchError) {
                    throw fetchError;
                }

                const commentsWithUsers = (commentsData || []).map(comment => {
                    const profile = profilesMap[comment.user_id];
                    return {
                        ...comment,
                        auth_users: profile ? {
                            email: profile.email,
                            raw_user_meta_data: {
                                full_name: profile.full_name
                            }
                        } : null
                    };
                });

                setComments(commentsWithUsers);
                setError(null);
            } catch (err) {
                console.error('Error fetching comments:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();

        const subscription = supabase
            .channel(`comments:movie_${movieId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `movie_id=eq.${movieId}`,
                },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        // Fetch user data for new comment
                        const { data: profileData } = await supabase
                            .from('profiles')
                            .select('id, full_name, email')
                            .eq('id', payload.new.user_id)
                            .single();

                        const newComment = {
                            ...payload.new,
                            auth_users: profileData ? {
                                email: profileData.email,
                                raw_user_meta_data: {
                                    full_name: profileData.full_name
                                }
                            } : null
                        };
                        setComments((prev) => [newComment, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setComments((prev) =>
                            prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [movieId]);

    const addComment = async (content, userId) => {
        if (!movieId || !userId || !content.trim()) {
            setError('Missing required fields');
            return false;
        }

        try {
            setLoading(true);
            const { data, error: insertError } = await supabase
                .from('comments')
                .insert({
                    movie_id: movieId,
                    user_id: userId,
                    content: content.trim(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select('*')
                .single();

            if (insertError) {
                throw insertError;
            }

            // Fetch user profile separately
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .eq('id', userId)
                .single();

            const commentWithUser = {
                ...data,
                auth_users: profileData ? {
                    email: profileData.email,
                    raw_user_meta_data: {
                        full_name: profileData.full_name
                    }
                } : null
            };

            setComments((prev) => [commentWithUser, ...prev]);
            return true;
        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update comment
    const updateComment = async (commentId, content) => {
        if (!content.trim()) {
            setError('Comment content cannot be empty');
            return false;
        }

        try {
            setLoading(true);
            const { data, error: updateError } = await supabase
                .from('comments')
                .update({
                    content: content.trim(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', commentId)
                .select('*')
                .single();

            if (updateError) {
                throw updateError;
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .eq('id', data.user_id)
                .single();

            const commentWithUser = {
                ...data,
                auth_users: profileData ? {
                    email: profileData.email,
                    raw_user_meta_data: {
                        full_name: profileData.full_name
                    }
                } : null
            };

            setComments((prev) =>
                prev.map((c) => (c.id === commentId ? commentWithUser : c))
            );
            return true;
        } catch (err) {
            console.error('Error updating comment:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Delete comment
    const deleteComment = async (commentId) => {
        try {
            setLoading(true);
            const { error: deleteError } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId);

            if (deleteError) {
                throw deleteError;
            }

            setComments((prev) => prev.filter((c) => c.id !== commentId));
            return true;
        } catch (err) {
            console.error('Error deleting comment:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        comments,
        loading,
        error,
        addComment,
        updateComment,
        deleteComment,
    };
}