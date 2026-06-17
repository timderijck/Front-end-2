import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import { useParams } from "react-router";

export default function PublicProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchPublicProfile() {
            const { data } = await supabase
                .from('Profiles')
                .select('*')
                .eq('user_id', id)
                .single();

            if (data) setProfile(data);
        }

        fetchPublicProfile();
    }, [id]);

    if (!profile) return <p>Profiel laden...</p>;

    return (
        <div>
            {profile.avatar_url && <img src={profile.avatar_url} alt="avatar" width={80} />}
            <h2>{profile.Username ?? '—'}</h2>
            <p>{profile.Bio || 'Geen bio ingesteld.'}</p>
            <p>Profiel: {profile.is_private ? 'Privé' : 'Openbaar'}</p>
        </div>
    );
}