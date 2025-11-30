import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import supabase from '../../utils/supabase'
import Toast from '../../components/Toast';

export default function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: { full_name: form.name }
                }
            });

            if (error) throw error;

            setForm({ name: "", email: "", password: "" });
            setToast({ message: "Kayıt başarılı. E-posta ile doğrulamayı kontrol edin.", type: "success" });
        } catch (err) {
            setToast({ message: err.message ?? String(err), type: "error" });
        }
    };


    return (
        <div className="flex items-center justify-center text-[var(--text-primary)] p-4">
            <div className="bg-[var(--bg-primary)] rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>


                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                    </div>


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
                        className="w-full py-3 mt-4 bg-[var(--accent-primary)] text-white rounded-xl hover:opacity-90 transition shadow-md"
                    >
                        Create Account
                    </button>
                </form>
                <p className='text-center mt-4'>Already have an account? <Link className='underline' to="/signin">SignIn</Link></p>
            </div>
            
            {toast && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
