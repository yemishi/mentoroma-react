import React, { useState } from "react";
import { updateFavorites } from "../utils/api";

interface PostProps {
  id: string;
  title: string;
  content: string;
  starsCount: number;
}

const PostFav: React.FC<PostProps> = ({ id, starsCount }) => {
  const [favorites, setFavorites] = useState(starsCount);

  const handleFavoriteClick = async () => {
    try {
      const updatedPost = await updateFavorites(id);
      setFavorites(updatedPost.starsCount);
    } catch (error) {
      alert("Failed to update favorites");
    }
  };

  return (
    <button className="post-item" onClick={handleFavoriteClick}>
      ❤️ {favorites} Favorites
    </button>
  );
};

export default PostFav;
