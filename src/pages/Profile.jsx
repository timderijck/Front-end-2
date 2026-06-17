import { useSession } from "../hooks/useSession.js";
import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";

export default function ProfilePage() {
    const { session, loading: sessionLoading } = useSession();
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [isprivate, setIsprivate] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    async function fetchProfile() {
        const { data } = await supabase
            .from("Profiles")
            .select('*')
            .eq('user_id', session.sub)
            .single();

        if (data) {
            setProfile(data);
            setUsername(data.Username ?? '');
            setBio(data.Bio ?? '');
            setIsprivate(data.is_private ?? false);
        }
    }
    useEffect(() => {
        if (!session) return;

        fetchProfile();
    }, [session]);


    async function updateProfile() {
        const {error} = await supabase
            .from("Profiles")
            .update({username, bio, is_private: isprivate})
            .eq('user_id', session.sub);

        if (!error) fetchProfile();
    }
    async function ProfielFoto(e) {
        const image = e.target.files[0];
        if (!image) return;

        const fileName = `${session.sub}-${Date.now()}`;

        const {error} = await supabase.storage
        .from("avatars")
            .upload(fileName, image);

        if (error) {
            setMessage ('Upload mislukt: ' + error.message);
            return;
        }
        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        await supabase
            .from('Profiles')
            .update({ avatar_url: data.publicUrl })
            .eq('user_id', session.sub);

        await fetchProfile();
        setMessage('Profielfoto bijgewerkt!');
    }


    async function handleSave() {
        setSaving(true);
        const { error } = await supabase
            .from("Profiles")
            .update({
                Username: username,
                Bio: bio,
                is_private: isprivate,
            })
            .eq('user_id', session.sub);

        setSaving(false);
        if (error) {
            setMessage('Opslaan mislukt: ' + error.message);
        } else {
            setProfile(p => ({ ...p, Username: username, Bio: bio, is_private: isprivate }));
            setEditing(false);
            setMessage('Profiel opgeslagen!');
        }
    }

    if (sessionLoading) return <p>Laden...</p>;
    if (!session) return <p>Niet ingelogd.</p>;
    if (!profile) return <p>Profiel laden...</p>;

    return (
        <div>
            <h2>{profile.Username ?? '—'}</h2>
            <p>{profile.Bio || 'Geen bio ingesteld.'}</p>
            <p>Profiel: {profile.is_private ? 'Privé' : 'Openbaar'}</p>


            {profile.avatar_url && <img src={profile.avatar_url} alt="avatar" width={80} />}
            <input type="file" accept="image/*" onChange={ProfielFoto} />


            {!editing ? (
                <button onClick={() => { updateProfile(); setEditing(true); }}>Bewerken</button>
            ) : (
                <div>
                    <div>
                        <label>Gebruikersnaam</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isprivate}
                                onChange={e => setIsprivate(e.target.checked)}
                            />
                            Profiel privé maken
                        </label>
                    </div>
                    <button onClick={handleSave} disabled={saving}>
                        {saving ? 'Opslaan...' : 'Opslaan'}
                    </button>
                    <button onClick={() => setEditing(false)}>Annuleren</button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}