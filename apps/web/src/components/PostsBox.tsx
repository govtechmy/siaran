'use client';

import React from 'react';
import PostCard from './PostCard';
import Pagination from '@/components/ui/pagination';
import { PaginatedResponse, Post } from '@/app/types/types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface PostsBoxProps {
  posts: PaginatedResponse<Post>; 
}

const PostsBox: React.FC<PostsBoxProps> = ({ posts }) => {
  const { docs: data, totalPages, page } = posts;
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        {data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PostsBox;
