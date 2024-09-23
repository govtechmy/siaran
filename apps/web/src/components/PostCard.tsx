import React from 'react';
import { Post } from '@/app/types/types';

interface PostCardProps {
  post: Post;
}

export const truncateContent = (content: string, maxWords: number): string => {
  const words = content.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return content;
};

export const getPostTypeLabel = (type: string): string => {
  switch (type) {
    case 'kenyataan_media':
      return 'Kenyataan Media';
    case 'ucapan':
      return 'Ucapan';
    default:
      return 'Other';
  }
};

export const getPostTypeColor = (type: string): string => {
  switch (type) {
    case 'kenyataan_media':
      return '#15803D';
    case 'ucapan':
      return '#A16207'; 
    default:
      return '#000000'; 
  }
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div
      className="w-[410px] h-auto p-6 gap-2 rounded-tl-xl border border-gray-300 opacity-100 shadow-md"
      style={{ borderRadius: '12px 12px 12px 12px' }}
    >
      <p
        className="text-[16px] font-semibold pb-1"
        style={{
          lineHeight: '24px',
          color: getPostTypeColor(post.type),
        }}
      >
        {getPostTypeLabel(post.type)}
      </p>

      <div className="w-[362px] h-[96px] flex flex-col gap-[18px]">
        <h3
          className="text-[16px] font-semibold text-[#3F3F46] h-[48px] overflow-hidden"
          style={{ lineHeight: '24px' }}
        >
          {post.title}
        </h3>

        <p
          className="text-[14px] font-normal text-[#3F3F46] overflow-hidden h-[40px]"
          style={{ lineHeight: '20px' }}
        >
          {truncateContent(post.content.plain, 20)}
        </p>
      </div>

      <div className="w-[362px] h-auto pt-2 flex items-center gap-[8px]">
        <span
          className="text-[#71717A] font-medium"
          style={{
            width: '34px',
            height: '20px',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '20px',
          }}
        >
          {post.relatedAgency.acronym}
        </span>
        <span className="mx-1">•</span>
        <span
          className="text-[#71717A] font-normal"
          style={{
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '20px',
          }}
        >
          {new Date(post.date_published).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })},{' '}
          {new Date(post.date_published).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
