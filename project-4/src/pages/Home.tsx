import React from 'react';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Blog</h1>
      <PostForm />
      <PostList />
    </div>
  );
};

export default Home;
