import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useSession } from '../hooks/useSession';

function Posts() {
    const { session } = useSession();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);  //image const
    const [posts, setPosts] = useState([]);

    // Posts ophalen
    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*');

        if (error) console.error('Fetch error:', error);
        setPosts(data || []);
    };

    // Bij laden meteen posts ophalen
    useEffect(() => {
        fetchPosts();
    }, []);

    // Post plaatsen
    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = null;

        // image uploaden
        if (image) {
            const fileName = `${session.sub}-${Date.now()}`;
            const { error: uploadError } = await supabase.storage
                .from('posts')
                .upload(fileName, image);

            if (uploadError) {
                console.error(uploadError);
                return;
            }

            // publieke URL ophalen
            const { data } = supabase.storage
                .from('posts')
                .getPublicUrl(fileName);

            imageUrl = data.publicUrl;
        }

        const { error } = await supabase.from('posts').insert({
            user_id: session.sub,
            content: content,
            image: imageUrl,
        });

        if (error) console.error('Insert error:', error);

        if (!error) {
            setContent('');
            setImage(null);
            fetchPosts();
        }
    };

    // Post verwijderen
    const handleDelete = async (id) => {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (!error) fetchPosts();
    };

    return (
        <div>
            <h1>Posts</h1>

            {/*Formulier*/}
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="5"
                    placeholder="Schrijf een post..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button type="submit">Posten</button>
            </form>

            {/* Posts tonen */}
            {posts.map((post) => (
                <div key={post.id}>
                    <p>{post.content}</p>
                    {post.image && (
                        <img src={post.image} alt="post afbeelding" width={200} />
                    )}
                    {post.user_id === session?.sub && (
                        <button onClick={() => handleDelete(post.id)}>
                            Verwijderen
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Posts;