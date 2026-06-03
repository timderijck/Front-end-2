import { useSession } from '../hooks/useSession';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router';

function Header() {
    const { session } = useSession();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header>
            {session && (
                <button onClick={handleLogout}>
                    Uitloggen
                </button>
            )}
        </header>
    );
}

export default Header;