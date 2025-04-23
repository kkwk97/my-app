// HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseLayout from './BaseLayout';


const HomePage = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [days, setDays] = useState('');
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ✅ NEW: Get current user ID from localStorage
  const userId = localStorage.getItem('userId');

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/posts', {
        params: {
          query,
          location,
          days,
          username,
          start_date: startDate,
          end_date: endDate,
          type,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <BaseLayout>
    <div className="container">
      <h1 className="my-4">Welcome Back {userId} </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        {/* ... your search form stays the same ... */}
      </form>

      {/* Conditional Rendering for New Post */}
      {isAuthenticated && (
        <Link to="/new-post" className="btn btn-primary btn-sm mb-4">
          New Post
        </Link>
      )}

      {/* Posts List */}
      <div className="row">
        {posts.length ? (
          posts.map((post) => (
            <div className="col-md-6 mb-4" key={post.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    By {post.author.username} in {post.location}
                  </h6>
                  <p className="card-text">
                    {post.content.slice(0, 200)}
                    {post.content.length > 200 && '...'}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Posted on {new Date(post.created_at).toLocaleDateString()}
                    </small>
                  </p>

                  {post.images && (
                    <div className="row g-2">
                      {post.images.map((image, index) => (
                        <div className="col-4" key={index}>
                          <img
                            src={`http://localhost:5000/static/uploads/${image.filename}`}
                            alt="Post"
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ✅ NEW: Show Edit button only if current user is the author */}
                  {isAuthenticated && post.author.username === userId && (
                    <Link to={`/edit-post/${post.id}`} className="btn btn-primary btn-sm mt-2">
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No results found.</p>
          </div>
        )}
      </div>
    </div>
    </BaseLayout>
  );
};

export default HomePage;