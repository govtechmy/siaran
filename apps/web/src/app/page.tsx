import React from 'react';
import { getPosts } from '../../actions/apiServices';
import PostsBox from '../components/PostsBox';
import { PaginatedResponse, Post } from '@/app/types/types';

interface MainPageProps {
  searchParams: { [key: string]: string };
}

const MainPage = async ({ searchParams }: MainPageProps) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  const paginatedPosts: PaginatedResponse<Post> = await getPosts(currentPage, 12);
  return (
    <div>
      <PostsBox posts={paginatedPosts} /> 
    </div>
  );
};

export default MainPage;