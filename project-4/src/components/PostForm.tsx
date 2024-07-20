import React, { useState } from "react";
import api from "../utils/api";
import { TextField, Button, Card, CardContent } from "@mui/material";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newPost = { title, content };
      await api.post("/posts", newPost);
      setTitle("");
      setContent("");
      window.location.reload();
    } catch (error) {
      setError("Failed to create post");
      console.error("Failed to create post:", error);
    }
  };

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <h2>Create a New Post</h2>
        {error && <div>{error}</div>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Create Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
