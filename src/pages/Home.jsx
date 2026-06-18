import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../supabase';
import Posts from './Posts';
import '../Style.css';

function Home() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase
                .from('Profiles')
                .select('user_id, Username, avatar_url')
                .eq('is_private', false);

            if (error) console.error('Fetch error:', error);
            setUsers(data || []);
        }

        fetchUsers();
    }, []);

    return (
        <div className="home-wrapper">
            <main className="home-main">
                <Posts />
            </main>

            <aside className="home-sidebar">
                <h3>Gebruikers</h3>
                <ul className="home-userlist">
                    {users.map((user) => (
                        <li key={user.user_id}>
                            <Link to={`/profile/${user.user_id}`} className="home-userlink">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="avatar" className="home-avatar" />
                                ) : (
                                    <div className="home-avatar-placeholder">
                                        {user.Username?.[0]?.toUpperCase() ?? '?'}
                                    </div>
                                )}
                                <span>{user.Username ?? 'Onbekend'}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
export default Home;