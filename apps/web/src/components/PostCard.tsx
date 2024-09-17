import React from 'react';
import { Post } from '@/app/types/types';

interface PostCardProps {
  post: Post;
}

const truncateContent = (content: string, maxWords: number): string => {
  const words = content.split(' '); 
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...'; 
  }
  return content;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{new Date(post.date_published).toLocaleDateString()}</p>
      <p>{truncateContent(post.content.plain, 20)}</p>
    </div>
  );
};

export default PostCard;
