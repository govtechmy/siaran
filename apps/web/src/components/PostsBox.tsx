'use client';

import React, { useState } from 'react';
import PostCard from './PostCard';
import Pagination from '@/components/ui/pagination';
import { PaginatedResponse, Post } from '@/app/types/types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ViewSwitch from './ViewSwitch'; // Import the new component

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
        <ViewSwitch view={view} onViewChange={handleViewChange} />
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
``