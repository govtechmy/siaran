'use client';

import React from 'react';
import PostCard from './PostCard';
import Pagination from '@/components/ui/pagination';
import { PaginatedResponse, Post } from '@/app/types/types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PostsBoxProps {
  posts: PaginatedResponse<Post>; 
}

const PostsBox: React.FC<PostsBoxProps> = ({ posts }) => {
  const { docs: data, totalPages, page } = posts;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<'card' | 'list'>('card');

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  const handleViewChange = (selectedView: 'card' | 'list') => {
    setView(selectedView);
  };

  return (
    <div className="w-[1280px] h-auto opacity-100 mx-auto">
      <div className="w-[1280px] h-auto flex justify-between items-center mb-6 gap-[12px]">
        <h2 className="text-[16px] font-medium text-[#3F3F46]" style={{ lineHeight: '24px' }}>
          Latest Releases
        </h2>
        <div
          className="flex gap-0 h-[32px]"
          style={{ width: '167px', height: '32px', opacity: 1 }}
        >
          <button
            className={`${
              view === 'card'
                ? 'bg-[#E4E4E7] text-[#18181B]'
                : 'bg-transparent text-[#71717A]'
            } rounded-full border-none h-[32px] px-[10px] py-[6px] gap-[4px] transition-all`}
            style={{
              borderRadius: '999px',
            }}
            onClick={() => handleViewChange('card')}
          >
            <span className="text-[14px] font-medium" style={{ lineHeight: '20px' }}>
              Card view
            </span>
          </button>
          <button
            className={`${
              view === 'list'
                ? 'bg-[#E4E4E7] text-[#18181B]'
                : 'bg-transparent text-[#71717A]'
            } rounded-full border-none h-[32px] px-[10px] py-[6px] gap-[4px] transition-all`}
            style={{
              borderRadius: '999px',
            }}
            onClick={() => handleViewChange('list')}
          >
            <span className="text-[14px] font-medium" style={{ lineHeight: '20px' }}>
              List view
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6"> 
        {data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PostsBox;
