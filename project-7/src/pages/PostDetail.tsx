import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { Post } from '../types/types';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get<Post>(`/posts/${id}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        setError('Failed to fetch post');
        console.error('Failed to fetch post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const response = await api.put<Post>(`/posts/${id}/favorite`);
      setPost(response.data);
    } catch (error) {
      setError('Failed to update favorites');
      console.error('Failed to update favorites:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (error) {
      setError('Failed to delete post');
      console.error('Failed to delete post:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedPost = { title, content };
      const response = await api.put<Post>(`/posts/${id}`, updatedPost);
      setPost(response.data);
      setEditMode(false);
    } catch (error) {
      setError('Failed to update post');
      console.error('Failed to update post:', error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!post) return <div>Loading...</div>;

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        {editMode ? (
          <div>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update Post
            </Button>
          </div>
        ) : (
          <div>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
            <Typography variant="body1" color="text.primary">
              Favorites: {post.starsCount}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleFavorite}>
              Favorite
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostDetail;
