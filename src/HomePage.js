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
        <h1 className="my-4">Welcome Back {userId}</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          {/* You can add more search form fields if necessary */}
        </form>

        {/* New Post Button */}
        {isAuthenticated && (
          <Link to="/new-post" className="btn btn-primary btn-sm mb-4">
            New Post
          </Link>
        )}

        {/* Posts List */}
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {posts.length ? (
            posts.map((post) => (
              <div className="col mb-4" key={post.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      By {post.author?.username || 'Unknown'} in {post.location}
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

                    {/* Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="row g-2">
                        {post.images.map((image, index) => {
                          let imageUrl = '';
                          if (image.s3_url) {
                            imageUrl = image.s3_url.replace(
                              's3://mybucketjocel/',
                              'https://mybucketjocel.s3.ap-southeast-2.amazonaws.com/'
                            );
                          } else if (image.filename) {
                            imageUrl = `https://mybucketjocel.s3.ap-southeast-2.amazonaws.com/${image.filename}`;
                          } else if (image.url) {
                            imageUrl = image.url;
                          }

                          return (
                            <div className="col-6" key={index}>
                              <img
                                src={imageUrl}
                                alt="Post"
                                className="img-fluid rounded"
                                style={{
                                  width: '100%',
                                  height: 'auto',         // let height adjust based on image
                                  maxHeight: '300px',      // limit maximum height
                                  objectFit: 'contain',    // keep full image without cutting
                                }}
                              />
                            </div>

                          );
                        })}
                      </div>
                    )}

                    {/* Edit button if current user is the author */}
                    {isAuthenticated && post.author?.username === userId && (
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
