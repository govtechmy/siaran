// components/PostsBox.tsx
import React from 'react';
import { Post } from '@/app/types/types';
import PostCard from './PostCard';

interface PostsBoxProps {
  posts: Post[];
}

const PostsBox: React.FC<PostsBoxProps> = ({ posts }) => {
  return (
    <div className="posts-box">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsBox;
