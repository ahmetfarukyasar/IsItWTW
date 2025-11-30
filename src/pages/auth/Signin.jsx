import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import Toast from '../../components/Toast';

export default function SignIn() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });
            if (error) throw error;

            setForm({ email: "", password: "" });
            setToast({ message: "Success. Redirecting to home...", type: "success" });

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setToast({ message: err.message ?? String(err), type: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center text-[var(--text-primary)] p-4">
            <div className="bg-[var(--bg-primary)] rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-[var(--accent-primary)] text-white rounded-xl hover:opacity-90 transition shadow-md cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>

                <p className='text-center mt-4'>
                    Don't you have an account? <Link className='underline' to="/signup">SignUp</Link>
                </p>
            </div>

            {toast && (
                <div className="fixed bottom-5 right-5 z-50">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}
        </div>
    );
}
