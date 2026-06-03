import { useState } from 'react';
import { supabase } from '../supabase';
import { useSession } from '../hooks/useSession';
import { Navigate } from 'react-router';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const { session, loading: sessionLoading } = useSession();
    if (sessionLoading) return null;
    if (session) return <Navigate to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else setMessage('Account aangemaakt! Je kunt nu inloggen.');

        setLoading(false);
    };

    return (
        <div>
            <h1>Registreren</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br/>
                <input
                    type="password"
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br/>
                {error && <p>{error}</p>}
                {message && <p>{message}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Even wachten...' : 'Registreren'}
                </button>
            </form>
            <a href="/login">Al een account? Log hier in</a>
        </div>
    );
}

export default Register;