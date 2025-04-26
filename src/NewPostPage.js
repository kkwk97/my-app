// src/pages/NewPostPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';

// ✅ Get current user ID from localStorage
const userId = localStorage.getItem('userId');

const NewPostPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    content: '',
    username: '',
    user_id: ''
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert all images to base64
      const imagesData = await Promise.all(
        images.map(async (file) => {
          const base64 = await toBase64(file);
          return {
            filename: file.name,
            content: base64.split(',')[1] // Only the base64 part
          };
        })
      );

      const data = {
        title: formData.title,
        location: formData.location,
        content: formData.content,
        username: userId,
        user_id: '',
        images: imagesData
      };

      const res = await fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/posts/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        navigate('/home');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <BaseLayout>
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Create New Travel Post</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter a catchy title for your travel experience"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Where did you travel to?"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Your Story</label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows="10"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder="Share your travel experience..."
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Upload Images</label>
                  <input
                    className="form-control"
                    type="file"
                    id="image"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {preview.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`preview-${i}`}
                        className="img-thumbnail"
                        style={{ maxHeight: '150px' }}
                      />
                    ))}
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Create Post</button>
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

export default NewPostPage;
