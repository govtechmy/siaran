// components/PostCard.tsx
import React from 'react';
import { Post } from '@/app/types/types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{new Date(post.datetime).toLocaleDateString()}</p>
      <p>{post.summary}</p>
    </div>
  );
};

export default PostCard;
