import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Post } from "../types/types";
import PostFav from "./PostFav";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get<Post[]>("/posts");
        setPosts(response.data);
      } catch (error) {
        setError("Failed to fetch posts");
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      {posts.map((post) => (
        <Card key={post.id} sx={{ margin: 2 }}>
          <CardContent>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <PostFav {...post} />
              <Button
                component={Link}
                to={`/posts/${post.id}`}
                variant="outlined"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
