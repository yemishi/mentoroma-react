import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../utils/api";

interface PostProps {
  id: string;
  title: string;
  content: string;
  starsCount: number;
}

const Post: React.FC<PostProps> = ({ id, title, content, starsCount }) => {
  const [favorites, setFavorites] = React.useState(starsCount);

  const handleFavorite = async () => {
    try {
      const response = await api.put(`/posts/${id}/favorite`);
      setFavorites(response.data.starsCount);
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  };

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        <Typography variant="body1" color="text.primary">
          Favorites: {favorites}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFavorite}>
          Favorite
        </Button>
        <Button component={Link} to={`/posts/${id}`} variant="outlined">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default Post;
