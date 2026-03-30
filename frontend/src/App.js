import { useState, useEffect } from 'react';
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API}/api/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const createPost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author: author || 'Anonymous' })
      });
      setTitle(''); setContent(''); setAuthor('');
      fetchPosts();
    } catch (err) {
      console.error('Create error:', err);
    }
    setLoading(false);
  };

  const deletePost = async (id) => {
    try {
      await fetch(`${API}/api/posts/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>DevBlog</h1>
        <p>A MERN stack blog — built for the DevOps pipeline project</p>
      </header>

      <main className="main">
        <section className="form-section">
          <h2>New Post</h2>
          <form onSubmit={createPost} className="form">
            <input
              type="text" placeholder="Title" value={title}
              onChange={e => setTitle(e.target.value)} className="input" required
            />
            <input
              type="text" placeholder="Author (optional)" value={author}
              onChange={e => setAuthor(e.target.value)} className="input"
            />
            <textarea
              placeholder="Write your post..." value={content}
              onChange={e => setContent(e.target.value)} className="textarea" required
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </section>

        <section className="posts-section">
          <h2>Posts ({posts.length})</h2>
          {posts.length === 0 && <p className="empty">No posts yet. Write the first one.</p>}
          {posts.map(post => (
            <div key={post._id} className="card">
              <div className="card-header">
                <h3>{post.title}</h3>
                <button onClick={() => deletePost(post._id)} className="delete-btn">Delete</button>
              </div>
              <p className="meta">{post.author} · {new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="content">{post.content}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
