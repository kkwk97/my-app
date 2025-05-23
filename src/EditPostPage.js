// src/pages/EditPostPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BaseLayout from './BaseLayout';

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [deleteImages, setDeleteImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/posts/edit-post/${postId}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.error('Failed to fetch post:', err));
  }, [postId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleImagePreview = (e) => {
    const files = Array.from(e.target.files);
    setPreviewImages([]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImageToggle = (id) => {
    setDeleteImages(prev =>
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('location', post.location);
    formData.append('content', post.content);
    formData.append('username', userId);

    // Attach selected images
    const fileInput = document.getElementById('image');
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append('images', fileInput.files[i]);
    }

    // Attach deleted images (if any)
    deleteImages.forEach(id => formData.append('delete_images', id));

    const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/posts/edit-post/${postId}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      navigate('/home');
    } else {
      console.error('Failed to update post');
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <BaseLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Edit Travel Post</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    required
                    value={post.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    required
                    value={post.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Your Story</label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="10"
                    required
                    value={post.content}
                    onChange={handleInputChange}
                  />
                </div>

                {post.images && post.images.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Current Images:</label><br />
                    {post.images.map(image => (
                      <div className="mb-2" key={image.id}>
                        <img
                          src={`https://mybucketjocel.s3.ap-southeast-2.amazonaws.com/${image.filename}`}
                          alt="Current"
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px' }}
                        />
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`delete_image_${image.id}`}
                            checked={deleteImages.includes(image.id)}
                            onChange={() => handleDeleteImageToggle(image.id)}
                          />
                          <label className="form-check-label" htmlFor={`delete_image_${image.id}`}>
                            Delete this image
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Upload New Images</label>
                  <input
                    className="form-control"
                    type="file"
                    id="image"
                    name="images"
                    multiple
                    onChange={handleImagePreview}
                  />
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {previewImages.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        className="img-thumbnail"
                        alt="Preview"
                        style={{ maxHeight: '150px' }}
                      />
                    ))}
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Update Post</button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default EditPostPage;
