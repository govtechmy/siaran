import React from 'react';
import { getPosts } from '../../actions/apiServices';
import PostsBox from '../components/PostsBox';
import { Post } from './types/types';

interface MainPageProps {
  searchParams: { [key: string]: string };
}

const MainPage = async ({ searchParams }: MainPageProps) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  const { docs: posts }: { docs: Post[] } = await getPosts(currentPage, 12);

  return (
    <div>
      <h1>Latest Press Releases</h1>
      <PostsBox posts={posts} />
    </div>
  );
};

export default MainPage;
